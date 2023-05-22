import { Dimensions } from 'react-native'
import type { MapStyleElement } from 'react-native-maps'

export const GOOGLE_MAP_API_KEY = process.env.GOOGLE_MAP_API_KEY
export const GOOGLE_WEB_CLIENT_ID = process.env.GOOGLE_WEB_CLIENT_ID
export const API_BASE_URL = process.env.API_BASE_URL

export const mapStyle: MapStyleElement[] = [
  {
    featureType: 'administrative',
    elementType: 'all',
    stylers: [
      {
        color: '#ff0000',
      },
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'landscape',
    elementType: 'all',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'landscape',
    elementType: 'labels.text',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'landscape.natural',
    elementType: 'all',
    stylers: [
      {
        visibility: 'simplified',
      },
      {
        color: '#e4f0ee',
      },
      {
        gamma: '0.59',
      },
      {
        lightness: '3',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'all',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'all',
    stylers: [
      {
        visibility: 'on',
      },
      {
        color: '#ff0000',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'all',
    stylers: [
      {
        color: '#ffffff',
      },
    ],
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'all',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'all',
    stylers: [
      {
        color: '#fa8c61',
      },
      {
        lightness: '59',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'all',
    stylers: [
      {
        color: '#ffffff',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'all',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'all',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'all',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#0acdf3',
      },
      {
        gamma: '0.96',
      },
      {
        lightness: '71',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
]

// 地図の初期設定
const { width, height } = Dimensions.get('window')
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.02
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
export const INITIAL_POSITION = {
  latitude: 34.6623621604858,
  longitude: 135.50213718786836,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
}
