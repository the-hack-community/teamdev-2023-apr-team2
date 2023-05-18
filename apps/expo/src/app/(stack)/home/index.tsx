import HistoryButton from '@Components/organisms/history-button'
import NavigationMap from '@Components/organisms/navigation-map'
import { GOOGLE_MAP_API_KEY } from '@Const/const'
import { AuthStore } from '@Stores/store'
import * as Location from 'expo-location'
import { Redirect, Stack } from 'expo-router'
import { useEffect, useState } from 'react'
import { SafeAreaView, View } from 'react-native'

const App = () => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const { isLoggedIn } = AuthStore.useState((s) => s)

  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setErrorMsg('位置情報取得には承認が必要です。')
        return
      }
    }
    void getPermissions()
  }, [])
  if (errorMsg) console.error(errorMsg)

  if (!GOOGLE_MAP_API_KEY || !isLoggedIn) {
    return <Redirect href='/login' />
  }

  return (
    <SafeAreaView className='bg-arctic h-full w-full'>
      <Stack.Screen options={{ title: 'Home' }} />
      <NavigationMap />
      <View className='absolute bottom-10 left-4'>
        <HistoryButton href='/home/history' />
      </View>
    </SafeAreaView>
  )
}

export default App
