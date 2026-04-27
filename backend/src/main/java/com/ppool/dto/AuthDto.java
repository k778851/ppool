package com.ppool.dto;

import com.ppool.entity.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

public class AuthDto {

    @Data
    public static class KakaoCallbackRequest {
        @NotBlank
        private String code;
    }

    @Data
    public static class SignupRequest {
        @NotBlank
        private String name;
        @NotBlank
        private String department;
        @NotBlank
        private String phone;
        @Pattern(regexp = "M|F|N")
        private String gender;
    }

    @Data
    public static class TokenResponse {
        private final String token;
        private final UserDto.Response user;
    }
}
