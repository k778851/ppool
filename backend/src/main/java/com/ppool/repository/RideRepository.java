package com.ppool.repository;

import com.ppool.entity.Ride;
import com.ppool.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface RideRepository extends JpaRepository<Ride, String> {

    @Query("""
        SELECT r FROM Ride r
        WHERE r.status IN ('OPEN', 'FULL')
        AND r.departureTime > :now
        AND (:gender IS NULL OR r.genderPreference = 'ANY' OR r.driver.gender = :gender)
        ORDER BY r.departureTime ASC
        """)
    Page<Ride> findAvailableRides(
            @Param("now") LocalDateTime now,
            @Param("gender") String gender,
            Pageable pageable);

    List<Ride> findByDriverOrderByDepartureTimeDesc(User driver);

    // 출발 후 5분 이내 STARTED 미처리 게시글 자동 취소용
    @Query("""
        SELECT r FROM Ride r
        WHERE r.status = 'OPEN'
        AND r.departureTime < :cutoff
        """)
    List<Ride> findExpiredRides(@Param("cutoff") LocalDateTime cutoff);
}
