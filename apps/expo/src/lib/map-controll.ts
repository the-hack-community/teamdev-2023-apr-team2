import type MapView from 'react-native-maps'
import type { LatLng } from 'react-native-maps'

// 現在地・目的地の表示を中央にする
export const traceRoute = ({
  location,
  destination,
  setShowDirections,
  mapRef,
  edgePaddingValue = 40,
}: {
  location: LatLng | null
  destination: LatLng | null
  setShowDirections: (show: boolean) => void
  mapRef: React.RefObject<MapView>
  edgePaddingValue?: number
}) => {
  const edgePadding = {
    top: edgePaddingValue === 0 ? 0 : 200,
    right: edgePaddingValue,
    bottom: edgePaddingValue,
    left: edgePaddingValue,
  }
  if (location && destination) {
    setShowDirections(true)
    mapRef.current?.fitToCoordinates([location, destination], { edgePadding })
  }
}
