import 'expo-router/entry'

import Constants from 'expo-constants'
import * as Location from 'expo-location'
import { useEffect, useRef, useState } from 'react'
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import {
  type GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from 'react-native-google-places-autocomplete'
import type { LatLng } from 'react-native-maps'
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'

// 地図の初期設定
const { width, height } = Dimensions.get('window')
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.02
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
const INITIAL_POSITION = {
  latitude: 35.689506,
  longitude: 139.6917,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
}

const GOOGLE_MAP_API_KEY = process.env.GOOGLE_MAP_API_KEY

//型定義
type InputAutoCompleteProps = {
  placeholder: string
  onPlaceSelected: (details: GooglePlaceDetail | null) => void
}
type RouteProps = {
  distance: number
}

// 目的地検索ボックス
const InputAutoComplete = ({ placeholder, onPlaceSelected }: InputAutoCompleteProps) => {
  return (
    <GooglePlacesAutocomplete
      styles={{ textInput: styles.input }}
      placeholder={placeholder}
      fetchDetails //座標の値を取得
      onPress={(_, details = null) => {
        onPlaceSelected(details)
      }}
      query={{
        key: GOOGLE_MAP_API_KEY,
        language: 'ja',
      }}
    />
  )
}

const App = () => {
  const [location, setLocation] = useState<LatLng | null>(null)
  const [destination, setDestination] = useState<LatLng | null>(null)
  const [showDirections, setShowDirections] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [distance, setDistance] = useState<number>(0)
  const mapRef = useRef<MapView>(null)

  // 地図が移動した時のアニメーション
  const moveTo = async (position: LatLng) => {
    const camera = await mapRef.current?.getCamera()
    if (camera) {
      camera.center = position
      mapRef.current?.animateCamera(camera, { duration: 1000 })
    }
  }

  const traceRouteOnReady = (args: RouteProps) => {
    if (args) {
      setDistance(args.distance)
    }
  }

  // 現在地・目的地の表示を中央にする
  const edgePaddingValue = 70
  const edgePadding = {
    top: edgePaddingValue,
    right: edgePaddingValue,
    bottom: edgePaddingValue,
    left: edgePaddingValue,
  }
  const traceRoute = () => {
    if (location && destination) {
      setShowDirections(true)
      mapRef.current?.fitToCoordinates([location, destination], { edgePadding })
    }
  }

  const onPlaceSelected = (details: GooglePlaceDetail | null) => {
    const position = {
      latitude: details?.geometry.location.lat || 0,
      longitude: details?.geometry.location.lng || 0,
    }
    setDestination(position)
    void moveTo(position)
  }

  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setErrorMsg('位置情報取得には承認が必要です。')
        return
      }

      //現在地の監視
      const location = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000,
          distanceInterval: 80,
        },
        (location_update) => {
          console.log('update location!', location_update.coords)
          const { latitude, longitude } = location_update.coords
          setLocation({ latitude, longitude })
        },
      )
      console.log('location!', location)
    }
    void getPermissions()
  }, [])

  let text = 'Waiting..'

  if (errorMsg) {
    console.error(errorMsg)
  } else if (location) {
    text = JSON.stringify(location)
    console.log(text)
  }

  if (!GOOGLE_MAP_API_KEY) {
    return (
      <View style={styles.container}>
        <Text>GOOGLE MAP APIが未設定です</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={INITIAL_POSITION}
        provider={PROVIDER_GOOGLE}>
        {/* 現在地 */}
        {location && (
          <Marker coordinate={location}>
            <Callout>
              <Text>出発地</Text>
            </Callout>
          </Marker>
        )}
        {/* 目的地 */}
        {destination && (
          <Marker coordinate={destination}>
            <Callout>
              <Text>目的地</Text>
            </Callout>
          </Marker>
        )}

        {/* //ルート表示 */}
        {showDirections && location && destination && (
          <MapViewDirections
            origin={location}
            destination={destination}
            apikey={GOOGLE_MAP_API_KEY ?? ''}
            strokeColor='#6644ff' //ルートの色
            strokeWidth={4} //ルートの太さ
            onReady={traceRouteOnReady} //成功したら距離と時間が返却される
            onError={(errorMessage) => {
              console.log(errorMessage)
            }}
          />
        )}
      </MapView>

      {/* 目的地検索 */}
      <View style={styles.searchContainer}>
        <InputAutoComplete
          placeholder='目的地検索'
          onPlaceSelected={(details) => onPlaceSelected(details)}
        />

        {/* ルート検索ボタン */}
        <TouchableOpacity
          style={styles.button}
          onPress={traceRoute}>
          <Text style={styles.buttonText}>ルート検索</Text>
        </TouchableOpacity>

        {/* 距離表示 */}
        {distance ? <Text>距離:{distance.toFixed(2)}km</Text> : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  searchContainer: {
    position: 'absolute',
    zIndex: 100,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    padding: 8,
    borderRadius: 8,
    top: Constants.statusBarHeight,
    left: 10,
    right: 10,
  },
  input: {
    borderColor: '#eee',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#bbb',
    paddingVertical: 12,
    marginTop: 16,
    borderRadius: 4,
  },
  buttonText: {
    textAlign: 'center',
  },
})

export default App
