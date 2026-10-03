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

test('input writes bind the payload owner to the same session that supplies authorization', async t => {
  let finishSession;
  const client = load('lib/apiClient.js', {
    'react-native': { Platform: { OS: 'ios' } },
    './supabase': { supabase: { auth: { getSession: () => new Promise(resolve => { finishSession = resolve; }) } } },
    './compat/legacyWireContracts': { readRuntimeApiBaseUrl: () => 'https://synthetic.invalid' },
    './monitoring': { captureApiError() {} },
  });
  const submit = load('lib/api/home/emotionSubmitApi.js', { '../client': client });
  const piece = load('lib/api/home/emotionPieceApi.js', {
    '../client': client,
    '../../compat/legacyWireContracts': { PIECE_WIRE: { routes: {
      emotionPiecePreview: '/preview', emotionPiecePublish: '/publish', emotionPieceCancel: '/cancel',
    } } },
  });
  const sent = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    sent.push({ url, options });
    return { ok: true, text: async () => '{"id":"saved"}' };
  });
  const calls = [
    () => submit.submitEmotionInput({ memo: 'Aの入力' }, { expectedUserId: 'A' }),
    () => piece.previewEmotionPiece({ memo: 'Aの入力' }, { expectedUserId: 'A' }),
    () => piece.publishEmotionPiece('A-preview', { expectedUserId: 'A' }),
    () => piece.cancelEmotionPiece('A-preview', { expectedUserId: 'A' }),
  ];
  for (const call of calls) {
    for (const session of [{ user: { id: 'B' }, access_token: 'B-token' }, null]) {
      const pending = call();
      finishSession({ data: { session } });
      await assert.rejects(pending, { name: 'AccountChangedError' });
    }
  }
  assert.equal(sent.length, 0);
  const valid = calls[0]();
  finishSession({ data: { session: { user: { id: 'A' }, access_token: 'A-refreshed-token' } } });
  assert.deepEqual(await valid, { id: 'saved' });
  assert.equal(sent[0].options.headers.Authorization, 'Bearer A-refreshed-token');
  assert.equal(sent[0].options.body, '{"memo":"Aの入力"}');
  assert.equal(Object.hasOwn(sent[0].options, 'expectedUserId'), false);
  const legacy = client.getAccessToken(); finishSession({ data: { session: null } });
  assert.equal(await legacy, null);
  const screen = fs.readFileSync(path.join(ROOT, 'screens/InputScreen.js'), 'utf8');
  for (const call of ['submitEmotionInput(payload', 'previewEmotionPiece(payload', 'publishEmotionPiece(previewId', 'cancelEmotionPiece(previewId']) {
    assert.ok(screen.includes(`${call}, { expectedUserId: requestOwner.id })`));
  }
});

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

test('account changes remount private tab state; old hook callbacks cannot mutate the new owner', async () => {
  let session={user:{id:'A'}},mounts=0;
  function Tabs(){const [privateDraft]=React.useState(()=>`private-${session.user.id}-${++mounts}`);return React.createElement('Tabs',{privateDraft});}
  const {default:Root}=load('navigation/RootNavigator.js',{
    'react-native':{ActivityIndicator:'Spinner',View:'View'},'../AuthContext':{useAuth:()=>({session})},
    '../AuthScreen':()=>null,'../SubscriptionContext':{useSubscription:()=>({subscriptionBootstrapLoaded:false})},
    '../TutorialContext':{useTutorial:()=>({tutorialResetToken:0})},'./MainTabs':Tabs,
    '../lib/iap/iapService':{startIapPurchaseObserver:async()=>{},stopIapPurchaseObserver:()=>{}},
    '../lib/pushToken':{syncPushTokenOnce:async()=>{},startPushTokenSync:()=>()=>{}},
    '../lib/monitoring':{captureClientError:()=>{}},'./navigationRef':{tryOpenRouteIfPending:()=>{}},
  });
  let root;await act(async()=>{root=Renderer.create(React.createElement(Root));});assert.equal(root.root.findByType('Tabs').props.privateDraft,'private-A-1');
  session={user:{id:'B'}};await act(async()=>root.update(React.createElement(Root)));assert.equal(root.root.findByType('Tabs').props.privateDraft,'private-B-2');
  await act(async()=>root.unmount());
  const h=await mount({get:async()=>initial,answer:()=>assert.fail('old callback sent')});
  await act(async()=>h.value.open('input'));await act(async()=>h.value.setDraft('Aの下書き'));const old=h.value;
  await h.user('B');await act(async()=>h.value.open('input'));await act(async()=>h.value.setDraft('Bの下書き'));
  await act(async()=>{old.setDraft('古い値');old.sendAnswer();old.action('skip');});assert.equal(h.value.draft,'Bの下書き');assert.equal(h.value.uncertain,false);
  await act(async()=>h.root.unmount());
});

