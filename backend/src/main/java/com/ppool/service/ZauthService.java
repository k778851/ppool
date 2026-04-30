package com.ppool.service;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

/**
 * 시온로그인 API 연동 서비스
 * - 고유번호 + 비밀번호로 인증 후 성도 정보(이름·부서·연락처) 수신
 */
@Service
public class ZauthService {

    private final WebClient webClient;

    public ZauthService(@Value("${zauth.api-url}") String apiUrl) {
        this.webClient = WebClient.builder().baseUrl(apiUrl).build();
    }

    /**
     * 시온로그인 인증 및 사용자 정보 조회
     * @throws RuntimeException 인증 실패 시
     */
    @SuppressWarnings("unchecked")
    public ZauthUserInfo verify(String zauthId, String password) {
        Map<String, Object> response = webClient.post()
                .uri("/verify")
                .bodyValue(Map.of("zauthId", zauthId, "password", password))
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        if (response == null || Boolean.FALSE.equals(response.get("success"))) {
            throw new RuntimeException("시온로그인 인증에 실패하였습니다.");
        }

        ZauthUserInfo info = new ZauthUserInfo();
        info.setName((String) response.getOrDefault("name", ""));
        info.setDepartment((String) response.getOrDefault("department", ""));
        info.setPhone((String) response.get("phone")); // null 허용
        return info;
    }

    @Data
    public static class ZauthUserInfo {
        private String name;
        private String department;
        private String phone;
    }
}
