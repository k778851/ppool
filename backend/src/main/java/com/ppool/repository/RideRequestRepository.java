package com.ppool.repository;

import com.ppool.entity.Ride;
import com.ppool.entity.RideRequest;
import com.ppool.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RideRequestRepository extends JpaRepository<RideRequest, String> {
    List<RideRequest> findByRide(Ride ride);
    List<RideRequest> findByRider(User rider);
    Optional<RideRequest> findByRideAndRider(Ride ride, User rider);
    long countByRideAndStatus(Ride ride, RideRequest.RequestStatus status);
}
