# PPOOL 개발 기획서

> **작성 기준일**: 2026-04-27  
> **현재 버전**: v0.1.0 MVP (UI 완성, 백엔드 연동 전)  
> **배포 URL**: https://k778851.github.io/ppool/  
> **저장소**: https://github.com/k778851/ppool

---

## 1. 서비스 개요

### 1.1 목적
지파 청년부 구성원 전용 내부 카풀 매칭 웹 서비스.  
인당 **3,000원 정액 분담금** (유류비 분담 성격, 유상운송 아님)으로 운영하며,  
카카오 로그인 후 **관리자 수동 승인** 구조로 비구성원을 원천 차단한다.

### 1.2 핵심 원칙
- 영리 목적 아님 — 분담금은 3,000원 고정, 임의 증액 불가
- 폐쇄형 커뮤니티 — 카카오 로그인 후 관리자 승인 필수
- 개인정보 최소화 — 타 회원에게는 이름·부서·성별만 노출
- 법적 안전장치 — 서비스 이용약관·개인정보처리방침·위치정보 이용약관 3종

---

## 2. 기술 스택

| 구분 | 기술 | 비고 |
|---|---|---|
| **Frontend** | React 19 + TypeScript + Vite 8 | PWA 적용 예정 |
| **라우터** | React Router v7 (HashRouter) | GitHub Pages SPA 대응 |
| **상태 관리** | React Context + @tanstack/react-query | 서버 상태 캐싱 |
| **폼 검증** | react-hook-form + zod | 회원가입 폼 |
| **Backend / DB** | Supabase (PostgreSQL + Auth + Realtime + RLS) | 현재 미연동 |
| **인증** | 카카오 OAuth → Supabase Auth | 현재 미연동 |
| **지도** | 카카오맵 API | 현재 placeholder |
| **배포** | GitHub Pages (gh-pages 브랜치) | 프리뷰용 |
| **운영 배포** | Vercel (예정) | |
| **암호화** | crypto-js (AES-256) | 계좌번호 암호화용 |
| **폰트** | Pretendard (본문), Gaegu (히어로 강조) | |

---

## 3. 프로젝트 구조

