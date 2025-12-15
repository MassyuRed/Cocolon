# --- React Native / TurboModules
-keep class com.facebook.react.** { *; }
-dontwarn com.facebook.react.**
-keep class com.facebook.react.turbomodule.** { *; }

# --- reanimated
-keep class com.swmansion.reanimated.** { *; }

# --- Hermes / JSI / SoLoader
-keep class com.facebook.hermes.** { *; }
-dontwarn com.facebook.hermes.**
-keep class com.facebook.jni.** { *; }
-dontwarn com.facebook.jni.**
-keep class com.facebook.soloader.** { *; }
-dontwarn com.facebook.soloader.**

# --- Unity（将来利用予定）
-keep class com.unity3d.** { *; }
-dontwarn com.unity3d.**
-keep class com.unity3d.player.UnityPlayerActivity { *; }

# --- アプリ本体
-keep class com.anonymous.cocolonmvp.** { *; }

# --- MainApplication の二重定義対策 ---
# ProGuard による最適化/rename 対象外にする
-keep class com.anonymous.cocolonmvp.MainApplication { *; }
-dontwarn com.anonymous.cocolonmvp.MainApplication

# --- BlurView / @react-native-community/blur を難読化で壊さない（A案）
-keep class eightbitlab.com.blurview.** { *; }
-dontwarn eightbitlab.com.blurview.**
-keep class com.reactnativecommunity.blur.** { *; }
-dontwarn com.reactnativecommunity.blur.**

# （保険）Kotlin メタデータ
-keep class kotlin.Metadata { *; }
