package com.ppool.repository;

import com.ppool.entity.User;
import com.ppool.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VehicleRepository extends JpaRepository<Vehicle, String> {
    Optional<Vehicle> findByUser(User user);
}
