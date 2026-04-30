import type { User, Ride, RideRequest, Vehicle } from '../types'

/** NEXT_PUBLIC_API_URL 미설정 시 목업 모드로 동작 */
export const IS_MOCK =
  !process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_URL === 'http://localhost:8080'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

// ── 토큰 관리 ──────────────────────────────────────────────
function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('ppool_token')
}

export function setToken(token: string) {
  localStorage.setItem('ppool_token', token)
}

export function clearToken() {
  localStorage.removeItem('ppool_token')
}

function authHeaders(): Record<string, string> {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ── 공통 fetch 래퍼 ───────────────────────────────────────
async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}/api${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401) {
    clearToken()
    if (typeof window !== 'undefined') window.location.href = '/login'
    throw new Error('인증이 만료되었습니다.')
  }

  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText)
    throw new Error(msg || `HTTP ${res.status}`)
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

// ── 요청/응답 타입 ─────────────────────────────────────────
export interface RideCreateRequest {
  origin: string
  origin_lat: number
  origin_lng: number
  destination: string
  destination_lat: number
  destination_lng: number
  departure_time: string
  max_seats: number
  gender_preference: 'ANY' | 'SAME_ONLY'
  notice?: string
}

export interface RideRequestCreate {
  pickup_location: string
  pickup_lat: number
  pickup_lng: number
}

export interface RideFilter {
  gender?: string
  available?: boolean
  page?: number
  size?: number
}

// ── API 클라이언트 ─────────────────────────────────────────
export const api = {

  // 인증
  auth: {
    /** 시온로그인 고유번호+비밀번호 → JWT 발급 */
    zauthLogin: (zauthId: string, password: string) =>
      request<{ token: string; user: User }>('POST', '/auth/zauth', { zauthId, password }),

    /** 최초 로그인 셋업: 성별 저장 */
    setup: (gender: 'M' | 'F' | 'N') =>
      request<User>('POST', '/auth/setup', { gender }),
  },

  // 유저
  users: {
    /** 내 프로필 조회 */
    me: () => request<User>('GET', '/users/me'),

    /** 내 정보 수정 */
    updateMe: (data: Partial<Pick<User, 'name' | 'department' | 'phone'>>) =>
      request<User>('PATCH', '/users/me', data),

    /** 차량 등록 */
    addVehicle: (data: Omit<Vehicle, 'id' | 'user_id'>) =>
      request<Vehicle>('POST', '/users/me/vehicle', data),
  },

  // 게시글
  rides: {
    /** 게시글 목록 (필터) */
    list: (params?: RideFilter) => {
      const qs = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : ''
      return request<Ride[]>('GET', `/rides${qs}`)
    },

    /** 게시글 단건 조회 */
    get: (id: string) => request<Ride>('GET', `/rides/${id}`),

    /** 게시글 등록 */
    create: (data: RideCreateRequest) => request<Ride>('POST', '/rides', data),

    /** 게시글 수정 */
    update: (id: string, data: Partial<RideCreateRequest>) =>
      request<Ride>('PATCH', `/rides/${id}`, data),

    /** 게시글 삭제 */
    delete: (id: string) => request<void>('DELETE', `/rides/${id}`),

    /** 출발 버튼 */
    start: (id: string) => request<void>('POST', `/rides/${id}/start`),

    /** 완료 처리 */
    complete: (id: string) => request<void>('POST', `/rides/${id}/complete`),
  },

  // 탑승 신청
  requests: {
    /** 탑승 신청 */
    create: (rideId: string, data: RideRequestCreate) =>
      request<RideRequest>('POST', `/rides/${rideId}/requests`, data),

    /** 승인 (운전자) */
    approve: (id: string) => request<void>('PATCH', `/requests/${id}/approve`),

    /** 거부 (운전자) */
    reject: (id: string) => request<void>('PATCH', `/requests/${id}/reject`),

    /** 취소 (탑승자) */
    cancel: (id: string) => request<void>('DELETE', `/requests/${id}`),
  },

  // 신고
  reports: {
    create: (data: { reported_id: string; ride_id: string; reason: string; description?: string }) =>
      request<void>('POST', '/reports', data),
  },

  // 관리자
  admin: {
    users: () => request<User[]>('GET', '/admin/users'),
    approveUser: (id: string) => request<void>('PATCH', `/admin/users/${id}/approve`),
    rejectUser: (id: string) => request<void>('PATCH', `/admin/users/${id}/reject`),
    banUser: (id: string, days?: number) => request<void>('PATCH', `/admin/users/${id}/ban`, { days }),
    rides: () => request<Ride[]>('GET', '/admin/rides'),
    exportUsers: () => request<Blob>('GET', '/admin/export/users'),
    exportRides: () => request<Blob>('GET', '/admin/export/rides'),
  },
}
