import { PermissionsAndroid, Platform } from 'react-native';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

const DEFAULT_CHANNEL_ID = 'default';
const DEFAULT_CHANNEL_NAME = 'Default';

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await notifee.createChannel({
    id: DEFAULT_CHANNEL_ID,
    name: DEFAULT_CHANNEL_NAME,
    importance: AndroidImportance.HIGH,
  });
}

export async function requestNotificationPermission(): Promise<boolean> {
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

export type PushTokenSync = (token: string) => Promise<void>;

export async function initPushNotifications(syncToken: PushTokenSync): Promise<void> {
  await requestNotificationPermission();

  // Ensure FCM is initialized
  await messaging().setAutoInitEnabled(true);
  await messaging().registerDeviceForRemoteMessages();

  // Initial token
  const token = await messaging().getToken();
  await syncToken(token);

  // Token refresh
  messaging().onTokenRefresh(async newToken => {
    try {
      await syncToken(newToken);
    } catch (e) {
      console.warn('[push] token refresh sync failed', e);
    }
  });
}

export async function displayFromRemoteMessage(
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
): Promise<void> {
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

export function subscribeToPushEvents(opts: {
  onNotificationPress?: (data: Record<string, string> | undefined) => void;
} = {}): () => void {
  const unsubOnMessage = messaging().onMessage(async remoteMessage => {
    // Foreground: FCM will NOT show system notification automatically.
    // Show one locally via Notifee.
    await displayFromRemoteMessage(remoteMessage);
  });

  const unsubOpen = messaging().onNotificationOpenedApp(remoteMessage => {
    // When user taps an FCM notification (notification payload) and app is in background.
    opts.onNotificationPress?.(remoteMessage.data);
  });

  // When user taps an FCM notification and app was quit.
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        opts.onNotificationPress?.(remoteMessage.data);
      }
    })
    .catch(e => console.warn('[push] getInitialNotification failed', e));

  // When user taps a Notifee notification while app is in foreground.
  const unsubNotifeeFg = notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS) {
      opts.onNotificationPress?.(detail.notification?.data as any);
    }
  });

  return () => {
    unsubOnMessage();
    unsubOpen();
    unsubNotifeeFg();
  };
}
