/** @type {import("@babel/core").ConfigFunction} */
module.exports = function (api) {
  api.cache.forever()
  process.env.EXPO_ROUTER_APP_ROOT = '../../apps/expo/src/app'
  return {
    plugins: ['nativewind/babel', require.resolve('expo-router/babel')],
    presets: ['babel-preset-expo'],
  }
}
