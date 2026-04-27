import type { User, Ride, RideRequest, Vehicle } from '../types'

export const IS_MOCK =
  !process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_URL === 'http://localhost:8080'

// ── 현재 로그인 유저 (나) ──────────────────────────────────
export const MOCK_USER: User = {
  id: 'user-001',
  kakao_id: 'kakao-001',
  name: '김지파',
  phone: '010-1234-5678',
  department: '청년1부',
  gender: 'M',
  account_number: 'ENCRYPTED_110-123-456789',
  account_bank: '카카오뱅크',
  is_driver: true,
  is_admin: false,
  status: 'APPROVED',
  no_show_count: 0,
  report_count: 0,
  created_at: '2026-01-01T00:00:00Z',
  approved_at: '2026-01-02T00:00:00Z',
}

export const MOCK_VEHICLE: Vehicle = {
  id: 'vehicle-001',
  user_id: 'user-001',
  car_number: '12가 3456',
  car_model: '아반떼',
  max_passengers: 3,
  insurance_confirmed: true,
}

// ── 다른 유저들 ───────────────────────────────────────────
const USER_2: User = {
  id: 'user-002', kakao_id: 'kakao-002', name: '박청년',
  phone: '010-2345-6789', department: '청년2부', gender: 'M',
  is_driver: true, is_admin: false, status: 'APPROVED',
  no_show_count: 0, report_count: 0, created_at: '2026-01-01T00:00:00Z',
}
const USER_3: User = {
  id: 'user-003', kakao_id: 'kakao-003', name: '이여름',
  phone: '010-3456-7890', department: '청년3부', gender: 'F',
  is_driver: true, is_admin: false, status: 'APPROVED',
  no_show_count: 0, report_count: 0, created_at: '2026-01-01T00:00:00Z',
}
const USER_4: User = {
  id: 'user-004', kakao_id: 'kakao-004', name: '최봉사',
  phone: '010-4567-8901', department: '청년4부', gender: 'M',
  is_driver: true, is_admin: false, status: 'APPROVED',
  no_show_count: 0, report_count: 0, created_at: '2026-01-01T00:00:00Z',
}

const h = (n: number) => new Date(Date.now() + n * 3_600_000).toISOString()

