import { API_BASE_URL, GOOGLE_WEB_CLIENT_ID } from '@Const/const'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import auth from '@react-native-firebase/auth'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import axios from 'axios'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { Alert, SafeAreaView, Text, View } from 'react-native'
import { AccessToken, LoginManager } from 'react-native-fbsdk-next'

const SignUp = () => {
  const router = useRouter()

  const signUpServer = async ({
    facebookId = '',
    googleId = '',
  }: {
    facebookId?: string
    googleId?: string
  }) => {
    const resCsrf = await fetch(`${API_BASE_URL}/csrf`)
    const { csrf_token } = (await resCsrf.json()) as { csrf_token: string }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/signup`,
        {
          facebook_id: facebookId,
          google_id: googleId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Csrf-Token': csrf_token,
          },
          withCredentials: true,
        },
      )
      if (response.data) return 'success'
      return 'failed'
    } catch (error) {
      return 'failed'
    }
  }

  // Google SignUp
  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/userinfo.profile'], // what API you want to access on behalf of the user, default is email and profile
      webClientId: GOOGLE_WEB_CLIENT_ID, // client ID of type WEB for your server (needed to verify user ID and offline access)
    })
  }, [])

  const googleSignUp = async () => {
    const { user } = await GoogleSignin.signIn()
    const result = await signUpServer({ googleId: user.id })
    if (result === 'success') {
      router.replace('/login')
    } else {
      Alert.alert(
        'エラー',
        'サインインエラーが発生しました。\n入力された情報に問題がある可能性がありますので、再度ご確認ください。',
      )
    }
  }

  // Facebook SignUp
  const onFacebookButtonPress = async () => {
    const result = await LoginManager.logInWithPermissions([])
    if (result.isCancelled) {
      throw 'User cancelled the login process'
    }
    const data = await AccessToken.getCurrentAccessToken()
    if (!data) {
      throw 'Something went wrong obtaining access token'
    }
    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken)
    return auth().signInWithCredential(facebookCredential)
  }
  const facebookSignUp = async () => {
    const { user } = await onFacebookButtonPress()
    const result = await signUpServer({ facebookId: user.providerData.at(0)?.uid })
    if (result === 'success') {
      router.replace('/login')
    } else {
      Alert.alert(
        'エラー',
        'サインインエラーが発生しました。\n入力された情報に問題がある可能性がありますので、再度ご確認ください。',
      )
    }
  }

  return (
    <SafeAreaView className='flex h-full w-full flex-1 flex-col items-center justify-center'>
      <View className='gap-4'>
        <View
          className='flex flex-row'
          onTouchStart={() => void googleSignUp()}>
          <MaterialCommunityIcons
            name='google'
            size={24}
            color='black'
          />
          <Text className='ml-2'>Sign up with Google</Text>
        </View>
        <View
          className='flex flex-row'
          onTouchStart={() => void facebookSignUp()}>
          <MaterialCommunityIcons
            name='facebook'
            size={24}
            color='black'
          />
          <Text className='ml-2'>Sign up with Facebook</Text>
        </View>
        <View>
          <View
            className='w-40 rounded-lg bg-gray-200'
            onTouchStart={() => router.replace('/login')}>
            <Text className='m-auto'>Login</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default SignUp
