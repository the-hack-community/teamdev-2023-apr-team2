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

const SignUp = () => {
  const router = useRouter()
  const url = getRedirectUrl('cilotta://redirect')

  const [csrfToken, setCsrfToken] = useState('')
  AuthStore.useState((s) => (s.isLoggedIn = false))

  useEffect(() => {
    const getCsrf = async () => {
      const response = await fetch(`${API_BASE_URL}/csrf`)
      if (!response.ok) console.log('error')
      const { csrf_token } = (await response.json()) as { csrf_token: string }
      setCsrfToken(csrf_token)
    }
    void getCsrf()
  }, [])

  // Google SignUp
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

        const response = await fetch(`${API_BASE_URL}/signup`, {
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
      }

      try {
        void getUserId()
        router.push('/login')
      } catch (error) {
        console.error(error)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [googleResponse])

  // Facebook SignUp
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
        const { id } = (await userInfoResponse.json()) as UserInfo

        const response = await fetch(`${API_BASE_URL}/signup`, {
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
        if (!response.ok) new Error('error')
      }
      try {
        void getUserId()
        router.replace('/login')
      } catch (error) {
        console.error(error)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facebookResponse])

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
          <Text className='ml-2'>Sign up with Google</Text>
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
          <Text className='ml-2'>Sign up with Facebook</Text>
        </View>
        <View>
          <View
            className='w-40 rounded-lg bg-gray-200'
            onTouchStart={() => {
              AuthStore.update((s) => {
                s.isLoggedIn = false
                s.token = ''
                s.csrfToken = ''
              })
              router.replace('/login')
            }}>
            <Text className='m-auto'>Login</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default SignUp