```
ppool/
├── public/
│   ├── logo.png            # PPOOL 버블폰트 로고
│   └── favicon.svg
├── src/
│   ├── App.tsx             # 라우터 설정
│   ├── main.tsx
│   ├── types/index.ts      # 전체 TypeScript 타입 정의
│   ├── lib/
│   │   ├── supabase.ts     # Supabase 클라이언트
│   │   ├── mock.ts         # 목업 데이터 (IS_MOCK 패턴)
│   │   ├── utils.ts        # 날짜 포맷 등 유틸
│   │   └── crypto.ts       # AES-256 암호화
│   ├── stores/
│   │   └── authStore.ts    # AuthContext
│   ├── hooks/
│   │   └── useAuth.ts      # 인증 훅 (Supabase / Mock 분기)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AuthGuard.tsx     # 인증 라우트 가드
│   │   │   ├── BottomNav.tsx     # 하단 네비게이션 (5탭)
│   │   │   ├── Header.tsx
│   │   │   └── PageLayout.tsx
│   │   ├── ride/
│   │   │   └── RideCard.tsx      # 게시글 카드 컴포넌트
│   │   └── admin/
│   │       ├── AdminUsers.tsx
│   │       ├── AdminReports.tsx
│   │       ├── AdminRides.tsx
│   │       └── AdminBackup.tsx
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── AuthCallbackPage.tsx
│   │   ├── SignupPage.tsx
│   │   ├── PendingPage.tsx
│   │   ├── BannedPage.tsx
│   │   ├── MainPage.tsx          # 메인 피드
│   │   ├── RideDetailPage.tsx    # 게시글 상세
│   │   ├── RideNewPage.tsx       # 게시글 등록
│   │   ├── MyPage.tsx            # 마이페이지
│   │   └── admin/AdminPage.tsx
│   ├── index.css           # 컴포넌트별 스타일
│   └── styles.css          # 디자인 토큰
└── Docs/
    ├── screenshots/        # 화면 캡처 5종
    ├── PPOOL.md
    ├── PPOOL_MVP_상세명세서.md
    └── PPOOL_약관초안.md
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
| `--ink-100` ~ `--ink-5` | 단계별 | 텍스트·배경 계층 |
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
| 1 | `/login` | 카카오 로그인 | ✅ 완료 | ⬜ 미연동 |
| 2 | `/auth/callback` | 인증 콜백 | ✅ 완료 | ⬜ 미연동 |
| 3 | `/signup` | 회원가입 | ✅ 완료 | ⬜ 미연동 |
| 4 | `/pending` | 승인 대기 | ✅ 완료 | ⬜ 미연동 |
| 5 | `/banned` | 이용 정지 | ✅ 완료 | ⬜ 미연동 |
| 6 | `/` | 메인 피드 | ✅ 완료 | ⬜ 미연동 |
| 7 | `/rides/new` | 게시글 등록 | ✅ 완료 | ⬜ 미연동 |
| 8 | `/rides/:id` | 게시글 상세 | ✅ 완료 | ⬜ 미연동 |
| 9 | `/my` | 마이페이지 | ✅ 완료 | ⬜ 미연동 |
| 10 | `/my/driver` | 운전자 등록 | ⬜ 미구현 | ⬜ 미연동 |
| 11 | `/admin` | 관리자 | ✅ 완료 | ⬜ 미연동 |
| 12 | `/terms` 외 | 약관 3종 | ⬜ 내용 없음 | — |

---

## 6. 데이터 타입 정의

### 6.1 User
```typescript
interface User {
  id: string
  kakao_id: string
  name: string
  phone: string           // 부분 암호화 저장
  department: string
  gender: 'M' | 'F' | 'N'
  account_number?: string  // AES-256 암호화 저장
  account_bank?: string
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

### 6.2 Ride (게시글)
```typescript
interface Ride {
  id: string
  driver_id: string
  vehicle_id: string
  origin: string            // 출발지 주소
  origin_lat / lng: number  // 좌표
  destination: string       // 도착지 주소
  destination_lat / lng: number
  waypoints?: { address, lat, lng }[]  // 경유지
  departure_time: string
  max_seats: number
  current_seats: number
  fare_per_person: number   // 고정값 3000
  status: 'OPEN' | 'FULL' | 'STARTED' | 'COMPLETED' | 'CANCELLED'
  gender_preference: 'ANY' | 'SAME_ONLY'
  notice?: string
  started_at?: string
  completed_at?: string
}
```

### 6.3 RideRequest (탑승 신청)
```typescript
interface RideRequest {
  id: string
  ride_id: string
  passenger_id: string
  pickup_location: string   // 탑승 희망 위치
  pickup_lat / lng: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'NO_SHOW' | 'COMPLETED'
  created_at: string
  approved_at?: string
  cancelled_at?: string
}
```

---

## 7. 인증 플로우

```
[사용자] 카카오 로그인 클릭
    ↓
Supabase signInWithOAuth({ provider: 'kakao' })
    ↓
/auth/callback 리다이렉트 → Supabase 세션 수립
    ↓
users 테이블 조회
    ├── 레코드 없음 → /signup (회원가입 폼)
    ├── status = PENDING → /pending (승인 대기)
    ├── status = APPROVED → / (메인 피드)
    ├── status = BANNED → /banned (이용 정지)
    └── status = REJECTED → /login

[관리자] /admin → 회원관리 탭 → PENDING 목록 → 승인/거부
    ↓
users.status = 'APPROVED' / 'REJECTED' 업데이트
```

### IS_MOCK 패턴
```typescript
// .env에 VITE_SUPABASE_URL 미설정 시 자동으로 목업 데이터 사용
export const IS_MOCK =
  !import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.VITE_SUPABASE_URL === 'your_supabase_url'
```

---

## 8. 핵심 비즈니스 규칙

| 규칙 | 상세 | 구현 위치 |
|---|---|---|
| 분담금 고정 | `fare_per_person = 3000` 수정 불가 | DB RLS + UI readonly |
| 노쇼 3회 | `no_show_count >= 3` → `banned_until = +30일` | 서버 트리거 (미구현) |
| 취소 정책 | 30분 전: 자유취소 / 10~30분: 취소 기록 / 10분 이내: 노쇼 | 서버 로직 (미구현) |
| 출발 자동 취소 | 출발 시각 +5분 내 [출발] 미클릭 → CANCELLED | Supabase Edge Function (미구현) |
| 출발 시각 제약 | 현재 시각 +10분 이상, +7일 이내 | 클라이언트 검증 (미구현) |
| 동시 신청 처리 | 트랜잭션 원자 처리, FIFO | Supabase RPC (미구현) |
| 성별 매칭 | SAME_ONLY 시 동성만 신청 가능 | 서버 RLS (미구현) |

---

## 9. Supabase DB 스키마 (구현 예정)

```sql
-- 회원
create table users (
  id uuid primary key references auth.users,
  kakao_id text unique,
  name text not null,
  phone text,              -- 부분 암호화
  department text,
  gender text check (gender in ('M','F','N')),
  account_number text,     -- AES-256 암호화
  account_bank text,
  is_driver boolean default false,
  is_admin boolean default false,
  status text default 'PENDING'
    check (status in ('PENDING','APPROVED','REJECTED','BANNED')),
  no_show_count int default 0,
  report_count int default 0,
  banned_until timestamptz,
  created_at timestamptz default now(),
  approved_at timestamptz
);

-- 차량
create table vehicles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users,
  car_number text not null,
  car_model text,
  max_passengers int,
  insurance_confirmed boolean default false
);

-- 게시글
create table rides (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid references users,
  vehicle_id uuid references vehicles,
  origin text, origin_lat float, origin_lng float,
  destination text, destination_lat float, destination_lng float,
  waypoints jsonb,
  departure_time timestamptz not null,
  max_seats int not null,
  current_seats int default 0,
  fare_per_person int default 3000,
  status text default 'OPEN'
    check (status in ('OPEN','FULL','STARTED','COMPLETED','CANCELLED')),
  gender_preference text default 'ANY' check (gender_preference in ('ANY','SAME_ONLY')),
  notice text,
  created_at timestamptz default now(),
  started_at timestamptz,
  completed_at timestamptz
);

-- 탑승 신청
create table ride_requests (
  id uuid primary key default gen_random_uuid(),
  ride_id uuid references rides,
  passenger_id uuid references users,
  pickup_location text,
  pickup_lat float, pickup_lng float,
  status text default 'PENDING'
    check (status in ('PENDING','APPROVED','REJECTED','CANCELLED','NO_SHOW','COMPLETED')),
  created_at timestamptz default now(),
  approved_at timestamptz,
  cancelled_at timestamptz
);

-- 신고
create table reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references users,
  reported_id uuid references users,
  ride_id uuid references rides,
  reason text check (reason in ('NO_SHOW','RUDE','UNSAFE','FARE','OTHER')),
  description text,
  status text default 'PENDING' check (status in ('PENDING','REVIEWED','REJECTED')),
  created_at timestamptz default now()
);
```

---

## 10. RLS 정책 원칙

```sql
-- 예시: rides 테이블
-- 조회: APPROVED 회원만
create policy "approved users can read rides"
  on rides for select
  using (
    exists (
      select 1 from users
      where id = auth.uid() and status = 'APPROVED'
    )
  );

-- 수정: 본인 게시글만
create policy "driver can update own ride"
  on rides for update
  using (driver_id = auth.uid());

-- 관리자: 전체 접근
create policy "admin full access"
  on rides for all
  using (
    exists (
      select 1 from users
      where id = auth.uid() and is_admin = true
    )
  );
```

---

## 11. API 엔드포인트 (Supabase 자동 생성 + RLS)

| Method | 경로 | 설명 | 구현 방식 |
|---|---|---|---|
| POST | /auth/kakao | 카카오 로그인 | Supabase OAuth |
| POST | /auth/signup | 회원가입 정보 제출 | supabase.from('users').insert |
| GET | /api/rides | 게시글 목록 (필터) | supabase.from('rides').select |
| POST | /api/rides | 게시글 등록 | supabase.from('rides').insert |
| PATCH | /api/rides/:id | 게시글 수정 | supabase.from('rides').update |
| DELETE | /api/rides/:id | 게시글 삭제 | supabase.from('rides').delete |
| POST | /api/rides/:id/start | 출발 버튼 | Supabase RPC |
| POST | /api/rides/:id/complete | 완료 처리 | Supabase RPC |
| POST | /api/rides/:id/requests | 탑승 신청 | supabase.from('ride_requests').insert |
| PATCH | /api/requests/:id/approve | 승인 (운전자) | Supabase RPC |
| PATCH | /api/requests/:id/reject | 거부 (운전자) | supabase.from('ride_requests').update |
| DELETE | /api/requests/:id | 신청 취소 (탑승자) | Supabase RPC (취소 정책 적용) |
| PATCH | /api/users/me | 내 정보 수정 | supabase.from('users').update |
| POST | /api/users/me/vehicle | 차량 등록 | supabase.from('vehicles').insert |
| POST | /api/reports | 신고 접수 | supabase.from('reports').insert |
| GET | /api/admin/users | 회원 목록 | supabase.from('users').select |
| PATCH | /api/admin/users/:id/approve | 승인 | supabase.from('users').update |
| PATCH | /api/admin/users/:id/ban | 정지 | supabase.from('users').update |

---

## 12. 남은 개발 작업 (Phase 2)

### 12.1 백엔드 연동 필수 작업

| 우선순위 | 작업 | 설명 |
|---|---|---|
| 🔴 HIGH | Supabase 프로젝트 생성 | URL·Key 발급, .env 설정 |
| 🔴 HIGH | DB 스키마 적용 | SQL 실행, RLS 정책 설정 |
| 🔴 HIGH | 카카오 개발자 앱 등록 | OAuth 앱 키, Redirect URI 설정 |
| 🔴 HIGH | 카카오맵 API 키 발급 | 지도 미리보기 연동 |
| 🔴 HIGH | 회원가입 → 탑승 전체 플로우 연동 | mock → real API |
| 🟡 MED | 출발 자동 취소 | Supabase Edge Function + cron |
| 🟡 MED | 노쇼 정책 자동 처리 | 서버 트리거 |
| 🟡 MED | 취소 정책 (시간 기반) | RPC 함수 |
| 🟡 MED | 계좌번호 암호화 키 관리 | 환경변수 VITE_ENCRYPT_KEY |
| 🟢 LOW | 운전자 등록 화면 (`/my/driver`) | UI 미구현 |
| 🟢 LOW | 약관 페이지 내용 채우기 | `/terms`, `/privacy`, `/location-terms` |
| 🟢 LOW | 실시간 알림 | Supabase Realtime + Web Push |
| 🟢 LOW | PWA 설정 | manifest.json, Service Worker |

### 12.2 환경변수 설정 (.env)

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_KAKAO_MAP_KEY=카카오맵API키
VITE_ENCRYPT_KEY=AES256암호화키
```

---

## 13. 배포 현황

| 환경 | URL | 용도 |
|---|---|---|
| **프리뷰 (현재)** | https://k778851.github.io/ppool/ | UI 확인용, mock 데이터 |
| **운영 (예정)** | 도메인 구입 후 Vercel 연동 | 실서비스 |

### 배포 명령어
```bash
npm run build      # 빌드
npm run deploy     # gh-pages 배포 (GitHub Pages)
```

### 운영 배포 시 변경 사항
- `vite.config.ts`의 `base: '/ppool/'` → `base: '/'` 로 변경
- `HashRouter` → `BrowserRouter` 로 변경 (Vercel은 SPA 라우팅 지원)
- `.env` 실제 값 설정

---

## 14. 출시 전 필수 체크리스트

- [ ] 카카오 개발자 앱 등록 + Redirect URI 설정
- [ ] 카카오맵 API 키 발급
- [ ] Supabase 프로젝트 생성 및 DB 스키마 적용
- [ ] RLS 정책 전체 검증
- [ ] 계좌번호 암호화 키 관리 방안 확정
- [ ] 관리자 계정 생성 (is_admin = true)
- [ ] 부서 목록 사전 등록 (청년1~8부 외 추가 여부 확인)
- [ ] 약관 3종 법률 전문가 검토 완료
- [ ] 도메인 구입 · DNS · HTTPS 설정
- [ ] 개인정보 처리방침 페이지 내용 게시
- [ ] 노쇼·취소 정책 Edge Function 테스트
- [ ] 모바일 기기 실기기 QA (iOS Safari, Android Chrome)

---

## 15. 법적 필수 사항

- UI 전체에서 **"요금"** 대신 **"분담금"** 사용
- 회원가입 시 약관 **3종 개별 체크박스** 필수
  - 이용약관 (필수)
  - 개인정보처리방침 (필수)
  - 위치정보 이용약관 (선택)
- 운전자 등록 시 **3종 확인 체크** 필수
  - 자동차 보험 가입 확인
  - 운전면허 유효 확인
  - 비영리 목적 확인
- 약관 초안: `Docs/PPOOL_약관초안.md` — **서비스 배포 전 법률 전문가 검토 필수**
