import MarkerIcon from '@Components/atoms/marker-icon'
import { API_BASE_URL, GOOGLE_MAP_API_KEY, INITIAL_POSITION, mapStyle } from '@Const/const'
import { traceRoute } from '@Lib/map-controll'
import { getParkingListByLatLng } from '@Lib/parking-api'
import { AuthStore } from '@Stores/store'
import type { History, ParkingLocation } from '@Type/type'
import { useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import type { LatLng } from 'react-native-maps'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'

const HistoryMap = ({ history }: { history: History }) => {
  const { from_longitude, from_latitude, to_longitude, to_latitude, parking_id } = history

  const mapRef = useRef<MapView>(null)
  const [location] = useState<LatLng>({
    latitude: Number(from_latitude),
    longitude: Number(from_longitude),
  })
  const [destination] = useState<LatLng>({
    latitude: Number(to_latitude),
    longitude: Number(to_longitude),
  })
  const [, setShowDirections] = useState(false)
  const [nearParkingLocation, setNearParkingLocation] = useState<ParkingLocation | null>(null)
  const { csrfToken } = AuthStore.useState((s) => s)

  useEffect(() => {
    const areaNumber = 0.005
    if (!destination) return
    try {
      const getParkingList = async () => {
        const parkingLocationList = await getParkingListByLatLng({
          minLat: destination.latitude - areaNumber,
          maxLat: destination.latitude + areaNumber,
          minLng: destination.longitude - areaNumber,
          maxLng: destination.longitude + areaNumber,
          csrfToken,
        })

        const nearParkingLocation = parkingLocationList
          .filter((parking) => parking.id === parking_id)
          .at(0)
        nearParkingLocation && setNearParkingLocation(nearParkingLocation)
      }
      void getParkingList()
      traceRoute({ location, destination, setShowDirections, mapRef, edgePaddingValue: 0 })
    } catch (error) {
      console.log(error)
    }
  }, [])

  if (!GOOGLE_MAP_API_KEY || !API_BASE_URL) return <></>
  return (
    <View className='h-full w-full'>
      <MapView
        ref={mapRef}
        className='h-full'
        initialRegion={INITIAL_POSITION}
        provider={PROVIDER_GOOGLE}
        followsUserLocation
        showsMyLocationButton={false}
        maxZoomLevel={16}
        scrollEnabled={false}
        customMapStyle={mapStyle}
        showsIndoors={false}>
        {/* 目的地 */}
        {destination && (
          <Marker coordinate={destination}>
            <View
              style={{
                width: 50,
                height: 50,
                position: 'relative',
              }}>
              <MarkerIcon
                width='100%'
                height='100%'
                viewBox='-3.5 0 30 30'
              />
            </View>
          </Marker>
        )}

        {/* //ルート表示 */}
        {nearParkingLocation && (
          <>
            <MapViewDirections
              origin={location}
              destination={{
                latitude: nearParkingLocation.latitude,
                longitude: nearParkingLocation.longitude,
              }}
              apikey={GOOGLE_MAP_API_KEY}
              strokeColor='#FA8C61' //ルートの色
              strokeWidth={4} //ルートの太さ
              // onReady={(mapDirection) => setDistanceToParking(mapDirection.distance)}
              mode='BICYCLING'
              region='JP'
              language='ja'
              onError={(error) => console.error(error)}
            />
            <MapViewDirections
              origin={{
                latitude: nearParkingLocation.latitude,
                longitude: nearParkingLocation.longitude,
              }}
              destination={destination}
              apikey={GOOGLE_MAP_API_KEY}
              strokeColor='#29616C'
              strokeWidth={4}
              // onReady={(mapDirection) => setDistanceToDestination(mapDirection.distance)}
              mode='WALKING'
              region='JP'
              language='ja'
              onError={(error) => console.error(error)}
            />
          </>
        )}
      </MapView>
    </View>
  )
}

export default HistoryMap
