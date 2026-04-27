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

    /** POST /api/auth/kakao — 카카오 인가코드로 JWT 발급 */
    @PostMapping("/kakao")
    public ResponseEntity<AuthDto.TokenResponse> kakaoLogin(
            @Valid @RequestBody AuthDto.KakaoCallbackRequest req) {
        return ResponseEntity.ok(authService.kakaoLogin(req.getCode()));
    }

    /** POST /api/auth/signup — 회원가입 추가 정보 제출 */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody AuthDto.SignupRequest req) {
        return ResponseEntity.ok(authService.signup(user, req));
    }
}
