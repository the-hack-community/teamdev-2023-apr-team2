import * as Location from 'expo-location'
import { useEffect, useRef, useState } from 'react'
import { Text } from 'react-native'
import type { LatLng } from 'react-native-maps'
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'

import { GOOGLE_MAP_API_KEY, INITIAL_POSITION, mapStyle } from '../../const/const'
import MapSearchArea from './map-search-area'

const NavigationMap = () => {
  const mapRef = useRef<MapView>(null)
  const [location, setLocation] = useState<LatLng | null>(null)
  const [destination, setDestination] = useState<LatLng | null>(null)
  const [showDirections, setShowDirections] = useState(false)
  const [distance, setDistance] = useState<number>(0)

  const traceRouteOnReady = ({ distance }: { distance: number }) => {
    if (distance) {
      setDistance(distance)
    }
  }

  useEffect(() => {
    const getCurrentLocation = async () => {
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
    void getCurrentLocation()
  }, [])

  if (!GOOGLE_MAP_API_KEY) return <></>

  return (
    <>
      <MapView
        ref={mapRef}
        className='h-full w-full'
        initialRegion={INITIAL_POSITION}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        userLocationAnnotationTitle='現在地'
        followsUserLocation
        showsMyLocationButton={false}
        minZoomLevel={10}
        maxZoomLevel={20}
        customMapStyle={mapStyle}
        onRegionChangeComplete={(Region, { isGesture: boolean }) => {
          console.log(Region)
          console.log(boolean)
        }}>
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
          <>
            <Marker coordinate={destination}>
              <Callout>
                <Text>目的地</Text>
              </Callout>
            </Marker>
            <Marker
              coordinate={{
                latitude: 34.6919269,
                longitude: 135.5015518,
              }}>
              <Callout>
                <Text>目的地1</Text>
              </Callout>
            </Marker>
          </>
        )}

        {/* //ルート表示 */}
        {showDirections && location && destination && (
          <MapViewDirections
            origin={location}
            destination={destination}
            apikey={GOOGLE_MAP_API_KEY}
            strokeColor='#6644ff' //ルートの色
            strokeWidth={4} //ルートの太さ
            onReady={traceRouteOnReady} //成功したら距離と時間が返却される
            mode='BICYCLING'
            region='JP'
            language='ja'
            waypoints={[
              {
                latitude: 34.6886959,
                longitude: 135.5036893,
              },
            ]}
            splitWaypoints={true}
            onError={(errorMessage) => {
              console.log(errorMessage)
            }}
          />
        )}
      </MapView>
      <MapSearchArea
        distance={distance}
        destination={destination}
        setDestination={setDestination}
        setShowDirections={setShowDirections}
        mapRef={mapRef}
        location={location}
      />
    </>
  )
}

export default NavigationMap
