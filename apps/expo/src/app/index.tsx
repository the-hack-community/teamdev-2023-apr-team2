import * as Location from 'expo-location'
import { useEffect, useState } from 'react'
import { SafeAreaView, Text, View } from 'react-native'

import HistoryButton from '../conponents/organisms/history-button'
import NavigationMap from '../conponents/organisms/navigation-map'
import { GOOGLE_MAP_API_KEY } from '../const/const'

const App = () => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

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

  if (!GOOGLE_MAP_API_KEY) {
    return (
      <SafeAreaView className='bg-arctic h-full w-full'>
        <Text>GOOGLE MAP APIが未設定です</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className='bg-arctic h-full w-full'>
      <NavigationMap />
      <View className='absolute bottom-10 left-4'>
        <HistoryButton href='/history' />
      </View>
    </SafeAreaView>
  )
}

export default App
