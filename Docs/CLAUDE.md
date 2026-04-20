# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

Pre-development (planning) phase. No application code exists yet. All spec is in `Docs/PPOOL_MVP_상세명세서.md` and `Docs/PPOOL.md`.

## Project Overview

**P플** — 지파 청년부 전용 내부 카풀 웹 서비스. 인당 3,000원 정액 분담금(유류비 분담 성격, 유상운송 아님). 카카오 로그인 후 관리자 수동 승인 구조로 비구성원 원천 차단.

## Tech Stack

- **Frontend**: React (PWA 적용 권장), Pretendard 폰트, CSS variables (`src/styles.css`)
- **Backend/DB**: Supabase (PostgreSQL + Auth + Realtime + RLS)
- **Auth**: 카카오 OAuth → 관리자 승인 (PENDING → APPROVED/REJECTED)
- **Maps**: 카카오맵 API
- **Deployment**: Vercel
- **Notifications**: Web Push (Service Worker) — 2차

## Database Schema

| Table | 설명 |
|---|---|
| `users` | 회원 프로필. `status`: PENDING / APPROVED / REJECTED / BANNED. `no_show_count`, `banned_until` 포함 |
| `vehicles` | 운전자 차량 정보 (차량번호, 최대 탑승 인원, 보험 확인 여부) |
| `rides` | 카풀 게시글. `status`: OPEN / FULL / STARTED / COMPLETED / CANCELLED. `fare_per_person` 고정 3000 |
| `ride_requests` | 탑승 신청. `status`: PENDING / APPROVED / REJECTED / CANCELLED / NO_SHOW / COMPLETED |
| `reports` | 신고. `reason`: NO_SHOW / RUDE / UNSAFE / FARE / OTHER |
| `notifications` | 2차 확장 |

**민감정보 처리**: 계좌번호 AES-256 암호화, 전화번호 해시/부분 암호화. 위치정보는 운행 종료 즉시 삭제(분쟁 대비 30일 로그만 보관).

**공개 범위**: 타 회원에게는 이름·부서·성별만 노출. 연락처는 신청 승인 후에만 공개. 계좌번호는 본인만 조회 가능.

## RLS 정책 원칙

- 본인 게시글만 수정·삭제 가능
- 본인 신청 내역만 조회 가능
- 관리자(`role = 'admin'`)는 전체 접근
- BANNED/PENDING 회원의 API 호출 → 401 반환

## 핵심 비즈니스 규칙

| 규칙 | 상세 |
|---|---|
| 노쇼 3회 누적 | 30일 이용 정지 (`users.banned_until`) |
| 취소 정책 | 30분 전 이상: 자유취소 / 10~30분 전: 취소 기록 / 10분 이내: 노쇼 처리 |
| 출발 자동 삭제 | 출발 시각 +5분 내 [출발] 미클릭 시 게시글 자동 CANCELLED, 신청자 알림 |
| 분담금 고정 | `fare_per_person = 3000` 수정 불가, 운전자 임의 증액 시 이용 제한 |
| 정원 초과 동시 신청 | 트랜잭션으로 원자적 처리 (FIFO, 운전자가 최종 선택) |
| 출발 시각 제약 | 현재 시각 +10분 이상, +7일 이내 |

## API 엔드포인트 요약

Supabase 사용 시 대부분 자동 생성되지만 RLS는 수동 설정 필요.

