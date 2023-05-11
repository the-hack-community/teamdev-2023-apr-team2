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
  },
  plugins: ['./expo-plugins/with-modify-gradle.js'],
})

export default defineConfig
