export type UserStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'BANNED'
export type Gender = 'M' | 'F' | 'N'
export type RideType = 'CARPOOL' | 'TAXI'
export type RideStatus = 'OPEN' | 'FULL' | 'STARTED' | 'COMPLETED' | 'CANCELLED'
export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'NO_SHOW' | 'COMPLETED'
export type GenderPreference = 'ANY' | 'SAME_ONLY'
export type ReportReason = 'NO_SHOW' | 'RUDE' | 'UNSAFE' | 'FARE' | 'OTHER'

export interface User {
  id: string
  zauth_id: string
  name: string
  phone: string
  department: string
  gender: Gender | null   // null = 최초 로그인 후 /setup 미완료 상태
  is_driver: boolean
  is_admin: boolean
  status: UserStatus
  no_show_count: number
  report_count: number
  banned_until?: string
  created_at: string
  approved_at?: string
}

export interface Vehicle {
  id: string
  user_id: string
  car_number: string
  car_model?: string
  max_passengers: number
  insurance_confirmed: boolean
}

export interface Ride {
  id: string
  ride_type: RideType          // CARPOOL | TAXI
  driver_id: string            // 카풀 운전자 또는 택시합승 모집자
  vehicle_id: string | null    // TAXI 타입은 null
  origin: string
  origin_lat: number
  origin_lng: number
  destination: string
  destination_lat: number
  destination_lng: number
  waypoints?: { address: string; lat: number; lng: number }[]
  departure_time: string
  max_seats: number
  current_seats: number
  fare_per_person: number      // CARPOOL=3000 고정 / TAXI=예상 택시비 n분의 1 (0=미설정)
  status: RideStatus
  gender_preference: GenderPreference
  notice?: string
  created_at: string
  started_at?: string
  completed_at?: string
  driver?: User
  vehicle?: Vehicle
}

export interface RideRequest {
  id: string
  ride_id: string
  passenger_id: string
  pickup_location: string
  pickup_lat: number
  pickup_lng: number
  status: RequestStatus
  created_at: string
  approved_at?: string
  cancelled_at?: string
  passenger?: User
}

export interface Report {
  id: string
  reporter_id: string
  reported_id: string
  ride_id: string
  reason: ReportReason
  description?: string
  status: 'PENDING' | 'REVIEWED' | 'REJECTED'
  created_at: string
}
