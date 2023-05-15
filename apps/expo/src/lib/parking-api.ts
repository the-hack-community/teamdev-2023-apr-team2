import { API_BASE_URL } from '../const/const'
import type { ParkingBaseInfo, ParkingLocation } from '../type/type'

export const getParkingListByLatLng = async ({
  minLat,
  maxLat,
  minLng,
  maxLng,
}: {
  minLat: number
  maxLat: number
  minLng: number
  maxLng: number
}): Promise<ParkingLocation[]> => {
  const body = JSON.stringify({
    latitude: { min: minLat, max: maxLat },
    longitude: { min: minLng, max: maxLng },
  })
  const response = await fetch(`${API_BASE_URL}/location`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  })
  if (!response.ok) throw new Error(response.statusText)
  return (await response.json()) as ParkingLocation[]
}

export const getParkingInfo = async (id: number): Promise<ParkingBaseInfo> => {
  const response = await fetch(`${API_BASE_URL}/parking/${id}`)
  if (!response.ok) throw new Error(response.statusText)
  return (await response.json()) as ParkingBaseInfo
}
