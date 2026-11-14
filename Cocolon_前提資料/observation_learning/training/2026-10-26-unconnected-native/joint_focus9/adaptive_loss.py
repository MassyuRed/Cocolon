"""One-forward full adaptive + source/reference + prose/ending joint loss."""
import hashlib
import json

def require(ok, code):
    if not ok:
        raise ValueError(code)

def normalized_weights(ce):
    import torch
    require(ce.ndim == 1 and ce.numel() > 0, 'adaptive_ce_shape')
    require(torch.isfinite(ce).all().item() and (ce >= 0).all().item(), 'adaptive_ce_invalid')
    weights = 1.0 + 15.0 * (1.0 - torch.exp(-ce.detach())).square()
    return weights / weights.sum()

def joint_weights(ce, groups):
    import torch
    masks=[]
    for name in ('ground', 'prose'):
        indices=groups[name]
        require(type(indices) is list and indices and all(type(x) is int for x in indices), 'focus_indices_type')
        require(indices==sorted(set(indices)) and indices[0]>=0 and indices[-1]<ce.numel(), 'focus_indices_range')
        mask=torch.zeros_like(ce)
        mask[indices]=1.0/len(indices)
        masks.append(mask)
    return .5*normalized_weights(ce)+.25*masks[0]+.25*masks[1]

def loss_from_logits(logits, gold, groups):
    import torch.nn.functional as F
    require(logits.ndim==2 and gold.ndim==1 and logits.shape[0]==gold.shape[0], 'adaptive_logits_shape')
    ce=F.cross_entropy(logits.float(),gold,reduction='none')
    return (joint_weights(ce,groups)*ce).sum()

def teacher_loss(model, helper, *, input_ids, attention_mask, labels, encoded, adaptive):
    if not adaptive:
        return helper.teacher_loss(model,input_ids=input_ids,attention_mask=attention_mask,labels=labels,encoded=encoded)
    start,count=helper.assistant_loss_window(encoded)
    out=model(input_ids=input_ids,attention_mask=attention_mask,logits_to_keep=count,use_cache=False)
    gold=labels[0,start+1:]
    require(out.logits.shape[:2]==(1,count), 'adaptive_tail_logits_shape')
    return loss_from_logits(out.logits[0,:-1,:],gold,encoded['focus_groups'])

def lexical_values(text):
    """Training-only spans in the exact serialized teacher; no candidate rewriting."""
    decoder=json.JSONDecoder();spans=[]
    def space(i):
        while i<len(text) and text[i].isspace():i+=1
        return i
    def visit(i,path):
        i=space(i);start=i
        if text[i]=='{':
            i=space(i+1);value={}
            if text[i]!='}':
                while True:
                    key,offset=decoder.raw_decode(text[i:]);require(type(key) is str and key not in value,'teacher_duplicate_key')
                    i=space(i+offset);require(text[i]==':','teacher_colon')
                    item,i=visit(i+1,path+(key,));value[key]=item;i=space(i)
                    if text[i]=='}':break
                    require(text[i]==',','teacher_object_separator');i=space(i+1)
            return value,i+1
        if text[i]=='[':
            i=space(i+1);value=[]
            if text[i]!=']':
                while True:
                    item,i=visit(i,path+(len(value),));value.append(item);i=space(i)
                    if text[i]==']':break
                    require(text[i]==',','teacher_array_separator');i=space(i+1)
            spans.append((path,start,i+1,'array'))
            return value,i+1
        value,offset=decoder.raw_decode(text[i:]);spans.append((path,start,i+offset,'scalar'))
        return value,i+offset
    value,end=visit(0,())
    require(space(end)==len(text) and value==json.loads(text),'teacher_lexical_roundtrip')
    return spans

