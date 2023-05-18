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
      [
        'module-resolver',
        {
          alias: {
            '@Navigation': './src/navigation',
            '@Components': './src/components',
            '@Screens': './src/screens',
            '@Stores': './src/stores',
            '@Assets': './assets',
            '@Const': './src/const',
            '@Lib': './src/lib',
            '@Type': './src/type',
          },
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      ],
    ],
    presets: ['babel-preset-expo'],
  }
}
