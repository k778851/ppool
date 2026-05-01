-- V2: rides 테이블에 ride_type 컬럼 추가 (CARPOOL / TAXI)
-- 기존 데이터는 모두 CARPOOL로 설정

ALTER TABLE rides
    ADD COLUMN ride_type VARCHAR(10) NOT NULL DEFAULT 'CARPOOL';

-- 분담금 컬럼을 TAXI 타입에서 0 허용 (기존 NOT NULL + default 3000 유지)
-- fare_per_person 은 이미 NOT NULL default 3000 으로 선언돼 있으므로
-- TAXI 의 경우 0 값을 허용하는 별도 제약 변경 불필요

COMMENT ON COLUMN rides.ride_type IS 'CARPOOL: 개인 차량 운전자 카풀 / TAXI: 택시합승 모집';
COMMENT ON COLUMN rides.fare_per_person IS 'CARPOOL: 3000 고정 / TAXI: 예상 인당 금액 (0 = 현장 N빵)';
