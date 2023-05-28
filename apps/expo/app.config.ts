import type { ExpoConfig } from '@expo/config'

type Config = {
  scheme: string[] | string
}

const defineConfig = (): Omit<ExpoConfig, 'scheme'> & Config => ({
  name: 'cilotta',
  slug: 'cilotta',
  originalFullName: '@zorro901/cilotta',
  scheme: 'cilotta',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/icon.png',
    resizeMode: 'contain',
    backgroundColor: '#1F104A',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'your.bundle.identifier',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/icon.png',
      backgroundColor: '#1F104A',
    },
    package: 'app.expo.cilotta',
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAP_API_KEY,
      },
    },
    googleServicesFile: './google-services.json',
  },
  extra: {
    eas: {
      projectId: '0097aebd-d4a8-4e7d-89a0-9b24ceb1112f',
    },
    GOOGLE_MAP_API_KEY: process.env.GOOGLE_MAP_API_KEY,
    GOOGLE_WEB_CLIENT_ID: process.env.GOOGLE_WEB_CLIENT_ID,
    GOOGLE_ANDROID_CLIENT_ID: process.env.GOOGLE_ANDROID_CLIENT_ID,
    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
    API_BASE_URL: process.env.API_BASE_URL,
  },
  plugins: [
    './expo-plugins/with-modify-gradle.js',
    '@react-native-firebase/app',
    '@react-native-firebase/perf',
    '@react-native-firebase/crashlytics',
    '@react-native-google-signin/google-signin',
    [
      'react-native-fbsdk-next',
      {
        appID: '629191368747614',
        clientToken: process.env.FACEBOOK_CLIENT_TOKEN,
        displayName: 'Cilotta',
        scheme: 'fb629191368747614',
        isAutoInitEnabled: true,
      },
    ],
    '@notifee/react-native',
  ],
})

export default defineConfig
