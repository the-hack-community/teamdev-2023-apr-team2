import {
  API_BASE_URL,
  FACEBOOK_CLIENT_ID,
  GOOGLE_ANDROID_CLIENT_ID,
  GOOGLE_WEB_CLIENT_ID,
} from '@Const/const'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { AuthStore } from '@Stores/store'
import type { UserInfo } from '@Type/type'
import { getRedirectUrl } from 'expo-auth-session'
import * as Facebook from 'expo-auth-session/providers/facebook'
import * as Google from 'expo-auth-session/providers/google'
import { useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { useEffect, useState } from 'react'
import { SafeAreaView, Text, View } from 'react-native'

WebBrowser.maybeCompleteAuthSession()

const LogIn = () => {
  const router = useRouter()
  const url = getRedirectUrl('cilotta://redirect')
  const [csrfToken, setCsrfToken] = useState('')
  const [authToken, setAuthToken] = useState('')

  useEffect(() => {
    router.push('/(stack)/home')

    const getCsrf = async () => {
      const response = await fetch(`${API_BASE_URL}/csrf`)
      if (!response.ok) console.log('error')
      const { csrf_token } = (await response.json()) as { csrf_token: string }
      setCsrfToken(csrf_token)
    }
    void getCsrf()
  }, [])

  // Google Login
  const [, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    webClientId: GOOGLE_WEB_CLIENT_ID,
    expoClientId: GOOGLE_WEB_CLIENT_ID,
    language: 'ja',
    redirectUri: url,
  })
  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const getUserId = async () => {
        const userInfoRes = await fetch('https://www.googleapis.com/userinfo/v2/me', {
          headers: { Authorization: `Bearer ${googleResponse.authentication?.accessToken}` },
        })
        const googleUser = (await userInfoRes.json()) as UserInfo

        const response = await fetch(`${API_BASE_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Csrf-Token': csrfToken,
            Cookie: `_csrf=${csrfToken}; Path=/`,
          },
          credentials: 'include',
          body: JSON.stringify({
            google_id: googleUser.id,
          }),
        })
        if (!response.ok) new Error('error')

        const cookieString = response.headers.get('set-cookie')
        const matches = cookieString?.match(/token=([^;]+)/)
        const result = matches ? matches[1] : null
        result && setAuthToken(result)
      }
      try {
        void getUserId()
        toMap({ authToken, csrfToken })
      } catch (error) {
        console.error(error)
      }
    }
  }, [googleResponse])

  // Facebook Login
  const [, facebookResponse, facebookPromptAsync] = Facebook.useAuthRequest({
    clientId: FACEBOOK_CLIENT_ID,
    language: 'ja',
    redirectUri: url,
  })
  useEffect(() => {
    if (facebookResponse?.type === 'success') {
      const getUserId = async () => {
        const userInfoResponse = await fetch(
          `https://graph.facebook.com/me?access_token=${facebookResponse.authentication?.accessToken}`,
        )
        if (!userInfoResponse.ok) throw new Error('error')
        const { id } = (await userInfoResponse.json()) as UserInfo
        const response = await fetch(`${API_BASE_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Csrf-Token': csrfToken,
            Cookie: `_csrf=${csrfToken}; Path=/`,
          },
          credentials: 'include',
          body: JSON.stringify({
            facebook_id: id,
          }),
        })

        if (!response.ok) throw new Error('error')
        const cookieString = response.headers.get('set-cookie')
        const matches = cookieString?.match(/token=([^;]+)/)
        const result = matches ? matches[1] : null
        result && setAuthToken(result)
      }
      try {
        void getUserId()
        toMap({ authToken, csrfToken })
      } catch (error) {
        console.error(error)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facebookResponse])

  // Redirect with authorization
  // TODO: ログイン後のリダイレクトを修正する
  const toMap = ({ authToken, csrfToken }: { authToken: string; csrfToken: string }) => {
    if (authToken != '' && csrfToken != '') {
      AuthStore.update((s) => {
        s.isLoggedIn = true
        s.token = authToken
        s.csrfToken = csrfToken
      })
      router.push('/(stack)/home')
    } else {
      router.replace('/login')
    }
  }

  return (
    <SafeAreaView className='flex h-full w-full flex-1 flex-col items-center justify-center'>
      <View className='gap-4'>
        <View
          className='flex flex-row'
          onTouchStart={() => {
            void googlePromptAsync()
          }}>
          <MaterialCommunityIcons
            name='google'
            size={24}
            color='black'
          />
          <Text className='ml-2'>Sign in with Google</Text>
        </View>
        <View
          className='flex flex-row'
          onTouchStart={() => {
            void facebookPromptAsync()
          }}>
          <MaterialCommunityIcons
            name='facebook'
            size={24}
            color='black'
          />
          <Text className='ml-2'>Sign in with Facebook</Text>
        </View>
        <View
          className='w-40 rounded-lg bg-gray-200'
          onTouchStart={() => {
            router.replace('/sign-up')
          }}>
          <Text className='m-auto'>Sign Up</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default LogIn
