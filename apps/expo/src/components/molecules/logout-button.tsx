import { AuthStore } from '@Stores/store'
import { useRouter } from 'expo-router'
import { Text, View } from 'react-native'

const LogoutButton = () => {
  const router = useRouter()
  return (
    <View
      className='w-40 rounded-lg bg-gray-200'
      onTouchStart={() => {
        AuthStore.update((s) => {
          s.isLoggedIn = false
          s.token = ''
          s.csrfToken = ''
        })
        router.replace('/login')
      }}>
      <Text className='m-auto'>Login</Text>
    </View>
  )
}

export default LogoutButton
