package com.ppool.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class KakaoAuthService {

    private final WebClient kakaoAuthClient;
    private final WebClient kakaoApiClient;

    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.kakao.client-secret}")
    private String clientSecret;

    @Value("${spring.security.oauth2.client.registration.kakao.redirect-uri}")
    private String redirectUri;

    public KakaoAuthService(
            @Value("${kakao.auth-url}") String authUrl,
            @Value("${kakao.api-url}") String apiUrl) {
        this.kakaoAuthClient = WebClient.builder().baseUrl(authUrl).build();
        this.kakaoApiClient = WebClient.builder().baseUrl(apiUrl).build();
    }

    /** 인가코드 → 카카오 access_token */
    public String getAccessToken(String code) {
        @SuppressWarnings("unchecked")
        Map<String, Object> response = kakaoAuthClient.post()
                .uri("/oauth/token")
                .header("Content-Type", "application/x-www-form-urlencoded")
                .bodyValue("grant_type=authorization_code"
                        + "&client_id=" + clientId
                        + "&client_secret=" + clientSecret
                        + "&redirect_uri=" + redirectUri
                        + "&code=" + code)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        if (response == null || !response.containsKey("access_token")) {
            throw new RuntimeException("카카오 토큰 발급 실패");
        }
        return (String) response.get("access_token");
    }

    /** access_token → 카카오 회원번호 (kakaoId) */
    public String getKakaoId(String accessToken) {
        @SuppressWarnings("unchecked")
        Map<String, Object> response = kakaoApiClient.get()
                .uri("/v2/user/me")
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        if (response == null || !response.containsKey("id")) {
            throw new RuntimeException("카카오 사용자 정보 조회 실패");
        }
        return String.valueOf(response.get("id"));
    }
}