test('unknown ACK labels the cached body as last confirmed, never current', async () => {
  const native=Object.fromEntries(['ActivityIndicator','KeyboardAvoidingView','Modal','ScrollView','Text','TextInput','View'].map(x=>[x,x]));Object.assign(native,{Platform:{OS:'ios'},StyleSheet:{create:x=>x}});
  const {default:Modal}=load('screens/input/EmlisThreadModal.js',{'react-native':native,'../../components/CocolonButton':p=>React.createElement('Button',p,p.children)});
  let root;const thread={visible:true,dto:completed,draft:'',uncertain:true};
  await act(async()=>{root=Renderer.create(React.createElement(Modal,{thread,colors:{}}));});
  let out=JSON.stringify(root.toJSON());assert.match(out,/前回確認した観測/);assert.doesNotMatch(out,/現在の観測/);
  await act(async()=>root.update(React.createElement(Modal,{thread:{...thread,uncertain:false},colors:{}})));out=JSON.stringify(root.toJSON());assert.match(out,/現在の観測/);
  await act(async()=>root.update(React.createElement(Modal,{thread:{...thread,uncertain:false,busy:true},colors:{}})));out=JSON.stringify(root.toJSON());assert.match(out,/前回確認した観測/);assert.doesNotMatch(out,/現在の観測/);
  await act(async()=>root.unmount());
});

