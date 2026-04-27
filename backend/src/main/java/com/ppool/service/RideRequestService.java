package com.ppool.service;

import com.ppool.dto.RideRequestDto;
import com.ppool.entity.Ride;
import com.ppool.entity.RideRequest;
import com.ppool.entity.User;
import com.ppool.repository.RideRepository;
import com.ppool.repository.RideRequestRepository;
import com.ppool.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RideRequestService {

    private final RideRepository rideRepository;
    private final RideRequestRepository rideRequestRepository;
    private final UserRepository userRepository;

    @Transactional
    public RideRequestDto.Response createRequest(User rider, String rideId, RideRequestDto.CreateRequest req) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        if (ride.getStatus() != Ride.RideStatus.OPEN && ride.getStatus() != Ride.RideStatus.FULL) {
            throw new IllegalStateException("신청할 수 없는 게시글입니다.");
        }
        if (ride.getDriver().getId().equals(rider.getId())) {
            throw new IllegalStateException("자신의 게시글에는 신청할 수 없습니다.");
        }
        if (rideRequestRepository.findByRideAndRider(ride, rider).isPresent()) {
            throw new IllegalStateException("이미 신청한 게시글입니다.");
        }
        // 성별 제한 체크
        if (ride.getGenderPreference() == Ride.GenderPreference.SAME_ONLY
                && ride.getDriver().getGender() != rider.getGender()) {
            throw new IllegalStateException("성별 제한으로 신청할 수 없습니다.");
        }

        RideRequest request = RideRequest.builder()
                .ride(ride)
                .rider(rider)
                .pickupLocation(req.getPickupLocation())
                .pickupLat(req.getPickupLat())
                .pickupLng(req.getPickupLng())
                .status(RideRequest.RequestStatus.PENDING)
                .build();

        return RideRequestDto.Response.from(rideRequestRepository.save(request));
    }

    @Transactional
    public void approve(User driver, String requestId) {
        RideRequest request = findRequest(requestId);
        checkDriver(request, driver);
        checkPending(request);

        request.setStatus(RideRequest.RequestStatus.APPROVED);
        request.setRespondedAt(LocalDateTime.now());
        rideRequestRepository.save(request);

        // 정원 가득 찬 경우 FULL 처리
        Ride ride = request.getRide();
        long approved = rideRequestRepository.countByRideAndStatus(ride, RideRequest.RequestStatus.APPROVED);
        if (approved >= ride.getMaxSeats()) {
            ride.setStatus(Ride.RideStatus.FULL);
            rideRepository.save(ride);
        }
    }

    @Transactional
    public void reject(User driver, String requestId) {
        RideRequest request = findRequest(requestId);
        checkDriver(request, driver);
        checkPending(request);
        request.setStatus(RideRequest.RequestStatus.REJECTED);
        request.setRespondedAt(LocalDateTime.now());
        rideRequestRepository.save(request);

        // FULL → OPEN 복구
        Ride ride = request.getRide();
        if (ride.getStatus() == Ride.RideStatus.FULL) {
            ride.setStatus(Ride.RideStatus.OPEN);
            rideRepository.save(ride);
        }
    }

    @Transactional
    public void cancel(User rider, String requestId) {
        RideRequest request = findRequest(requestId);
        if (!request.getRider().getId().equals(rider.getId())) {
            throw new SecurityException("권한이 없습니다.");
        }
        if (request.getStatus() != RideRequest.RequestStatus.PENDING
                && request.getStatus() != RideRequest.RequestStatus.APPROVED) {
            throw new IllegalStateException("취소할 수 없는 상태입니다.");
        }

        LocalDateTime departureTime = request.getRide().getDepartureTime();
        LocalDateTime now = LocalDateTime.now();

        // 취소 정책: 10분 이내 → 노쇼 처리
        if (now.isAfter(departureTime.minusMinutes(10))) {
            request.setStatus(RideRequest.RequestStatus.NO_SHOW);
            User riderEntity = request.getRider();
            riderEntity.setNoShowCount(riderEntity.getNoShowCount() + 1);
            if (riderEntity.getNoShowCount() >= 3) {
                riderEntity.setBannedUntil(now.plusDays(30));
                riderEntity.setStatus(User.UserStatus.BANNED);
            }
            userRepository.save(riderEntity);
        } else {
            request.setStatus(RideRequest.RequestStatus.CANCELLED);
        }
        rideRequestRepository.save(request);

        // 정원 복구
        Ride ride = request.getRide();
        if (ride.getStatus() == Ride.RideStatus.FULL) {
            ride.setStatus(Ride.RideStatus.OPEN);
            rideRepository.save(ride);
        }
    }

    private RideRequest findRequest(String id) {
        return rideRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("신청 내역을 찾을 수 없습니다."));
    }

    private void checkDriver(RideRequest request, User driver) {
        if (!request.getRide().getDriver().getId().equals(driver.getId())) {
            throw new SecurityException("권한이 없습니다.");
        }
    }

    private void checkPending(RideRequest request) {
        if (request.getStatus() != RideRequest.RequestStatus.PENDING) {
            throw new IllegalStateException("이미 처리된 신청입니다.");
        }
    }
}
