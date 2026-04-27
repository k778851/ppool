package com.ppool.service;

import com.ppool.dto.AuthDto;
import com.ppool.dto.UserDto;
import com.ppool.entity.User;
import com.ppool.repository.UserRepository;
import com.ppool.security.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final KakaoAuthService kakaoAuthService;
    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;

    /**
     * 카카오 인가코드 → JWT 발급
     * 신규 사용자면 PENDING 상태로 생성 후 토큰 반환
     */
    @Transactional
    public AuthDto.TokenResponse kakaoLogin(String code) {
        String accessToken = kakaoAuthService.getAccessToken(code);
        String kakaoId = kakaoAuthService.getKakaoId(accessToken);

        User user = userRepository.findByKakaoId(kakaoId).orElseGet(() -> {
            // 신규 사용자 — 기본 정보만 저장, 나머지는 /auth/signup 에서 완성
            return userRepository.save(User.builder()
                    .kakaoId(kakaoId)
                    .name("신규회원")
                    .status(User.UserStatus.PENDING)
                    .build());
        });

        String token = jwtProvider.generateToken(user.getId());
        return new AuthDto.TokenResponse(token, UserDto.Response.from(user));
    }

    /**
     * 회원가입 정보 제출 (PENDING 사용자가 이름·부서·전화·성별 입력)
     */
    @Transactional
    public UserDto.Response signup(User currentUser, AuthDto.SignupRequest req) {
        if (currentUser.getStatus() != User.UserStatus.PENDING) {
            throw new IllegalStateException("이미 처리된 회원입니다.");
        }
        currentUser.setName(req.getName());
        currentUser.setDepartment(req.getDepartment());
        currentUser.setPhone(req.getPhone());
        currentUser.setGender(User.Gender.valueOf(req.getGender()));
        return UserDto.Response.from(userRepository.save(currentUser));
    }
}
