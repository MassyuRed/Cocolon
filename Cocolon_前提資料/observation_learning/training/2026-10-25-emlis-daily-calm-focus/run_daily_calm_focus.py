#!/usr/bin/env python3
"""Pending one-run daily focus candidate; stdlib CPU inspection is available.

Frozen teacher/input/admission remain unchanged. GPU execution requires this
new plan's explicit approval; old fit18 is closed and cannot be rerun here.
"""
import argparse
import gc
import hashlib
import importlib.util
import json
import math
import os
from pathlib import Path
import random
import re
import signal
import sys
import time
sys.dont_write_bytecode=True
PARENT_SHA="549a2b5dcee6f994bdf8a77081a6655410fe84af8a488e4613190b8121eaf506"
LEGACY_SHA="2f659078c05bee6d7b32f50aae8b9eebc03c767d4a3be084bc17e9e3ccc4c10d"
INITIAL="5f0e51e9fbd5c94ba7bd213b033397dcc0982c19853819c1966afc8ece5613ed"
OUTPUT=Path("/workspace/cocolon_4b_daily_calm_focus12_20261025")
def require(value,code):
    if not value: raise ValueError(code)
def sha(path): return hashlib.sha256(Path(path).read_bytes()).hexdigest()
def load_module(name,path,expected):
    require(sha(path)==expected,"frozen_helper_hash_mismatch")
    spec=importlib.util.spec_from_file_location(name,path);module=importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module);return module

def daily_learning_ranges(text):
    """Parse the actual evidence table and every candidate evidence-index array."""
    def unique(pairs):
        result = {}
        for key, value in pairs:
            require(key not in result, "duplicate_json_key")
            result[key] = value
        return result
    def invalid(_value):
        raise ValueError("non_finite_json")
    decoder = json.JSONDecoder(object_pairs_hook=unique, parse_constant=invalid)
    def whitespace(index):
        while index < len(text) and text[index] in " \t\r\n":
            index += 1
        return index
    start = whitespace(0)
    packet, stop = decoder.raw_decode(text, start)
    require(whitespace(stop) == len(text) and type(packet) is dict
            and set(packet) == {"candidate", "evidence"}, "closed_candidate_evidence_json_required")
    evidence, selected = packet["evidence"], []
    require(type(evidence) is list and evidence and type(packet["candidate"]) is dict,
            "nonempty_evidence_and_candidate_required")
    def walk(begin, path, expected):
        value, end = decoder.raw_decode(text, begin)
        require(value == expected, "json_position_value_mismatch")
        if path == ("evidence",):
            selected.append({"path": list(path), "kind": "evidence_table", "char_start": begin, "char_end": end,
                "value_sha256": hashlib.sha256(text[begin:end].encode()).hexdigest(), "evidence_row_count": len(evidence)})
            return end
        elif path in {("candidate", "relations"), ("candidate", "surface_proposal")}:
            selected.append({"path":list(path),"kind":"complete_daily_value","char_start":begin,"char_end":end})
            return end
        elif len(path) >= 4 and path[:2] == ("candidate", "claims") and (
            path[-1] == "evidence_indexes" or path[-1] == "text" or path[-2:] == ("predicate", "surface")):
            selected.append({"path":list(path),"kind":"claim_value","char_start":begin,"char_end":end})
            return end
        if type(value) is dict:
            cursor = whitespace(begin + 1)
            for index, (key, child) in enumerate(value.items()):
                actual_key, key_end = decoder.raw_decode(text, cursor)
                require(actual_key == key, "json_object_key_position_mismatch")
                cursor = whitespace(key_end)
                require(text[cursor:cursor + 1] == ":", "json_member_colon_required")
                cursor = walk(whitespace(cursor + 1), (*path, key), child)
                cursor = whitespace(cursor)
                require(text[cursor:cursor + 1] == ("}" if index == len(value) - 1 else ","), "json_object_separator_mismatch")
                cursor = whitespace(cursor + 1)
        elif type(value) is list:
            cursor = whitespace(begin + 1)
            for index, child in enumerate(value):
                cursor = whitespace(walk(cursor, (*path, index), child))
                require(text[cursor:cursor + 1] == ("]" if index == len(value) - 1 else ","), "json_array_separator_mismatch")
                cursor = whitespace(cursor + 1)
        return end
    walk(start, (), packet)
    require(len(packet["candidate"]["claims"]) == 5 and len(packet["candidate"]["relations"]) == 4
            and len(evidence) == 8, "frozen_daily_five_four_eight_required")
    expected = {("evidence",), ("candidate","relations"), ("candidate","surface_proposal")}
    for i, claim in enumerate(packet["candidate"]["claims"]):
        base = ("candidate","claims",i)
        expected.update({(*base,"text"),(*base,"predicate","surface"),(*base,"evidence_indexes"),
            (*base,"about_time","evidence_indexes"),(*base,"modality","evidence_indexes"),
            (*base,"polarity","evidence_indexes"),(*base,"subject","evidence_indexes")})
    require({tuple(x["path"]) for x in selected} == expected and len(selected) == 38,
            "exact_daily_learning_value_set_required")
    ordered=sorted((x["char_start"],x["char_end"]) for x in selected)
    require(all(a[1]<=b[0] for a,b in zip(ordered,ordered[1:])), "overlapping_learning_ranges")
    return selected


