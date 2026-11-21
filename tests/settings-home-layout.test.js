const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const React = require('react');
const Renderer = require('react-test-renderer');
const babel = require('@babel/core');
const source = fs.readFileSync(path.join(__dirname, '../screens/SettingsScreen.js'), 'utf8');
const code = babel.transformSync(source, { babelrc: false, configFile: false,
  presets: [require.resolve('@babel/preset-react')], plugins: [require.resolve('@babel/plugin-transform-modules-commonjs')] }).code;
const colors = { FIELD_BG: '#FFFFFF', CARD_BORDER: '#D7D2C9', TITLE_GOLD: '#800020', GOLD_BUTTON: '#5A1020' };
const menuStyles = { homeHeaderRow: { marginBottom: 16 }, homeTitle: { color: colors.TITLE_GOLD } };
function mount(t, changes = {}) {
  const navigated = [], actions = [];
  const subscription = { loading:false, tier:'free', currentLabel:'Freeプラン', currentPriceLabel:'無料', actionBusy:false,
    restoreLoading:false, restoreEnabled:true, manageEnabled:false, links:{ terms_url:'https://test/terms', privacy_url:'https://test/privacy', support_url:'https://test/support' },
    onRestorePurchases:()=>actions.push('restore'), onOpenManageSubscription:()=>actions.push('manage'), openExternalPage:(url)=>actions.push(url), ...changes };
  const native = { View:'View', Text:'Text', ActivityIndicator:'Spinner', StyleSheet:{create:x=>x} };
  const dependencies = name => {
    if(name==='react') return React;
    if(name==='react-native') return native;
    if(name==='@react-navigation/native') return {};
    if(name.includes('Ionicons')) return 'Icon';
    if(name.includes('CocolonPressable')) return {__esModule:true,default:'Pressable'};
    if(name.includes('applyTypographyTokens')) return {applyTypographyTokens:x=>x};
    if(name==='./AnalysisMenuCommon') return {AnalysisMenuScroll:'Scroll',useAnalysisMenuStyles:()=>({styles:menuStyles,colors,ui:{}})};
    return {__esModule:true,default:name};
  };
  const module={exports:{}}; Function('require','module','exports',code)(dependencies,module,module.exports);
  let root; Renderer.act(()=>{root=Renderer.create(React.createElement(module.exports.SettingsHomeContent,{subscription,navigation:{navigate:r=>navigated.push(r)}}));});
  t.after(()=>Renderer.act(()=>root.unmount()));
  return {root,actions,navigated, subscription, button:label=>root.root.findAllByType('Pressable').find(x=>x.props.accessibilityLabel===label)};
}
test('settings shows live plan and direct preview groups with existing embedded controls', t=>{
  const h=mount(t,{tier:'plus',currentLabel:'Plusプラン',currentPriceLabel:'月額680円',manageEnabled:true});
  const labels=h.root.root.findAllByType('Text').map(x=>x.props.children).filter(x=>typeof x==='string');
  assert.ok(labels.indexOf('アプリ設定')<labels.indexOf('サブスク加入状況'));
  assert.ok(labels.indexOf('サブスク加入状況')<labels.indexOf('その他'));
  assert.ok(labels.includes('Plus')&&labels.includes('月額680円'));
  assert.equal(h.root.root.findByType('./SettingsAppSettingsScreen').props.embedded,true);
  assert.equal(h.root.root.findByType('./SettingsOtherScreen').props.embedded,true);
  h.button('購入内容を復元').props.onPress(); h.button('サブスクリプションを管理').props.onPress();
  assert.deepEqual(h.actions,['restore','manage']);
  h.button('プランを選ぶ').props.onPress(); assert.deepEqual(h.navigated,['SubscriptionSelect']);
});
test('settings shares the title and card styles and keeps Account in the settings body', t=>{
  const h = mount(t);
  const labels = h.root.root.findAllByType('Text').map(node => node.props.children);
  const title = h.root.root.findAllByType('Text').find(node => node.props.children === '設定');
  assert.equal(title.props.style, menuStyles.homeTitle);
  assert.ok(labels.indexOf('設定') < labels.indexOf('アカウント'));
  assert.ok(labels.indexOf('アカウント') < labels.indexOf('アプリ設定'));
  assert.ok(labels.indexOf('サブスク加入状況') < labels.indexOf('現在のプラン'));
  assert.ok(!labels.includes('YOUR SPACE'));

  for (const label of ['アカウントを開く', '現在のプランと加入状況を開く']) {
    const surface = h.button(label).props.style[0];
    assert.equal(surface.backgroundColor, colors.FIELD_BG);
    assert.equal(surface.borderColor, colors.CARD_BORDER);
  }
  h.button('アカウントを開く').props.onPress();
  assert.deepEqual(h.navigated, ['Account']);

  const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  assert.doesNotMatch(read('navigation/MainTabs.js'), /settingsAccountAvatar|headerRightSlot/);
  assert.doesNotMatch(read('components/GlobalFrameLayout.js'), /headerRightSlot/);
  assert.match(read('navigation/SettingsStackNavigator.js'), /contentStyle: \{ backgroundColor: colors\.BG_SILVER \}/);
});
test('settings prevents plan navigation during restore and keeps Free management disabled',t=>{
  const h=mount(t,{actionBusy:true});
  for(const label of ['現在のプランと加入状況を開く','プランを選ぶ','購入内容を復元','サブスクリプションを管理']) assert.equal(h.button(label).props.disabled,true);
  h.button('プランを選ぶ').props.onPress(); h.button('現在のプランと加入状況を開く').props.onPress();
  assert.deepEqual(h.navigated,[]);
});
test('loading plan never presents a fabricated Plus subscription',t=>{
  const h=mount(t,{loading:true,currentLabel:'Plusプラン',currentPriceLabel:'月額680円'});
  assert.equal(h.root.root.findAllByType('Spinner').length,1);
  assert.ok(!h.root.root.findAllByType('Text').some(x=>x.props.children==='Plus'));
});
