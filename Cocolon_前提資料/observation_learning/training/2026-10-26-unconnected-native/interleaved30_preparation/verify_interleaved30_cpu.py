"""CPU scope checks for the new 30-update candidate. No model runtime import."""
import ast,collections,copy,hashlib,importlib.util,json,pathlib,shutil,sys,tempfile
P=pathlib.Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('candidate30',P/'run_native15_interleaved30.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
plan=json.loads((P/m.SUCCESSOR_PLAN).read_text());checks=[]
def ok(name,value):
 assert value,name;checks.append(name)
def refuses(name,fn,expected):
 try:fn()
 except ValueError as e:ok(name,str(e)==expected)
 else:raise AssertionError(name)
ok('pending_plan_static_valid',m.validate_successor(P)==plan)
existed=m.OUTPUT.exists();refuses('pending_execute_refused_before_output_or_weights',lambda:m.execute(P,'a'*40),'execute_refused_mash_approval_pending');ok('pending_output_not_created',m.OUTPUT.exists()==existed)
prior=json.loads((P/'gpu15.plan.json').read_text());ids=prior['training_order'];rows=[json.loads(l) for l in (P/'train_messages.jsonl').read_text().splitlines()];cases=[json.loads(l) for l in (P/'eval_inputs.jsonl').read_text().splitlines()]
ok('original_data_evaluation_order15_unchanged',[x['id'] for x in rows]==ids==[x['case_id'] for x in cases])
ok('exact30_each_row_twice',collections.Counter(plan['update_order'])==collections.Counter({cid:2 for cid in ids}))
for n in (0,15):ok('pass'+str(n//15+1)+'_all_frozen15_once',collections.Counter(plan['update_order'][n:n+15])==collections.Counter(ids))
for row,case in zip(rows,cases,strict=True):ok('no_teacher_in_eval:'+row['id'],row['messages'][:-1]==case['messages'])
with tempfile.TemporaryDirectory() as td:
 q=pathlib.Path(td)
 for x in P.iterdir():
  if x.is_file():shutil.copyfile(x,q/x.name)
 def trial(key,value,error):
  a=copy.deepcopy(plan);a[key]=value;(q/m.SUCCESSOR_PLAN).write_text(json.dumps(a));refuses('mutation_'+key,lambda:m.validate_successor(q),error)
 for key,value in [('optimizer_steps',31),('training_passes',3),('max_model_calls',16),('max_seconds',2701),('per_generation_seconds',181),('retry',True),('before_ids',[ids[0]]),('update_order',list(reversed(plan['update_order'])))]:trial(key,value,'successor_scope_changed:'+key)
 trial('gpu_run_authorized',True,'successor_authorization_mismatch')
 trial('approval_basis','invented approval','approval_basis_mismatch')
 trial('gpu_hourly_usd',0.29,'fixed_process_budget_changed')
 trial('pod_id','another-pod','same_a5000_pod_required')
 trial('runner_sha256','0'*64,'successor_runner_changed')
 a={**plan,'status':'AUTHORIZED_ONCE_BOUND','gpu_run_authorized':True,'approval_basis':'CPU TEST ONLY NOT EXECUTED'};(q/m.SUCCESSOR_PLAN).write_text(json.dumps(a));ok('authorized_shape_only_no_execute',m.validate_successor(q,execution=True)==a)
 (q/m.SUCCESSOR_PLAN).write_text(json.dumps(plan));f=q/'run_native15_afteronly.py';f.write_bytes(f.read_bytes()+b' ');refuses('closed_runner_modification_refused',lambda:m.validate_successor(q),'closed_afteronly_runner_changed')
 f.write_bytes((P/f.name).read_bytes());f=q/'train_messages.jsonl';f.write_bytes(f.read_bytes()+b' ');refuses('frozen_teacher_modification_refused',lambda:m.validate_successor(q),'payload_changed:train_messages.jsonl')
old=(P/'run_native15_afteronly.py').read_text();new=(P/'run_native15_interleaved30.py').read_text()
def part(s,a,b):return s[s.index(a):s.index(b,s.index(a))]
ok('generation_caps_finish_reason_timeout_raw_behavior_identical',part(old,'  def evaluate_one(','  byid=')==part(new,'  def evaluate_one(','  byid='))
ok('save_separate_reload_and_after15_identical',part(old,'  optimizer.zero_grad(set_to_none=True);optimizer=None',' except BaseException as exc:')==part(new,'  optimizer.zero_grad(set_to_none=True);optimizer=None',' except BaseException as exc:'))
ok('same_optimizer_and_lr',"optimizer=torch.optim.AdamW([p for n,p in trainable],lr=5e-5,weight_decay=0.)" in new)
ok('full_assistant_eos_loss_unchanged',"loss=r.teacher_loss(model,input_ids=ids,attention_mask=torch.ones_like(ids),labels=labels,encoded=item)" in new)
tree=ast.parse(new);prep=next(n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name=='prepare');merge=next(n.value for n in prep.body if isinstance(n,ast.Assign) and isinstance(n.value,ast.Dict) and any(isinstance(k,ast.Constant) and k.value=='successor' for k in n.value.keys));effective=eval(compile(ast.Expression(body=merge),'<effective-plan>','eval'),{'plan':prior,'successor':plan})
ok('effective_pending_does_not_inherit_old_approval',effective['gpu_run_authorized'] is False and effective['optimizer_steps']==30 and effective['update_order']==plan['update_order'])
for i,cid in enumerate(plan['update_order']):
 idx=ids.index(cid);ok('step_row_index_and_log_id:'+str(i+1),rows[idx]['id']==cid)
spec2=importlib.util.spec_from_file_location('consumer30',P/'consume_interleaved30.py');consumer=importlib.util.module_from_spec(spec2);spec2.loader.exec_module(consumer)
cs,native=consumer.frozen_cases(P,P/'sft_examples.jsonl')
ok('consumer15_frozen_input_prior_binding',len(cs)==len(native)==15)
ok('no_model_runtime_imported',not {'torch','transformers','peft'}&set(sys.modules))
report=dict(status='CPU_INTERLEAVED30_SCOPE_CHECKS_PASSED',checks=checks,count=len(checks),actual_tokenizer_reexecution=False,model_loads=0,model_forwards=0,training_updates=0,generations=0,cmee_adoptions=0,sql_operations=0,runner_sha256=hashlib.sha256((P/'run_native15_interleaved30.py').read_bytes()).hexdigest(),consumer_sha256=hashlib.sha256((P/'consume_interleaved30.py').read_bytes()).hexdigest(),gpu_run_authorized=False)
(P/'cpu_scope_validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items() if k!='checks'}))
