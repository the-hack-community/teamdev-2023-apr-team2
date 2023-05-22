import HistoryButton from '@Components/organisms/history-button'
import HistoryMap from '@Components/organisms/history-map'
import { getHistories } from '@Lib/history-api'
import { AuthStore } from '@Stores/store'
import type { History } from '@Type/type'
import { Stack } from 'expo-router'
import { useEffect, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'

const HistoryPage = () => {
  const [histories, setHistories] = useState<History[]>([])
  const { token, csrfToken } = AuthStore.useState((s) => s)

  useEffect(() => {
    const getHistoriesPage = async () => {
      try {
        const result = await getHistories({ csrfToken, token })
        setHistories(result)
      } catch (error) {
        console.error(error)
      }
    }
    void getHistoriesPage()
  }, [])

  return (
    <View className='text-dark-teal bg-arctic flex h-full w-full flex-col justify-center px-8'>
      <Stack.Screen options={{ title: 'History' }} />
      <Text className='text-dark-teal mb-8 text-3xl font-extrabold'>Route History</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className='flex max-h-96'>
        {histories.map((history) => (
          <View
            key={history.id}
            className='text-dark-teal bg-orange mr-4 h-96 w-60 overflow-hidden rounded-3xl'>
            <HistoryMap history={history} />
          </View>
        ))}
      </ScrollView>
      <Text className='text-dark-teal my-4 text-2xl font-medium'>Tokyo Sky tree</Text>
      <View className='flex flex-row items-baseline'>
        <Text className='text-dark-teal mt-2 text-2xl font-medium'>20.1</Text>
        <Text className='text-dark-teal'> km</Text>
      </View>
      <Text className='text-dark-teal mb-16 mt-2'>DISTANCE</Text>
      <View className='absolute bottom-10 left-4'>
        <HistoryButton href='/(stack)/home' />
      </View>
    </View>
  )
}
export default HistoryPage
