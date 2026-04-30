package com.ppool.controller;

import com.ppool.dto.AuthDto;
import com.ppool.entity.User;
import com.ppool.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /** POST /api/auth/zauth — 시온로그인 고유번호+비밀번호 → JWT 발급 */
    @PostMapping("/zauth")
    public ResponseEntity<AuthDto.TokenResponse> zauthLogin(
            @Valid @RequestBody AuthDto.ZauthLoginRequest req) {
        return ResponseEntity.ok(authService.zauthLogin(req.getZauthId(), req.getPassword()));
    }

    /** POST /api/auth/setup — 최초 로그인 셋업 (성별 저장) */
    @PostMapping("/setup")
    public ResponseEntity<?> setup(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody AuthDto.SetupRequest req) {
        return ResponseEntity.ok(authService.setup(user, req));
    }
}
