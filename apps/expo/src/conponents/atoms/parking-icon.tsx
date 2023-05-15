import { MaterialIcons } from '@expo/vector-icons'
import type { OpaqueColorValue } from 'react-native'
import { View } from 'react-native'

const ParkingIcon = ({
  bgColor = 'bg-orange',
  iconColor = 'white',
}: {
  bgColor?: string
  iconColor?: string | OpaqueColorValue
}) => (
  <View className={`relative flex h-8 w-8 items-center justify-center rounded-full ${bgColor}`}>
    <MaterialIcons
      name='local-parking'
      size={24}
      color={iconColor}
    />
  </View>
)

export default ParkingIcon
