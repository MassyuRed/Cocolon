const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const deferred = () => { let resolve; const promise = new Promise(a => { resolve = a; }); return { promise, resolve }; };
const tick = async () => { for (let i=0;i<40;i++) await Promise.resolve(); };
const strip = source => source.replace(/^import\s[\s\S]*?;\r?\n/gm,'').replace(/^export\s+(?=(?:async\s+)?(?:function|const)\b)/gm,'').replace(/^export\s*\{[^}]*\};?\s*$/gm,'');
const sku='test.plus', purchase={ productId:sku,transactionId:'synthetic-tx',transactionReceipt:'synthetic-receipt',purchaseToken:'synthetic-purchase-token' };
function service(platform='ios') {
  let owner='A', connectHold=null, lookupHold=null, restoreHold=null, authHold=null, authHoldAt=0, authCalls=0, nativeHandler=null, postHold=null;
  const posts=[], native=[], finishes=[], alerts=[];
  const supabase={auth:{getSession:async()=>{authCalls++;if(authHold&&authCalls===authHoldAt)await authHold.promise;return {data:{session:owner?{user:{id:owner},access_token:'synthetic-'+owner}:null}};}}};
  const bindings={Platform:{OS:platform},supabase,readRuntimeApiBaseUrl:()=> 'https://example.test',captureApiError(){},AbortController,
    setTimeout:(fn,ms)=>{const t=setTimeout(fn,ms);t.unref();return t;},clearTimeout,process:{env:{}},
    fetch:async(url,opts)=>{if(opts.signal?.aborted)throw Object.assign(Error('cancelled'),{name:'AbortError'}); posts.push({owner:opts.headers.Authorization,body:JSON.parse(opts.body)});if(postHold)await postHold.promise;return {ok:true,status:200,text:async()=>JSON.stringify({subscription_tier:'plus'})};}};
  const client=Function(...Object.keys(bindings),strip(read('lib/apiClient.js'))+'\nreturn {apiPost};')(...Object.values(bindings));
  const ib={Platform:{OS:platform},supabase,postSubscriptionUpdate:(payload,opts)=>client.apiPost('/subscription/update',payload,opts),
    RNIap:{initConnection:async()=>{if(connectHold)await connectHold.promise;return true;},
      getSubscriptions:async()=>{if(lookupHold)await lookupHold.promise;return [{productId:sku}];},
      requestSubscription:async args=>{native.push(args);if(nativeHandler)return nativeHandler(args,native.length);return purchase;},finishTransaction:async args=>finishes.push(args),
      getAvailablePurchases:async()=>{if(restoreHold)await restoreHold.promise;return [purchase];}},
    getAllSkus:()=>[sku],getPlanSku:()=>sku,SUBSCRIPTION_PUBLIC_CONFIG:{},getPlanForProductAndBasePlan:()=> 'plus',getPlanForProductId:()=> 'plus',getPurchaseBasePlanId:()=>'',
    getPurchaseSku:()=>sku,getRecognizedBasePlanIdsForPlan:()=>[],getRecognizedSkus:()=>[sku],getRecognizedSkusForPlan:()=>[sku]};
  const api=Function(...Object.keys(ib),strip(read('lib/iap/iapService.js'))+'\nreturn {syncPurchaseToSubscriptionTier,requestSubscriptionForPlan,restoreAvailablePurchases};')(...Object.values(ib));
  return {...api,posts,native,finishes,alerts,supabase,setOwner:id=>{owner=id;},get authCalls(){return authCalls;},
    onNative(handler){nativeHandler=handler;},holdAuthAt(call){authHoldAt=call;authHold=deferred();return authHold;},holdPost(){postHold=deferred();return postHold;},
    holdConnect(){connectHold=deferred();return connectHold;},holdLookup(){lookupHold=deferred();return lookupHold;},holdRestore(){restoreHold=deferred();return restoreHold;}};
}
for(const next of ['B',null])test(`in-flight A transaction cannot post or finish after ${next||'logout'}`,async()=>{
  const p=service(),held=p.holdConnect(),work=p.syncPurchaseToSubscriptionTier(purchase,{expectedUserId:'A'});
  await tick();p.setOwner(next);held.resolve();await assert.rejects(work,{name:'AccountChangedError'});
  assert.equal(p.posts.length,0);assert.equal(p.finishes.length,0);
});

test('aborted purchase lifetime rejects before looking up auth',async()=>{
  const p=service(),controller=new AbortController();controller.abort();
  await assert.rejects(p.requestSubscriptionForPlan('plus',{expectedUserId:'A',signal:controller.signal}),{name:'AbortError'});
  assert.equal(p.authCalls,0);assert.equal(p.native.length,0);assert.equal(p.posts.length,0);
});

test('A to B to A during product lookup cannot revive an aborted purchase lifetime',async()=>{
  const p=service(),controller=new AbortController(),held=p.holdLookup();
  const work=p.requestSubscriptionForPlan('plus',{expectedUserId:'A',signal:controller.signal});await tick();
  p.setOwner('B');controller.abort();p.setOwner('A');held.resolve();
  await assert.rejects(work,{name:'AbortError'});assert.equal(p.native.length,0);assert.equal(p.posts.length,0);assert.equal(p.finishes.length,0);
});

