# PPOOL 개발 기획서

> **작성 기준일**: 2026-04-28  
> **현재 버전**: v0.2.0 (Next.js 15 + Spring Boot 3 마이그레이션 완료)  
> **배포 URL**: https://k778851.github.io/ppool/  
> **저장소**: https://github.com/k778851/ppool

---

## 1. 서비스 개요

### 1.1 목적
지파 청년부 구성원 전용 내부 카풀 매칭 웹 서비스.  
인당 **3,000원 정액 분담금** (유류비 분담 성격, 유상운송 아님)으로 운영하며,  
**zauth 고유번호 로그인 후 관리자 수동 승인** 구조로 비구성원을 원천 차단한다.

### 1.2 핵심 원칙
- 영리 목적 아님 — 분담금은 3,000원 고정, 임의 증액 불가
- 폐쇄형 커뮤니티 — zauth 로그인(고유번호+비밀번호) 후 관리자 승인 필수
- 개인정보 최소화 — 타 회원에게는 이름·부서·성별만 노출
- 법적 안전장치 — 서비스 이용약관·개인정보처리방침·위치정보 이용약관 3종

---

## 2. 기술 스택

| 구분 | 기술 | 비고 |
|---|---|---|
| **Frontend** | Next.js 15 App Router + TypeScript | `'use client'` 컴포넌트 |
| **상태 관리** | React Context + @tanstack/react-query | 서버 상태 캐싱 |
| **폼 검증** | react-hook-form + zod | 회원가입·로그인 폼 |
| **Backend** | Spring Boot 3.3 (Java 17) | REST API |
| **ORM / DB** | Spring Data JPA + PostgreSQL | |
| **인증** | zauth (고유번호 + 비밀번호) → Spring Boot JWT | 자체 로그인 시스템 |
| **DB 마이그레이션** | Flyway | `db/migration/V*.sql` |
| **지도** | 카카오맵 API | |
| **배포 (Frontend)** | GitHub Pages (`DEPLOY_TARGET=ghpages`) | 정적 export |
| **배포 (Backend)** | 별도 서버 (환경변수 기반) | |
| **폰트** | Pretendard (본문), Gaegu (히어로 강조) | |

---

## 3. 프로젝트 구조

```
ppool/
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── layout.tsx             # Root layout (Providers)
│   │   ├── page.tsx               # / → auth 상태 따라 redirect
│   │   ├── (main)/                # Route group — AuthGuard 적용
│   │   │   ├── layout.tsx         # APPROVED 상태 확인, 미승인 시 redirect
│   │   │   ├── feed/page.tsx      # 메인 피드
│   │   │   ├── rides/[id]/page.tsx
│   │   │   ├── rides/new/page.tsx
│   │   │   └── my/page.tsx
│   │   ├── login/page.tsx         # zauth 로그인 (고유번호 + 비밀번호)
│   │   ├── setup/page.tsx         # 최초 로그인 시 성별·차량 정보 입력 ★
│   │   ├── pending/page.tsx
│   │   ├── banned/page.tsx
│   │   └── admin/page.tsx
│   ├── components/
│   │   ├── layout/                # AuthGuard, BottomNav, Header, PageLayout
│   │   ├── ride/                  # RideCard
│   │   └── admin/                 # AdminUsers, AdminRides, AdminReports, AdminBackup
│   ├── hooks/useAuth.ts           # JWT 기반 인증 상태
│   ├── stores/authStore.ts        # AuthContext
│   ├── lib/
│   │   ├── api.ts                 # Java REST API 클라이언트 (IS_MOCK 패턴)
│   │   └── mock.ts                # 목업 데이터
│   └── types/index.ts
│
└── backend/src/main/java/com/ppool/
    ├── entity/         User, Vehicle, Ride, RideRequest, Report
    ├── dto/            AuthDto, UserDto, RideDto, RideRequestDto, VehicleDto
    ├── repository/     JPA repositories (5종)
    ├── service/        AuthService, UserService, RideService, RideRequestService, AdminService
    ├── controller/     AuthController, UserController, RideController, RequestController, ReportController, AdminController
    ├── security/       JwtProvider, JwtAuthFilter, SecurityConfig
    ├── config/         WebConfig (CORS)
    ├── exception/      GlobalExceptionHandler
    └── util/           (암호화 유틸 불필요 — 계좌 미보관)
```

