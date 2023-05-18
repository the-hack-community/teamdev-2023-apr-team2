import {
  EncodeSansSemiCondensed_100Thin,
  EncodeSansSemiCondensed_300Light,
  EncodeSansSemiCondensed_400Regular,
  EncodeSansSemiCondensed_700Bold,
  useFonts,
} from '@expo-google-fonts/encode-sans-semi-condensed'
import { SplashScreen, Stack } from 'expo-router'

const Layout = () => {
  const [fontsLoaded] = useFonts({
    EncodeSansSemiCondensed_700Bold,
    EncodeSansSemiCondensed_400Regular,
    EncodeSansSemiCondensed_300Light,
    EncodeSansSemiCondensed_100Thin,
  })

  if (!fontsLoaded) {
    // The native splash screen will stay visible for as long as there
    // are `<SplashScreen />` components mounted. This component can be nested.

    return <SplashScreen />
  }

  return <Stack screenOptions={{ headerShown: false }} />
}

export default Layout
