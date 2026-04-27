package com.ppool.controller;

import com.ppool.dto.RideDto;
import com.ppool.dto.UserDto;
import com.ppool.service.AdminService;
import com.ppool.service.RideService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final RideService rideService;

    /** GET /api/admin/users */
    @GetMapping("/users")
    public ResponseEntity<List<UserDto.Response>> getUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    /** PATCH /api/admin/users/:id/approve */
    @PatchMapping("/users/{id}/approve")
    public ResponseEntity<Void> approveUser(@PathVariable String id) {
        adminService.approveUser(id);
        return ResponseEntity.noContent().build();
    }

    /** PATCH /api/admin/users/:id/reject */
    @PatchMapping("/users/{id}/reject")
    public ResponseEntity<Void> rejectUser(@PathVariable String id) {
        adminService.rejectUser(id);
        return ResponseEntity.noContent().build();
    }

    @Data
    public static class BanRequest {
        private int days = 30;
    }

    /** PATCH /api/admin/users/:id/ban */
    @PatchMapping("/users/{id}/ban")
    public ResponseEntity<Void> banUser(
            @PathVariable String id,
            @RequestBody(required = false) BanRequest req) {
        int days = req != null ? req.getDays() : 30;
        adminService.banUser(id, days);
        return ResponseEntity.noContent().build();
    }

    /** GET /api/admin/rides */
    @GetMapping("/rides")
    public ResponseEntity<List<RideDto.Response>> getRides() {
        return ResponseEntity.ok(rideService.listRides(null, 0, 100));
    }
}
