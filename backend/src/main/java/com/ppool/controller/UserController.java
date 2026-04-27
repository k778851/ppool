package com.ppool.controller;

import com.ppool.dto.UserDto;
import com.ppool.dto.VehicleDto;
import com.ppool.entity.User;
import com.ppool.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /** GET /api/users/me */
    @GetMapping("/me")
    public ResponseEntity<UserDto.Response> getMe(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(UserDto.Response.from(user));
    }

    /** PATCH /api/users/me */
    @PatchMapping("/me")
    public ResponseEntity<UserDto.Response> updateMe(
            @AuthenticationPrincipal User user,
            @RequestBody UserDto.UpdateRequest req) {
        return ResponseEntity.ok(userService.updateMe(user, req));
    }

    /** POST /api/users/me/vehicle */
    @PostMapping("/me/vehicle")
    public ResponseEntity<VehicleDto.Response> addVehicle(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody VehicleDto.CreateRequest req) {
        return ResponseEntity.ok(userService.addVehicle(user, req));
    }
}
