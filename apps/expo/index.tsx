import { registerRootComponent } from 'expo'
import { ExpoRoot } from 'expo-router'

// Must be exported or Fast Refresh won't update the context
const Root = () => {
  const ctx = require.context('./src/app')
  return <ExpoRoot context={ctx} />
}

registerRootComponent(Root)
