"""Two source-authored combination contrasts; CPU strict/file/tokenizer only."""
from pathlib import Path
from dataclasses import replace
from hashlib import sha256
from unittest.mock import patch
from contextlib import ExitStack
import argparse,json,sys
w=Path('/workspace');api=w/'analysis-api-20261103'
sys.dont_write_bytecode=True
sys.path[:0]=[str(api/'ai/tools'),str(api/'ai/services/ai_inference')]
def main():
 parser=argparse.ArgumentParser();parser.add_argument('--source-sha256',required=True);args=parser.parse_args()
 source=w/'combination2_sources.json';assert sha256(source.read_bytes()).hexdigest()==args.source_sha256
 spec=json.loads(source.read_text());assert spec['status']=='ROOT_SYNTHETIC_COMBINATION2_CPU_ONLY_NOT_A_TRAINING_PLAN' and len(spec['rows'])==2
 prior=w/'analysis-ce68-20261103';old=json.loads((prior/'semantic_units_ce68_plan.json').read_text());out=w/'analysis-combination2-cpu-v2-20261103';assert not out.exists()
 manifest=json.loads((prior/'api_source_manifest.json').read_text());assert len(manifest)==2134 and all(sha256((api/n).read_bytes()).hexdigest()==h for n,h in manifest.items())
 import analysis_cumulative_service as service
 from cocolon_meaning_experience_engine import MeaningExperienceEngine
 from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import AnalysisModelQuotedParentUnitsResponse,canonical
 import cocolon_meaning_experience_engine.cores.analysis.intent_compiler as compiler
 import cocolon_meaning_experience_engine.cores.analysis.observed_route_realizer as author
 from transformers import AutoTokenizer
 tok=AutoTokenizer.from_pretrained(old['plan']['model'],revision=old['plan']['revision'],local_files_only=True,trust_remote_code=False)
 out.mkdir();(out/'source.json').write_bytes(source.read_bytes());rows=[]
 oldtexts={m['original']['memo'] for row in old['teachers']+old['evaluation'] for m in row['snapshot']['members']}
 for row in spec['rows']:
  assert all(m['original']['memo'] not in oldtexts for m in row['snapshot']['members'])
  prepared=service.prepare_cumulative_quoted_parent_units(row['owner'],row['snapshot']);raw=canonical(row['target'])
  response=AnalysisModelQuotedParentUnitsResponse(prepared.request_ref,sha256(canonical(prepared.messages()).encode()).hexdigest(),sha256(raw.encode()).hexdigest(),'stop',raw);inp=replace(prepared,response=response)
  art,cov=service.build_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],model_input=inp)
  assert cov['mapped_count']==0 and cov['unparsed_count']==1
  path=out/('teacher_'+row['id']+'.candidate.json');path.write_text(service.serialize_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],model_input=inp,artifact=art,coverage=cov))
  with ExitStack() as stack:
   for obj,name in [(MeaningExperienceEngine,'generate'),(compiler,'compile_analysis_unit_candidates'),(author,'realize_analysis_unit_candidates')]:stack.enter_context(patch.object(obj,name,side_effect=AssertionError('no saved regeneration/compiler/author')))
   saved,counts=service.reload_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],path.read_text())
  assert art==saved and cov==counts
  prompt=tok.apply_chat_template(prepared.messages(),enable_thinking=False,add_generation_prompt=True,tokenize=True,return_dict=False,truncation=False)
  full=tok.apply_chat_template(prepared.messages()+[dict(role='assistant',content=raw)],enable_thinking=False,add_generation_prompt=False,tokenize=True,return_dict=False,truncation=False)
  assert full[:len(prompt)]==prompt and len(prompt)+2048<=8192 and len(full)<=8192
  assert tok.decode(full[len(prompt):],skip_special_tokens=False,clean_up_tokenization_spaces=False)==raw+'<|im_end|>\n'
  rows.append(dict(id=row['id'],owner=row['owner'],snapshot=row['snapshot'],request_ref=prepared.request_ref,messages=prepared.messages(),assistant_target=raw,source_bound_candidate_id=art.candidate_id,coverage=cov,provenance=row['provenance'],prompt_tokens=len(prompt),target_tokens=len(full)-len(prompt),full_tokens=len(full),file_reload='MATCHED_NO_GENERATION_COMPILER_AUTHOR'))
 result=dict(status='TWO_NEW_SOURCE_CONTRASTS_STRICT_FILE_TOKENIZER_MATCHED_CPU_ONLY',source_sha256=args.source_sha256,existing68_unchanged=True,rows=rows,model_loads=0,new_generations=0,training_updates=0,normal_adoption=False,next_gpu_selected=False)
 (out/'semantic_units_combination2_cpu.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
 files=[p for p in out.rglob('*') if p.is_file()];(out/'manifest.json').write_text(json.dumps({str(p.relative_to(out)):sha256(p.read_bytes()).hexdigest() for p in files},indent=2)+'\n')
 import html
 bundle={str(p.relative_to(out)):dict(text=p.read_bytes().decode('utf-8'),sha256=sha256(p.read_bytes()).hexdigest(),bytes=p.stat().st_size) for p in out.rglob('*') if p.is_file()}
 (w/'combination2-evidence.html').write_text('<meta charset=utf-8><textarea aria-label="CPU evidence">'+html.escape(json.dumps(bundle,ensure_ascii=False,separators=(',',':')))+'</textarea>')
 print(json.dumps(dict(status=result['status'],model_loads=0,new_generations=0,training_updates=0,rows=[{k:r[k] for k in ['id','prompt_tokens','target_tokens','full_tokens','file_reload']} for r in rows])))
if __name__=='__main__':main()
