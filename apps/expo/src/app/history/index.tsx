import { Text, View } from 'react-native'

import HistoryButton from '../../conponents/organisms/history-button'

const HistoryPage = () => {
  return (
    <View className='text-dark-teal bg-arctic flex h-full w-full flex-col justify-center px-8'>
      <Text className='text-dark-teal mb-8 text-3xl font-extrabold'>Route History</Text>
      <View className='text-dark-teal bg-orange h-96 w-60 rounded-3xl'>
        <Text>Navigation</Text>
      </View>
      <Text className='text-dark-teal my-4 text-2xl font-medium'>Tokyo Sky tree</Text>
      <View className='flex flex-row items-baseline'>
        <Text className='text-dark-teal mt-2 text-2xl font-medium'>20.1</Text>
        <Text className='text-dark-teal'> km</Text>
      </View>
      <Text className='text-dark-teal mb-16 mt-2'>DISTANCE</Text>
      <View className='absolute bottom-10 left-4'>
        <HistoryButton href='/' />
      </View>
    </View>
  )
}
export default HistoryPage