---

## 4. 디자인 시스템

### 4.1 컬러 토큰 (`src/styles.css`)

| 토큰 | 값 | 용도 |
|---|---|---|
| `--blue-hero` | `#1A38F5` | 히어로 헤더, 내 게시글 강조 |
| `--mint` | `#7EF0E4` | 메인 액센트, 확정 배지 |
| `--driver` | `#FF8A3D` | 운전자 배지·버튼·강조 |
| `--rider` | `#2B6BFF` | 탑승자 배지·버튼 |
| `--warn` | `#FF4A4A` | 경고·신고 |
| `--radius-sm/md/lg/xl` | `10/14/20/28px` | 카드·버튼 radius |

### 4.2 성별 배지 색상
| 성별 | 배경 | 텍스트 |
|---|---|---|
| 남성 (M) | `#E4EEFF` | `#1A38F5` |
| 여성 (F) | `#FFE4EF` | `#C0185A` |

### 4.3 유틸리티 클래스
- `.tap` — 터치 피드백 (scale + opacity)
- `.card` — 기본 카드 스타일
- `.noscroll` — 스크롤바 숨김
- `.hand` — Gaegu 폰트 적용
- `.t-mono` — 모노스페이스

---

## 5. 화면 구성 및 구현 상태

| # | 경로 | 화면명 | UI | 백엔드 연동 |
|---|---|---|---|---|
| 1 | `/login` | zauth 로그인 (고유번호+비밀번호) | ⬜ 미구현 | ⬜ 미연동 |
| 2 | `/setup` | 최초 로그인 — 성별·차량 정보 입력 ★ | ⬜ 미구현 | ⬜ 미연동 |
| 3 | `/pending` | 승인 대기 안내 | ✅ 완료 | ⬜ 미연동 |
| 4 | `/banned` | 이용 정지 안내 | ✅ 완료 | ⬜ 미연동 |
| 5 | `/feed` | 메인 피드 (게시글 카드 리스트) | ✅ 완료 | ⬜ 미연동 |
| 6 | `/rides/new` | 게시글 등록 | ✅ 완료 | ⬜ 미연동 |
| 7 | `/rides/:id` | 게시글 상세 | ✅ 완료 | ⬜ 미연동 |
| 8 | `/my` | 마이페이지 | ✅ 완료 | ⬜ 미연동 |
| 9 | `/admin` | 관리자 | ✅ 완료 | ⬜ 미연동 |
| 10 | `/terms` 외 | 약관 3종 | ⬜ 내용 없음 | — |

> ★ `/setup` 화면은 신규 구현 필요. 기존 `/signup`·`/auth/callback` 화면은 삭제 대상.

---

## 6. 데이터 타입 정의

### 6.1 User
```typescript
interface User {
  id: string
  zauth_id: string           // zauth 고유번호 (unique key)
  name: string               // zauth에서 수신
  department: string         // zauth에서 수신
  phone?: string             // zauth에서 수신 (있을 경우)
  gender: 'M' | 'F' | 'N'  // 최초 로그인 시 직접 입력 ★
  is_driver: boolean
  is_admin: boolean
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'BANNED'
  no_show_count: number
  report_count: number
  banned_until?: string
  created_at: string
  approved_at?: string
}
```

> `kakao_id` 제거 → `zauth_id` 로 대체.  
> `name`, `department`, `phone` 은 zauth API 응답에서 자동 수신하므로 사용자가 직접 입력하지 않음.  
> `gender` 는 zauth에 저장되지 않으므로 최초 로그인 시 필수 입력.

### 6.2 Vehicle (차량)
```typescript
interface Vehicle {
  id: string
  user_id: string
  plate_number: string        // 차량번호 (최초 로그인 시 입력) ★
  car_model: string
  max_seats: number
  insurance_verified: boolean
  license_verified: boolean
  non_commercial_confirmed: boolean
}
```

> 차량 정보는 zauth에 없으므로, 운전자로 등록하려는 경우 최초 로그인 시 또는 마이페이지에서 직접 입력.

