import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useCallback } from 'react'
import { Pressable } from 'react-native'
import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'

const HistoryButton = ({ href }: { href: string }) => {
  const scaleUpAnimation = useSharedValue(1)
  const router = useRouter()

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleUpAnimation.value }],
  }))
  const animatedTextStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 / scaleUpAnimation.value }],
  }))

  const duration = 700
  const scaleUpSize = 1200
  const handleItemClick = useAnimatedGestureHandler(
    {
      onStart: () => {
        scaleUpAnimation.value = withTiming(scaleUpSize, {
          duration,
          // easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        })
      },
      onFinish: () => {
        scaleUpAnimation.value = withDelay(duration + 500, withTiming(1))
      },
    },
    [scaleUpAnimation],
  )

  const handlePress = useCallback(() => {
    setTimeout(() => {
      if (href === '/(stack)/home') router.back()
      router.push(href)
    }, duration + 200)
  }, [href, router])

  return (
    <Pressable onPress={handlePress}>
      {() => (
        <PanGestureHandler onGestureEvent={handleItemClick}>
          <Animated.View
            style={animatedStyle}
            className='flex h-14 w-14 items-center justify-center rounded-full bg-[#b1dad5]'>
            <Animated.View
              style={animatedTextStyle}
              className='flex h-14 w-14 items-center justify-center rounded-full bg-white'>
              <MaterialIcons
                name='collections-bookmark'
                size={22}
                color='black'
              />
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
      )}
    </Pressable>
  )
}

export default HistoryButton
