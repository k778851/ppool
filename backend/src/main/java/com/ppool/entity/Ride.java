package com.ppool.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "rides")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Ride {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id", nullable = false)
    private User driver;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @Column(nullable = false)
    private String origin;

    private Double originLat;
    private Double originLng;

    @Column(nullable = false)
    private String destination;

    private Double destinationLat;
    private Double destinationLng;

    private String waypoints; // JSON 문자열로 저장

    @Column(nullable = false)
    private LocalDateTime departureTime;

    @Column(nullable = false)
    private int maxSeats;

    @Column(nullable = false)
    private int farePerPerson = 3000; // 고정

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GenderPreference genderPreference = GenderPreference.ANY;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RideStatus status = RideStatus.OPEN;

    private String notice;

    @CreationTimestamp
    private LocalDateTime createdAt;

    private LocalDateTime startedAt;
    private LocalDateTime completedAt;

    public enum GenderPreference { ANY, SAME_ONLY }

    public enum RideStatus { OPEN, FULL, STARTED, COMPLETED, CANCELLED }
}
