// Run with NODE_PATH pointing to the pinned dependencies in emlis-q2-tools.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const React = require('react');
const Renderer = require('react-test-renderer');
const babel = require('@babel/core');
const { act } = Renderer;
const ROOT = path.resolve(__dirname, '..');

function load(relative, mocks = {}, dev = true) {
  const filename = path.resolve(ROOT, relative);
  const transformed = babel.transformSync(fs.readFileSync(filename, 'utf8'), {
    filename, configFile: false, babelrc: false,
    presets: [require.resolve('@babel/preset-react')],
    plugins: [require.resolve('@babel/plugin-transform-modules-commonjs')],
  }).code;
  const module = { exports: {} };
  Function('require', 'module', 'exports', '__DEV__', transformed)(name => {
    if (Object.hasOwn(mocks, name)) return mocks[name];
    return require(name);
  }, module, module.exports, dev);
  return module.exports;
}
const initial = {
  schema_version: 'cocolon.emlis_thread.application.v1', thread_id: 'thread', revision: 3,
  state: 'AWAITING_ANSWER', body_state: 'PRE_QUESTION', answer_saved: false,
  pending_question: { question_id: 'question', text: 'その時、どう感じましたか？' },
  original: { id: 'input', created_at: '2026-09-10T03:00:00', memo: '褒められたのに、嬉しくなかった。' },
  timeline: [{ event_id: 'old', kind: 'OBSERVATION', text: '初回の観測', is_current: true },
    { event_id: 'question', kind: 'QUESTION', text: 'その時、どう感じましたか？' }],
};
const completed = { ...initial, revision: 6, state: 'COMPLETED', body_state: 'REFINED',
  answer_saved: true, pending_question: null, current_observation: { event_id: 'new', text: '更新した観測' } };

async function mount(api, enabled = true) {
  const { useEmlisThread } = load('screens/input/useEmlisThread.js', {
    '../../lib/api/emlisThreadApi': { emlisThreadApi: api },
    '../../AppRuntimeContext': { useAppRuntime: () => ({ isFeatureEnabled: () => false }) },
  });
  let value, root;
  function Harness({ userId }) { value = useEmlisThread({ userId, api, enabled }); return null; }
  await act(async () => { root = Renderer.create(React.createElement(Harness, { userId: 'owner' })); });
  return { get value() { return value; }, root,
    async user(userId) { await act(async () => root.update(React.createElement(Harness, { userId }))); } };
}

test('close and reopen read the saved question without skip or generation', async () => {
  let reads = 0;
  const h = await mount({ get: async () => { reads++; return initial; }, action: () => assert.fail('close must not post') });
  await act(async () => h.value.open('input'));
  await act(async () => h.value.setDraft('一時的な下書き'));
  await act(async () => h.value.close());
  assert.equal(h.value.visible, false); assert.equal(h.value.draft, '');
  await act(async () => h.value.open('input'));
  assert.equal(h.value.dto.pending_question.question_id, 'question'); assert.equal(reads, 2);
  await act(async () => h.root.unmount());
});

test('double tap sends once and saved answer clears draft', async () => {
  let finish, sends = 0, body;
  const h = await mount({ get: async () => initial, answer: async (_, payload) => {
    sends++; body = payload; return new Promise(resolve => { finish = resolve; });
  } });
  await act(async () => h.value.open('input'));
  await act(async () => h.value.setDraft('次も同じ成果を求められるようで、重かった。'));
  let pending;
  await act(async () => { pending = h.value.sendAnswer(); h.value.sendAnswer(); });
  assert.equal(sends, 1); assert.ok(body.idempotency_key); assert.equal(body.expected_revision, 3);
  assert.equal(h.value.busy, true);
  await act(async () => { finish(completed); await pending; });
  assert.equal(h.value.draft, ''); assert.equal(h.value.dto.answer_saved, true);
  await act(async () => h.root.unmount());
});

test('unknown admission reconciles with GET before replaying identical payload', async () => {
  const sent = [];
  const h = await mount({ get: async () => initial, answer: async (_, payload) => {
    sent.push(payload); if (sent.length === 1) throw new Error('timeout'); return completed;
  } });
  await act(async () => h.value.open('input'));
  await act(async () => h.value.setDraft('回答'));
  await act(async () => h.value.sendAnswer());
  assert.equal(h.value.uncertain, true);
  await act(async () => { h.value.setDraft('別の回答'); await h.value.sendAnswer(); });
  assert.equal(sent.length, 1); assert.equal(h.value.draft, '回答');
  await act(async () => h.value.refresh());
  await act(async () => h.value.sendAnswer());
  assert.deepEqual(sent[1], sent[0]); assert.equal(h.value.draft, '');
  await act(async () => h.root.unmount());
});

