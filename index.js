// --- Polyfills: MUST be first ---
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

// --- RN base ---
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import { enableScreens } from 'react-native-screens';

// Enable native screens for performance
enableScreens(true);

// --- JS runtime polyfills (for React Navigation etc.) ---
if (!Array.prototype.findLastIndex) {
  Object.defineProperty(Array.prototype, 'findLastIndex', {
    value: function (predicate, thisArg) {
      if (this == null) {
        throw new TypeError('Array.prototype.findLastIndex called on null or undefined');
      }
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      const o = Object(this);
      const len = o.length >>> 0;

      for (let k = len - 1; k >= 0; k--) {
        const kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return k;
        }
      }
      return -1;
    },
    writable: true,
    configurable: true,
  });
}

// ------------------------------------------------------------
// Push: FCM background handler
// - Needed for data-only messages when app is in background/killed
// - If you rely on "notification" payload, Android shows notifications automatically
// ------------------------------------------------------------
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  try {
    console.log('[push] setBackgroundMessageHandler:', remoteMessage?.messageId, remoteMessage?.data || null);
  } catch {
    // noop
  }
});

import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
