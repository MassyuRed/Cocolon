"""Full teacher CE with a fixed, premeasured local emphasis. No model search."""
import hashlib,json

def require(ok, code):
    if not ok: raise ValueError(code)

def ids_sha(ids):
    return hashlib.sha256(json.dumps(ids,separators=(',',':')).encode()).hexdigest()

def validate_case(spec, teacher, target_ids):
    require(hashlib.sha256(teacher.encode()).hexdigest()==spec['teacher_utf8_sha256'],'local_teacher_changed')
    require(len(target_ids)==spec['target_tokens'] and ids_sha(target_ids)==spec['target_ids_sha256'],'local_target_ids_changed')
    chosen=spec['selected_target_indices']
    require(type(chosen) is list and chosen==sorted(set(chosen)) and all(type(i) is int and 0<=i<len(target_ids) for i in chosen),'local_mask_invalid')
    require(set(spec['selected_fields'])=={str(i) for i in chosen},'local_mask_fields_missing')
    require(all(f not in {'candidate.question_proposal','candidate.unknowns','EOS','TEMPLATE_TAIL','JSON_STRUCTURE'} for f in spec['selected_fields'].values()),'local_mask_field_invalid')
    return chosen

def loss_from_logits(logits, gold, chosen):
    import torch
    import torch.nn.functional as F
    require(logits.ndim==2 and gold.ndim==1 and logits.shape[0]==gold.shape[0] and len(gold)>0,'local_logits_shape')
    require(chosen==sorted(set(chosen)) and all(type(i) is int and 0<=i<len(gold) for i in chosen),'local_mask_invalid')
    ce=F.cross_entropy(logits.float(),gold,reduction='none')
    require(torch.isfinite(ce).all().item(),'local_ce_nonfinite')
    # No selected point gets exclusive loss: every target and EOS remains positive.
    weight=torch.ones_like(ce)
    if chosen: weight[chosen]=16.
    return (ce*weight).sum()/weight.sum()

def teacher_loss(model, helper, *, input_ids, attention_mask, labels, encoded, chosen):
    if not chosen:
        return helper.teacher_loss(model,input_ids=input_ids,attention_mask=attention_mask,labels=labels,encoded=encoded)
    start,count=helper.assistant_loss_window(encoded)
    # Include the previous position; the last logit has no following gold token.
    out=model(input_ids=input_ids,attention_mask=attention_mask,logits_to_keep=count,use_cache=False)
    gold=labels[0,start+1:]
    require(out.logits.shape[:2]==(1,count),'local_tail_logits_shape')
    return loss_from_logits(out.logits[0,:-1,:],gold,chosen)