test('account switch, logout and late response cannot reveal previous draft/body', async () => {
  let resolve;
  const h = await mount({ get: async () => new Promise(r => { resolve = r; }) });
  let opening;
  await act(async () => { opening = h.value.open('input'); });
  await h.user('different-owner');
  await act(async () => { resolve(initial); await opening; });
  assert.equal(h.value.dto, null); assert.equal(h.value.visible, false);
  await h.user('');
  assert.equal(h.value.draft, ''); assert.equal(await h.value.open('input'), false);
  await act(async () => h.root.unmount());
});

test('deletion/access removal clears source and answer draft', async () => {
  let gone = false;
  const h = await mount({ get: async () => { if (gone) throw Object.assign(new Error('gone'), { status: 404 }); return initial; } });
  await act(async () => h.value.open('input'));
  await act(async () => h.value.setDraft('保存しない回答'));
  gone = true;
  await act(async () => h.value.refresh());
  assert.equal(h.value.dto, null); assert.equal(h.value.draft, ''); assert.match(h.value.error, /参照できません/);
  await act(async () => h.root.unmount());
});

test('default-off hook makes no requests; whitespace/long answers cannot send', async () => {
  const disabled = await mount({ get: () => assert.fail('disabled') }, false);
  assert.equal(await disabled.value.open('input'), false);
  await act(async () => disabled.root.unmount());
  const h = await mount({ get: async () => initial, answer: () => assert.fail('invalid answer') });
  await act(async () => h.value.open('input'));
  for (const text of ['   ', 'あ'.repeat(2001)]) {
    await act(async () => h.value.setDraft(text)); await act(async () => h.value.sendAnswer());
  }
  await act(async () => h.root.unmount());
});

test('refinement failure shows old observation as historical and retry only when allowed', async () => {
  const native = Object.fromEntries(['ActivityIndicator','KeyboardAvoidingView','Modal','ScrollView','Text','TextInput','View'].map(x => [x,x]));
  Object.assign(native, { Platform: { OS: 'ios' }, StyleSheet: { create: x => x } });
  const { default: Modal } = load('screens/input/EmlisThreadModal.js', {
    'react-native': native,
    '../../components/CocolonButton': props => React.createElement('Button',props,props.children),
  });
  const failed = { ...completed, state: 'RESPONSE_FAILED', body_state: 'MEANING_UPDATED_BODY_UNAVAILABLE',
    timeline: initial.timeline.map(e => ({ ...e, is_current: false })), current_observation: null, can_retry: true };
  const actions = [];
  const thread = { visible: true, dto: failed, draft: '', action: value => actions.push(value), close: () => actions.push('close') };
  let root;
  await act(async () => { root = Renderer.create(React.createElement(Modal, { thread, colors: {} })); });
  const output = JSON.stringify(root.toJSON());
  assert.match(output, /以前の観測/); assert.doesNotMatch(output, /現在の観測/);
  assert.match(output, /意味の訂正は保存/); assert.equal(root.root.findAllByType('TextInput').length, 0);
  const retry = root.root.findAllByType('Button').find(b => b.props.children === '本文を再試行する');
  await act(async () => retry.props.onPress()); assert.deepEqual(actions, ['retry_response']);
  await act(async () => root.update(React.createElement(Modal, { thread: { ...thread, dto: { ...failed, can_retry: false } }, colors: {} })));
  assert.equal(root.root.findAllByType('Button').filter(b => b.props.children === '本文を再試行する').length, 0);
  await act(async () => root.unmount());
});

test('dedicated API drops source-bearing error bodies and keeps auth on', async () => {
  let options;
  const { emlisThreadApi } = load('lib/api/emlisThreadApi.js', {
    '../apiClient': { apiFetch: async (_, opts) => { options = opts; return {
      ok: false, status: 503, json: () => assert.fail('must not read private error'),
    }; } },
  });
  await assert.rejects(emlisThreadApi.answer('thread', { answer_text: 'synthetic' }), error => {
    assert.equal(error.message, 'emlis_thread_request_failed'); assert.equal(error.body, undefined); return true;
  });
  assert.notEqual(options.auth, false); assert.equal(options.method, 'POST');
});

