import { API_BASE_URL, GOOGLE_WEB_CLIENT_ID } from '@Const/const'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import notifee from '@notifee/react-native'
import auth from '@react-native-firebase/auth'
import messaging from '@react-native-firebase/messaging'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { AuthStore } from '@Stores/store'
import axios from 'axios'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { PermissionsAndroid, Platform, SafeAreaView, Text, View } from 'react-native'
import { AccessToken, LoginManager } from 'react-native-fbsdk-next'

const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission()
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL

  if (enabled) {
    console.log('Authorization status:', authStatus)
  }
}

const LogIn = () => {
  const router = useRouter()

  // 通知処理
  useEffect(() => {
    void requestUserPermission()
    if (Platform.OS === 'android' && PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS != null) {
      void PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)
    }
    void messaging()
      .subscribeToTopic('cilotta')
      .catch((err) => console.log('failed: ', err))
    const onMessageListener = () =>
      new Promise((resolve) => {
        messaging().onMessage((payload) => {
          resolve(payload)
        })
      })
    onMessageListener()
      .then((payload) => {
        const { notification } = payload as { notification: { body: string; title: string } }
        void notifee.displayNotification(notification)
      })
      .catch((err) => console.log('failed: ', err))
  }, [])

  const getAuthToken = async ({
    facebookId = '',
    googleId = '',
  }: {
    facebookId?: string
    googleId?: string
  }) => {
    const resCsrf = await fetch(`${API_BASE_URL}/csrf`)
    const { csrf_token } = (await resCsrf.json()) as { csrf_token: string }

    const response = await axios.post(
      `${API_BASE_URL}/login`,
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
    const cookie = response.headers['set-cookie']?.at(0)
    const matches = cookie?.match(/token=([^;]+)/)
    const result = matches ? matches[1] : null
    return (
      {
        token: result,
        csrfToken: csrf_token,
      } ?? null
    )
  }

  // Google login
  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/userinfo.profile'], // what API you want to access on behalf of the user, default is email and profile
      webClientId: GOOGLE_WEB_CLIENT_ID, // client ID of type WEB for your server (needed to verify user ID and offline access)
    })
  }, [])

  const googleLogin = async () => {
    const { user } = await GoogleSignin.signIn()
    const { token, csrfToken } = await getAuthToken({ googleId: user.id })

    if (token) {
      AuthStore.update((s) => {
        s.isLoggedIn = true
        s.token = token
        s.csrfToken = csrfToken
      })
      router.push('/(stack)/home')
    }
  }

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

  const facebookLogin = async () => {
    const { user } = await onFacebookButtonPress()
    const { token, csrfToken } = await getAuthToken({ facebookId: user.providerData.at(0)?.uid })
    if (token) {
      AuthStore.update((s) => {
        s.isLoggedIn = true
        s.token = token
        s.csrfToken = csrfToken
      })
      router.push('/(stack)/home')
    }
  }

  return (
    <SafeAreaView className='flex h-full w-full flex-col items-center justify-center'>
      <View className='gap-4'>
        <View
          className='my-1 flex flex-row items-center justify-center'
          onTouchStart={() => void googleLogin()}>
          <MaterialCommunityIcons
            name='google'
            size={24}
            color='black'
          />
          <Text className='ml-2 w-40'>Sign in with Google</Text>
        </View>
        <View
          className='my-1 flex flex-row items-center justify-center'
          onTouchStart={() => void facebookLogin()}>
          <MaterialCommunityIcons
            name='facebook'
            size={24}
            color='black'
          />
          <Text className='ml-2 w-40'>Sign in with Facebook</Text>
        </View>
        <View
          className='rounded-lg bg-gray-200'
          onTouchStart={() => router.replace('/sign-up')}>
          <Text className='text-center'>Sign Up</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default LogIn