### 6.3 Ride (게시글)
```typescript
interface Ride {
  id: string
  driver_id: string
  vehicle_id: string
  origin: string
  origin_lat: number; origin_lng: number
  destination: string
  destination_lat: number; destination_lng: number
  departure_time: string
  max_seats: number
  fare_per_person: number    // 고정값 3000
  status: 'OPEN' | 'FULL' | 'STARTED' | 'COMPLETED' | 'CANCELLED'
  gender_preference: 'ANY' | 'SAME_ONLY'
  notice?: string
}
```

### 6.4 RideRequest (탑승 신청)
```typescript
interface RideRequest {
  id: string
  ride_id: string
  rider_id: string
  pickup_location: string
  pickup_lat: number; pickup_lng: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'NO_SHOW' | 'COMPLETED'
  created_at: string
}
```

---

## 7. 인증 플로우

### 7.1 로그인 플로우

```
[사용자] /login 에서 고유번호 + 비밀번호 입력
    ↓
POST /api/auth/zauth { zauthId, password }
    ↓
Spring Boot → zauth API 호출 → 사용자 정보 수신 (name, department, phone)
    ↓
ppool DB의 users 테이블 조회 (by zauth_id)
    ├── 레코드 없음 (최초 로그인)
    │       → users에 신규 레코드 생성 (status=PENDING, gender 미설정)
    │       → JWT 발급 후 프론트엔드로 반환
    │       → 프론트: /setup 으로 이동 (성별 + 선택적 차량 정보 입력)  ★
    │
    ├── status = PENDING, gender 미설정 → /setup
    ├── status = PENDING, gender 설정 완료 → /pending (관리자 승인 대기)
    ├── status = APPROVED → /feed (메인 피드)
    ├── status = BANNED → /banned
    └── status = REJECTED → /login (오류 메시지)

[관리자] /admin → 회원관리 → PENDING 목록 → 승인/거부
    ↓
users.status = 'APPROVED' / 'REJECTED' 업데이트
```

### 7.2 최초 로그인 셋업 (`/setup`) ★

최초 로그인 후 `/setup` 화면에서 다음 정보를 입력:

**1단계 — 필수 정보 (모든 신규 사용자)**
| 항목 | 설명 |
|---|---|
| 성별 | M / F / N 선택 (성별 매칭 기능에 사용) |
| 약관 동의 | 이용약관·개인정보처리방침 (필수), 위치정보 이용약관 (선택) |

**2단계 — 운전자 선택 등록 (운전 의사가 있는 경우)**
| 항목 | 설명 |
|---|---|
| 차량번호 | 예) 12가 3456 |
| 차종 | 예) 아반떼 |
| 최대 탑승 인원 | 1~8명 |
| 보험 가입 확인 체크 | 필수 |
| 운전면허 유효 확인 체크 | 필수 |
| 비영리 목적 확인 체크 | 필수 |

> 2단계는 "나중에 등록하기" 버튼으로 건너뛸 수 있음. 이후 마이페이지 → 운전자 등록에서 추가 가능.  
> 1단계 완료 시 status는 여전히 PENDING → 관리자 승인 대기로 이동.

### 7.3 zauth 연동 방식

```
zauth API (내부 시스템)
  - 엔드포인트: 협의 필요 (예: https://zauth.internal/api/verify)
  - 요청: { zauthId: string, password: string }
  - 응답: { success: boolean, name: string, department: string, phone?: string }
  - 인증 실패 시: { success: false, message: string }
```

> Spring Boot `AuthService.zauthLogin()` 에서 WebClient로 zauth API 호출.  
> zauth API 엔드포인트·인증 방식은 실제 시스템 스펙 확인 후 구현.

### 7.4 IS_MOCK 패턴
```typescript
// NEXT_PUBLIC_API_URL 미설정 시 목업 모드
export const IS_MOCK = !process.env.NEXT_PUBLIC_API_URL
```

---

## 8. 핵심 비즈니스 규칙

