import { Feather, MaterialIcons } from '@expo/vector-icons'
import { Text, TouchableOpacity, View } from 'react-native'
import type { GooglePlaceDetail } from 'react-native-google-places-autocomplete'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import type { LatLng } from 'react-native-maps'
import type MapView from 'react-native-maps'

import { GOOGLE_MAP_API_KEY } from '../../const/const'

const MapSearchArea = ({
  location,
  distance,
  destination,
  setDestination,
  setShowDirections,
  mapRef,
}: {
  location: LatLng | null
  distance: number
  destination: LatLng | null
  setDestination: (position: LatLng | null) => void
  setShowDirections: (show: boolean) => void
  mapRef: React.RefObject<MapView>
}) => {
  const moveTo = async (position: LatLng) => {
    const camera = await mapRef.current?.getCamera()
    if (camera) {
      camera.center = position
      mapRef.current?.animateCamera(camera, { duration: 1000 })
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

  // 現在地・目的地の表示を中央にする
  const traceRoute = () => {
    const edgePaddingValue = 40
    const edgePadding = {
      top: 200,
      right: edgePaddingValue,
      bottom: edgePaddingValue,
      left: edgePaddingValue,
    }
    if (location && destination) {
      setShowDirections(true)
      mapRef.current?.fitToCoordinates([location, destination], { edgePadding })
    }
  }

  if (!GOOGLE_MAP_API_KEY) return <></>
  return (
    <>
      {/* 目的地検索 */}
      <View className='absolute flex h-56 w-full bg-white/40'>
        <View className='text-orange placeholder:text-orange mt-16 h-full px-4'>
          <GooglePlacesAutocomplete
            suppressDefaultStyles={false}
            textInputProps={{
              placeholderTextColor: '#929292',
            }}
            styles={{
              container: {
                flex: 1,
                maxWidth: '85%',
              },
              textInputContainer: {
                flexDirection: 'row',
              },
              textInput: {
                backgroundColor: 'transparent',
                fontSize: 15,
              },
              poweredContainer: {
                display: 'none',
              },
              powered: {},
              listView: {
                height: 120,
              },
              row: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                paddingTop: 10,
                flexDirection: 'row',
              },
              separator: {
                display: 'none',
              },
              description: {},
              loader: { flexDirection: 'row', justifyContent: 'flex-end', height: 20 },
            }}
            placeholder='目的地を検索'
            fetchDetails //座標の値を取得
            onPress={(_, details = null) => {
              onPlaceSelected(details)
            }}
            onFail={(error) => {
              console.error(error)
            }}
            query={{
              key: GOOGLE_MAP_API_KEY,
              language: 'ja',
            }}
          />

          {/* ルート検索ボタン */}
          <TouchableOpacity
            className='bg-orange absolute right-8 mt-1 flex h-8 w-8 items-center justify-center rounded-full'
            onPress={traceRoute}>
            <Feather
              name='search'
              size={20}
              color='white'
            />
          </TouchableOpacity>
          <View className='absolute left-6 top-14 flex flex-row'>
            <View className='bg-orange relative flex h-8 w-8 items-center justify-center rounded-full'>
              <MaterialIcons
                name='local-parking'
                size={24}
                color='white'
              />
            </View>
            <Text className='ml-2 text-lg text-black/80'>東京ソラマチ西駐輪場</Text>
          </View>
          {/* 距離表示 */}
          {distance ? (
            <Text className='absolute left-6 top-28 text-black/40'>
              distance {distance.toFixed(2)}km
            </Text>
          ) : null}
        </View>
      </View>
    </>
  )
}

export default MapSearchArea