test('identity auth lookup rechecks the purchase lifetime after its await',async()=>{
  const p=service(),controller=new AbortController(),held=p.holdAuthAt(2);
  const work=p.requestSubscriptionForPlan('plus',{expectedUserId:'A',signal:controller.signal});await tick();
  assert.equal(p.authCalls,2);p.setOwner('B');controller.abort();p.setOwner('A');held.resolve();
  await assert.rejects(work,{name:'AbortError'});assert.equal(p.authCalls,2);assert.equal(p.native.length,0);assert.equal(p.posts.length,0);
});

for(const [platform,abortAt,change] of [['ios',1,false],['ios',2,false],['android',1,false],['android',2,false],['android',1,true]]) {
  test(`${platform} ${change?'upgrade':'purchase'} fallback ${abortAt} retains the original aborted lifetime`,async()=>{
    const p=service(platform),controller=new AbortController();
    p.onNative((_args,count)=>{if(count===abortAt){p.setOwner('B');controller.abort();p.setOwner('A');}throw Error('synthetic native signature rejection');});
    await assert.rejects(p.requestSubscriptionForPlan(change?'premium':'plus',{expectedUserId:'A',signal:controller.signal,...(change?{fromPlan:'plus'}:{})}),{name:'AbortError'});
    assert.equal(p.native.length,abortAt);assert.equal(p.posts.length,0);assert.equal(p.finishes.length,0);
  });
}

for(const [platform,succeedsAt,change] of [['ios',2,false],['ios',3,false],['android',2,false],['android',3,false],['android',2,true]]) {
  test(`${platform} same-owner ${change?'upgrade':'purchase'} legacy attempt ${succeedsAt} still completes`,async()=>{
    const p=service(platform),controller=new AbortController();
    p.onNative((_args,count)=>{if(count<succeedsAt)throw Error('synthetic native signature rejection');return purchase;});
    await p.requestSubscriptionForPlan(change?'premium':'plus',{expectedUserId:'A',signal:controller.signal,...(change?{fromPlan:'plus'}:{})});
    assert.equal(p.native.length,succeedsAt);assert.equal(p.posts.length,1);assert.equal(p.posts[0].owner,'Bearer synthetic-A');assert.equal(p.finishes.length,1);
  });
}

test('already verified server success still finishes its native transaction after lifetime abort',async()=>{
  const p=service(),controller=new AbortController(),held=p.holdPost();
  const work=p.syncPurchaseToSubscriptionTier(purchase,{expectedUserId:'A',signal:controller.signal});await tick();
  assert.equal(p.posts.length,1);assert.equal(p.posts[0].owner,'Bearer synthetic-A');
  controller.abort();p.setOwner('B');held.resolve();const result=await work;
  assert.equal(result.ok,true);assert.equal(p.finishes.length,1);assert.equal(p.posts.length,1);
});
test('an A transaction marked done cannot suppress verification for B',async()=>{
  const p=service();await p.syncPurchaseToSubscriptionTier(purchase,{expectedUserId:'A'});p.setOwner('B');
  const result=await p.syncPurchaseToSubscriptionTier(purchase,{expectedUserId:'B'});
  assert.equal(result.skipped,undefined);assert.deepEqual(p.posts.map(x=>x.owner),['Bearer synthetic-A','Bearer synthetic-B']);
});
test('purchase product lookup preserves starting owner before opening native store',async()=>{
  const p=service(),held=p.holdLookup(),work=p.requestSubscriptionForPlan('plus',{expectedUserId:'A'});
  await tick();p.setOwner('B');held.resolve();await assert.rejects(work,{name:'AccountChangedError'});assert.equal(p.native.length,0);assert.equal(p.posts.length,0);
});
test('same-owner purchase preserves native account token and server verification before finish',async()=>{
  const p=service();await p.requestSubscriptionForPlan('plus',{expectedUserId:'A'});
  assert.equal(p.native[0].appAccountToken,'A');assert.equal(p.posts[0].owner,'Bearer synthetic-A');assert.equal(p.finishes.length,1);
});
for(const caller of ['account','subscription'])test(`${caller} restoration keeps A while native purchase lookup waits`,async()=>{
  const p=service(),held=p.holdRestore();let source;
  const bindings={...p,user:{id:'A'},restoreLoading:false,actionBusy:false,setRestoreLoading(){},getPlanSku:()=>sku,
    plusRecognizedSkus:new Set([sku]),premiumRecognizedSkus:new Set(),Platform:{OS:'ios'},Alert:{alert:(...args)=>p.alerts.push(args)},
    refreshSubscriptionState:async()=>{},refreshScreenState:async()=>{},buildIapErrorMessage:e=>e.message};
  if(caller==='account'){
    source=read('screens/account/useAccountSubscription.js').split('  const onRestorePurchases = async () => {')[1].split('\n  return {')[0];
  }else{
    source=read('screens/SubscriptionSelectScreen.js').split('  const onRestorePurchases = useCallback(async () => {')[1].split('  }, [\n    actionBusy,')[0]+'\n  };';
  }
  source=source.replace(/\n  };\s*$/,'');
  const run=Function(...Object.keys(bindings),'return async function(){'+source+'\n};')(...Object.values(bindings));
  const work=run();await tick();p.setOwner('B');held.resolve();await work;
  assert.equal(p.posts.length,0);assert.equal(p.finishes.length,0);assert.equal(p.alerts.length,1);
  assert.match(p.alerts[0][1],/アカウントが切り替わりました/);
});
