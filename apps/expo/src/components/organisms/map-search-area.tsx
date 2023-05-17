import ParkingIcon from '@Components/atoms/parking-icon'
import SearchIcon from '@Components/atoms/search-icon'
import { GOOGLE_MAP_API_KEY } from '@Const/const'
import { traceRoute } from '@Lib/map-controll'
import type { ParkingInfo } from '@Type/type'
import { useRef, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import type {
  GooglePlaceDetail,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import type { LatLng } from 'react-native-maps'
import type MapView from 'react-native-maps'

const MapSearchArea = ({
  location,
  distance,
  destination,
  setDestination,
  setShowDirections,
  mapRef,
  nearParkingInfo,
}: {
  location: LatLng | null
  distance: number
  destination: LatLng | null
  setDestination: (position: LatLng | null) => void
  setShowDirections: (show: boolean) => void
  mapRef: React.RefObject<MapView>
  nearParkingInfo: ParkingInfo | null
}) => {
  const googlePlacesRef = useRef<GooglePlacesAutocompleteRef>(null)
  const [isInputFocused, setIsInputFocused] = useState(false)

  const cleanDescription = (description: string) => description.split(' ').at(-1) ?? ''

  const moveTo = async (position: LatLng) => {
    const camera = await mapRef.current?.getCamera()
    if (camera) {
      camera.center = position
      mapRef.current?.animateCamera(camera, { duration: 500 })
    }
  }
  const onPlaceSelected = (details: GooglePlaceDetail | null) => {
    const position = {
      latitude: details?.geometry.location.lat || 0,
      longitude: details?.geometry.location.lng || 0,
    }
    setDestination(position)
    if (location && destination) {
      traceRoute({ location, destination, setShowDirections, mapRef })
      void moveTo(position)
    }
  }

  if (!GOOGLE_MAP_API_KEY) return <></>
  return (
    <View className='absolute flex h-56 w-full bg-white/40'>
      <View className='mx-4 mt-16 h-96'>
        {/* background */}
        <View className='absolute h-12 w-full rounded-full bg-white' />
        {isInputFocused && <View className='absolute h-96 w-full rounded-2xl bg-white' />}
        <GooglePlacesAutocomplete
          ref={googlePlacesRef}
          suppressDefaultStyles={false}
          textInputProps={{
            onTextInput: () => setIsInputFocused(true),
            placeholderTextColor: '#FA8C61',
            marginLeft: 8,
          }}
          styles={{
            container: {
              flex: 1,
            },
            textInput: {
              backgroundColor: 'transparent',
              fontSize: 15,
              marginTop: 2,
            },
            separator: {
              display: 'none',
            },
          }}
          placeholder='目的地を検索'
          fetchDetails //座標の値を取得
          onPress={(data, details = null) => {
            googlePlacesRef.current?.setAddressText(cleanDescription(data.description))
            setIsInputFocused(false)
            onPlaceSelected(details)
          }}
          // disableScroll
          isRowScrollable={false}
          debounce={250}
          minLength={2}
          onFail={(error) => console.error(error)}
          query={{
            key: GOOGLE_MAP_API_KEY,
            language: 'ja',
            components: 'country:jp',
          }}
          renderRightButton={() => (
            <TouchableOpacity // ルート検索ボタン
              className='bg-orange mr-2 mt-2 flex h-8 w-8 items-center justify-center rounded-full'
              onPress={() => traceRoute({ location, destination, setShowDirections, mapRef })}>
              <SearchIcon />
            </TouchableOpacity>
          )}
          inbetweenCompo={
            nearParkingInfo != null && !isInputFocused ? (
              <>
                <View className='absolute left-2 top-16 flex flex-row'>
                  <ParkingIcon />
                  <Text className='ml-2 text-lg text-black/80'>{nearParkingInfo.name}</Text>
                </View>
                {/* 各種情報表示 */}
                {distance ? (
                  <View className='absolute top-28 ml-2 flex w-full flex-row'>
                    <Text className='text-black/40'>distance {distance.toFixed(2)} km</Text>
                    <Text className='ml-2 text-black/40'>
                      {`￥${nearParkingInfo.onetime_price.toString()}~`}
                    </Text>
                    {nearParkingInfo.free_hour > 0 && (
                      <Text className='ml-2 text-black/40'>
                        {`free ${nearParkingInfo.free_hour.toString()} 時間`}
                      </Text>
                    )}
                  </View>
                ) : null}
              </>
            ) : null
          }
          enablePoweredByContainer={false}
          renderRow={(googlePlace) => {
            const place = cleanDescription(googlePlace.description)
            return <Text className='text-orange'>{place}</Text>
          }}
          listViewDisplayed={true}
        />
      </View>
    </View>
  )
}

export default MapSearchArea