| 규칙 | 상세 | 구현 위치 |
|---|---|---|
| 분담금 고정 | `fare_per_person = 3000` 수정 불가 | DB + UI readonly |
| 노쇼 3회 | `no_show_count >= 3` → `banned_until = +30일` | RideRequestService |
| 취소 정책 | 30분 전: 자유취소 / 10~30분: 취소 기록 / 10분 이내: 노쇼 | RideRequestService.cancel() |
| 출발 자동 취소 | 출발 시각 +5분 내 [출발] 미클릭 → CANCELLED | RideService @Scheduled |
| 출발 시각 제약 | 현재 시각 +10분 이상, +7일 이내 | RideService.createRide() |
| 동시 신청 처리 | 트랜잭션 원자 처리, FIFO | RideRequestService @Transactional |
| 성별 매칭 | SAME_ONLY 시 동성만 신청 가능 | RideRequestService.createRequest() |

---

## 9. DB 스키마 (Flyway V1__init.sql)

```sql
CREATE TABLE users (
  id              VARCHAR(36) PRIMARY KEY,
  zauth_id        VARCHAR(50) UNIQUE NOT NULL,  -- ★ kakao_id 대신 zauth_id
  name            VARCHAR(50) NOT NULL,
  phone           VARCHAR(100),
  department      VARCHAR(100),
  gender          CHAR(1),                      -- ★ 최초 로그인 시 입력 (시온로그인에 없음)
  is_driver       BOOLEAN NOT NULL DEFAULT FALSE,
  is_admin        BOOLEAN NOT NULL DEFAULT FALSE,
  status          VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  no_show_count   INT NOT NULL DEFAULT 0,
  report_count    INT NOT NULL DEFAULT 0,
  banned_until    TIMESTAMP,
  created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
  approved_at     TIMESTAMP
);

CREATE TABLE vehicles (
  id                          VARCHAR(36) PRIMARY KEY,
  user_id                     VARCHAR(36) UNIQUE NOT NULL REFERENCES users(id),
  plate_number                VARCHAR(20) NOT NULL,  -- ★ 최초 로그인 시 입력
  car_model                   VARCHAR(50) NOT NULL,
  max_seats                   INT NOT NULL,
  insurance_verified          BOOLEAN NOT NULL DEFAULT FALSE,
  license_verified            BOOLEAN NOT NULL DEFAULT FALSE,
  non_commercial_confirmed    BOOLEAN NOT NULL DEFAULT FALSE
);

-- rides, ride_requests, reports 테이블은 기존과 동일
```

---

## 10. API 엔드포인트

| Method | 경로 | 설명 |
|---|---|---|
| POST | `/api/auth/zauth` | zauth 고유번호+비밀번호 로그인 → JWT 발급 ★ |
| POST | `/api/auth/setup` | 최초 로그인 셋업 (성별·약관 저장) ★ |
| GET | `/api/users/me` | 내 프로필 조회 |
| PATCH | `/api/users/me` | 내 정보 수정 |
| POST | `/api/users/me/vehicle` | 차량 등록 (최초 셋업 또는 마이페이지) |
| GET | `/api/rides` | 게시글 목록 (필터: 성별, 잔여석) |
| POST | `/api/rides` | 게시글 등록 |
| PATCH | `/api/rides/:id` | 게시글 수정 |
| DELETE | `/api/rides/:id` | 게시글 삭제 |
| POST | `/api/rides/:id/start` | 출발 버튼 |
| POST | `/api/rides/:id/complete` | 완료 처리 |
| POST | `/api/rides/:id/requests` | 탑승 신청 |
| PATCH | `/api/requests/:id/approve` | 신청 승인 (운전자) |
| PATCH | `/api/requests/:id/reject` | 신청 거부 (운전자) |
| DELETE | `/api/requests/:id` | 신청 취소 (탑승자) |
| POST | `/api/reports` | 신고 접수 |
| GET | `/api/admin/users` | 회원 목록 |
| PATCH | `/api/admin/users/:id/approve` | 회원 승인 |
| PATCH | `/api/admin/users/:id/reject` | 회원 거부 |
| PATCH | `/api/admin/users/:id/ban` | 회원 정지 |
| GET | `/api/admin/rides` | 전체 게시글 |

---

## 11. 남은 개발 작업 (Phase 2)

### 11.1 백엔드 연동 필수 작업

