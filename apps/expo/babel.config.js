/** @type {import("@babel/core").ConfigFunction} */
module.exports = function (api) {
  api.cache.forever()
  process.env.EXPO_ROUTER_APP_ROOT = './src/app'
  return {
    plugins: [
      'transform-inline-environment-variables',
      'nativewind/babel',
      'react-native-reanimated/plugin',
      require.resolve('expo-router/babel'),
    ],
    presets: ['babel-preset-expo'],
  }
}
