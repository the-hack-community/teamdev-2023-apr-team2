import 'expo-router/entry'
import 'react-native-reanimated'
import 'react-native-gesture-handler'

import messaging from '@react-native-firebase/messaging'
import { registerRootComponent } from 'expo'
import { ExpoRoot } from 'expo-router'

// Must be exported or Fast Refresh won't update the context
const Root = () => {
  const ctx = require.context('./src/app')
  return <ExpoRoot context={ctx} />
}
messaging().setBackgroundMessageHandler(
  (remoteMessage) =>
    new Promise((resolve) => {
      resolve(remoteMessage)
    }),
)

registerRootComponent(Root)
