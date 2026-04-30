-- P플 초기 스키마

CREATE TABLE IF NOT EXISTS users (
    id              VARCHAR(36) PRIMARY KEY,
    zauth_id        VARCHAR(50) UNIQUE NOT NULL,  -- 시온로그인 고유번호
    name            VARCHAR(50) NOT NULL,
    phone           VARCHAR(100),
    department      VARCHAR(100),
    gender          CHAR(1),                      -- 시온로그인에 없으므로 최초 로그인 시 입력
    is_driver       BOOLEAN NOT NULL DEFAULT FALSE,
    is_admin        BOOLEAN NOT NULL DEFAULT FALSE,
    status          VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    no_show_count   INT NOT NULL DEFAULT 0,
    report_count    INT NOT NULL DEFAULT 0,
    banned_until    TIMESTAMP,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    approved_at     TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehicles (
    id                          VARCHAR(36) PRIMARY KEY,
    user_id                     VARCHAR(36) UNIQUE NOT NULL REFERENCES users(id),
    plate_number                VARCHAR(20) NOT NULL,
    car_model                   VARCHAR(50) NOT NULL,
    max_seats                   INT NOT NULL,
    insurance_verified          BOOLEAN NOT NULL DEFAULT FALSE,
    license_verified            BOOLEAN NOT NULL DEFAULT FALSE,
    non_commercial_confirmed    BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS rides (
    id                  VARCHAR(36) PRIMARY KEY,
    driver_id           VARCHAR(36) NOT NULL REFERENCES users(id),
    vehicle_id          VARCHAR(36) REFERENCES vehicles(id),
    origin              VARCHAR(200) NOT NULL,
    origin_lat          DOUBLE PRECISION,
    origin_lng          DOUBLE PRECISION,
    destination         VARCHAR(200) NOT NULL,
    destination_lat     DOUBLE PRECISION,
    destination_lng     DOUBLE PRECISION,
    waypoints           TEXT,
    departure_time      TIMESTAMP NOT NULL,
    max_seats           INT NOT NULL,
    fare_per_person     INT NOT NULL DEFAULT 3000,
    gender_preference   VARCHAR(20) NOT NULL DEFAULT 'ANY',
    status              VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    notice              TEXT,
    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    started_at          TIMESTAMP,
    completed_at        TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ride_requests (
    id              VARCHAR(36) PRIMARY KEY,
    ride_id         VARCHAR(36) NOT NULL REFERENCES rides(id),
    rider_id        VARCHAR(36) NOT NULL REFERENCES users(id),
    pickup_location VARCHAR(200),
    pickup_lat      DOUBLE PRECISION,
    pickup_lng      DOUBLE PRECISION,
    status          VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    responded_at    TIMESTAMP,
    UNIQUE(ride_id, rider_id)
);

CREATE TABLE IF NOT EXISTS reports (
    id              VARCHAR(36) PRIMARY KEY,
    reporter_id     VARCHAR(36) NOT NULL REFERENCES users(id),
    reported_id     VARCHAR(36) NOT NULL REFERENCES users(id),
    ride_id         VARCHAR(36) REFERENCES rides(id),
    reason          VARCHAR(20) NOT NULL,
    description     TEXT,
    status          VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_rides_status_departure ON rides(status, departure_time);
CREATE INDEX IF NOT EXISTS idx_ride_requests_ride ON ride_requests(ride_id);
CREATE INDEX IF NOT EXISTS idx_ride_requests_rider ON ride_requests(rider_id);
