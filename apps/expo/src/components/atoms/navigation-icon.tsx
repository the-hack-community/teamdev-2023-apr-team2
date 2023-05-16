import { MaterialCommunityIcons } from '@expo/vector-icons'
import { View } from 'react-native'

const NavigationIcon = () => (
  <View className='relative flex h-14 w-14 items-center justify-center rounded-full bg-white'>
    <MaterialCommunityIcons
      name='navigation-variant'
      size={24}
      color='black'
    />
  </View>
)
export default NavigationIcon
