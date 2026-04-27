package com.ppool.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Component
public class EncryptUtil {

    private final byte[] keyBytes;

    public EncryptUtil(@Value("${encrypt.key}") String key) {
        // AES-256: 32 bytes
        byte[] raw = key.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        this.keyBytes = java.util.Arrays.copyOf(raw, 32);
    }

    public String encrypt(String plaintext) {
        if (plaintext == null) return null;
        try {
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            cipher.init(Cipher.ENCRYPT_MODE, new SecretKeySpec(keyBytes, "AES"));
            return Base64.getEncoder().encodeToString(cipher.doFinal(plaintext.getBytes()));
        } catch (Exception e) {
            throw new RuntimeException("암호화 실패", e);
        }
    }

    public String decrypt(String ciphertext) {
        if (ciphertext == null) return null;
        try {
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            cipher.init(Cipher.DECRYPT_MODE, new SecretKeySpec(keyBytes, "AES"));
            return new String(cipher.doFinal(Base64.getDecoder().decode(ciphertext)));
        } catch (Exception e) {
            throw new RuntimeException("복호화 실패", e);
        }
    }

    /** 전화번호 뒤 4자리만 보이도록 마스킹 */
    public String maskPhone(String phone) {
        if (phone == null || phone.length() < 4) return phone;
        return "*".repeat(phone.length() - 4) + phone.substring(phone.length() - 4);
    }
}