def select_daily_tokens(full, prefix, text_ids, offsets, text):
    """Cover complete JSON value spans; crossing token fragments are syntax only."""
    require(full[prefix:prefix + len(text_ids)] == text_ids and len(text_ids) == len(offsets),
            "assistant_token_prefix_or_offsets_mismatch")
    ranges, selected, boundary_syntax = daily_learning_ranges(text), set(), []
    syntax = set('{}[],:" \t\r\n')
    labels = [-100] * len(full)
    for row in ranges:
        a, b = row["char_start"], row["char_end"]
        indexes = [i for i, (s, e) in enumerate(offsets) if e > a and s < b]
        require(indexes and indexes == list(range(indexes[0], indexes[-1] + 1)), "evidence_value_tokens_not_contiguous")
        covered = a
        for i in indexes:
            s, e = offsets[i]
            require(0 <= s < e <= len(text) and s <= covered, "evidence_token_offset_has_gap")
            extra = text[s:a] if s < a else ""
            extra += text[b:e] if e > b else ""
            require(set(extra) <= syntax, "token_boundary_would_supervise_unselected_semantic_value")
            if extra:
                boundary_syntax.append({"assistant_token_index": i, "offset": [s, e], "extra_syntax": extra,
                    "selected_path": row["path"]})
            covered = max(covered, e)
            selected.add(prefix + i)
            labels[prefix + i] = full[prefix + i]
        require(covered >= b, "evidence_value_token_range_not_complete")
        row["assistant_token_indexes"] = indexes
        row["token_ids"] = [text_ids[i] for i in indexes]
    require(selected and all(label == (full[i] if i in selected else -100) for i, label in enumerate(labels)),
            "unselected_token_received_loss")
    require(labels[:prefix] == [-100] * prefix
            and labels[prefix + len(text_ids):] == [-100] * (len(full) - prefix - len(text_ids)),
            "prompt_or_eos_received_loss")
    start = min(selected) - 1
    require(start >= prefix - 1, "evidence_loss_predecessor_missing")
    return {"input_ids": full, "labels": labels, "loss_start": start,
        "logits_positions": len(full) - start, "selected_evidence_tokens": len(selected),
        "evidence_row_count": next(r["evidence_row_count"] for r in ranges if r["kind"] == "evidence_table"),
        "selected_claim_value_count": sum(r["kind"] == "claim_value" for r in ranges),
        "selected_ranges": ranges, "boundary_syntax_rounding": boundary_syntax,
        "prompt_tokens": prefix, "full_context_tokens": len(full),
        "outside_selected_daily_values_only_boundary_syntax_allowed": True,
        "prompt_unselected_values_and_eos_labels_ignored": True}