| 우선순위 | 작업 | 설명 |
|---|---|---|
| 🔴 HIGH | zauth API 스펙 확인 | 엔드포인트·인증 방식·응답 필드 협의 |
| 🔴 HIGH | AuthService.zauthLogin() 구현 | zauth WebClient 호출, JWT 발급 |
| 🔴 HIGH | `/setup` 화면 구현 (프론트) | 성별 선택 + 약관 동의 + 선택적 차량 등록 |
| 🔴 HIGH | `/login` 화면 교체 | 카카오 버튼 → 고유번호+비밀번호 폼 |
| 🔴 HIGH | PostgreSQL 서버 구성 + Flyway 실행 | DB 스키마 적용 |
| 🔴 HIGH | 카카오맵 API 키 발급 | 지도 연동 |
| 🟡 MED | 전체 API 연동 | mock → real API (IS_MOCK 해제) |
| 🟡 MED | 노쇼 정책 자동 처리 | RideRequestService 로직 검증 |
| 🟡 MED | 출발 자동 취소 스케줄러 | RideService @Scheduled 검증 |
| 🟢 LOW | 약관 페이지 내용 채우기 | `/terms`, `/privacy`, `/location-terms` |
| 🟢 LOW | 실시간 알림 | Web Push (Service Worker) — 2차 |
| 🟢 LOW | PWA 설정 | manifest.json, Service Worker |

### 11.2 환경변수 설정

**Frontend (`.env.local`)**
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_KAKAO_MAP_KEY=카카오맵API키
NEXT_PUBLIC_ENCRYPT_KEY=AES256암호화키
```

**Backend (환경변수 또는 `.env`)**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ppool
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=최소256비트랜덤문자열
ENCRYPT_KEY=32바이트암호화키
ZAUTH_API_URL=https://zauth.internal/api   # ★ 실제 URL로 변경
ZAUTH_API_KEY=zauthApiKey                  # ★ zauth 연동 키 (필요시)
FRONTEND_URL=https://k778851.github.io
```

---

## 12. 배포 현황

| 환경 | URL | 용도 |
|---|---|---|
| **프리뷰 (현재)** | https://k778851.github.io/ppool/ | UI 확인용, mock 데이터 |
| **운영 (예정)** | 도메인 구입 후 별도 서버 | 실서비스 |

### 배포 명령어
```bash
# Frontend (GitHub Pages 정적 export)
DEPLOY_TARGET=ghpages npm run build
npm run deploy

# Backend
cd backend && mvn package -DskipTests
# JAR 실행: java -jar target/ppool-backend-0.1.0.jar
```

---

## 13. 출시 전 필수 체크리스트

- [ ] zauth API 엔드포인트·인증 방식 확인 및 연동
- [ ] 카카오맵 API 키 발급
- [ ] PostgreSQL 서버 구성 + Flyway 마이그레이션 실행
- [ ] JWT_SECRET, ENCRYPT_KEY 안전한 키 생성
- [ ] 관리자 계정 생성 (is_admin = true, 직접 DB INSERT)
- [ ] 부서 목록 사전 확인 (청년1~8부 외 추가 여부)
- [ ] `/setup` 화면 완성 및 최초 로그인 플로우 E2E 테스트
- [ ] 약관 3종 법률 전문가 검토 완료
- [ ] 도메인 구입·DNS·HTTPS 설정
- [ ] 개인정보처리방침 페이지 내용 게시
- [ ] 노쇼·취소 정책 시나리오 테스트
- [ ] 모바일 기기 실기기 QA (iOS Safari, Android Chrome)

---

## 14. 법적 필수 사항

- UI 전체에서 **"요금"** 대신 **"분담금"** 사용
- `/setup` 최초 로그인 시 약관 **3종 개별 체크박스** 필수
  - 이용약관 (필수)
  - 개인정보처리방침 (필수)
  - 위치정보 이용약관 (선택)
- 운전자 등록 시 **3종 확인 체크** 필수 (`/setup` 2단계 또는 마이페이지)
  - 자동차 보험 가입 확인
  - 운전면허 유효 확인
  - 비영리 목적 확인
- 약관 초안: `Docs/PPOOL_약관초안.md` — **서비스 배포 전 법률 전문가 검토 필수**
