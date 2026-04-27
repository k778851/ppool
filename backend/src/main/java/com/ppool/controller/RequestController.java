package com.ppool.controller;

import com.ppool.entity.User;
import com.ppool.service.RideRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class RequestController {

    private final RideRequestService rideRequestService;

    /** PATCH /api/requests/:id/approve */
    @PatchMapping("/{id}/approve")
    public ResponseEntity<Void> approve(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        rideRequestService.approve(user, id);
        return ResponseEntity.noContent().build();
    }

    /** PATCH /api/requests/:id/reject */
    @PatchMapping("/{id}/reject")
    public ResponseEntity<Void> reject(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        rideRequestService.reject(user, id);
        return ResponseEntity.noContent().build();
    }

    /** DELETE /api/requests/:id */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancel(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        rideRequestService.cancel(user, id);
        return ResponseEntity.noContent().build();
    }
}