def inspect_inputs(directory,parent):
    plan=json.loads((directory/'plan.json').read_text())
    fixed={'schema':'cocolon.daily_calm_focus12.v1','initial_adapter_sha256':INITIAL,
        'api_commit':'bd356566d37370911e14dab2819ab25a619c6353','max_optimizer_steps':12,
        'training_rows':9,'chair_passes':1,'daily_passes':2,'learning_rate':5e-5,
        'context_tokens':8192,'max_input_tokens':5632,'max_new_tokens':2560,
        'before_generations':0,'fit_generations':9,'max_seconds':1800,
        'gpu_hourly_usd':.26,'max_process_usd':.13,'retry':False,'automatic_pod_stop':False}
    for key,value in fixed.items():
        require(type(plan.get(key)) is type(value) and plan[key]==value,'fixed_plan_mismatch:'+key)
    require(sha(__file__)==plan['runner_sha256'],'focus_runner_changed')
    require(sha(parent/'run_daily_calm_fit.py')==PARENT_SHA,'parent_runner_changed')
    require(sha(parent/'dataset_manifest.json')==plan['dataset_manifest_sha256'],'manifest_changed')
    manifest=json.loads((parent/'dataset_manifest.json').read_text())
    for name,spec in manifest['files'].items():
        require(sha(parent/name)==spec['sha256'] and (parent/name).stat().st_size==spec['bytes'],'teacher_or_source_changed:'+name)
    examples=[json.loads(s) for s in (parent/'sft_examples.jsonl').read_text().splitlines()]
    require(len(examples)==9 and len({x['id'] for x in examples})==9,'nine_frozen_examples_required')
    require(sha(parent/'sft_examples.jsonl')==plan['training_examples_sha256']
        and sha(parent/'train_messages.jsonl')==plan['training_messages_sha256'],'training_bytes_changed')
    selected=[]
    for index,e in enumerate(examples):
        text=e['messages'][-1]['content'].strip()
        require(hashlib.sha256(e['messages'][-1]['content'].encode()).hexdigest()==e['target_sha256'],'target_hash_changed')
        if index<6:
            require('CHAIR' in e['family'],'chair_rows_changed')
            selected.append({'id':e['id'],'loss_scope':'FULL_ASSISTANT_JSON_AND_EOS','training_occurrences':1})
        else:
            require(e['family']=='DAILY_MEAL_SLIGHT_CALM_ONE_EXISTING_STORY' and e['stage']=='INITIAL','daily_rows_changed')
            ranges=daily_learning_ranges(text)
            selected.append({'id':e['id'],'loss_scope':'DAILY_SELECTED_VALUES','training_occurrences':2,
                'ranges':ranges,'range_count':len(ranges),'selected_characters':sum(r['char_end']-r['char_start'] for r in ranges),
                'teacher_characters':len(text),'character_ranges_verified':True,'bpe_token_positions_verified':False})
    return plan,examples,selected


def encode_items(tokenizer,examples,r):
    items,stats=[],[]
    for i,e in enumerate(examples):
        encoded,prefix=r.encode_training(tokenizer,e['messages'],context=8192)
        require(prefix<=5632 and prefix+2560<=8192 and len(encoded['input_ids'])-prefix<=2560,'complete_context_exceeded')
        if i>=6:
            text=e['messages'][-1]['content'].strip()
            mapped=tokenizer(text,add_special_tokens=False,return_offsets_mapping=True)
            encoded=select_daily_tokens(encoded['input_ids'],prefix,mapped['input_ids'],mapped['offset_mapping'],text)
            require(encoded['evidence_row_count']==8 and len(encoded['selected_ranges'])==38,'daily_mask_structure_mismatch')
        stats.append({'id':e['id'],'prompt_tokens':prefix,'full_tokens':len(encoded['input_ids']),
            'selected_loss_tokens':sum(x!=-100 for x in encoded['labels']),
            'scope':'FULL_ASSISTANT_JSON_AND_EOS' if i<6 else 'DAILY_SELECTED_VALUES',
            'selected_ranges':encoded.get('selected_ranges',[]),
            'boundary_syntax_rounding':encoded.get('boundary_syntax_rounding',[])})
        items.append(encoded)
    return items,stats


