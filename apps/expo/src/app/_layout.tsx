import { Stack } from 'expo-router'

const Layout = () => (
  <Stack>
    <Stack.Screen
      name='index'
      options={{
        // Hide the header for all other routes.
        headerShown: false,
      }}
    />
    <Stack.Screen
      name='history'
      options={{
        // Set the presentation mode to modal for our modal route.
        headerShown: false,
        animation: 'none',
      }}
    />
  </Stack>
)

export default Layout
