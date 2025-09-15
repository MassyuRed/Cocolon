package com.anonymous.cocolonmvp;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.PackageList;
import com.facebook.soloader.SoLoader;

import java.lang.reflect.Field;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  // BuildConfig の boolean を安全に読むユーティリティ（UNITY_ENABLED 判定に使用）
  private static boolean readBuildConfigFlag(String fieldName, boolean defaultValue) {
    try {
      Class<?> bc = Class.forName("com.anonymous.cocolonmvp.BuildConfig");
      Field f = bc.getField(fieldName);
      Object v = f.get(null);
      if (v instanceof Boolean) return (Boolean) v;
      return defaultValue;
    } catch (Throwable t) {
      return defaultValue;
    }
  }

  private static boolean isUnityEnabledFlag() {
    return readBuildConfigFlag("UNITY_ENABLED", false);
  }

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          // ★ Autolink（RN CLI/Gradle）で検出されたネイティブパッケージを一括登録
          List<ReactPackage> packages = new PackageList(this).getPackages();

          // ★ Unity ブリッジ（任意）：AAR 連携に加えて ReactPackage が存在する場合のみ追加
          if (isUnityEnabledFlag()) {
            try {
              Class<?> clazz = Class.forName("com.anonymous.cocolonmvp.UnityLauncherPackage");
              ReactPackage unityPackage =
                  (ReactPackage) clazz.getDeclaredConstructor().newInstance();
              packages.add(unityPackage);
            } catch (Throwable ignored) {
              // Unity の ReactPackage が無い環境では何もしない
            }
          }

          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    // RN 0.73 では必須ではないが、入っていても問題ない初期化
    SoLoader.init(this, /* native exopackage */ false);
  }
}
