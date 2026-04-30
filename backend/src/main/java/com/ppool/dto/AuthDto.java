package com.ppool.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

public class AuthDto {

    @Data
    public static class ZauthLoginRequest {
        @NotBlank
        private String zauthId;     // 시온로그인 고유번호
        @NotBlank
        private String password;
    }

    @Data
    public static class SetupRequest {
        @NotBlank @Pattern(regexp = "M|F|N")
        private String gender;      // 시온로그인에 없으므로 최초 로그인 시 직접 입력
    }

    @Data
    public static class TokenResponse {
        private final String token;
        private final UserDto.Response user;
    }
}
