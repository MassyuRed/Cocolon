const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const ROOT = path.resolve(__dirname, '..');
const SKU = Object.freeze({ plus: 'test.cocolon.plus', premium: 'test.cocolon.premium' });

// Execute the checked-in module, not a second implementation of restore.
// Only ES module declarations are adapted, following the existing Node-only
// contract tests. React Native, the store and the server are explicit doubles.
function loadModule(relativePath, bindings, exports) {
  const source = fs.readFileSync(path.join(ROOT, relativePath), 'utf8')
    .replace(/^import\s[\s\S]*?;\r?\n/gm, '')
    .replace(/^export\s+(?=(?:async\s+)?function\b|const\b)/gm, '')
    .replace(/^export\s*\{[^}]*\};?\s*$/gm, '');
  assert.doesNotMatch(source, /^\s*(?:import|export)\s/m, 'unexpected module declaration');
  return Function(...Object.keys(bindings), `"use strict";\n${source}\nreturn { ${exports.join(', ')} };`)(
    ...Object.values(bindings)
  );
}

function createService({
  platform = 'ios',
  purchases = async () => [],
  connect = async () => true,
  recognizedSkus = () => Object.values(SKU),
} = {}) {
  const calls = { connect: 0, query: 0, sync: 0, finish: 0 };
  const service = loadModule('lib/iap/iapService.js', {
    Platform: { OS: platform },
    RNIap: {
      async initConnection() { calls.connect += 1; return connect(); },
      getAvailablePurchases() { calls.query += 1; return purchases(); },
      async finishTransaction() { calls.finish += 1; },
    },
    getAllSkus: () => Object.values(SKU),
    getPlanSku: (plan) => SKU[plan],
    SUBSCRIPTION_PUBLIC_CONFIG: { apiBaseUrl: 'https://example.invalid' },
    getPlanForProductAndBasePlan: () => '',
    getPlanForProductId: () => '',
    getPurchaseBasePlanId: () => '',
    getPurchaseSku: (plan) => SKU[plan],
    getRecognizedBasePlanIdsForPlan: () => [],
    getRecognizedSkus: recognizedSkus,
    getRecognizedSkusForPlan: (plan) => [SKU[plan]],
    supabase: { auth: { getSession: async () => ({ data: { session: null } }) } },
    postSubscriptionUpdate: async () => { calls.sync += 1; return {}; },
  }, ['restoreAvailablePurchases']);
  return { ...service, calls };
}

for (const platform of ['ios', 'android']) {
  test(`${platform}: purchase-list rejection preserves the original error`, async () => {
    const error = Object.assign(new Error('store offline'), { code: 'E_NETWORK_ERROR' });
    const service = createService({ platform, purchases: async () => { throw error; } });
    await assert.rejects(service.restoreAvailablePurchases(), (actual) => actual === error);
    assert.deepEqual(service.calls, { connect: 1, query: 1, sync: 0, finish: 0 });
  });

  test(`${platform}: a successful empty purchase list stays empty`, async () => {
    const service = createService({ platform });
    assert.deepEqual(await service.restoreAvailablePurchases(), []);
    assert.deepEqual(service.calls, { connect: 1, query: 1, sync: 0, finish: 0 });
  });

  test(`${platform}: purchase filtering preserves objects and order without side effects`, async () => {
    const plus = Object.freeze({ productId: ` ${SKU.plus} `, transactionId: 'synthetic-plus' });
    const premium = Object.freeze({ productId: SKU.premium, transactionId: 'synthetic-premium' });
    const all = Object.freeze([plus, { productId: 'other.app' }, {}, null, premium]);
    const service = createService({ platform, purchases: async () => all });
    const result = await service.restoreAvailablePurchases();
    assert.deepEqual(result, [plus, premium]);
    assert.equal(result[0], plus);
    assert.equal(result[1], premium);
    assert.deepEqual(service.calls, { connect: 1, query: 1, sync: 0, finish: 0 });
  });

  test(`${platform}: a real no-matching-purchase result stays empty`, async () => {
    const service = createService({ platform, purchases: async () => [{ productId: 'other.app' }] });
    assert.deepEqual(await service.restoreAvailablePurchases(), []);
  });

  test(`${platform}: connection failure is not converted to no purchases`, async () => {
    const error = new Error('connection failed');
    const service = createService({ platform, connect: async () => { throw error; } });
    await assert.rejects(service.restoreAvailablePurchases(), (actual) => actual === error);
    assert.deepEqual(service.calls, { connect: 1, query: 0, sync: 0, finish: 0 });
  });

  test(`${platform}: retry after a purchase-list failure performs a fresh query`, async () => {
    const error = new Error('temporary failure');
    const purchase = { productId: SKU.plus };
    let attempt = 0;
    const service = createService({ platform, purchases: async () => {
      if (attempt++ === 0) throw error;
      return [purchase];
    } });
    await assert.rejects(service.restoreAvailablePurchases(), (actual) => actual === error);
    assert.deepEqual(await service.restoreAvailablePurchases(), [purchase]);
    assert.deepEqual(service.calls, { connect: 1, query: 2, sync: 0, finish: 0 });
  });
}

test('a synchronous store exception also propagates', async () => {
  const error = new Error('native synchronous exception');
  const service = createService({ purchases: () => { throw error; } });
  await assert.rejects(service.restoreAvailablePurchases(), (actual) => actual === error);
});

test('a non-Error rejection retains its original code and identity', async () => {
  const error = Object.freeze({ code: 'E_SERVICE_ERROR', message: 'store unavailable' });
  const service = createService({ purchases: async () => { throw error; } });
  await assert.rejects(service.restoreAvailablePurchases(), (actual) => actual === error);
});

