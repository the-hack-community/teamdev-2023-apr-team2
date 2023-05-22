import { MaterialCommunityIcons } from '@expo/vector-icons'
import { View } from 'react-native'

const FavoriteIcon = ({ state }: { state: boolean }) => (
  <View className='relative flex h-12 w-12 items-center justify-center rounded-full bg-white'>
    {state ? (
      <MaterialCommunityIcons
        name='star'
        size={28}
        color='#FA8C61'
      />
    ) : (
      <MaterialCommunityIcons
        name='star-outline'
        size={28}
        color='#FA8C61'
      />
    )}
  </View>
)

export default FavoriteIcon
