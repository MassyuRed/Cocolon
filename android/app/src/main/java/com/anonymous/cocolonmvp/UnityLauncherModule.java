package com.anonymous.cocolonmvp;

import android.content.Intent;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class UnityLauncherModule extends ReactContextBaseJavaModule {

  private static final String TAG = "UnityLauncher";

  UnityLauncherModule(ReactApplicationContext context) {
    super(context);
  }

  @Override
  public String getName() {
    return "UnityLauncher";
  }

  /** UnityのActivityクラスが解決できるかチェック（任意でJSからも呼べる） */
  @ReactMethod(isBlockingSynchronousMethod = true)
  public boolean hasUnityActivity() {
    try {
      Class.forName("com.unity3d.player.UnityPlayerActivity");
      return true;
    } catch (ClassNotFoundException e) {
      return false;
    }
  }

  /** RN(JS)からUnityを起動 */
  @ReactMethod
  public void launchUnity() {
    try {
      Class<?> unityActivity = Class.forName("com.unity3d.player.UnityPlayerActivity");
      Intent intent = new Intent(getReactApplicationContext(), unityActivity);
      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
      getReactApplicationContext().startActivity(intent);
    } catch (ClassNotFoundException e) {
      Log.e(TAG, "UnityPlayerActivity not found. Is the AAR correctly linked?", e);
      // ここで必要なら、ユーザー向けにToast等を出す処理を追加可能
      // Toast.makeText(getReactApplicationContext(), "Unity not available", Toast.LENGTH_SHORT).show();
    } catch (Throwable t) {
      Log.e(TAG, "Failed to launch UnityPlayerActivity.", t);
    }
  }
}

