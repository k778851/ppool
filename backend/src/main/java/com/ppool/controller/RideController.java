package com.ppool.controller;

import com.ppool.dto.RideDto;
import com.ppool.dto.RideRequestDto;
import com.ppool.entity.User;
import com.ppool.service.RideRequestService;
import com.ppool.service.RideService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rides")
@RequiredArgsConstructor
public class RideController {

    private final RideService rideService;
    private final RideRequestService rideRequestService;

    /** GET /api/rides?gender=&page=&size= */
    @GetMapping
    public ResponseEntity<List<RideDto.Response>> list(
            @RequestParam(required = false) String gender,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(rideService.listRides(gender, page, size));
    }

    /** GET /api/rides/:id */
    @GetMapping("/{id}")
    public ResponseEntity<RideDto.Response> get(@PathVariable String id) {
        return ResponseEntity.ok(rideService.getRide(id));
    }

    /** POST /api/rides */
    @PostMapping
    public ResponseEntity<RideDto.Response> create(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody RideDto.CreateRequest req) {
        return ResponseEntity.ok(rideService.createRide(user, req));
    }

    /** PATCH /api/rides/:id */
    @PatchMapping("/{id}")
    public ResponseEntity<RideDto.Response> update(
            @AuthenticationPrincipal User user,
            @PathVariable String id,
            @RequestBody RideDto.CreateRequest req) {
        return ResponseEntity.ok(rideService.updateRide(user, id, req));
    }

    /** DELETE /api/rides/:id */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        rideService.deleteRide(user, id);
        return ResponseEntity.noContent().build();
    }

    /** POST /api/rides/:id/start */
    @PostMapping("/{id}/start")
    public ResponseEntity<Void> start(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        rideService.startRide(user, id);
        return ResponseEntity.noContent().build();
    }

    /** POST /api/rides/:id/complete */
    @PostMapping("/{id}/complete")
    public ResponseEntity<Void> complete(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        rideService.completeRide(user, id);
        return ResponseEntity.noContent().build();
    }

    /** POST /api/rides/:id/requests */
    @PostMapping("/{id}/requests")
    public ResponseEntity<RideRequestDto.Response> createRequest(
            @AuthenticationPrincipal User user,
            @PathVariable String id,
            @RequestBody RideRequestDto.CreateRequest req) {
        return ResponseEntity.ok(rideRequestService.createRequest(user, id, req));
    }
}
