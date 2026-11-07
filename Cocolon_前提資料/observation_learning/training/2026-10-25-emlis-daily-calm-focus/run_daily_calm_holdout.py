"""One initial-only daily service evaluation, at most two new model calls.

No targets/prior are sent, no updates/retries/training, no normal application
or production DB. Requires the approved FIT9 to have completed successfully.
"""
import argparse
import asyncio
import hashlib
import importlib.metadata
import json
import os
from pathlib import Path
import signal
import sys
import tarfile
import threading
import time
from unittest.mock import patch

sys.dont_write_bytecode = True
API_COMMIT="bd356566d37370911e14dab2819ab25a619c6353"
OUTPUT=Path("/workspace/cocolon_4b_daily_calm_focus12_holdout_20261025")
LEGACY_SHA="2f659078c05bee6d7b32f50aae8b9eebc03c767d4a3be084bc17e9e3ccc4c10d"


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def dump(path,value):
    p=Path(path);tmp=p.with_suffix(p.suffix+".tmp")
    tmp.write_text(json.dumps(value,ensure_ascii=False,indent=2)+"\n");tmp.replace(p)


def archive(output):
    files=[p for p in sorted(output.iterdir()) if p.is_file() and p.name not in {"file_manifest.json","result.tar.gz"} and not p.name.endswith(".tmp")]
    dump(output/"file_manifest.json",{p.name:dict(bytes=p.stat().st_size,sha256=sha(p)) for p in files})
    with tarfile.open(output/"result.tar.gz","w:gz") as f:
        for p in files+[output/"file_manifest.json"]:f.add(p,arcname=p.name,recursive=False)


async def exercise(args,report,model,tokenizer,r,db,fixtures,adapter_sha):
    import emlis_thread_store as sm
    from emlis_thread_service import EmlisThreadService,_json
    from cocolon_meaning_experience_engine.emlis_semantic_admission import MODEL_PROFILE
    from cocolon_meaning_experience_engine.model_candidate_source import ModelCandidateSource,ModelCallLimits,ModelResponse
    output=OUTPUT
    def checkpoint():dump(output/"run.json",report)
    async def rpc(name,payload,**kw):
        assert name in {"emlis_thread_read","emlis_thread_commit"}
        report["sql_rpc_calls"]+=1
        return await db.rpc(name,payload,**kw)
    class NoGeneration:
        def __getattr__(self,_name):
            report["forbidden_generation_calls"]+=1
            raise AssertionError("saved_read_requested_generation")
    with patch.object(sm,"sb_post_rpc",rpc):
        for index,fixture in enumerate(fixtures,1):
            user,parent=fixture["user_id"],fixture["input_id"]
            assert "code" not in db.query("insert into auth.users values ($1)",[user])
            assert "code" not in db.query("insert into public.profiles values ($1,'free')",[user])
            assert "code" not in db.query("insert into public.emotions values ($1,$2,$3,$4,$5,array['生活'],array['平穏','喜び'],$6)",
                [parent,user,fixture["created_at"],fixture["memo"],fixture["memo_action"],json.dumps(fixture["emotion_details"],ensure_ascii=False)])
            async def generator(messages,limits):
                assert report["model_calls_started"]<2 and [m["role"] for m in messages]==["system","user"]
                assert limits.max_input_tokens==5632 and limits.max_new_tokens==2560
                path=output/f"case{index}_raw.jsonl"
                assert not path.exists()
                dump(output/f"case{index}_messages.json",messages)
                report["model_calls_started"]+=1;checkpoint()
                from transformers import StoppingCriteria,StoppingCriteriaList
                stop=threading.Event();deadline=time.monotonic()+limits.deadline_seconds
                actual=model.generate
                class Bounded(StoppingCriteria):
                    def __call__(self,_input_ids,_scores,**_kw):return stop.is_set() or time.monotonic()>=deadline
                def generate(*a,**kw):
                    kw["stopping_criteria"]=StoppingCriteriaList([*list(kw.get("stopping_criteria") or []),Bounded()])
                    return actual(*a,**kw)
                def evaluate():
                    with patch.object(model,"generate",generate):
                        r.evaluate(model,tokenizer,[dict(case_id=fixture["id"],messages=messages)],path,
                            dict(context_tokens=8192,max_new_tokens=2560),adapter_revision=adapter_sha)
                worker=asyncio.create_task(asyncio.to_thread(evaluate))
                try:await asyncio.shield(worker)
                except asyncio.CancelledError:
                    stop.set()
                    await asyncio.wait_for(asyncio.shield(worker),timeout=15)
                    raise
                finally:stop.set()
                records=r.read_jsonl(path);assert len(records)==1
                record=records[0]
                assert record["model"]==r.MODEL and record["revision"]==r.REVISION and record["adapter_revision"]==adapter_sha
                report["model_calls_completed"]+=1;checkpoint()
                return ModelResponse(record["raw_text"],record["finish_reason"],record["provider"],record["model"],record["revision"],record["adapter_revision"],record["usage"])
            boundary=ModelCandidateSource(generator,lambda m:len(r.chat_token_ids(tokenizer,m,generation_prompt=True)),
                limits=ModelCallLimits(5632,2560,150),adapter_revision=adapter_sha)
            async def source(req,prior):
                assert prior is None
                report["source_calls"]+=1
                dump(output/f"case{index}_request.json",_json(req))
                receipt=await boundary(req,prior)
                dump(output/f"case{index}_receipt.json",_json(receipt))
                return receipt
            service=EmlisThreadService(semantic_profile=MODEL_PROFILE,offline_candidate_source=source,offline_model_attempt_seconds=180)
            dto=await service.start(user,parent)
            dump(output/f"case{index}_dto.json",dto)
            saved=await service.store.read(user,input_id=parent)
            dump(output/f"case{index}_saved.json",saved)
            if dto["state"]!="COMPLETED" or dto["body_state"]!="FINAL" or dto["pending_question"] is not None or dto["issued_count"]!=0:
                report["failed_case"]=fixture["id"];checkpoint()
                raise ValueError("daily_service_candidate_not_adopted_no_retry")
            reader=EmlisThreadService(engine=NoGeneration())
            got=await reader.get(user,parent);again=await reader.start(user,parent)
            assert got==again=={**dto,"can_write":False}
            after=await service.store.read(user,input_id=parent)
            assert saved["thread"]==after["thread"] and saved["events"]==after["events"]
            dump(output/f"case{index}_reads.json",dict(get=got,start=again,persisted_thread_events_unchanged=True))
            report["saved_reread_cases"].append(fixture["id"]);checkpoint()


