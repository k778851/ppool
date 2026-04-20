# P플 개발 계획서

> **버전**: v1.0 / **작성일**: 2026-04-20
> **스택**: React + Supabase + Vercel
> **목표**: 4주 내 MVP 베타 배포

---

## 목차

1. [프로젝트 셋업](#1-프로젝트-셋업)
2. [폴더 구조](#2-폴더-구조)
3. [Supabase 설정](#3-supabase-설정)
4. [Sprint 1 — 기반 구축 (1주차)](#4-sprint-1--기반-구축-1주차)
5. [Sprint 2 — 핵심 기능 (2주차)](#5-sprint-2--핵심-기능-2주차)
6. [Sprint 3 — 완성도 + 관리자 (3주차)](#6-sprint-3--완성도--관리자-3주차)
7. [Sprint 4 — 마감 + 배포 (4주차)](#7-sprint-4--마감--배포-4주차)
8. [환경변수 목록](#8-환경변수-목록)
9. [구현 시 주의사항](#9-구현-시-주의사항)

---

## 1. 프로젝트 셋업

### 초기 명령어

```bash
# React 프로젝트 생성 (Vite 기반)
npm create vite@latest . --template react-ts --overwrite
npm install

# 주요 패키지 설치
npm install @supabase/supabase-js
npm install react-router-dom
npm install @tanstack/react-query
npm install react-hook-form
npm install @hookform/resolvers
npm install zod
npm install crypto-js
npm install xlsx

npm install --save-dev @types/crypto-js
```

### Vercel 연동

```bash
npm install -g vercel
vercel login
vercel link
```

---

## 2. 폴더 구조

```
src/
├── assets/
├── components/
│   ├── common/              # Button, Input, Badge, Modal 등 공통 UI
│   ├── ride/                # RideCard, RideForm 등 카풀 관련
│   ├── admin/               # AdminUsers, AdminReports, AdminRides, AdminBackup
│   └── layout/              # Header, BottomNav, PageLayout, AuthGuard
├── hooks/                   # useAuth
├── lib/
│   ├── supabase.ts          # Supabase 클라이언트 초기화
│   ├── crypto.ts            # AES 암호화/복호화
│   ├── mock.ts              # IS_MOCK 플래그 + 개발용 목 데이터
│   └── utils.ts             # formatRelativeTime 등 유틸
├── pages/
│   ├── LoginPage.tsx
│   ├── AuthCallbackPage.tsx
│   ├── SignupPage.tsx
│   ├── PendingPage.tsx
│   ├── BannedPage.tsx
│   ├── MainPage.tsx
│   ├── RideNewPage.tsx
│   ├── RideDetailPage.tsx
│   ├── MyPage.tsx
│   ├── DriverRegisterPage.tsx
│   └── admin/AdminPage.tsx
├── stores/authStore.ts      # AuthContext
├── types/index.ts           # TypeScript 타입 정의
├── styles.css               # 디자인 토큰
├── index.css                # 공통 UI 스타일
├── App.tsx                  # 라우터 + AuthProvider + QueryClient
└── main.tsx
```

---

## 3. Supabase 설정

### 3-1. DB 스키마 생성 SQL

```sql
-- users
create table users (
  id uuid primary key default gen_random_uuid(),
  kakao_id varchar unique not null,
  name varchar(20) not null,
  phone varchar(20) not null,
  department varchar(50) not null,
  gender varchar(1) default 'N',
  account_number varchar,
  account_bank varchar,
  is_driver boolean default false,
  is_admin boolean default false,
  status varchar default 'PENDING',
  no_show_count integer default 0,
  report_count integer default 0,
  banned_until timestamptz,
  created_at timestamptz default now(),
  approved_at timestamptz
);

-- vehicles
create table vehicles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  car_number varchar(20) not null,
  car_model varchar(50),
  max_passengers integer not null,
  insurance_confirmed boolean default false
);

-- rides
create table rides (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid references users(id),
  vehicle_id uuid references vehicles(id),
  origin varchar not null,
  origin_lat decimal not null,
  origin_lng decimal not null,
  destination varchar not null,
  destination_lat decimal not null,
  destination_lng decimal not null,
  waypoints jsonb,
  departure_time timestamptz not null,
  max_seats integer not null,
  current_seats integer default 0,
  fare_per_person integer default 3000,
  status varchar default 'OPEN',
  gender_preference varchar default 'ANY',
  notice text,
  created_at timestamptz default now(),
  started_at timestamptz,
  completed_at timestamptz
);

-- ride_requests
create table ride_requests (
  id uuid primary key default gen_random_uuid(),
  ride_id uuid references rides(id) on delete cascade,
  passenger_id uuid references users(id),
  pickup_location varchar not null,
  pickup_lat decimal not null,
  pickup_lng decimal not null,
  status varchar default 'PENDING',
  created_at timestamptz default now(),
  approved_at timestamptz,
  cancelled_at timestamptz
);

-- reports
create table reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references users(id),
  reported_id uuid references users(id),
  ride_id uuid references rides(id),
  reason varchar not null,
  description text,
  status varchar default 'PENDING',
  created_at timestamptz default now()
);
```

### 3-2. RLS 정책

```sql
alter table users enable row level security;
alter table rides enable row level security;
alter table ride_requests enable row level security;
alter table reports enable row level security;

-- rides: 승인 회원은 조회, 본인만 수정·삭제
create policy "승인 회원 조회" on rides for select using (
  exists (select 1 from users where id = auth.uid() and status = 'APPROVED')
);
create policy "본인 게시글 수정·삭제" on rides for all using (driver_id = auth.uid());

-- ride_requests: 본인 신청 + 해당 게시글 운전자만 조회
create policy "본인 신청 조회" on ride_requests for select using (passenger_id = auth.uid());
create policy "운전자 신청 조회" on ride_requests for select using (
  exists (select 1 from rides where id = ride_id and driver_id = auth.uid())
);
```

### 3-3. Supabase 클라이언트 (`src/lib/supabase.ts`)

```typescript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

---

## 4. Sprint 1 — 기반 구축 (1주차)

### 완료된 Task

- [x] Vite React TypeScript 프로젝트 셋업
- [x] 패키지 설치 (Supabase, react-router-dom, react-query, react-hook-form, zod, crypto-js, xlsx)
- [x] 폴더 구조 생성
- [x] TypeScript 타입 정의 (`src/types/index.ts`)
- [x] Supabase 클라이언트 (`src/lib/supabase.ts`)
- [x] AES 암호화 유틸 (`src/lib/crypto.ts`)
- [x] AuthContext + useAuth 훅 (`src/hooks/useAuth.ts`, `src/stores/authStore.ts`)
- [x] 라우트 가드 (`src/components/layout/AuthGuard.tsx`)
- [x] 로그인 페이지 (`/login`)
- [x] OAuth 콜백 처리 (`/auth/callback`)
- [x] 회원가입 페이지 (`/signup`) — react-hook-form + zod
- [x] 승인 대기 페이지 (`/pending`)
- [x] 이용 정지 페이지 (`/banned`)
- [x] 관리자 페이지 기본형 (`/admin`) — 회원관리·신고관리·게시글관리·백업 탭
- [x] 디자인 토큰 (`src/styles.css`)
- [x] 공통 UI 스타일 (`src/index.css`)
- [x] App.tsx 라우터 구성

### Task 1-1. 카카오 OAuth 연동 (실제 연결 시)

1. [카카오 개발자 콘솔](https://developers.kakao.com)에서 앱 등록
2. Redirect URI: `https://[supabase-project].supabase.co/auth/v1/callback`
3. Supabase Dashboard → Authentication → Providers → Kakao 활성화

```typescript
const signInWithKakao = async () => {
  await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: { redirectTo: `${window.location.origin}/auth/callback` }
  })
}
```

---

## 5. Sprint 2 — 핵심 기능 (2주차)

### Mock 모드 운용

DB 연결 전 `src/lib/mock.ts`의 `IS_MOCK` 플래그로 목 데이터로 동작.
Supabase 연결 후 각 페이지의 목 데이터 호출을 실제 쿼리로 교체.

### Task 2-1. 메인 피드 (`/`)

- 게시글 카드 리스트 (RideCard 컴포넌트)
- 필터: 지역 검색, 전체/동성만/잔여석 있는
- 정렬: 출발 임박순
- Supabase 연결 시: Realtime 구독 + useInfiniteQuery

### Task 2-2. 게시글 상세 (`/rides/:id`)

접근자별 버튼 분기:
| 접근자 | 표시 버튼 |
|---|---|
| 게시글 운전자 | [출발] (±5분 활성화) [수정] [삭제] + 신청자 목록 |
| 미신청 탑승자 | 탑승 희망 위치 입력 + [신청하기] |
| 신청 대기 탑승자 | [신청 취소] |
| 승인된 탑승자 | [운전자에게 연락] |

### Task 2-3. 운전자 게시글 작성 (`/rides/new`)

- 운전자 등록 안 된 경우 → 등록 유도 모달
- 출발 시각: 현재 +10분 이상, +7일 이내 강제 검증
- 분담금: 3,000원 고정 (readOnly)

### Task 2-4. 마이페이지 (`/my`)

- 프로필·차량정보·계좌 섹션
- 내 게시글 / 내 신청 내역 탭

### Task 2-5. 운전자 등록 (`/my/driver`)

- 차량번호, 차종, 최대 인원
- 보험·면허·비영리 목적 3종 체크박스 (모두 동의 필수)

---

## 6. Sprint 3 — 완성도 + 관리자 (3주차)

### Task 3-1. 출발·완료 버튼 로직

```typescript
// [출발] 버튼: 출발 시각 ±5분 이내에만 활성화
// status = 'STARTED', started_at = now()
// 자동 삭제: Vercel Cron으로 출발 시각 +5분 경과 후 CANCELLED 처리

// [완료] 버튼
// status = 'COMPLETED', completed_at = now()
// 연결된 ride_requests.status = 'COMPLETED' 일괄 업데이트
```

### Task 3-2. 취소·노쇼 처리

```typescript
const cancelRequest = async (requestId: string) => {
  const minutesBefore = getMinutesBeforeDeparture(ride.departure_time)
  if (minutesBefore < 10) {
    // 노쇼: users.no_show_count +1, 3회 이상 → banned_until = now() + 30days
  } else if (minutesBefore < 30) {
    // 취소 기록만
  }
  // 30분 이상: 자유 취소
}
```

### Task 3-3. 계좌번호 암호화

```typescript
// 저장 시: encrypt(accountNumber) → DB
// 조회 시 (본인만): decrypt(encryptedValue) → 뒷 4자리 마스킹
```

### Task 3-4. 관리자 페이지 완성

- 백업: `xlsx` 라이브러리로 엑셀 다운로드
- 정지: `banned_until = now() + 30days`
- 신고 처리 후 피신고자 `report_count +1`

---

## 7. Sprint 4 — 마감 + 배포 (4주차)

### Task 4-1. 약관 페이지

- `/terms` — `Docs/PPOOL_약관초안.md` 1장 내용
- `/privacy` — 2장
- `/location-terms` — 3장

### Task 4-2. 자동 삭제 Cron

```json
// vercel.json
{
  "crons": [{
    "path": "/api/cron/auto-cancel-rides",
    "schedule": "* * * * *"
  }]
}
```

`departure_time + 5분 < now()` AND `status IN ('OPEN', 'FULL')` → CANCELLED

### Task 4-3. 베타 배포

```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_KAKAO_MAP_KEY
vercel env add VITE_ENCRYPT_KEY
vercel --prod
```

---

## 8. 환경변수 목록

| 변수명 | 설명 | 비고 |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase 프로젝트 URL | Dashboard에서 확인 |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key | Dashboard에서 확인 |
| `VITE_KAKAO_MAP_KEY` | 카카오맵 JavaScript API 키 | 카카오 개발자 콘솔 |
| `VITE_ENCRYPT_KEY` | AES-256 암호화 비밀키 | 직접 생성, 절대 커밋 금지 |

`.env.local` 파일에 저장, `.gitignore`에 반드시 포함.

---

## 9. 구현 시 주의사항

### 분담금 고정
`fare_per_person`은 항상 3000. UI에서 `disabled` 처리, API에서도 클라이언트 값 무시하고 3000 강제 저장.

### 관리자 계정
`users.is_admin = true`는 Supabase Dashboard에서 직접 설정. UI를 통한 자가 승격 불가.

### 카카오맵 SDK 로드
`index.html`에 스크립트 태그로 로드:
```html
<script type="text/javascript"
  src="//dapi.kakao.com/v2/maps/sdk.js?appkey=%VITE_KAKAO_MAP_KEY%&libraries=services">
</script>
```

### Supabase 타입 자동 생성
```bash
npx supabase gen types typescript --project-id [project-id] > src/types/supabase.ts
```

### Mock → 실제 DB 전환 방법
1. `src/lib/mock.ts`의 `IS_MOCK` 조건이 자동으로 `false`가 되도록 `.env.local`에 실제 Supabase URL 입력
2. 각 페이지에서 목 데이터를 직접 쓰는 부분을 Supabase 쿼리로 교체
3. `useAuth.ts`의 Supabase Auth 로직이 자동으로 활성화됨
