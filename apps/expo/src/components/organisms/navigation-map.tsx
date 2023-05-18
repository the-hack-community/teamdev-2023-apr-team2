import MarkerIcon from '@Components/atoms/marker-icon'
import NavigationIcon from '@Components/atoms/navigation-icon'
import ParkingIcon from '@Components/atoms/parking-icon'
import MapSearchArea from '@Components/organisms/map-search-area'
import { API_BASE_URL, GOOGLE_MAP_API_KEY, INITIAL_POSITION, mapStyle } from '@Const/const'
import { traceRoute } from '@Lib/map-controll'
import { getParkingInfo, getParkingListByLatLng } from '@Lib/parking-api'
import { AuthStore } from '@Stores/store'
import type { ParkingInfo, ParkingLocation } from '@Type/type'
import * as Location from 'expo-location'
import { useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import type { LatLng } from 'react-native-maps'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'

const NavigationMap = () => {
  const mapRef = useRef<MapView>(null)
  const [location, setLocation] = useState<LatLng | null>(null)
  const [destination, setDestination] = useState<LatLng | null>(null)
  const [showDirections, setShowDirections] = useState(false)
  const [distance, setDistance] = useState<number>(0)
  const [parkingLocationsList, setParkingLocationsList] = useState<ParkingLocation[]>([])
  const [parkingList, setParkingList] = useState<ParkingInfo[]>([])
  const [nearParkingInfo, setNearParkingInfo] = useState<ParkingInfo | null>(null)
  const [distanceToParking, setDistanceToParking] = useState<number>(0)
  const [distanceToDestination, setDistanceToDestination] = useState<number>(0)

  const { csrfToken } = AuthStore.useState((s) => s)

  useEffect(() => {
    setDistance(distanceToParking + distanceToDestination)
  }, [distanceToDestination, distanceToParking])

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
  useEffect(() => {
    const areaNumber = 0.005
    // const areaNumber = 0.014
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
        setParkingLocationsList(parkingLocationList)
      }
      void getParkingList()
    } catch (error) {
      console.log(error)
    }
  }, [destination])

  useEffect(() => {
    const promiseList = parkingLocationsList.map((parking) => getParkingInfo(parking.id))

    const getParkingInfoList = async () => {
      const result = await Promise.all(promiseList)
      const parkingInfoList = parkingLocationsList.map((parkingLocation) => {
        const parkingBaseInfo = result.find(
          (parkingBaseInfo) => parkingBaseInfo.id === parkingLocation.id,
        )
        return { ...parkingBaseInfo, ...parkingLocation }
      }) as ParkingInfo[]

      setParkingList(parkingInfoList)
      if (!nearParkingInfo && parkingInfoList[0]) {
        setNearParkingInfo(parkingInfoList[0])
      }

      // setNearParkingInfo(getCheapParkingInfo(parkingInfoList)!)
    }
    void getParkingInfoList()
  }, [parkingLocationsList])

  if (!GOOGLE_MAP_API_KEY || !API_BASE_URL) return <></>
  return (
    <View className='h-full w-full'>
      <MapView
        ref={mapRef}
        className='h-full'
        initialRegion={INITIAL_POSITION}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        userLocationAnnotationTitle='現在地'
        followsUserLocation
        showsMyLocationButton={false}
        minZoomLevel={10}
        maxZoomLevel={20}
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
        {parkingList.length > 0 &&
          parkingList.map((parking) => (
            <Marker
              key={parking.id}
              coordinate={{
                latitude: parking.latitude,
                longitude: parking.longitude,
              }}
              onPress={() => setNearParkingInfo(parking)}>
              <View className='flex max-w-sm flex-row'>
                {parking.free_hour > 0 ? (
                  <ParkingIcon
                    bgColor={parking.onetime_price > 101 ? 'bg-white' : 'bg-arctic'}
                    iconColor={parking.with_roof ? '#29616C' : '#FA8C61'}
                  />
                ) : (
                  <ParkingIcon bgColor={parking.onetime_price > 101 ? 'bg-orange' : 'bg-arctic'} />
                )}
              </View>
            </Marker>
          ))}
        {/* //ルート表示 */}
        {showDirections && location && destination && nearParkingInfo && (
          <>
            <MapViewDirections
              origin={location}
              destination={{
                latitude: nearParkingInfo.latitude,
                longitude: nearParkingInfo.longitude,
              }}
              apikey={GOOGLE_MAP_API_KEY}
              strokeColor='#FA8C61' //ルートの色
              strokeWidth={4} //ルートの太さ
              onReady={(mapDirection) => setDistanceToParking(mapDirection.distance)}
              mode='BICYCLING'
              region='JP'
              language='ja'
              onError={(error) => console.error(error)}
            />
            <MapViewDirections
              origin={{
                latitude: nearParkingInfo.latitude,
                longitude: nearParkingInfo.longitude,
              }}
              destination={destination}
              apikey={GOOGLE_MAP_API_KEY}
              strokeColor='#29616C'
              strokeWidth={4}
              onReady={(mapDirection) => setDistanceToDestination(mapDirection.distance)}
              mode='WALKING'
              region='JP'
              language='ja'
              onError={(error) => console.error(error)}
            />
          </>
        )}
      </MapView>
      <View
        className='absolute bottom-10 right-4'
        onTouchStart={() => traceRoute({ location, destination, setShowDirections, mapRef })}>
        <NavigationIcon />
      </View>
      <MapSearchArea
        distance={distance}
        destination={destination}
        setDestination={setDestination}
        setShowDirections={setShowDirections}
        mapRef={mapRef}
        location={location}
        nearParkingInfo={nearParkingInfo}
      />
    </View>
  )
}

export default NavigationMap
