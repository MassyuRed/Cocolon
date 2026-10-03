const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const {assetExts, sourceExts} = defaultConfig.resolver;

const config = {
  // Keep the transform cache tied to the same public values as babel.config.js.
  // Restart Metro after changing the build environment; no runtime switch exists.
  cacheVersion: JSON.stringify([
    'EXPO_PUBLIC_API_BASE_URL',
    'EXPO_PUBLIC_PIECE_API_URL',
    'EXPO_PUBLIC_ANALYSIS_API_URL',
    'EXPO_PUBLIC_MYMODEL_API_URL',
  ].map(key => process.env[key] || '')),
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
  },
};

module.exports = mergeConfig(defaultConfig, config);
