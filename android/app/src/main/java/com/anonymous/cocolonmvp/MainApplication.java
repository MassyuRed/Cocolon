package com.anonymous.cocolonmvp;

import android.app.Application;
import android.content.Context;
import android.content.res.Configuration;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactHost;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactHost;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new DefaultReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected java.util.List<com.facebook.react.ReactPackage> getPackages() {
          return new PackageList(this).getPackages();
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }

        @Override
        protected boolean isNewArchEnabled() {
          return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }

        @Override
        protected Boolean isHermesEnabled() {
          return BuildConfig.IS_HERMES_ENABLED;
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public ReactHost getReactHost() {
    return DefaultReactHost.getDefaultReactHost(getApplicationContext(), getReactNativeHost());
  }

  @Override
  public void onCreate() {
    super.onCreate();
    initSoLoaderCompat(this);

    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      DefaultNewArchitectureEntryPoint.load();
    }
  }

  @Override
  public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
  }

  private static void initSoLoaderCompat(Context context) {
    try {
      Object mergedSoMappingInstance = getOpenSourceMergedSoMappingInstance();
      if (mergedSoMappingInstance != null) {
        for (Method method : SoLoader.class.getMethods()) {
          if (!"init".equals(method.getName())) {
            continue;
          }

          Class<?>[] parameterTypes = method.getParameterTypes();
          if (parameterTypes.length == 2
              && Context.class.isAssignableFrom(parameterTypes[0])
              && !boolean.class.equals(parameterTypes[1])
              && parameterTypes[1].isInstance(mergedSoMappingInstance)) {
            method.invoke(null, context, mergedSoMappingInstance);
            return;
          }
        }
      }

      SoLoader.init(context, false);
    } catch (IllegalAccessException | InvocationTargetException e) {
      throw new RuntimeException("Failed to initialize SoLoader", e);
    }
  }

  private static Object getOpenSourceMergedSoMappingInstance() {
    try {
      Class<?> mergedSoMappingClass =
          Class.forName("com.facebook.react.soloader.OpenSourceMergedSoMapping");
      return mergedSoMappingClass.getField("INSTANCE").get(null);
    } catch (ClassNotFoundException | NoSuchFieldException | IllegalAccessException e) {
      return null;
    }
  }
}