```
POST   /auth/kakao                      카카오 로그인 콜백
POST   /auth/signup                     회원가입 정보 제출

GET    /api/rides                       게시글 리스트 (필터: 지역, 성별, 잔여석)
POST   /api/rides                       게시글 등록
PATCH  /api/rides/:id                   게시글 수정
DELETE /api/rides/:id                   게시글 삭제
POST   /api/rides/:id/start             출발 버튼
POST   /api/rides/:id/complete          완료 처리

POST   /api/rides/:id/requests          탑승 신청
PATCH  /api/requests/:id/approve        승인 (운전자)
PATCH  /api/requests/:id/reject         거부 (운전자)
DELETE /api/requests/:id                신청 취소 (탑승자)

PATCH  /api/users/me                    내 정보 수정
POST   /api/users/me/vehicle            차량 등록

POST   /api/reports                     신고 접수

GET    /api/admin/users                 회원 목록
PATCH  /api/admin/users/:id/approve     승인
PATCH  /api/admin/users/:id/ban         정지
GET    /api/admin/export/users          회원 엑셀 다운로드
GET    /api/admin/export/rides          게시글 엑셀 다운로드
```

## 화면 구성 (10개)

| 경로 | 화면 |
|---|---|
| `/login` | 카카오 로그인, 약관 링크 |
| `/signup` | 이름·부서·연락처·성별 입력 + 약관 3종 동의 |
| `/pending` | 승인 대기 안내, 카카오톡 채널 문의 버튼 |
| `/` | 메인 피드 (게시글 카드 리스트, 필터, [운전해요]/[태워주세요] CTA) |
| `/rides/new` | 운전자 게시글 작성 (출발지·목적지·경유지·시각·인원·차량·성별매칭·공지) |
| `/rides/:id` | 게시글 상세 (역할에 따라 신청/승인/출발 버튼 분기) |
| `/my` | 마이페이지 (프로필·차량정보·계좌·활동내역·설정) |
| `/my/driver` | 운전자 등록 (차량번호·차종·인원·보험확인 3종 체크) |
| `/admin` | 관리자 (회원관리·신고관리·게시글관리·백업·통계) |

## 디자인 시스템 (`src/styles.css`)

| 토큰 | 값 | 용도 |
|---|---|---|
| `--blue-hero` | `#1A38F5` | 히어로 영역 전용 |
| `--mint` | `#7EF0E4` | 메인 액센트 |
| `--driver` | `#FF8A3D` | 운전자 뱃지·버튼 |
| `--rider` | `#2B6BFF` | 탑승자 뱃지·버튼 |
| `--warn` | `#FF4A4A` | 경고·신고 |
| `--radius-sm/md/lg/xl` | `10/14/20/28px` | 카드·버튼 radius |

폰트: `Pretendard` (기본), `Gaegu` (`.hand` 클래스, 히어로 강조용).
유틸리티 클래스: `.card`, `.tap` (터치 피드백), `.noscroll`, `.t-mono`.

## 법적 필수 사항

- UI 전체에서 "요금" 대신 **"분담금"** 사용 (`Docs/PPOOL_약관초안.md` 제1조, 제4조)
- 회원가입 시 약관 3종 **개별 체크박스** 필수 (이용약관·개인정보처리방침 필수 / 위치정보 선택)
- 운전자 등록 시 보험·면허·비영리 목적 **3종 확인 체크** 필수
- 약관 초안은 `Docs/PPOOL_약관초안.md` — 서비스 배포 전 법률 전문가 검토 필수

## 개발 Sprint

| Week | 목표 |
|---|---|
| 1 | React + Supabase 셋업, 카카오 OAuth, DB 스키마, 관리자 승인 UI |
| 2 | 회원가입·승인 대기 플로우, 운전자 게시글 등록, 메인 피드, 게시글 상세·신청 |
| 3 | 승인/거부 플로우, 출발·완료 버튼 로직, 취소·노쇼 처리, 관리자 페이지(백업 포함), 신고 기능 |
| 4 | PWA 설정, 약관 페이지 연결, QA, 베타 배포 |

## 출시 전 필수 체크

- 카카오 개발자 앱 등록 + 카카오맵 API 키 발급
- 계좌번호 암호화 키 관리 방안 확정
- 관리자 계정 생성 및 부서 목록 사전 등록
- 도메인 구입·DNS·HTTPS 설정
- 약관 법률 검토 완료
