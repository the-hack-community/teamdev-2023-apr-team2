export type ParkingBaseInfo = {
  id: number
  name: string
  address: string
  usage_time: string
  capacity: number
  multi_storey: boolean
  with_roof: boolean
  free_hour: number
  onetime_price: number
}

export type ParkingLocation = {
  id: number
  latitude: number
  longitude: number
}

export type ParkingInfo = ParkingLocation & ParkingBaseInfo

export type UserInfo = {
  id: string
  name: string
}