def build_groups(tokenizer,helper,messages):
    encoded,prefix=helper.encode_training(tokenizer,messages,context=8192)
    full=tokenizer.apply_chat_template(messages,tokenize=False,add_generation_prompt=False,enable_thinking=False)
    prompt=tokenizer.apply_chat_template(messages[:-1],tokenize=False,add_generation_prompt=True,enable_thinking=False)
    teacher=messages[-1]['content'].strip()
    require(full.startswith(prompt) and full[len(prompt):]==teacher+'<|im_end|>\n','focus_chat_suffix')
    tokens=tokenizer(full,add_special_tokens=False,return_offsets_mapping=True)
    require(tokens['input_ids']==encoded['input_ids'],'focus_full_token_ids')
    offsets=tokens['offset_mapping'];require(len(offsets)==len(encoded['input_ids']),'focus_offset_count')
    absolute=len(prompt);ground=[];prose=[];sections={}
    for path,start,end,kind in lexical_values(teacher):
        is_prose=path[:2]==('c','prose') and len(path)==3 and path[-1] in ('observation','reception','update_note')
        scalar_ground=kind=='scalar' and (path[:1] in (('a',),('q',)) or path[:2] in (('c','claims'),('c','relations'),('c','unknowns'),('c','updates')) or path[:3]==('c','prose','binds'))
        array_ground=kind=='array' and path and path[-1] in ('ev','scope','replace','cr','rr','ur')
        if scalar_ground or array_ground:ground.append((absolute+start,absolute+end))
        if is_prose:
            require(kind=='scalar' and path[-1] not in sections,'focus_prose_shape')
            span=(absolute+max(0,start-1),absolute+min(len(teacher),end+1));prose.append(span);sections[path[-1]]=span
    require(set(sections)=={'observation','reception','update_note'},'focus_three_prose_values')
    prose.append((absolute+len(teacher)-3,len(full)))
    def selected(spans):
        return sorted({i-prefix for i,(a,b) in enumerate(offsets) if i>=prefix and b>a and any(a<y and b>x for x,y in spans)})
    ground_ids=selected(ground);prose_ids=selected(prose)
    eos=[i-prefix for i,x in enumerate(encoded['input_ids']) if i>=prefix and x==tokenizer.eos_token_id]
    require(len(eos)==1,'focus_exact_one_eos')
    prose_ids=sorted(set(prose_ids+eos))
    group=dict(ground=ground_ids,prose=prose_ids,input_ids_sha256=hashlib.sha256(json.dumps(encoded['input_ids'],separators=(',',':')).encode()).hexdigest())
    n=len(encoded['input_ids'])-prefix
    require(ground_ids and prose_ids and max(ground_ids+prose_ids)<n,'focus_nonempty_target_only')
    section_counts={k:len(selected([v])) for k,v in sections.items()}
    require(all(x>0 for x in section_counts.values()),'focus_nonempty_prose_sections')
    return group,dict(prefix_tokens=prefix,target_tokens=n,ground_tokens=len(ground_ids),prose_tokens=len(prose_ids),overlap_tokens=len(set(ground_ids)&set(prose_ids)),prose_section_tokens=section_counts,eos_positions=eos,full_ids_exact=True,prompt_selected=0,all_labels_contiguous=True)

def cpu_loss_checks():
    import copy
    import torch
    import torch.nn.functional as F
    torch.manual_seed(20261028)
    logits=torch.randn(23,7,dtype=torch.float64,requires_grad=True);gold=torch.randint(0,7,(23,))
    group={'ground':[0,1,2,8,9,12],'prose':[8,9,15,18,20,21,22]}
    ce=F.cross_entropy(logits.float(),gold,reduction='none');alpha=joint_weights(ce,group)
    actual=loss_from_logits(logits,gold,group)
    expected=.5*(normalized_weights(ce)*ce).sum()+.25*ce[group['ground']].mean()+.25*ce[group['prose']].mean()
    require(torch.allclose(actual,expected,atol=2e-7,rtol=2e-7),'focus_loss_value')
    grad=torch.autograd.grad(actual,logits,retain_graph=True)[0];reference=torch.autograd.grad(expected,logits)[0]
    analytic=alpha.detach()[:,None]*(torch.softmax(logits.float(),dim=-1)-F.one_hot(gold,7))
    require(torch.allclose(grad,reference,atol=2e-7,rtol=2e-7) and torch.allclose(grad,analytic.double(),atol=2e-7,rtol=2e-7),'focus_gradient')
    require(bool(torch.isfinite(alpha).all()) and bool((alpha>0).all()) and torch.allclose(alpha.sum(),torch.tensor(1.)), 'focus_positive_sum_one')
    for invalid in ([],[0,0],[23],[-1],[True]):
        bad=copy.deepcopy(group);bad['ground']=invalid
        try:joint_weights(ce,bad)
        except ValueError:pass
        else:raise AssertionError('focus_invalid_group_not_rejected')
    try:normalized_weights(torch.tensor([float('nan')]))
    except ValueError:pass
    else:raise AssertionError('focus_nonfinite_not_rejected')
    return dict(loss_and_reference_gradient_identical=True,analytic_gradient_identical=True,positive_all_target_mass=True,group_mass_sum=1.0,invalid_groups_rejected=5,nonfinite_rejected=True)
