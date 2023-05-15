import type MapView from 'react-native-maps'
import type { LatLng } from 'react-native-maps'

// 現在地・目的地の表示を中央にする
export const traceRoute = ({
  location,
  destination,
  setShowDirections,
  mapRef,
}: {
  location: LatLng | null
  destination: LatLng | null
  setShowDirections: (show: boolean) => void
  mapRef: React.RefObject<MapView>
}) => {
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