def main(args):
    pack=args.pack.resolve();legacy=args.legacy_pack.resolve();api=args.api_root.resolve();adapter=args.adapter.resolve()
    assert not OUTPUT.exists(),"one_shot_output_already_exists"
    plan=json.loads((pack/"eval_plan.json").read_text())
    assert plan["api_commit"]==API_COMMIT and plan["max_model_calls"]==2 and plan["max_seconds"]==900
    assert plan["runner_sha256"]==sha(__file__) and plan["fixture_sha256"]==sha(pack/"eval_fixture.json")
    assert plan["gpu_hourly_usd"]==.26 and plan["max_process_usd"]==.065
    assert sha(legacy/"run_pilot.py")==LEGACY_SHA
    assert os.environ.get("HF_HUB_OFFLINE")==os.environ.get("TRANSFORMERS_OFFLINE")=="1"
    assert os.environ.get("Q2_PGLITE_MODULE"),"existing_isolated_sql_dependency_required"
    sys.path[:0]=[str(legacy)]
    import run_pilot as r
    from verify_cmee import load_api
    load_api(api,API_COMMIT)
    sys.path.insert(0,str(api/"ai/tests"))
    from test_emlis_q2_application import Database
    consumer=json.loads(args.fit_result.read_text())
    fit=json.loads(args.fit_run.read_text())
    assert sha(args.fit_result)==plan["fit_result_sha256"] and sha(args.fit_run)==plan["fit_run_sha256"]
    assert fit["schema"]=="cocolon.daily_calm_focus12_result.v1" and fit["status"]=="FOCUS12_COMPLETE_NOT_SERVICE_OR_PRODUCT_ACCEPTED"
    assert fit["plan"]["schema"]=="cocolon.daily_calm_focus12.v1" and fit["optimizer_steps_completed"]==12
    assert fit["generation_calls_started"]==fit["new_generations"]==9 and fit["before_generations"]==0
    assert fit["source_commit"]==plan["fit_training_source_commit"] and fit["api_commit"]==API_COMMIT
    assert fit["initial_adapter_sha256"]["adapter_model.safetensors"]=="5f0e51e9fbd5c94ba7bd213b033397dcc0982c19853819c1966afc8ece5613ed"
    assert consumer["schema"]=="cocolon.emlis_service_binding_fixed_fit_consumer.v1"
    assert consumer["scope"]=="TRAINING_FIT_FIXED_PRIOR_NOT_DYNAMIC" and consumer["api_commit"]==API_COMMIT
    assert consumer["api_source_hashes_verified"] is True and consumer["source_raw_unchanged"] is True and consumer["raw_modified"] is False
    assert consumer["meaning_count"]==consumer["body_count"]==9 and len(consumer["cases"])==9
    train_pack=args.training_pack.resolve()
    assert sha(train_pack/"dataset_manifest.json")==fit["plan"]["dataset_manifest_sha256"]
    assert sha(train_pack/"sft_examples.jsonl")==fit["plan"]["training_examples_sha256"]
    examples=[json.loads(line) for line in (train_pack/"sft_examples.jsonl").read_text().splitlines()]
    assert {c["case_id"] for c in consumer["cases"]}=={e["id"] for e in examples} and len(examples)==9
    assert all(c["meaning_adopted"] is True and c["body_available"] is True for c in consumer["cases"])
    assert consumer["source_raw_sha256"]==sha(args.fit_run.parent/"after_fit.jsonl")
    weights=r.adapter_hashes(adapter)
    assert weights["adapter_model.safetensors"]==fit["adapter_sha256"]["adapter_model.safetensors"]==plan["selected_adapter_sha256"]==consumer["expected_adapter_revision"]
    assert {k:importlib.metadata.version(k) for k in r.PINS}==r.PINS
    fixtures=json.loads((pack/"eval_fixture.json").read_text())
    assert len(fixtures)==2
    assert len({f["id"] for f in fixtures})==len({f["user_id"] for f in fixtures})==len({f["input_id"] for f in fixtures})==2
    assert len({f[k] for f in fixtures for k in ("user_id","input_id")})==4
    train=(train_pack/"sft_examples.jsonl").read_text()
    for f in fixtures:
        assert set(f)=={"id","user_id","input_id","created_at","memo","memo_action","emotion_details"}
        assert f["input_id"] not in train and f["user_id"] not in train
    assert fixtures[0]["memo"]=="あったかいもの食べたら、ちょっと落ち着いた。"
    assert fixtures[0]["memo_action"]=="帰ってから、うどんを作って食べた。"
    assert fixtures[1]["memo"]=="温かいものを食べたら、少し落ち着いた。"
    assert fixtures[1]["memo_action"]=="帰ってから、雑炊を作って食べた。"
    OUTPUT.mkdir();start=time.monotonic()
    report=dict(status="STARTED",api_commit=API_COMMIT,source_commit=args.source_commit,plan=plan,
        fit_run_sha256=sha(args.fit_run),fit_training_source_commit=fit["source_commit"],
        model_calls_started=0,model_calls_completed=0,source_calls=0,sql_rpc_calls=0,saved_reread_cases=[],
        forbidden_generation_calls=0,training_updates=0,gpu_stop_restart_delete_operations=0,product_accepted=False,retry=False)
    dump(OUTPUT/"run.json",report)
    for name in ("eval_plan.json","eval_fixture.json","run_daily_calm_holdout.py"):(OUTPUT/name).write_bytes((pack/name).read_bytes())
    db=None
    def timeout(*_):raise TimeoutError("daily_holdout_process_deadline")
    signal.signal(signal.SIGALRM,timeout);signal.alarm(900)
    def hard_stop():
        report.update(status="DEADLINE_EXCEEDED_NO_RETRY",seconds=time.monotonic()-start)
        try:
            dump(OUTPUT/"run.json",report);archive(OUTPUT)
        finally:os._exit(124)
    watchdog=threading.Timer(900,hard_stop);watchdog.daemon=True;watchdog.start()
    try:
        from transformers import AutoTokenizer
        tokenizer=AutoTokenizer.from_pretrained(r.MODEL,revision=r.REVISION,local_files_only=True,trust_remote_code=False)
        model,tensors=r.load_saved_adapter(adapter,weights)
        assert len(tensors)==32 and all(t["finite"] for t in tensors) and not any(p.requires_grad for p in model.parameters())
        db=Database()
        asyncio.run(exercise(args,report,model,tokenizer,r,db,fixtures,weights["adapter_model.safetensors"]))
        assert report["model_calls_started"]==report["model_calls_completed"]==len(report["saved_reread_cases"])==2
        assert r.adapter_hashes(adapter)==weights
        report.update(status="DAILY2_REAL_MODEL_ISOLATED_SQL_SAVED_REREADS_COMPLETE_NOT_PRODUCT_ACCEPTED",adapter_unchanged=True)
    except BaseException as exc:
        report.update(status="FAILED_NO_RETRY",error_type=type(exc).__name__,error_code=str(exc) if isinstance(exc,ValueError) else None)
        raise
    finally:
        try:
            if db is not None:db.proc.stdin.close();db.proc.wait(timeout=10)
        except Exception as cleanup_error:
            report["database_cleanup_error_type"]=type(cleanup_error).__name__
        finally:
            report["seconds"]=time.monotonic()-start
            try:dump(OUTPUT/"run.json",report);archive(OUTPUT)
            finally:signal.alarm(0);watchdog.cancel()


if __name__=="__main__":
    p=argparse.ArgumentParser()
    for name in ("pack","legacy-pack","api-root","adapter","fit-result","fit-run","training-pack"):p.add_argument("--"+name,type=Path,required=True)
    p.add_argument("--source-commit",required=True)
    main(p.parse_args())
