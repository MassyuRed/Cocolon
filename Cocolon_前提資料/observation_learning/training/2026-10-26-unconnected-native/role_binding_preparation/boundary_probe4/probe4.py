"""One bounded, no-learning gold-prefix boundary probe; never a full-generation result."""
import argparse
from dataclasses import replace
import gc
import hashlib
import importlib.util
import json
import math
import os
from pathlib import Path
import signal
import sys
import time
import traceback
from unittest.mock import patch

sys.dont_write_bytecode = True
HERE = Path(__file__).resolve().parent
IDS = ["FT-BOOK-AFTER-ANSWER", "FT-SHOP-AFTER-ANSWER"]
ADAPTER = {"README.md": "7716b0151793769140a76026939437398273346aefc3e5f75bb8ab2833b42885",
           "adapter_config.json": "a08f36c4b7f29abc7d85564e876ff7b90ce7fe6aa641ffe1b25fb56c908809db",
           "adapter_model.safetensors": "f4932d3a2bac1d8e78d0bf86579868e29546914512234d31556840eb28a85c19"}
LIMITS = dict(context_tokens=8192, max_seconds=900, parent_seconds=890, kill_seconds=10,
              per_call_seconds=180, model_loads=1, generations=4, optimizer_steps=0,
              prior_display_hourly_usd=0.28, max_process_usd=0.07, retry=False,
              product_credit=0, automatic_progression=False)

def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

def dump(path, value):
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(json.dumps(value, ensure_ascii=False, indent=2, allow_nan=False) + "\n")
    tmp.replace(path)

def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    result = importlib.util.module_from_spec(spec)
    sys.modules[name] = result
    spec.loader.exec_module(result)
    return result

def owners(args):
    runner = load("boundary_probe_role18", args.role_pack / "run_role18.py")
    _, prior, rows, bound = runner.validate(args.bundle, args.initial_adapter, True)
    helper = prior.module("boundary_probe_immutable_helper", args.bundle / "support/run_pilot.py")
    assert helper.adapter_hashes(args.adapter) == ADAPTER
    bound.update({args.adapter / n: h for n, h in ADAPTER.items()})
    bound.update({Path(__file__): sha(__file__)})
    return runner, prior, helper, rows, bound

