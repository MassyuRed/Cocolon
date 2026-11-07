"""One-shot CPU boundary probe. No model/tokenizer/CUDA/DB/network calls."""
import copy,hashlib,json,os,subprocess,sys,time,uuid
from pathlib import Path
os.environ["CUDA_VISIBLE_DEVICES"]=""
os.environ["HF_HUB_OFFLINE"]="1"
os.environ["TRANSFORMERS_OFFLINE"]="1"
sys.dont_write_bytecode=True
API="4002b4577838d1ed6671278a19585b61e7ccd10e"
OUTPUT=Path("/workspace/cocolon_4b_general_boundary_cpu_20261026.json")
assert not OUTPUT.exists(),"one_shot_result_exists"
started=time.monotonic()
legacy=Path("/workspace/cocolon_emlis_4b_repaired_20261025")
pack=Path("/workspace/cocolon_4b_quote_joint_pack_20261026")
roots=[]
for p in Path("/workspace").iterdir():
 if (p/".git").exists():
  head=subprocess.run(["git","-C",str(p),"rev-parse","HEAD"],capture_output=True,text=True,check=True).stdout.strip()
  if head==API:roots.append(p)
assert roots,"fixed_api_not_present"
api=sorted(roots)[0]
sys.path.insert(0,str(legacy))
from verify_cmee import load_api,reconstruct_request
load_api(api,API)
from cocolon_meaning_experience_engine.model_candidate_source import build_model_messages
from cocolon_meaning_experience_engine.preparation import prepare_emlis
from cocolon_meaning_experience_engine.emlis_thread_source import admit_emlis_thread
from cocolon_meaning_experience_engine.emlis_semantic_admission import _model_source_roles,SemanticNotAdopted
EXPECTED_HASHES={'ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_semantic_admission.py': 'cf7c4c92f2591a0a624b9fbb6044c5a71926aab1e7ca87efb4560aeb0ec1ba2a', 'ai/services/ai_inference/cocolon_meaning_experience_engine/model_candidate_source.py': 'ea63db1f10a51b30ca42e441d6b52824d2ae8eb2845e2ae6bfbe8c7642d7cc5c'}
actual_hashes={p:hashlib.sha256((api/p).read_bytes()).hexdigest() for p in EXPECTED_HASHES}
assert actual_hashes==EXPECTED_HASHES,"actual_api_bytes_changed"
examples=[json.loads(l) for l in (pack/"sft_examples.jsonl").read_text().splitlines() if l.strip()]
assert len(examples)==9
controls=[]
for e in examples:
 req,prior=reconstruct_request(e)
 roles=_model_source_roles(admit_emlis_thread(req),prepare_emlis(req))
 controls.append({"id":e["id"],"roles":list(roles[0]),"source_scope_supported":True})
base=next(e for e in examples if not e["native_case"]["answers"])
selected=[{'case_id': 'E01-0', 'original': {'id': 'E01-O', 'created_at': '2026-10-21T19:30:00+09:00', 'memo': 'やっと机の端が使える。', 'memo_action': '積んでいた郵便物を分けて、いらない紙を捨てた。', 'category': ['生活'], 'emotions': ['平穏'], 'emotion_details': [{'type': '平穏', 'strength': 'weak'}]}}, {'case_id': 'E03-0', 'original': {'id': 'E03-O', 'created_at': '2026-10-21T18:20:00+09:00', 'memo': '昨日は断れずに引き受けた。でも今日は、同じ頼まれごとを断ってほっとした。', 'memo_action': '昨日の依頼は引き受け、今日の依頼は断ると返事をした。', 'category': ['仕事'], 'emotions': ['平穏'], 'emotion_details': [{'type': '平穏', 'strength': 'medium'}]}}]
results=[]
for item in selected:
 case=copy.deepcopy(base["native_case"])
 original=copy.deepcopy(case["original"])
 original.update(item["original"])
 for key in ("id","user_id"):
  original[key]=str(uuid.uuid5(uuid.NAMESPACE_URL,"cocolon-boundary-20261026-"+item["case_id"]+key))
 case["original"]=original
 case["request_id"]="boundary-"+item["case_id"]
 case["thread_id"]=str(uuid.uuid5(uuid.NAMESPACE_URL,"cocolon-boundary-20261026-"+item["case_id"]+"thread"))
 assert case["answers"]==[] and case["prior_snapshot_json"] is None
 req,prior=reconstruct_request({"native_case":case})
 messages=build_model_messages(req,prior,candidate_format="cocolon.cmee.quote_candidate.v1")
 body=json.loads(messages[1]["content"])
 spec=body["output_spec"]
 try:
  _model_source_roles(admit_emlis_thread(req),prepare_emlis(req))
  outcome={"decision":"SUPPORTED","reason_code":None}
 except SemanticNotAdopted as exc:
  outcome={"decision":exc.decision,"reason_code":exc.reason_code}
 assert outcome=={"decision":"UNSUPPORTED","reason_code":"model_repair_reuse_source_out_of_scope"}
 assert "repair/result/joy/object" in spec["meaning"] and "Other grammars unsupported" in spec["meaning"]
 assert req.current_input_bundle.raw_current_input["memo"]==item["original"]["memo"]
 assert req.current_input_bundle.raw_current_input["memo_action"]==item["original"]["memo_action"]
 results.append({"case_id":item["case_id"],"original_input":item["original"],"request":case,
  "model_messages":messages,"source_scope_check":outcome,"incorrect_chair_instruction_for_unrelated_input":True,
  "model_called":False,"meaning_adopted":False,"counted_as_quality_failure":False})
weight=Path("/workspace/cocolon_4b_quote_joint_fit12_20261026/adapter/adapter_model.safetensors")
weight_sha=hashlib.sha256(weight.read_bytes()).hexdigest()
assert weight_sha.startswith("45779ad9")
assert "torch" not in sys.modules and "transformers" not in sys.modules
result={"schema":"cocolon.4b_general_input_boundary_cpu.v1","status":"BLOCKER_CONFIRMED_NO_MODEL_EXECUTION",
 "source_cocolon_commit":"bc39981585e2b12a364b2fadf64ac2f86a7bfad7","api_commit":API,
 "api_source_sha256":actual_hashes,"selected_adapter_sha256":weight_sha,
 "positive_controls":controls,"independent_input_checks":results,
 "diagnostic_is_not_model_capability_evaluation":True,"new_model_calls":0,"model_loads":0,"tokenizer_loads":0,
 "training_updates":0,"sql_calls":0,"network_calls":0,"gpu_lifecycle_operations":0,"production_changes":0,
 "teacher_and_existing_raw_files_changed":False,"seconds":time.monotonic()-started,
 "limits":["Current profile only recognizes repair/reuse and meal/calm syntax.","Quote equality does not prove arbitrary Japanese meaning.","No general model capability or product acceptance determined."],
 "diagnostic_source_sha256":hashlib.sha256(Path(__file__).read_bytes()).hexdigest()}
OUTPUT.write_text(json.dumps(result,ensure_ascii=False,indent=2)+"\n")
print("CPU_BOUNDARY: known source controls",len(controls),"/9 supported")
for r in results:print(r["case_id"],r["source_scope_check"]["decision"],r["source_scope_check"]["reason_code"])
print("Unrelated inputs currently receive chair-specific output instructions: 2/2")
print("Model/tokenizer/CUDA/training/SQL/network/lifecycle: 0")
print("Saved",OUTPUT,"sha256",hashlib.sha256(OUTPUT.read_bytes()).hexdigest())