test('runtime recognized SKUs retain precedence over static SKUs', async () => {
  const purchase = { productId: 'test.runtime.legacy' };
  const service = createService({
    recognizedSkus: () => ['test.runtime.legacy'],
    purchases: async () => [purchase, { productId: SKU.plus }],
  });
  assert.deepEqual(await service.restoreAvailablePurchases(), [purchase]);
});

test('empty runtime catalog retains the existing static SKU fallback', async () => {
  const purchase = { productId: SKU.plus };
  const service = createService({ recognizedSkus: () => [], purchases: async () => [purchase] });
  assert.deepEqual(await service.restoreAvailablePurchases(), [purchase]);
});

test('a catalog exception is not misreported as no purchases', async () => {
  const error = new Error('catalog unavailable');
  const service = createService({ recognizedSkus: () => { throw error; } });
  await assert.rejects(service.restoreAvailablePurchases(), (actual) => actual === error);
});

test('retry after connection failure reconnects before querying', async () => {
  const error = new Error('temporary connection failure');
  let attempt = 0;
  const service = createService({ connect: async () => {
    if (attempt++ === 0) throw error;
    return true;
  } });
  await assert.rejects(service.restoreAvailablePurchases(), (actual) => actual === error);
  assert.deepEqual(await service.restoreAvailablePurchases(), []);
  assert.deepEqual(service.calls, { connect: 2, query: 1, sync: 0, finish: 0 });
});

// Preserve the prior normalization contract; this change fixes rejected/throwing
// acquisition, not malformed successful native payloads or entitlement policy.
test('non-array resolved payload normalization is unchanged', async () => {
  for (const value of [null, undefined, {}]) {
    const service = createService({ purchases: async () => value });
    assert.deepEqual(await service.restoreAvailablePurchases(), []);
  }
});

function createAccountCaller(service, { user = { id: 'synthetic-user' } } = {}) {
  const alerts = [];
  const setters = [];
  const calls = { sync: [], refresh: 0 };
  const { useAccountSubscription } = loadModule('screens/account/useAccountSubscription.js', {
    useEffect: () => {},
    useState: (initial) => {
      const updates = [];
      setters.push(updates);
      return [initial, (value) => updates.push(value)];
    },
    Alert: { alert: (...args) => alerts.push(args) },
    useSubscription: () => ({
      tier: 'free', loading: false, allowedSelfStructureModes: ['light'],
      refreshTier: async () => { calls.refresh += 1; },
    }),
    restoreAvailablePurchases: service.restoreAvailablePurchases,
    syncPurchaseToSubscriptionTier: async (purchase) => { calls.sync.push(purchase); },
    getPlanSku: (plan) => SKU[plan],
    TIER_ALLOWED_SELF_STRUCTURE_MODES: { free: ['light'] },
    normalizeSubscriptionTier: (value) => value,
  }, ['useAccountSubscription']);
  const api = useAccountSubscription({ user });
  return { ...api, alerts, calls, restoreStates: setters[4] };
}

test('account caller shows failure, clears busy state and does not sync on lookup rejection', async () => {
  const error = new Error('store offline');
  const service = createService({ purchases: async () => { throw error; } });
  const ui = createAccountCaller(service);
  await ui.onRestorePurchases();
  assert.deepEqual(ui.alerts, [['復元に失敗しました', 'store offline']]);
  assert.deepEqual(ui.restoreStates, [true, false]);
  assert.deepEqual(ui.calls, { sync: [], refresh: 0 });
});

test('account caller retains the genuine no-purchase message and clears busy state', async () => {
  const ui = createAccountCaller(createService());
  await ui.onRestorePurchases();
  assert.deepEqual(ui.alerts, [['購入履歴がありません', '復元できる購入が見つかりませんでした。']]);
  assert.deepEqual(ui.restoreStates, [true, false]);
  assert.deepEqual(ui.calls, { sync: [], refresh: 0 });
});

test('account caller retains the successful restore flow and premium preference', async () => {
  const plus = { productId: SKU.plus };
  const premium = { productId: SKU.premium };
  const ui = createAccountCaller(createService({ purchases: async () => [plus, premium] }));
  await ui.onRestorePurchases();
  assert.deepEqual(ui.calls, { sync: [premium], refresh: 1 });
  assert.deepEqual(ui.alerts, [['復元が完了しました', 'プラン情報を更新しました。']]);
  assert.deepEqual(ui.restoreStates, [true, false]);
});

test('account caller can retry after a lookup error without a false no-purchase message', async () => {
  let attempt = 0;
  const purchase = { productId: SKU.plus };
  const service = createService({ purchases: async () => {
    if (attempt++ === 0) throw new Error('temporary store failure');
    return [purchase];
  } });
  const ui = createAccountCaller(service);
  await ui.onRestorePurchases();
  await ui.onRestorePurchases();
  assert.deepEqual(ui.alerts.map(([title]) => title), ['復元に失敗しました', '復元が完了しました']);
  assert.deepEqual(ui.restoreStates, [true, false, true, false]);
  assert.deepEqual(ui.calls, { sync: [purchase], refresh: 1 });
});

test('account caller retains the login guard without querying the store', async () => {
  const service = createService();
  const ui = createAccountCaller(service, { user: null });
  await ui.onRestorePurchases();
  assert.equal(ui.alerts[0][0], 'ログインが必要です');
  assert.deepEqual(service.calls, { connect: 0, query: 0, sync: 0, finish: 0 });
  assert.deepEqual(ui.restoreStates, []);
});
