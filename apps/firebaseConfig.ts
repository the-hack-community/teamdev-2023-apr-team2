import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getReactNativePersistence, initializeAuth } from 'firebase/auth/react-native'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Initialize Firebase
const firebaseConfig = {
  apiKey: Constants?.manifest?.extra?.apiKey,
  authDomain: Constants?.manifest?.extra?.authDomain,
  projectId: Constants?.manifest?.extra?.projectId,
  storageBucket: Constants?.manifest?.extra?.storageBucket,
  messagingSenderId: Constants?.manifest?.extra?.messagingSenderId,
  appId: Constants?.manifest?.extra?.appId,
}

let firebaseApp: any

if (!firebaseApp) {
  firebaseApp = initializeApp(firebaseConfig)
  initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(AsyncStorage),
  })
}

export const DB = getFirestore(firebaseApp)
export const AUTH = getAuth(firebaseApp)
export const STORAGE = getStorage(firebaseApp)
