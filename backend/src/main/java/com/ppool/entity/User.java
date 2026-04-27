package com.ppool.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(unique = true, nullable = false)
    private String kakaoId;

    @Column(nullable = false)
    private String name;

    private String phone;        // 부분 암호화 저장
    private String department;

    @Enumerated(EnumType.STRING)
    @Column(length = 1)
    private Gender gender;

    private String accountNumber; // AES-256 암호화 저장
    private String accountBank;

    @Column(nullable = false)
    private boolean isDriver = false;

    @Column(nullable = false)
    private boolean isAdmin = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status = UserStatus.PENDING;

    @Column(nullable = false)
    private int noShowCount = 0;

    @Column(nullable = false)
    private int reportCount = 0;

    private LocalDateTime bannedUntil;

    @CreationTimestamp
    private LocalDateTime createdAt;

    private LocalDateTime approvedAt;

    public enum Gender { M, F, N }

    public enum UserStatus { PENDING, APPROVED, REJECTED, BANNED }
}