test('changed native screens and question panel transpile', () => {
  for (const name of ['screens/InputScreen.js','screens/AnalysisHistoryScreen.js','screens/input/EmlisThreadModal.js']) {
    assert.ok(babel.transformSync(fs.readFileSync(path.join(ROOT,name),'utf8'), {
      configFile:false,babelrc:false,presets:[require.resolve('@babel/preset-react')],
    }).code);
  }
});

test('round two draft and uncertain answer survive round one receipt', async () => {
  const roundTwo = { ...initial, revision: 8, answer_saved: true, pending_question: { question_id: 'question-2' },
    timeline: [...initial.timeline, {event_id:'answer-1',kind:'ANSWER',question_id:'question',text:'前の回答'}] };
  let saved = roundTwo;
  const h = await mount({ get: async () => saved, answer: async () => { throw Error('timeout'); } });
  await act(async () => h.value.open('input')); await act(async () => h.value.setDraft('二つ目の回答'));
  await act(async () => h.value.refresh()); assert.equal(h.value.draft,'二つ目の回答');
  await act(async () => h.value.sendAnswer()); await act(async () => h.value.refresh());
  assert.equal(h.value.uncertain,true);assert.equal(h.value.draft,'二つ目の回答');
  saved = {...roundTwo,revision:11,pending_question:null,timeline:[...roundTwo.timeline,{event_id:'answer-2',kind:'ANSWER',question_id:'question-2',text:'二つ目の回答'}]};
  await act(async () => h.value.refresh());assert.equal(h.value.uncertain,false);assert.equal(h.value.draft,'');
  await act(async () => h.root.unmount());
});

test('continue is a deliberate action and frame feedback has its own replay key', async () => {
  const waiting={...completed,state:'AWAITING_CONTINUE',can_continue:true};const sent=[];
  const h=await mount({get:async()=>waiting, action:async(_,p)=>{sent.push(p);return {...initial,pending_question:{question_id:'question-2'}};},
    frame:async(_,p)=>{sent.push(p);return waiting;}});
  await act(async()=>h.value.open('input'));assert.equal(sent.length,0);
  await act(async()=>h.value.action('continue'));assert.equal(sent[0].action,'continue');assert.equal(sent[0].question_id,undefined);
  await act(async()=>h.value.updateFrame({frame_ref:'frame-version'},'REVISED','私の受け止め'));
  assert.equal(sent[1].frame_ref,'frame-version');assert.equal(sent[1].correction_text,'私の受け止め');
  assert.notEqual(sent[0].idempotency_key,sent[1].idempotency_key);
  await act(async()=>h.root.unmount());
});

test('frame editor submits an explicit revision and keeps continuation separate', async () => {
  const native=Object.fromEntries(['ActivityIndicator','KeyboardAvoidingView','Modal','ScrollView','Text','TextInput','View'].map(x=>[x,x]));
  Object.assign(native,{Platform:{OS:'ios'},StyleSheet:{create:x=>x}});
  const {default:Modal,threadStatus}=load('screens/input/EmlisThreadModal.js',{'react-native':native,
    '../../components/CocolonButton':p=>React.createElement('Button',p,p.children)});
  const calls=[];const frame={frame_key:'frame',frame_ref:'version',recorded_at:'2026-09-10T00:00:00Z',trigger:'褒められた',received_meaning:'重かった',status:'TENTATIVE'};
  const thread={visible:true,dto:{...completed,interpretive_frames:[frame]},draft:'',updateFrame:async(...args)=>{calls.push(args);return true;}};
  let root;await act(async()=>{root=Renderer.create(React.createElement(Modal,{thread,colors:{}}));});
  const button=label=>root.root.findAllByType('Button').find(x=>x.props.children===label);
  await act(async()=>button('理解を直す').props.onPress());
  await act(async()=>root.root.findByType('TextInput').props.onChangeText('怖かった'));
  await act(async()=>button('訂正を保存').props.onPress());assert.equal(calls[0][1],'REVISED');assert.equal(calls[0][2],'怖かった');
  assert.doesNotMatch(threadStatus({...completed,state:'AWAITING_CONTINUE',can_continue:false}),/続けられます/);
  await act(async()=>root.unmount());
});

test('NOT_CREATED falls back, unknown GET retains reconciliation, and saved thread opens', async () => {
  let result={...initial,state:'NOT_CREATED',thread_id:null};let fail=false;
  const h=await mount({get:async()=>{if(fail)throw Error('timeout');return result;}});
  let opened;await act(async()=>{opened=await h.value.open('input');});assert.equal(opened,false);assert.equal(h.value.visible,false);
  fail=true;await act(async()=>{opened=await h.value.open('input');});assert.equal(opened,true);assert.equal(h.value.visible,true);assert.equal(h.value.dto,null);
  fail=false;result=initial;await act(async()=>h.value.refresh());assert.equal(h.value.dto,initial);
  await act(async()=>h.root.unmount());
});

