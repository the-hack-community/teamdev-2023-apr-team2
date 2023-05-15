import type { ExpoConfig } from '@expo/config'

type Config = {
  scheme: string[] | string
}

const defineConfig = (): Omit<ExpoConfig, 'scheme'> & Config => ({
  name: 'expo',
  slug: 'cilotta',
  scheme: ['cilotta', 'fb629191368747614'],
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
  plugins: ['./expo-plugins/with-modify-gradle.js'],
})

export default defineConfig
