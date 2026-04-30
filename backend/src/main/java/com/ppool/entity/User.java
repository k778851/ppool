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
    private String zauthId;       // 시온로그인 고유번호

    @Column(nullable = false)
    private String name;

    private String phone;
    private String department;

    @Enumerated(EnumType.STRING)
    @Column(length = 1)
    private Gender gender;        // 시온로그인에 없으므로 최초 로그인 시 직접 입력

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
