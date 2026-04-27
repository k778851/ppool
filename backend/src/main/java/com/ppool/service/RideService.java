package com.ppool.service;

import com.ppool.dto.RideDto;
import com.ppool.entity.Ride;
import com.ppool.entity.RideRequest;
import com.ppool.entity.User;
import com.ppool.entity.Vehicle;
import com.ppool.repository.RideRepository;
import com.ppool.repository.RideRequestRepository;
import com.ppool.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RideService {

    private final RideRepository rideRepository;
    private final RideRequestRepository rideRequestRepository;
    private final VehicleRepository vehicleRepository;

    public List<RideDto.Response> listRides(String gender, int page, int size) {
        return rideRepository.findAvailableRides(
                LocalDateTime.now(),
                gender,
                PageRequest.of(page, size)
        ).stream().map(ride -> {
            int approved = (int) rideRequestRepository.countByRideAndStatus(ride, RideRequest.RequestStatus.APPROVED);
            return RideDto.Response.from(ride, approved);
        }).toList();
    }

    public RideDto.Response getRide(String id) {
        Ride ride = findRide(id);
        int approved = (int) rideRequestRepository.countByRideAndStatus(ride, RideRequest.RequestStatus.APPROVED);
        return RideDto.Response.from(ride, approved);
    }

    @Transactional
    public RideDto.Response createRide(User driver, RideDto.CreateRequest req) {
        if (!driver.isDriver()) {
            throw new IllegalStateException("운전자 등록이 필요합니다.");
        }
        // 출발 시각 제약: 현재 시각 +10분 이상, +7일 이내
        LocalDateTime now = LocalDateTime.now();
        if (req.getDepartureTime().isBefore(now.plusMinutes(10))) {
            throw new IllegalArgumentException("출발 시각은 현재 시각으로부터 10분 이후여야 합니다.");
        }
        if (req.getDepartureTime().isAfter(now.plusDays(7))) {
            throw new IllegalArgumentException("출발 시각은 7일 이내여야 합니다.");
        }

        Vehicle vehicle = vehicleRepository.findByUser(driver)
                .orElseThrow(() -> new IllegalStateException("차량 정보가 없습니다."));

        Ride ride = Ride.builder()
                .driver(driver)
                .vehicle(vehicle)
                .origin(req.getOrigin())
                .originLat(req.getOriginLat())
                .originLng(req.getOriginLng())
                .destination(req.getDestination())
                .destinationLat(req.getDestinationLat())
                .destinationLng(req.getDestinationLng())
                .departureTime(req.getDepartureTime())
                .maxSeats(req.getMaxSeats())
                .genderPreference(req.getGenderPreference() != null ? req.getGenderPreference() : Ride.GenderPreference.ANY)
                .notice(req.getNotice())
                .status(Ride.RideStatus.OPEN)
                .build();

        return RideDto.Response.from(rideRepository.save(ride), 0);
    }

    @Transactional
    public RideDto.Response updateRide(User driver, String rideId, RideDto.CreateRequest req) {
        Ride ride = findRide(rideId);
        checkOwner(ride, driver);
        if (ride.getStatus() != Ride.RideStatus.OPEN) {
            throw new IllegalStateException("수정할 수 없는 상태의 게시글입니다.");
        }
        if (req.getOrigin() != null) ride.setOrigin(req.getOrigin());
        if (req.getDestination() != null) ride.setDestination(req.getDestination());
        if (req.getDepartureTime() != null) ride.setDepartureTime(req.getDepartureTime());
        if (req.getMaxSeats() > 0) ride.setMaxSeats(req.getMaxSeats());
        if (req.getNotice() != null) ride.setNotice(req.getNotice());
        int approved = (int) rideRequestRepository.countByRideAndStatus(ride, RideRequest.RequestStatus.APPROVED);
        return RideDto.Response.from(rideRepository.save(ride), approved);
    }

    @Transactional
    public void deleteRide(User driver, String rideId) {
        Ride ride = findRide(rideId);
        checkOwner(ride, driver);
        if (ride.getStatus() == Ride.RideStatus.STARTED) {
            throw new IllegalStateException("이미 출발한 게시글은 삭제할 수 없습니다.");
        }
        ride.setStatus(Ride.RideStatus.CANCELLED);
        rideRepository.save(ride);
    }

    @Transactional
    public void startRide(User driver, String rideId) {
        Ride ride = findRide(rideId);
        checkOwner(ride, driver);
        if (ride.getStatus() != Ride.RideStatus.OPEN && ride.getStatus() != Ride.RideStatus.FULL) {
            throw new IllegalStateException("출발할 수 없는 상태입니다.");
        }
        ride.setStatus(Ride.RideStatus.STARTED);
        ride.setStartedAt(LocalDateTime.now());
        rideRepository.save(ride);
    }

    @Transactional
    public void completeRide(User driver, String rideId) {
        Ride ride = findRide(rideId);
        checkOwner(ride, driver);
        if (ride.getStatus() != Ride.RideStatus.STARTED) {
            throw new IllegalStateException("출발 후에만 완료 처리 가능합니다.");
        }
        ride.setStatus(Ride.RideStatus.COMPLETED);
        ride.setCompletedAt(LocalDateTime.now());
        // 승인된 신청 → COMPLETED
        rideRequestRepository.findByRide(ride).stream()
                .filter(r -> r.getStatus() == RideRequest.RequestStatus.APPROVED)
                .forEach(r -> {
                    r.setStatus(RideRequest.RequestStatus.COMPLETED);
                    rideRequestRepository.save(r);
                });
        rideRepository.save(ride);
    }

    /** 출발 시각 +5분 내 STARTED 미처리 게시글 자동 취소 (매분 체크) */
    @Scheduled(fixedDelay = 60_000)
    @Transactional
    public void autoCancelExpiredRides() {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(5);
        rideRepository.findExpiredRides(cutoff).forEach(ride -> {
            ride.setStatus(Ride.RideStatus.CANCELLED);
            rideRepository.save(ride);
            // TODO: 알림 발송
        });
    }

    private Ride findRide(String id) {
        return rideRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
    }

    private void checkOwner(Ride ride, User user) {
        if (!ride.getDriver().getId().equals(user.getId())) {
            throw new SecurityException("권한이 없습니다.");
        }
    }
}
