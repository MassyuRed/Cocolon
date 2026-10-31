"""One CPU creation of 3 daily service bindings; preserve old chair 6 verbatim."""
import argparse
import asyncio
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import subprocess
import sys
from unittest.mock import patch
from uuid import uuid4

API_COMMIT = "bd356566d37370911e14dab2819ab25a619c6353"
sys.dont_write_bytecode = True


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


async def generate(args):
    api, output, chair = args.api_root.resolve(), Path(__file__).resolve().parent, args.chair_pack.resolve()
    assert subprocess.check_output(["git", "-C", str(api), "rev-parse", "HEAD"],text=True).strip() == API_COMMIT
    assert not (output / "sft_examples.jsonl").exists(), "frozen_rows_already_exist"
    sys.path[:0] = [str(api / "ai/services/ai_inference"), str(api / "ai/tests")]
    from test_cmee_emlis_model_daily_calm import daily_request, daily_packet
    from test_emlis_q2_application import Database
    from cocolon_meaning_experience_engine.preparation import prepare_emlis, receive_candidate
    from cocolon_meaning_experience_engine.model_candidate_source import build_model_messages
    from cocolon_meaning_experience_engine.emlis_semantic_admission import MODEL_PROFILE
    from emlis_thread_service import EmlisThreadService, _json
    import emlis_thread_store

    rows = [json.loads(line) for line in (chair / "sft_examples.jsonl").read_text().splitlines()]
    assert len(rows) == 6 and all("CHAIR" in row["family"] for row in rows)
    old_six = canonical(rows)
    old_hashes = {name:sha(chair/name) for name in ("sft_examples.jsonl","train_messages.jsonl","dataset_manifest.json")}
    report = dict(api_commit=API_COMMIT,status="STARTED",synthetic_calls=0,model_calls=0,training_updates=0,
        sql_rpc_calls=0,production_db_calls=0,cases=[],old_chair_hashes=old_hashes)
    db=Database()
    async def rpc(name,payload,**kw):
        report["sql_rpc_calls"]+=1
        return await db.rpc(name,payload,**kw)
    class NoGeneration:
        def __getattr__(self,_name):
            raise AssertionError("saved_daily_read_attempted_generation")
    try:
        with patch.object(emlis_thread_store,"sb_post_rpc",rpc):
            for i in range(1,4):
                user,parent=str(uuid4()),str(uuid4())
                raw=daily_request().current_input_bundle.raw_current_input
                assert "code" not in db.query("insert into auth.users values ($1)",[user])
                db.query("insert into public.profiles values ($1,'free')",[user])
                db.query("insert into public.emotions values ($1,$2,$3,$4,$5,array['生活'],array['平穏','喜び'],$6)",
                    [parent,user,datetime.now(timezone.utc).isoformat(),raw["memo"],raw["memo_action"],json.dumps(raw["emotion_details"],ensure_ascii=False)])
                captured=[]
                def source(req,prior):
                    assert prior is None
                    packet=daily_packet(req)
                    messages=build_model_messages(req)
                    control=req.emlis_thread
                    native=dict(original=dict(req.current_input_bundle.raw_current_input),request_id=req.request_id,
                        thread_id=control.thread_id,capability_snapshot=control.capability_snapshot,
                        question_control=_json(control.question_control_context),answers=_json(control.answers),
                        current_round=control.current_round,prior_snapshot_json=None)
                    captured.append(dict(id=f"TRAIN-DAILY-CALM-{i:02d}-INITIAL",pair_id=f"TRAIN-DAILY-CALM-{i:02d}",
                        family="DAILY_MEAL_SLIGHT_CALM_ONE_EXISTING_STORY",stage="INITIAL",split="train_candidate",
                        scenario_persons_fictitious=True,provenance="FT-UDON-INITIAL_KAREN_EDIT_REAL_SERVICE_BINDING",
                        source_refs=json.loads((output/"source_mapping_candidate.json").read_text())["source_refs"],
                        messages=[*messages,dict(role="assistant",content=canonical(packet))],native_case=native,
                        target_sha256=hashlib.sha256(canonical(packet).encode()).hexdigest(),
                        target_checks=dict(all_evidence_exact=True,string_claim_relation_refs=True,claim_count=5,update_count=0)))
                    report["synthetic_calls"]+=1
                    material=prepare_emlis(req)
                    return receive_candidate(material,request_id=material.request_id,raw_output=canonical(packet),
                        finish_reason="stop",provider="synthetic_existing_teacher_not_model")
                service=EmlisThreadService(semantic_profile=MODEL_PROFILE,offline_candidate_source=source,offline_model_attempt_seconds=180)
                final=await service.start(user,parent)
                assert final["state"]=="COMPLETED" and final["body_state"]=="FINAL",final
                assert final["pending_question"] is None and final["issued_count"]==0 and len(captured)==1
                saved=await service.store.read(user,input_id=parent)
                reader=EmlisThreadService(engine=NoGeneration())
                assert await reader.get(user,parent)=={**final,"can_write":False}
                assert await reader.start(user,parent)=={**final,"can_write":False}
                after=await service.store.read(user,input_id=parent)
                assert after["thread"]==saved["thread"] and after["events"]==saved["events"]
                meaning=next(e for e in saved["events"] if e["kind"]=="MEANING_UPDATE")
                captured[0].update(expected_checkpoint_id=meaning["payload"]["checkpoint_id"],expected_body=final["current_observation"],expected_question=None)
                rows.extend(captured)
                report["cases"].append(dict(id=captured[0]["id"],dto=final,sql_non_generating_read=True,events=saved["events"]))
    finally:
        db.proc.stdin.close(); db.proc.wait(timeout=10)
    assert canonical(rows[:6])==old_six
    assert old_hashes=={name:sha(chair/name) for name in old_hashes}
    for name,values in [("sft_examples.jsonl",rows),("train_messages.jsonl",[dict(id=r["id"],messages=r["messages"]) for r in rows])]:
        with (output/name).open("x") as f:
            for row in values:f.write(canonical(row)+"\n")
    report.update(status="CPU_DAILY3_SQL_SAVED_READS_COMPLETE",training_rows=9,independent_language_families=2,
        old_chair_six_unchanged=True,tokenization_verified=False,token_counter_stub=False)
    (output/"cpu_connection_results.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n")
    names=["generate_candidates.py","sft_examples.jsonl","train_messages.jsonl","cpu_connection_results.json","source_mapping_candidate.json"]
    api_paths=["ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_semantic_admission.py",
        "ai/services/ai_inference/cocolon_meaning_experience_engine/model_candidate_source.py","ai/services/ai_inference/emlis_ai_grounded_observation_gate.py"]
    manifest=dict(schema="cocolon.daily_calm_training_candidates.v1",status="CPU_VERIFIED_NOT_YET_TOKENIZED",
        api_commit=API_COMMIT,training_rows=9,daily_rows=3,chair_rows=6,independent_language_families=2,evaluation_rows=0,
        files={name:dict(sha256=sha(output/name),bytes=(output/name).stat().st_size) for name in names},
        api_source_hashes={name:sha(api/name) for name in api_paths},old_chair_hashes=old_hashes)
    (output/"dataset_manifest.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n")
    print(json.dumps({k:report[k] for k in ("status","training_rows","synthetic_calls","sql_rpc_calls")}))


if __name__=="__main__":
    p=argparse.ArgumentParser();p.add_argument("--api-root",type=Path,required=True);p.add_argument("--chair-pack",type=Path,required=True)
    asyncio.run(generate(p.parse_args()))