def main(args):
    directory,parent=args.directory.resolve(),args.parent_pack.resolve()
    plan,examples,selected=inspect_inputs(directory,parent)
    if args.cpu_only:
        require(args.report is not None and not args.report.exists(),'fresh_cpu_report_required')
        report={'status':'CPU_CHARACTER_RANGES_VERIFIED_NOT_BPE_TOKENIZED','runner_sha256':sha(__file__),
            'plan_sha256':sha(directory/'plan.json'),'teacher_manifest_sha256':sha(parent/'dataset_manifest.json'),
            'training_updates':0,'model_calls':0,'gpu_calls':0,'teacher_changed':False,
            'rows':selected,'bpe_token_positions_verified':False,'product_accepted':False}
        args.report.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
        print(json.dumps({'status':report['status'],'daily_rows':3,'ranges_per_daily':38,'updates':0}));return
    legacy=args.legacy_pack.resolve()
    require(sha(legacy/'run_pilot.py')==LEGACY_SHA,'legacy_runner_changed')
    sys.path.insert(0,str(legacy));import run_pilot as r
    shared=load_module('frozen_daily_fit18',parent/'run_daily_calm_fit.py',PARENT_SHA)
    shared.validate_data(parent,legacy,plan,r)
    require(os.environ.get('HF_HUB_OFFLINE')==os.environ.get('TRANSFORMERS_OFFLINE')=='1','offline_cache_required')
    import importlib.metadata
    require({n:importlib.metadata.version(n) for n in r.PINS}==r.PINS,'fixed_runtime_versions_required')
    from transformers import AutoTokenizer
    tokenizer=AutoTokenizer.from_pretrained(r.MODEL,revision=r.REVISION,local_files_only=True,trust_remote_code=False)
    items,stats=encode_items(tokenizer,examples,r)
    if args.tokenize_only:
        require(args.report is not None and not args.report.exists(),'fresh_token_report_required')
        r.write_json(args.report,{'status':'ACTUAL_TOKEN_MASKS_VERIFIED_WITHOUT_MODEL_OR_CUDA',
            'runner_sha256':sha(__file__),'plan_sha256':sha(directory/'plan.json'),
            'manifest_sha256':sha(parent/'dataset_manifest.json'),'rows':stats,
            'training_updates':0,'model_calls':0,'gpu_calls':0,'token_counter_is_stub':False})
        print(json.dumps({'status':'ACTUAL_TOKEN_MASKS_VERIFIED_WITHOUT_MODEL_OR_CUDA','rows':9,
            'loss_tokens':[x['selected_loss_tokens'] for x in stats],'report_sha256':sha(args.report)}));return
    require(plan.get('status')=='AUTHORIZED_ONCE_NEW_FOCUS12' and plan.get('gpu_run_authorized') is True,
        'new_focus12_explicit_approval_required_fit18_remains_closed')
    require(args.initial_adapter is not None and re.fullmatch(r'[0-9a-f]{40}',args.source_commit or ''),'adapter_and_published_source_required')
    initial=args.initial_adapter.resolve();old_adapter=r.adapter_hashes(initial)
    require(old_adapter['adapter_model.safetensors']==INITIAL,'initial_adapter_changed')
    require(not OUTPUT.exists(),'output_exists_no_retry')
    OUTPUT.mkdir();start=time.monotonic()
    report={'schema':'cocolon.daily_calm_focus12_result.v1','status':'STARTED','plan':plan,
        'source_commit':args.source_commit,'api_commit':plan['api_commit'],'runner_sha256':sha(__file__),
        'initial_adapter_sha256':old_adapter,'optimizer_steps_completed':0,'generation_calls_started':0,
        'new_generations':0,'before_generations':0,'teacher_changed':False,'raw_repair':False,
        'separate_service_holdout_read_or_generated_here':False,'product_accepted':False,'retry':False,
        'automatic_progression':False,'gpu_stop_restart_delete_operations':0,'token_masks':stats}
    for name in ['dataset_manifest.json',*sorted(shared.FILES)]: (OUTPUT/name).write_bytes((parent/name).read_bytes())
    for source,name in [(directory/'plan.json','plan.json'),(Path(__file__),'runner_source.py'),
        (parent/'run_daily_calm_fit.py','parent_fit18_source.py'),(legacy/'run_pilot.py','legacy_run_pilot.py')]:
        (OUTPUT/name).write_bytes(source.read_bytes())
    (OUTPUT/'SOURCE_COMMIT').write_text(args.source_commit+'\n')
    def save():r.write_json(OUTPUT/'run.json',report)
    def timeout(*_):raise TimeoutError('focus12_deadline_no_retry')
    signal.signal(signal.SIGALRM,timeout);signal.signal(signal.SIGTERM,timeout);signal.alarm(1800);save()
    try:
        import torch
        from peft import PeftModel
        require(torch.cuda.device_count()==1,'single_existing_gpu_required')
        report['gpu']=r.gpu_profile(torch,plan);require('A4500' in report['gpu']['name'],'existing_a4500_only')
        random.seed(r.SEED);torch.manual_seed(r.SEED);torch.cuda.manual_seed_all(r.SEED);torch.cuda.reset_peak_memory_stats()
        order_rng=random.Random(r.SEED);order=list(range(9));order_rng.shuffle(order);tail=[6,7,8];order_rng.shuffle(tail);order+=tail
        require(len(order)==12 and all(order.count(i)==(1 if i<6 else 2) for i in range(9)),'training_order_mismatch')
        report['training_order']=[examples[i]['id'] for i in order]
        cfg=r.strict_json((initial/'adapter_config.json').read_text())
        require(cfg.get('base_model_name_or_path')==r.MODEL and set(cfg.get('target_modules',[]))==r.EXPECTED_TARGETS
            and cfg.get('r')==8 and cfg.get('lora_alpha')==16 and cfg.get('lora_dropout')==0 and cfg.get('bias')=='none','adapter_config_changed')
        model=PeftModel.from_pretrained(r.load_base(),initial,is_trainable=True,local_files_only=True)
        trainable=[(n,p) for n,p in model.named_parameters() if p.requires_grad]
        require(len(trainable)==32 and all('lora_' in n and '.self_attn.' in n and torch.isfinite(p).all().item() for n,p in trainable),'trainable_lora_invalid')
        def loss(index):
            item=items[index];ids=torch.tensor([item['input_ids']],dtype=torch.long,device='cuda:0')
            labels=torch.tensor([item['labels']],dtype=torch.long,device='cuda:0')
            if index<6:return r.teacher_loss(model,input_ids=ids,attention_mask=torch.ones_like(ids),labels=labels,encoded=item)
            require(int((labels!=-100).sum())==item['selected_evidence_tokens'],'daily_mask_count_changed')
            return model(input_ids=ids,attention_mask=torch.ones_like(ids),labels=labels[:,item['loss_start']:],
                logits_to_keep=item['logits_positions'],use_cache=False).loss
        def measure(name):
            model.eval();values=[]
            with torch.inference_mode():
                for i,e in enumerate(examples):
                    value=float(loss(i).detach().cpu());require(math.isfinite(value),'nonfinite_nll')
                    values.append({'id':e['id'],'loss_scope':stats[i]['scope'],'selected_loss_tokens':stats[i]['selected_loss_tokens'],'nll':value})
            r.write_json(OUTPUT/name,values)
        measure('before_mixed_scope_nll.json')
        model.config.use_cache=False;model.gradient_checkpointing_enable(gradient_checkpointing_kwargs={'use_reentrant':False});model.enable_input_require_grads();model.train()
        optimizer=torch.optim.AdamW([p for _,p in trainable],lr=5e-5,weight_decay=0.)
        with (OUTPUT/'training.jsonl').open('x',encoding='utf-8') as f:
            for step,index in enumerate(order,1):
                optimizer.zero_grad(set_to_none=True);value=loss(index);require(torch.isfinite(value).item(),'nonfinite_training_loss');value.backward()
                norm=float(torch.nn.utils.clip_grad_norm_([p for _,p in trainable],1.,error_if_nonfinite=True).cpu());require(math.isfinite(norm) and norm>0,'nonfinite_or_zero_gradient')
                optimizer.step();report['optimizer_steps_completed']=step
                f.write(json.dumps({'step':step,'id':examples[index]['id'],'loss_scope':stats[index]['scope'],'loss':float(value.detach().cpu()),'gradient_norm':norm})+'\n');f.flush();save();del value
        require(report['optimizer_steps_completed']==12,'incomplete_updates');optimizer.zero_grad(set_to_none=True);del optimizer
        require(all(torch.isfinite(p).all().item() for _,p in trainable),'nonfinite_saved_adapter')
        model.save_pretrained(OUTPUT/'adapter',safe_serialization=True)
        report.update(stage='ADAPTER_SAVED_BEFORE_GENERATION',adapter_sha256=r.adapter_hashes(OUTPUT/'adapter'));save();shared.archive(OUTPUT,r)
        del trainable,model;gc.collect();torch.cuda.empty_cache()
        model,tensor_stats=r.load_saved_adapter(OUTPUT/'adapter',report['adapter_sha256'])
        require(len(tensor_stats)==32 and all(x['finite'] for x in tensor_stats),'reload_invalid')
        report.update(stage='NON_TRAINABLE_RELOAD',reloaded_adapter_tensors=tensor_stats);measure('after_mixed_scope_nll.json')
        with (OUTPUT/'after_fit.jsonl').open('x',encoding='utf-8') as f:
            for e in examples:
                report['generation_calls_started']+=1;save();temporary=OUTPUT/'one_fit.jsonl'
                r.evaluate(model,tokenizer,[{'case_id':e['id'],'messages':e['messages'][:-1]}],temporary,plan,adapter_revision=report['adapter_sha256']['adapter_model.safetensors'])
                rows=r.read_jsonl(temporary);require(len(rows)==1,'one_fit_required')
                f.write(json.dumps(rows[0],ensure_ascii=False,allow_nan=False)+'\n');f.flush();report['new_generations']+=1;temporary.unlink();save()
        require(report['generation_calls_started']==report['new_generations']==9,'fit_budget_changed')
        require(r.adapter_hashes(initial)==old_adapter and r.adapter_hashes(OUTPUT/'adapter')==report['adapter_sha256'],'adapter_changed')
        inspect_inputs(directory,parent);shared.validate_data(parent,legacy,plan,r)
        report.update(status='FOCUS12_COMPLETE_NOT_SERVICE_OR_PRODUCT_ACCEPTED',initial_adapter_unchanged=True,
            saved_adapter_unchanged_during_inference=True,seconds=time.monotonic()-start,
            peak_allocated_gib=torch.cuda.max_memory_allocated()/2**30,peak_reserved_gib=torch.cuda.max_memory_reserved()/2**30);save();shared.archive(OUTPUT,r)
    except BaseException as exc:
        report.update(status='FAILED_NO_RETRY',error_type=type(exc).__name__,error_code=str(exc) if isinstance(exc,ValueError) else None,seconds=time.monotonic()-start);save();shared.archive(OUTPUT,r);raise
    finally:signal.alarm(0)

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--directory',type=Path,default=Path(__file__).resolve().parent)
    parser.add_argument('--parent-pack',type=Path,required=True)
    parser.add_argument('--legacy-pack',type=Path)
    parser.add_argument('--initial-adapter',type=Path)
    parser.add_argument('--source-commit')
    parser.add_argument('--cpu-only',action='store_true')
    parser.add_argument('--tokenize-only',action='store_true')
    parser.add_argument('--report',type=Path)
    main(parser.parse_args())
