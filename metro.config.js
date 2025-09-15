/**
 * Metro configuration for React Native (RN 0.73)
 * 必ず @react-native/metro-config をベースに merge する
 */

const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

// SVG だけ transformer に回し、他はデフォルトを保持（assetRegistryPath を含む）
const config = {
  transformer: {
    // デフォルトの transformer 設定を引き継いだ上で追加
    ...defaultConfig.transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
  },
  resolver: {
    // デフォルト拡張子を引き継いだ上で、svg を source に、asset から除外
    assetExts: defaultConfig.resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...defaultConfig.resolver.sourceExts, "svg"],
  },
};

module.exports = mergeConfig(defaultConfig, config);


