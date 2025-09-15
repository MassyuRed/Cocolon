import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
enableScreens(true);

// ★ 一時診断ログ（登録OKならオブジェクト／未登録なら undefined）
import { NativeModules } from 'react-native';
console.log(
  'RNSScreen config:',
  NativeModules.UIManager?.getViewManagerConfig?.('RNSScreen')
);
