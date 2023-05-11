import { getRedirectUrl } from 'expo-auth-session'
import * as Facebook from 'expo-auth-session/providers/facebook'
import * as Google from 'expo-auth-session/providers/google'
import { useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { useEffect, useState } from 'react'
import { Button, SafeAreaView, Text, View } from 'react-native'

import { FACEBOOK_CLIENT_ID, GOOGLE_ANDROID_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from '../const/const'

WebBrowser.maybeCompleteAuthSession()

type UserInfo = {
  name: string
}

const Login = () => {
  const [token, setToken] = useState('')
  const [googleUserInfo, setGoogleUserInfo] = useState<UserInfo | null>(null)

  const router = useRouter()
  const [facebookUserInfo, setFacebookUserInfo] = useState<UserInfo | null>(null)
  const url = getRedirectUrl('cilotta://redirect')
  const [, facebookResponse, facebookPromptAsync] = Facebook.useAuthRequest({
    clientId: FACEBOOK_CLIENT_ID,
    language: 'ja',
    redirectUri: url,
  })
  useEffect(() => {
    if (
      facebookResponse &&
      facebookResponse.type === 'success' &&
      facebookResponse.authentication
    ) {
      router.push('/')
      void (async () => {
        const userInfoResponse = await fetch(
          `https://graph.facebook.com/me?access_token=${facebookResponse.authentication?.accessToken}`,
        )
        const userInfo = (await userInfoResponse.json()) as UserInfo
        setFacebookUserInfo(userInfo)
      })()
    }
  }, [facebookResponse, router])

  const handlePressAsync = async () => {
    const result = await facebookPromptAsync()
    if (result.type !== 'success') {
      alert('Uh oh, something went wrong')
      return
    }
  }

  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    webClientId: GOOGLE_WEB_CLIENT_ID,
    expoClientId: GOOGLE_WEB_CLIENT_ID,
    language: 'ja',
    redirectUri: url,
  })

  useEffect(() => {
    if (googleResponse?.type === 'success') {
      router.push('/')
      if (googleResponse.authentication) setToken(googleResponse.authentication.accessToken)
      void getUserInfo()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [googleResponse, token])

  const getUserInfo = async () => {
    try {
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const googleUser = (await response.json()) as UserInfo
      setGoogleUserInfo(googleUser)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <SafeAreaView>
      <View className='mt-40'>
        {googleUserInfo === null ? (
          <Button
            title='Sign in with Google'
            disabled={!googleRequest}
            onPress={() => {
              void googlePromptAsync()
            }}
          />
        ) : (
          <Text>{googleUserInfo.name}</Text>
        )}

        {facebookUserInfo ? (
          <View>
            <Text>Facebook Signed</Text>
          </View>
        ) : (
          <Button
            disabled={!googleRequest}
            title='Sign in with Facebook'
            onPress={() => void handlePressAsync()}
          />
        )}
      </View>
    </SafeAreaView>
  )
}

export default Login
