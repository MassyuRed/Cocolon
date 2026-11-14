"""One bounded same-weights/messages comparison; export final answers only."""
import gc,hashlib,inspect,json,os,signal,sys,threading,time,traceback
from pathlib import Path
os.environ.update(HF_HOME='/workspace/.cache/huggingface',HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1')
sys.dont_write_bytecode=True
sys.path.insert(0,'/workspace/mashos-api/ai/tools')
import serve_emlis_natural_reply as serving
ROOT=Path('/workspace/semantic-budget512-v1');ROOT.mkdir(exist_ok=False)
pack=json.loads(Path('/workspace/semantic-resume40-v1/plan.json').read_text());previous=json.loads(Path('/workspace/semantic-resume40-v1/run/report.json').read_text())
assert previous['initial_updates']==80 and previous['updates_completed']==40 and len(previous['calls'])==5
assert previous['adapter_sha256']=='ecbdd0d113cfcdc38a17be4b17c708678c01c5071ae86c8a30ca9a5de5900495'
source=inspect.getsource(serving.load_generator);assert 'enable_thinking=False' in source
source=source.replace('def load_generator(', 'def load_thinking_generator(',1).replace('enable_thinking=False','enable_thinking=True',1)
old='        return tokenizer.decode(tokens, skip_special_tokens=True, clean_up_tokenization_spaces=False), finish'
new='''        closing = int(tokenizer.convert_tokens_to_ids('</think>'))
        assert tokenizer.decode([closing], skip_special_tokens=False) == '</think>'
        positions = (tokens == closing).nonzero(as_tuple=False)
        if not len(positions):
            return '', 'length'
        final_tokens = tokens[int(positions[0,0])+1:]
        return tokenizer.decode(final_tokens, skip_special_tokens=True, clean_up_tokenization_spaces=False).lstrip(), finish'''
assert old in source;source=source.replace(old,new,1);namespace=dict(serving.__dict__);exec(compile(source,'same_pinned_generator_thinking_final_only','exec'),namespace)
import torch
class ThinkingBudgetProcessor:
 def __init__(self,prompt_tokens,closing,budget=512):self.prompt_tokens,self.closing,self.budget=prompt_tokens,closing,budget
 def __call__(self,input_ids,scores):
  suffix=input_ids[:,self.prompt_tokens:]
  if suffix.shape[1]>=self.budget and not bool((suffix==self.closing).any()):
   scores.fill_(float('-inf'));scores[:,self.closing]=0
  return scores
# Check the exact boundary and natural close without any model generation.
processor=ThinkingBudgetProcessor(2,4,budget=3)
a=processor(torch.tensor([[1,1,2,2]]),torch.zeros(1,8));assert bool((a==0).all())
b=processor(torch.tensor([[1,1,2,2,2]]),torch.zeros(1,8));assert b[0,4]==0 and torch.isneginf(b[0,:4]).all()
c=processor(torch.tensor([[1,1,4,2,2]]),torch.zeros(1,8));assert bool((c==0).all())
namespace['ThinkingBudgetProcessor']=ThinkingBudgetProcessor
# Only the closing think token is forced; final analysis tokens remain model-generated.
source=source.replace('stopping_criteria=StoppingCriteriaList([stopping]))',
 'logits_processor=[ThinkingBudgetProcessor(count,int(tokenizer.convert_tokens_to_ids("</think>")))], stopping_criteria=StoppingCriteriaList([stopping]))')
assert 'logits_processor=[ThinkingBudgetProcessor' in source
exec(compile(source,'same_pinned_generator_budget512_final_only','exec'),namespace)
start=time.monotonic();deadline=start+680
report=dict(status='STARTED_NOT_ADOPTED',adapter_sha256=previous['adapter_sha256'],adapter_config_sha256=previous['adapter_config_sha256'],fixed_base_revision=pack['revision'],same_messages=True,thinking=True,thinking_budget=512,private_reasoning_exported=False,model_adopted=False,calls=[],runner_sha256=hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),generator_variant_sha256=hashlib.sha256(source.encode()).hexdigest())
def save():
 report['seconds']=round(time.monotonic()-start,3);p=ROOT/'report.json';tmp=p.with_suffix('.tmp');tmp.write_text(json.dumps(report,ensure_ascii=False,indent=2));tmp.replace(p)
def expire(*a):raise TimeoutError('bounded_thinking_comparison_expired')
signal.signal(signal.SIGALRM,expire);signal.signal(signal.SIGTERM,expire);signal.setitimer(signal.ITIMER_REAL,680);save()
try:
 generator=namespace['load_thinking_generator']('/workspace/semantic-resume40-v1/run/adapter',threading.Event(),weights_sha256=previous['adapter_sha256'],config_sha256=previous['adapter_config_sha256'],max_new_tokens=4096,context_tokens=16384)
 rows={r['id']:r for r in pack['teachers']+pack['heldouts']}
 for name in ['T01_manual10','H03_boundary','H04_garden']:
  row=rows[name];begin=time.monotonic();final,finish=generator(row['messages'],min(deadline-10,begin+210))
  response=dict(model='cocolon-qwen3.5-4b-analysis-semantic-budget512-120u',choices=[dict(index=0,finish_reason=finish,message=dict(role='assistant',content=final))])
  (ROOT/(name+'.response.json')).write_text(json.dumps(response,ensure_ascii=False))
  report['calls'].append(dict(id=name,finish_reason=finish,seconds=round(time.monotonic()-begin,3),final_sha256=hashlib.sha256(final.encode()).hexdigest()));save()
  if finish!='stop':break
 report['status']='COMPLETE_NOT_ADOPTED_PENDING_FINAL_READ'
except BaseException as exc:
 report.update(status='FAILED_NOT_ADOPTED',error_type=type(exc).__name__,error=str(exc));raise
finally:
 save();signal.setitimer(signal.ITIMER_REAL,0)