def token_prefix(helper, tokenizer, row, evaluation, condition):
    assert row["messages"][:-1] == evaluation["messages"], "original_full_prompt_changed"
    full, prompt_count = helper.encode_training(tokenizer, row["messages"], context=8192)
    gold = row["messages"][-1]["content"].strip()
    gold_object = helper.strict_json(gold)
    assert list(gold_object["c"]) == ["claims", "conflicts", "core", "question", "relations", "schema", "unknowns", "updates", "prose"]
    assert gold_object["c"]["question"] is None
    marker = '"updates":[' if condition == "GOLD_MEANING" else '"prose":{'
    assert gold.count(marker) == 1
    desired = gold.index(marker)
    assistant_ids = full["input_ids"][prompt_count:]
    estimated = len(tokenizer.encode(gold[:desired], add_special_tokens=False))
    choices = []
    for count in range(max(1, estimated - 8), min(len(assistant_ids), estimated + 9)):
        prefix = tokenizer.decode(assistant_ids[:count], skip_special_tokens=False, clean_up_tokenization_spaces=False)
        if desired - 4 <= len(prefix) <= desired and gold.startswith(prefix) and all(ch in ',{}[]": \n' for ch in gold[len(prefix):desired]):
            choices.append((count, prefix))
    assert choices, "no_exact_teacher_token_boundary"
    count, prefix = max(choices)
    input_ids = full["input_ids"][:prompt_count + count]
    expected = gold[len(prefix):]
    suffix_tokens = len(full["input_ids"]) - len(input_ids) - 1
    cap = ((suffix_tokens + 192 + 63) // 64) * 64
    assert len(input_ids) + cap <= 8192 and 0 < cap <= 1536, "prefix_context_or_cap"
    assert prefix + expected == gold
    c = dict(probe_id=row["id"] + "--" + condition, case_id=row["id"], condition=condition,
             gold_assisted=True, eligible_for_full_generation_credit=False,
             messages_sha256=hashlib.sha256(json.dumps(evaluation["messages"], ensure_ascii=False, separators=(",", ":")).encode()).hexdigest(),
             full_teacher_sha256=hashlib.sha256(gold.encode()).hexdigest(),
             boundary_marker=marker, requested_char_boundary=desired,
             actual_char_boundary=len(prefix), actual_utf8_boundary=len(prefix.encode()),
             prompt_tokens=prompt_count, given_assistant_tokens=count,
             input_tokens=len(input_ids), max_new_tokens=cap,
             input_ids_sha256=hashlib.sha256(json.dumps(input_ids, separators=(",", ":")).encode()).hexdigest(),
             input_ids=input_ids, given_prefix=prefix, given_prefix_sha256=hashlib.sha256(prefix.encode()).hexdigest(),
             expected_suffix=expected)
    return c

def prepare(args):
    started = time.monotonic()
    _, _, helper, rows, bound = owners(args)
    from transformers import AutoTokenizer
    tokenizer = AutoTokenizer.from_pretrained(helper.MODEL, revision=helper.REVISION, local_files_only=True, trust_remote_code=False)
    training = {r["id"]: r for r in rows}
    evaluation = {r["case_id"]: r for r in json.loads((args.bundle / "archive/runtime/eval_inputs.json").read_text())}
    cases = [token_prefix(helper, tokenizer, training[cid], evaluation[cid], condition)
             for cid in IDS for condition in ["GOLD_MEANING", "GOLD_MEANING_AND_UPDATES"]]
    assert len(cases) == 4
    report = dict(status="CPU_BOUNDARY_PROBE4_READY_NO_MODEL", source_sha256=sha(__file__),
                  cases=cases, limits=LIMITS, adapter_sha256=ADAPTER,
                  model_loads=0, model_forwards=0, generations=0, training_updates=0,
                  frozen={str(p): h for p, h in bound.items()}, seconds=time.monotonic()-started)
    assert all(sha(p) == h for p, h in bound.items())
    dump(HERE / "prepared_cpu.json", report)
    print(json.dumps(dict(status=report["status"], sha256=sha(HERE / "prepared_cpu.json"),
                         cases=[{k:c[k] for k in ["probe_id","input_tokens","max_new_tokens","actual_char_boundary","given_assistant_tokens"]} for c in cases],
                         seconds=report["seconds"]), ensure_ascii=False), flush=True)

def execute(args):
    assert len(args.source_commit) == 40 and all(x in "0123456789abcdef" for x in args.source_commit)
    parent = (Path("/proc") / str(os.getppid()) / "cmdline").read_bytes().split(bytes([0]))
    assert parent[0].rsplit(b"/",1)[-1] == b"timeout" and all(x in parent for x in [b"--signal=TERM",b"--kill-after=10s",b"890s"])
    assert os.environ.get("HF_HUB_OFFLINE") == os.environ.get("TRANSFORMERS_OFFLINE") == "1"
    assert sha(HERE / "prepared_cpu.json") == args.cpu_sha
    cpu = json.loads((HERE / "prepared_cpu.json").read_text())
    assert cpu["status"] == "CPU_BOUNDARY_PROBE4_READY_NO_MODEL" and cpu["source_sha256"] == sha(__file__) and cpu["limits"] == LIMITS
    assert cpu["adapter_sha256"] == ADAPTER and all(sha(p) == h for p,h in cpu["frozen"].items())
    with (HERE / "execute_once.lock").open("x") as stream:
        stream.write(args.source_commit + "\n")
    args.out.mkdir(exist_ok=False)
    started = time.monotonic()
    deadline = started + 900
    report = dict(status="STARTED_ONCE_DIAGNOSTIC_ONLY", source_commit=args.source_commit,
                  source_sha256=sha(__file__), cpu_sha256=args.cpu_sha, limits=LIMITS,
                  adapter_sha256=ADAPTER, model_loads_started=0, model_loads_completed=0,
                  model_calls_started=0, model_calls_completed=0, calls=[],
                  training_updates=0, gold_assisted=True, product_credit=0,
                  automatic_progression=False, retry=False, started_unix=time.time())
    model = batch = generated = None
    def checkpoint():
        report["elapsed_seconds"] = time.monotonic()-started
        dump(args.out / "run.json", report)
    def stop(*_):
        raise TimeoutError("boundary_probe4_deadline_no_retry")
    signal.signal(signal.SIGALRM, stop)
    signal.signal(signal.SIGTERM, stop)
    signal.setitimer(signal.ITIMER_REAL, 900)
    checkpoint()
    try:
        runner, prior, helper, _, _ = owners(args)
        import importlib.metadata
        import torch
        from transformers import AutoTokenizer, GenerationConfig, StoppingCriteria, StoppingCriteriaList
        assert {n:importlib.metadata.version(n) for n in helper.PINS} == helper.PINS
        assert os.environ.get("RUNPOD_POD_ID") == "vgkm402msgroiu" and torch.cuda.device_count() == 1
        report["gpu"] = helper.gpu_profile(torch, {"minimum_free_gib":14})
        assert report["gpu"]["name"] == "NVIDIA RTX A5000"
        tokenizer = AutoTokenizer.from_pretrained(helper.MODEL, revision=helper.REVISION, local_files_only=True, trust_remote_code=False)
        recovery = prior.module("boundary_probe_recovery", args.bundle / "support/run_expanded15_recovery.py")
        recovery.OLDPACK = args.bundle / "support"
        recovery.ORIGIN = args.bundle / "archive/run"
        owner, _, _ = recovery.owner_with_checked_suffixes()
        report["model_loads_started"] = 1
        checkpoint()
        model, tensors = owner.load_expanded_adapter(helper, args.adapter, ADAPTER, trainable=False)
        assert not any(p.requires_grad for p in model.parameters())
        report["model_loads_completed"] = 1
        dump(args.out / "loaded_tensors.json", tensors)
        model.eval()
        model.config.use_cache = True
        eos = model.generation_config.eos_token_id or tokenizer.eos_token_id
        eos_ids = {eos} if isinstance(eos,int) else set(eos)
        for c in cpu["cases"]:
            assert time.monotonic() < deadline-5 and report["model_calls_started"] < 4
            assert hashlib.sha256(json.dumps(c["input_ids"], separators=(",", ":")).encode()).hexdigest() == c["input_ids_sha256"]
            stop_at = min(deadline, time.monotonic()+180)
            timed_out = False
            class Bounded(StoppingCriteria):
                def __call__(self,*a,**kw):
                    nonlocal timed_out
                    timed_out = time.monotonic() >= stop_at
                    return timed_out
            cfg = GenerationConfig(do_sample=False, num_beams=1, max_new_tokens=c["max_new_tokens"],
                                   eos_token_id=eos, pad_token_id=tokenizer.pad_token_id if tokenizer.pad_token_id is not None else tokenizer.eos_token_id,
                                   use_cache=True)
            batch = torch.tensor([c["input_ids"]], dtype=torch.long, device="cuda:0")
            report["model_calls_started"] += 1
            checkpoint()
            call_started = time.monotonic()
            with torch.inference_mode():
                generated = model.generate(input_ids=batch, attention_mask=torch.ones_like(batch),
                                           generation_config=cfg, stopping_criteria=StoppingCriteriaList([Bounded()]))
            torch.cuda.synchronize()
            new_ids = generated[0,len(c["input_ids"]):].tolist()
            continuation = tokenizer.decode(new_ids, skip_special_tokens=True, clean_up_tokenization_spaces=False)
            joined = c["given_prefix"] + continuation
            try:
                parsed, error = helper.strict_json(joined), None
            except (ValueError,TypeError,UnicodeError) as exc:
                parsed, error = None, str(exc)
            ended = bool(new_ids) and new_ids[-1] in eos_ids
            raw = dict(probe_id=c["probe_id"], case_id=c["case_id"], condition=c["condition"],
                       raw_text=joined, continuation_text=continuation,
                       raw_utf8_sha256=hashlib.sha256(joined.encode()).hexdigest(),
                       continuation_utf8_sha256=hashlib.sha256(continuation.encode()).hexdigest(),
                       given_prefix_sha256=c["given_prefix_sha256"], output_token_ids=new_ids,
                       input_tokens=c["input_tokens"], output_tokens=len(new_ids),
                       usage=dict(prompt_tokens=c["input_tokens"], completion_tokens=len(new_ids)),
                       seconds=time.monotonic()-call_started, finish_reason="stop" if ended else "length",
                       eos_reached=ended, timeout_triggered=timed_out, parsed=parsed, parse_error=error,
                       provider="local_transformers", model=helper.MODEL, revision=helper.REVISION,
                       adapter_revision=ADAPTER["adapter_model.safetensors"], adoption_state="NOT_ADOPTED",
                       semantic_profile=helper.PROFILE, gold_assisted=True,
                       eligible_for_full_generation_credit=False,
                       expected_suffix_exact=continuation == c["expected_suffix"])
            path = args.out / (c["probe_id"]+".json")
            dump(path, raw)
            report["calls"].append(dict(probe_id=c["probe_id"], case_id=c["case_id"], path=path.name,
                                         sha256=sha(path), eos_reached=ended, output_tokens=len(new_ids),
                                         timeout_triggered=timed_out, strict_json=parsed is not None,
                                         expected_suffix_exact=raw["expected_suffix_exact"]))
            report["model_calls_completed"] += 1
            batch = generated = None
            checkpoint()
            assert not timed_out and time.monotonic() < stop_at, "per_call_deadline_no_retry"
        assert helper.adapter_hashes(args.adapter) == ADAPTER
        report["status"] = "CONDITIONAL_RAW_COMPLETE_PENDING_CMEE_REVIEW"
    except BaseException as exc:
        report.update(status="STOPPED_NO_RETRY", error_type=type(exc).__name__, reason=str(exc), traceback=traceback.format_exc())
    finally:
        batch = generated = model = None
        gc.collect()
        if "torch" in sys.modules and sys.modules["torch"].cuda.is_initialized():
            sys.modules["torch"].cuda.empty_cache()
            report["post_release_allocated_bytes"] = sys.modules["torch"].cuda.memory_allocated()
        report["frozen_inputs_and_adapter_unchanged"] = all(sha(p) == h for p,h in cpu["frozen"].items())
        if not report["frozen_inputs_and_adapter_unchanged"]:
            report["status"] = "STOPPED_IDENTITY_UNVERIFIED_NO_RETRY"
        report["processing_seconds"] = time.monotonic()-started
        report["process_cost_usd"] = report["processing_seconds"]*0.28/3600
        checkpoint()
        signal.setitimer(signal.ITIMER_REAL,0)
    print(json.dumps({k:v for k,v in report.items() if k not in ["calls","limits","gpu"]}),flush=True)

def consume(args):
    os.environ["CUDA_VISIBLE_DEVICES"] = ""
    started = time.monotonic()
    consumer = load("boundary_probe_cmee", args.role_pack / "consume_role18.py")
    old, (v,native,Engine,semantic,prep) = consumer.owners(args.bundle,args.cmee_root)
    run = json.loads((args.out / "run.json").read_text())
    assert run["status"] == "CONDITIONAL_RAW_COMPLETE_PENDING_CMEE_REVIEW" and run["model_calls_completed"] == 4 and run["training_updates"] == 0
    cpu = json.loads((HERE / "prepared_cpu.json").read_text())
    assert sha(HERE / "prepared_cpu.json") == run["cpu_sha256"]
    records = {c["probe_id"]:c for c in cpu["cases"]}
    report = dict(status="GOLD_ASSISTED_BOUNDARY_PROBE4_COMPLETE", cases=[], source_commit=run["source_commit"],
                  api_commit=consumer.API, model_calls=0, training_updates=0, sql_operations=0,
                  product_credit=0, automatic_progression=False, eligible_for_full_generation_credit=False)
    for call in run["calls"]:
        path = args.out / call["path"]
        assert sha(path) == call["sha256"]
        raw = json.loads(path.read_text())
        c = records[raw["probe_id"]]
        assert raw["raw_text"] == c["given_prefix"] + raw["continuation_text"]
        assert raw["given_prefix_sha256"] == c["given_prefix_sha256"] and raw["gold_assisted"]
        item, _ = consumer.read_raw(v,native,Engine,semantic,prep,raw["case_id"],raw)
        item.update(probe_id=raw["probe_id"], condition=raw["condition"], gold_assisted=True,
                    eligible_for_full_generation_credit=False, generated_suffix_sha256=raw["continuation_utf8_sha256"])
        report["cases"].append(item)
    report["seconds"] = time.monotonic()-started
    dump(args.out / "conditional_cmee.json",report)
    print(json.dumps(dict(status=report["status"],seconds=report["seconds"],
                         cases=[dict(probe_id=x["probe_id"], conditional_meaning=x["meaning_adopted"],
                                     conditional_body=x["body_available"], decision=x.get("decision"),reason=x.get("reason_code")) for x in report["cases"]])),flush=True)

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--mode",required=True,choices=["prepare","execute","consume"])
    p.add_argument("--bundle",type=Path,required=True)
    p.add_argument("--role-pack",type=Path,required=True)
    p.add_argument("--initial-adapter",type=Path,required=True)
    p.add_argument("--adapter",type=Path,required=True)
    p.add_argument("--cmee-root",type=Path,required=True)
    p.add_argument("--out",type=Path,required=True)
    p.add_argument("--source-commit")
    p.add_argument("--cpu-sha")
    a = p.parse_args()
    {"prepare":prepare,"execute":execute,"consume":consume}[a.mode](a)

