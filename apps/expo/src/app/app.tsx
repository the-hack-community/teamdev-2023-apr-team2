import React, { useEffect, useRef } from 'react'
import { Animated, Easing, Text } from 'react-native'

const App = () => {
  const animatedValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 2,
        duration: 50000,
        easing: Easing.linear,
        isInteraction: true,
        useNativeDriver: false,
      }),
    ).start()
  }, [animatedValue])

  const backgroundInterpolation = animatedValue.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['rgb(80, 200, 120)', 'rgb(100, 120, 200)', 'rgb(80, 200, 120)'],
  })

  return (
    <Animated.View
      className='flex h-full w-full items-center justify-center'
      style={{ backgroundColor: backgroundInterpolation }}>
      <Text className='text-8xl text-white'>
        Now, let&apos;s start making <Text className='text-pink-600'>Cilotta</Text>!
      </Text>
    </Animated.View>
  )
}

export default App
