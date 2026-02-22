import { PermissionsAndroid, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

const DEFAULT_CHANNEL_ID = 'default';
const DEFAULT_CHANNEL_NAME = 'Default';

async function ensureAndroidChannel() {
  if (Platform.OS !== 'android') return;
  await notifee.createChannel({
    id: DEFAULT_CHANNEL_ID,
    name: DEFAULT_CHANNEL_NAME,
    importance: AndroidImportance.HIGH,
  });
}

export async function requestNotificationPermission() {
  if (Platform.OS === 'android') {
    if (Platform.Version >= 33) {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      return result === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  }

  // iOS
  const authStatus = await messaging().requestPermission();
  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
}

export async function initPushNotifications(syncToken) {
  await requestNotificationPermission();
  await messaging().setAutoInitEnabled(true);
  await messaging().registerDeviceForRemoteMessages();

  const token = await messaging().getToken();
  await syncToken(token);

  messaging().onTokenRefresh(async newToken => {
    try {
      await syncToken(newToken);
    } catch (e) {
      console.warn('[push] token refresh sync failed', e);
    }
  });
}

export async function displayFromRemoteMessage(remoteMessage) {
  await ensureAndroidChannel();

  const title =
    remoteMessage.notification?.title ??
    remoteMessage.data?.title ??
    '通知';
  const body =
    remoteMessage.notification?.body ??
    remoteMessage.data?.body ??
    '';

  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId: DEFAULT_CHANNEL_ID,
      pressAction: { id: 'default' },
    },
    data: remoteMessage.data,
  });
}

export function subscribeToPushEvents(opts = {}) {
  const unsubOnMessage = messaging().onMessage(async remoteMessage => {
    await displayFromRemoteMessage(remoteMessage);
  });

  const unsubOpen = messaging().onNotificationOpenedApp(remoteMessage => {
    opts.onNotificationPress?.(remoteMessage.data);
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        opts.onNotificationPress?.(remoteMessage.data);
      }
    })
    .catch(e => console.warn('[push] getInitialNotification failed', e));

  const unsubNotifeeFg = notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS) {
      opts.onNotificationPress?.(detail.notification?.data);
    }
  });

  return () => {
    unsubOnMessage();
    unsubOpen();
    unsubNotifeeFg();
  };
}