test('read-only preserves body and pending answer without any mutation call', async () => {
  const dto={...initial,can_write:false,can_retry:false,can_continue:false};
  const noWrite=()=>assert.fail('write while paused');
  const h=await mount({get:async()=>dto,answer:noWrite,action:noWrite,frame:noWrite});
  await act(async()=>h.value.open('input'));await act(async()=>h.value.setDraft('下書き'));
  await act(async()=>{h.value.sendAnswer();h.value.action('skip');h.value.action('continue');h.value.updateFrame({frame_ref:'x'},'REJECTED');});
  assert.equal(h.value.dto,dto);assert.equal(h.value.draft,'下書き');
  await act(async()=>h.root.unmount());
});

test('definite conflict permits a new revision after GET while timeout retains its original key', async () => {
  const sent=[];let current=initial;
  const h=await mount({get:async()=>current,answer:async(_,p)=>{sent.push(p);if(sent.length===1)throw Object.assign(Error('conflict'),{status:409});return completed;}});
  await act(async()=>h.value.open('input'));await act(async()=>h.value.setDraft('回答'));
  await act(async()=>h.value.sendAnswer());assert.equal(h.value.uncertain,false);assert.equal(h.value.rejected,true);
  await act(async()=>h.value.sendAnswer());assert.equal(sent.length,1);
  current={...initial,revision:4};await act(async()=>h.value.refresh());await act(async()=>h.value.sendAnswer());
  assert.equal(sent[1].expected_revision,4);assert.notEqual(sent[1].idempotency_key,sent[0].idempotency_key);
  await act(async()=>h.root.unmount());
});

test('release runtime bootstrap enables reader; default and failed initial load stay off', async () => {
  let payload={feature_flags:{emlis_threads_enabled:true}},fail=false;
  const runtime=load('AppRuntimeContext.js',{'./lib/apiClient':{apiGet:async()=>{if(fail)throw Error('offline');return payload;}}},false);
  const api={get:async()=>initial};
  const {useEmlisThread}=load('screens/input/useEmlisThread.js',{'../../lib/api/emlisThreadApi':{emlisThreadApi:api},'../../AppRuntimeContext':runtime},false);
  let value,control,root;
  function Harness(){control=runtime.useAppRuntime();value=useEmlisThread({userId:'owner'});return null;}
  await act(async()=>{root=Renderer.create(React.createElement(runtime.AppRuntimeProvider,null,React.createElement(Harness)));});
  assert.equal(value.enabled,false);fail=true;await act(async()=>{await assert.rejects(control.refreshAppRuntime());});assert.equal(value.enabled,false);
  fail=false;await act(async()=>control.refreshAppRuntime());assert.equal(value.enabled,true);
  await act(async()=>value.open('input'));assert.equal(value.dto,initial);
  payload={feature_flags:{emlis_threads_enabled:false}};await act(async()=>control.refreshAppRuntime());assert.equal(value.enabled,false);assert.equal(value.dto,null);
  await act(async()=>root.unmount());
});

test('current body leads; original source and older observations remain expandable', async () => {
  const native=Object.fromEntries(['ActivityIndicator','KeyboardAvoidingView','Modal','ScrollView','Text','TextInput','View'].map(x=>[x,x]));
  Object.assign(native,{Platform:{OS:'ios'},StyleSheet:{create:x=>x}});
  const {default:Modal}=load('screens/input/EmlisThreadModal.js',{'react-native':native,'../../components/CocolonButton':p=>React.createElement('Button',p,p.children)});
  const thread={visible:true,dto:completed,draft:''};let root;
  await act(async()=>{root=Renderer.create(React.createElement(Modal,{thread,colors:{}}));});
  let out=JSON.stringify(root.toJSON());assert.match(out,/更新した観測/);assert.doesNotMatch(out,/初回の観測/);
  const toggle=root.root.findAllByType('Button').find(b=>b.props.children==='元の記録とこれまでのやり取り');
  await act(async()=>toggle.props.onPress());out=JSON.stringify(root.toJSON());assert.match(out,/初回の観測/);assert.ok(out.indexOf('更新した観測')<out.indexOf('初回の観測'));
  await act(async()=>root.unmount());
});