// ── 카풀 게시글 ───────────────────────────────────────────
// ride-001: 내가 APPROVED 신청자로 있는 게시글
// ride-002: 내 게시글 (운전자)
// ride-003: FULL 게시글, 신청 없음
// ride-004: 내가 PENDING 신청자로 있는 게시글
// ride-005: 신청 없음, 신청 가능
export const MOCK_RIDES: (Ride & { driver?: User; vehicle?: Vehicle })[] = [
  {
    id: 'ride-001',
    driver_id: 'user-002', vehicle_id: 'vehicle-002',
    origin: '광주 동구 금남로', origin_lat: 35.1468, origin_lng: 126.9184,
    destination: '서울 강남구 역삼동', destination_lat: 37.5012, destination_lng: 127.0396,
    departure_time: h(2), max_seats: 3, current_seats: 2,
    fare_per_person: 3000, status: 'OPEN', gender_preference: 'ANY',
    notice: '짐 많으신 분은 미리 알려주세요.',
    created_at: h(-1), driver: USER_2,
    vehicle: { id: 'vehicle-002', user_id: 'user-002', car_number: '34나 5678', car_model: '쏘렌토', max_passengers: 4, insurance_confirmed: true },
  },
  {
    id: 'ride-002',
    driver_id: 'user-001', vehicle_id: 'vehicle-001',
    origin: '서울 강남구 삼성동', origin_lat: 37.5140, origin_lng: 127.0568,
    destination: '광주 북구 운암동', destination_lat: 35.1731, destination_lng: 126.8881,
    departure_time: h(5), max_seats: 3, current_seats: 1,
    fare_per_person: 3000, status: 'OPEN', gender_preference: 'ANY',
    notice: '', created_at: h(-2), driver: MOCK_USER, vehicle: MOCK_VEHICLE,
  },
  {
    id: 'ride-003',
    driver_id: 'user-003', vehicle_id: 'vehicle-003',
    origin: '광주 서구 치평동', origin_lat: 35.1528, origin_lng: 126.8509,
    destination: '서울 마포구 홍대입구', destination_lat: 37.5571, destination_lng: 126.9241,
    departure_time: h(10), max_seats: 2, current_seats: 2,
    fare_per_person: 3000, status: 'FULL', gender_preference: 'SAME_ONLY',
    created_at: h(-3), driver: USER_3,
    vehicle: { id: 'vehicle-003', user_id: 'user-003', car_number: '56다 7890', car_model: '모닝', max_passengers: 2, insurance_confirmed: true },
  },
  {
    id: 'ride-004',
    driver_id: 'user-004', vehicle_id: 'vehicle-004',
    origin: '광주 남구 봉선동', origin_lat: 35.1269, origin_lng: 126.9152,
    destination: '서울 송파구 잠실동', destination_lat: 37.5133, destination_lng: 127.1000,
    departure_time: h(24), max_seats: 4, current_seats: 0,
    fare_per_person: 3000, status: 'OPEN', gender_preference: 'ANY',
    notice: '새벽 출발이라 졸음 주의해 주세요!',
    created_at: h(-0.5), driver: USER_4,
    vehicle: { id: 'vehicle-004', user_id: 'user-004', car_number: '78라 9012', car_model: '그랜저', max_passengers: 4, insurance_confirmed: true },
  },
  {
    id: 'ride-005',
    driver_id: 'user-002', vehicle_id: 'vehicle-002',
    origin: '광주 광산구 수완동', origin_lat: 35.1916, origin_lng: 126.8132,
    destination: '서울 서초구 방배동', destination_lat: 37.4815, destination_lng: 126.9969,
    departure_time: h(48), max_seats: 3, current_seats: 0,
    fare_per_person: 3000, status: 'OPEN', gender_preference: 'ANY',
    created_at: h(-0.2), driver: USER_2,
    vehicle: { id: 'vehicle-002', user_id: 'user-002', car_number: '34나 5678', car_model: '쏘렌토', max_passengers: 4, insurance_confirmed: true },
  },
]

// ── 내 신청 내역 ──────────────────────────────────────────
export const MOCK_MY_REQUESTS: RideRequest[] = [
  {
    id: 'req-001', ride_id: 'ride-001', passenger_id: 'user-001',
    pickup_location: '광주 동구 충장로', pickup_lat: 35.1483, pickup_lng: 126.9176,
    status: 'APPROVED', created_at: h(-0.5), approved_at: h(-0.3),
  },
  {
    id: 'req-002', ride_id: 'ride-004', passenger_id: 'user-001',
    pickup_location: '광주 남구 봉선2동', pickup_lat: 35.1250, pickup_lng: 126.9140,
    status: 'PENDING', created_at: h(-0.1),
  },
]

// ── 내 게시글에 들어온 신청들 ─────────────────────────────
export const MOCK_REQUESTS_TO_MY_RIDE: (RideRequest & { passenger?: User })[] = [
  {
    id: 'req-003', ride_id: 'ride-002', passenger_id: 'user-003',
    pickup_location: '서울 강남구 선릉역', pickup_lat: 37.5044, pickup_lng: 127.0491,
    status: 'APPROVED', created_at: h(-1.5), approved_at: h(-1.2),
    passenger: USER_3,
  },
  {
    id: 'req-004', ride_id: 'ride-002', passenger_id: 'user-004',
    pickup_location: '서울 강남구 삼성역', pickup_lat: 37.5088, pickup_lng: 127.0630,
    status: 'PENDING', created_at: h(-0.8),
    passenger: USER_4,
  },
]
