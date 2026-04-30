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

    private final ZauthService zauthService;
    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;

    /**
     * 시온로그인 → JWT 발급
     * 신규 사용자면 PENDING 상태로 생성 후 토큰 반환 (성별은 /auth/setup 에서 완성)
     */
    @Transactional
    public AuthDto.TokenResponse zauthLogin(String zauthId, String password) {
        // 시온로그인 API 호출 → 이름·부서·연락처 수신
        ZauthService.ZauthUserInfo info = zauthService.verify(zauthId, password);

        User user = userRepository.findByZauthId(zauthId).orElseGet(() ->
            userRepository.save(User.builder()
                    .zauthId(zauthId)
                    .name(info.getName())
                    .department(info.getDepartment())
                    .phone(info.getPhone())
                    .status(User.UserStatus.PENDING)
                    .build())
        );

        // 시온로그인에서 받은 정보 최신화
        user.setName(info.getName());
        user.setDepartment(info.getDepartment());
        if (info.getPhone() != null) user.setPhone(info.getPhone());
        userRepository.save(user);

        String token = jwtProvider.generateToken(user.getId());
        return new AuthDto.TokenResponse(token, UserDto.Response.from(user));
    }

    /**
     * 최초 로그인 셋업: 성별 저장 (시온로그인에 없는 정보)
     */
    @Transactional
    public UserDto.Response setup(User currentUser, AuthDto.SetupRequest req) {
        if (currentUser.getGender() != null) {
            // 이미 셋업 완료 — 성별만 재설정은 허용
        }
        currentUser.setGender(User.Gender.valueOf(req.getGender()));
        return UserDto.Response.from(userRepository.save(currentUser));
    }
}