for (const configuredBase of [null, 'https://emlis-development.invalid///']) {
  test(`history and saved Emlis use one API origin (${configuredBase ? 'development' : 'default'})`, async t => {
    const wire = load('lib/compat/legacyWireContracts.js');
    for (const key of wire.RUNTIME_COMPAT_ENV.apiBaseUrlKeys) {
      const saved = process.env[key];
      t.after(() => { if (saved === undefined) delete process.env[key]; else process.env[key] = saved; });
      delete process.env[key];
    }
    if (configuredBase) process.env.EXPO_PUBLIC_API_BASE_URL = configuredBase;
    const expectedBase = configuredBase ? 'https://emlis-development.invalid' : 'https://mashos-api.onrender.com';
    const session = { user: { id: 'owner' }, access_token: 'synthetic-token' };
    const auth = { supabase: { auth: { getSession: async () => ({ data: { session } }) } } };
    const native = Object.fromEntries(['ActivityIndicator', 'KeyboardAvoidingView', 'Modal', 'ScrollView',
      'RefreshControl', 'SafeAreaView', 'Text', 'TextInput', 'TouchableOpacity', 'View'].map(x => [x, x]));
    let confirmDelete;
    Object.assign(native, { Platform: { OS: 'ios' }, StyleSheet: { create: x => x },
      Alert: { alert: (_title, _message, buttons) => { confirmDelete = buttons.find(b => b.style === 'destructive').onPress; } },
      FlatList: ({ data, renderItem }) => React.createElement('List', null,
        data.map(item => React.createElement(React.Fragment, { key: item.id }, renderItem({ item })))),
    });
    const client = load('lib/apiClient.js', { 'react-native': native, './supabase': auth,
      './compat/legacyWireContracts': wire, './monitoring': { captureApiError: () => assert.fail('unexpected API error') } });
    assert.equal(client.API_BASE_URL, expectedBase);
    const { emlisThreadApi } = load('lib/api/emlisThreadApi.js', { '../apiClient': client });
    const threadHook = load('screens/input/useEmlisThread.js', {
      '../../lib/api/emlisThreadApi': { emlisThreadApi },
      '../../AppRuntimeContext': { useAppRuntime: () => ({ isFeatureEnabled: key => key === 'emlis_threads_enabled' }) },
    });
    const Modal = load('screens/input/EmlisThreadModal.js', { 'react-native': native,
      '../../components/CocolonButton': p => React.createElement('Button', p, p.children) }).default;
    const Screen = load('screens/AnalysisHistoryScreen.js', {
      'react-native': native, 'react-native-vector-icons/Ionicons': 'Icon',
      '../components/CocolonBackButton': () => null, '../lib/supabase': auth,
      '../theme/ThemeContext': { useTheme: () => ({ themeName: 'light', colors: {} }) },
      '../ui/uiTokens': { makeUiTokens: () => ({}) }, '../ui/applyTypographyTokens': { applyTypographyTokens: x => x },
      '../SubscriptionContext': { useSubscription: () => ({ tier: 'premium', loading: false }) },
      '../lib/apiClient': client, '../lib/historyRetentionLabel': { getHistoryRetentionLabel: () => '' },
      '../AuthContext': { useAuth: () => ({ session }) }, './input/useEmlisThread': threadHook,
      './input/EmlisThreadModal': { default: Modal, __esModule: true },
    }).default;
    const row = { id: 'input', created_at: initial.original.created_at, memo: initial.original.memo, is_secret: false };
    const calls = [];
    let savedDto = { ...initial, can_write: true };
    t.mock.method(globalThis, 'fetch', async (url, options) => {
      calls.push({ url, options });
      const route = new URL(url).pathname;
      let value;
      if (route === '/emotion/history/search') value = { items: [row], meta: { has_more: false } };
      else if (route === '/emlis/threads/by-input/input') value = savedDto;
      else if (route === '/emlis/threads/thread/answers') value = savedDto = { ...completed, can_write: true };
      else if (route === '/emotion/secret' || route === '/emotion/history/input') value = {};
      else assert.fail(`unexpected route: ${route}`);
      return { ok: true, status: 200, json: async () => value, text: async () => JSON.stringify(value) };
    });
    let root;
    t.after(async () => { if (root) await act(async () => root.unmount()); });
    await act(async () => { root = Renderer.create(React.createElement(Screen)); });
    const open = () => root.root.findByProps({ accessibilityLabel: 'この記録のEmlisの観測を開く' }).props.onPress();
    await act(async () => open());
    assert.match(JSON.stringify(root.toJSON()), /その時、どう感じましたか/);
    await act(async () => root.root.findByProps({ accessibilityLabel: 'Emlisへの回答' }).props.onChangeText('今は嬉しい。'));
    await act(async () => root.root.findAllByType('Button').find(b => b.props.children === '回答を送る').props.onPress());
    assert.match(JSON.stringify(root.toJSON()), /更新した観測/);
    await act(async () => root.root.findByProps({ accessibilityLabel: 'Emlisの観測を閉じる' }).props.onPress());
    await act(async () => open());
    assert.match(JSON.stringify(root.toJSON()), /更新した観測/);
    await act(async () => root.root.findAllByType('TouchableOpacity').find(b =>
      b.findAllByType('Icon').some(i => i.props.name === 'lock-open-outline')).props.onPress());
    await act(async () => root.root.findAllByType('TouchableOpacity').find(b =>
      b.findAllByType('Icon').some(i => i.props.name === 'trash-outline')).props.onPress());
    await act(async () => confirmDelete());
    assert.equal(root.root.findAllByProps({ accessibilityLabel: 'この記録のEmlisの観測を開く' }).length, 0);
    assert.deepEqual(calls.map(({ url, options }) => [options.method, url]), [
      ['POST', `${expectedBase}/emotion/history/search`], ['GET', `${expectedBase}/emlis/threads/by-input/input`],
      ['POST', `${expectedBase}/emlis/threads/thread/answers`], ['GET', `${expectedBase}/emlis/threads/by-input/input`],
      ['POST', `${expectedBase}/emotion/secret`], ['DELETE', `${expectedBase}/emotion/history/input`],
    ]);
    assert.ok(calls.every(c => c.options.headers.Authorization === 'Bearer synthetic-token'));
    const submitted = JSON.parse(calls[2].options.body);
    assert.equal(submitted.question_id, 'question'); assert.equal(submitted.answer_text, '今は嬉しい。');
    assert.equal(submitted.expected_revision, initial.revision); assert.ok(submitted.idempotency_key);
    assert.deepEqual(JSON.parse(calls[4].options.body), { emotion_id: row.id, is_secret: true, created_at: row.created_at });
  });
}

// This build regression also uses the app's existing RN / Metro dependencies.
test('RN bundle embeds only public API URLs and invalidates cached transforms on rebuild', t => {
  const { execFileSync } = require('node:child_process');
  const fixture = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'emlis-api-bundle-'));
  t.after(() => fs.rmSync(fixture, { recursive: true, force: true }));
  const buildModules = path.dirname(path.dirname(require.resolve('metro/package.json')));
  fs.mkdirSync(path.join(fixture, 'lib/compat'), { recursive: true });
  for (const file of ['babel.config.js', 'metro.config.js', 'lib/compat/legacyWireContracts.js']) {
    fs.copyFileSync(path.join(ROOT, file), path.join(fixture, file));
  }
  fs.symlinkSync(buildModules, path.join(fixture, 'node_modules'), 'dir');
  fs.writeFileSync(path.join(fixture, 'entry.js'),
    "globalThis.__emlisBase = require('./lib/compat/legacyWireContracts').readRuntimeApiBaseUrl();");
  const keys = load('lib/compat/legacyWireContracts.js').RUNTIME_COMPAT_ENV.apiBaseUrlKeys;
  const child = String.raw`
    const assert = require('node:assert/strict'), path = require('node:path'), vm = require('node:vm');
    const babel = require('@babel/core'), metro = require('metro');
    const root = process.cwd(), filename = path.join(root, 'lib/compat/legacyWireContracts.js');
    const options = { configFile: path.join(root, 'babel.config.js'), babelrc: false };
    const transformed = babel.transformFileSync(filename, options).code;
    assert.ok(!transformed.includes('not-public-api-sentinel'));
    const values = [];
    for (const runtime of [{}, { process: { env: {} } }]) {
      const module = { exports: {} };
      vm.runInNewContext(transformed, { ...runtime, module, exports: module.exports, require });
      values.push(module.exports.readRuntimeApiBaseUrl());
    }
    const unrelated = babel.transformSync('module.exports = process?.env?.PRIVATE_API_TEST;',
      { ...options, filename: path.join(root, 'unrelated.js') }).code;
    assert.ok(unrelated.includes('process'));
    assert.ok(!unrelated.includes('not-public-api-sentinel'));
    const shadowed = babel.transformSync('module.exports = process => process?.env?.PRIVATE_API_TEST;',
      { ...options, filename }).code;
    const local = { exports: {} };
    vm.runInNewContext(shadowed, { module: local });
    assert.equal(local.exports({ env: { PRIVATE_API_TEST: 'local' } }), 'local');
    (async () => {
      const config = await metro.loadConfig({ cwd: root, config: path.join(root, 'metro.config.js') });
      config.maxWorkers = 1;
      config.reporter = { update() {} };
      config.resolver.useWatchman = false;
      config.watchFolders = [...config.watchFolders, require('node:fs').realpathSync(path.join(root, 'node_modules'))];
      config.cacheStores = [new (require('metro-cache').FileStore)({ root: path.join(root, 'shared-cache') })];
      // Exercise the real transformer/cache/resolver without booting native APIs.
      config.serializer.getModulesRunBeforeMainModule = () => [];
      config.serializer.getPolyfills = () => [];
      const bundle = await metro.runBuild(config, { entry: 'entry.js', platform: 'ios', dev: false, minify: false });
      assert.ok(!bundle.code.includes('not-public-api-sentinel'));
      const runtime = {};
      vm.runInNewContext(bundle.code, runtime);
      process.stdout.write(JSON.stringify({ values, base: runtime.__emlisBase, cacheVersion: config.cacheVersion }));
    })().catch(error => { console.error(error); process.exitCode = 1; });
  `;
  const cases = [
    { values: [' https://api-build-a.invalid/// ', 'https://piece.invalid', 'https://analysis.invalid', 'https://model.invalid'], expected: 'https://api-build-a.invalid' },
    { values: [' ', 'https://piece-build-b.invalid/', 'https://analysis.invalid', 'https://model.invalid'], expected: 'https://piece-build-b.invalid' },
    { values: ['', '', 'https://analysis-build-c.invalid//', 'https://model.invalid'], expected: 'https://analysis-build-c.invalid' },
    { values: ['', '', '', 'https://model-build-d.invalid/'], expected: 'https://model-build-d.invalid' },
    { values: ['', '', '', ''], expected: 'https://mashos-api.onrender.com' },
  ];
  const cacheVersions = new Set();
  for (const scenario of cases) {
    const env = { ...process.env, NODE_PATH: buildModules, PRIVATE_API_TEST: 'not-public-api-sentinel' };
    keys.forEach((key, i) => { if (scenario.values[i]) env[key] = scenario.values[i]; else delete env[key]; });
    const result = JSON.parse(execFileSync(process.execPath, ['-'], {
      cwd: fixture, env, input: child, encoding: 'utf8', timeout: 60000,
    }));
    assert.deepEqual(result.values, [scenario.expected, scenario.expected]);
    assert.equal(result.base, scenario.expected);
    cacheVersions.add(result.cacheVersion);
  }
  assert.equal(cacheVersions.size, cases.length);
});
