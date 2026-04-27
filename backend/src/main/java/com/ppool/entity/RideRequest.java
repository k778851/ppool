package com.ppool.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ride_requests")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RideRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ride_id", nullable = false)
    private Ride ride;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rider_id", nullable = false)
    private User rider;

    private String pickupLocation;
    private Double pickupLat;
    private Double pickupLng;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status = RequestStatus.PENDING;

    @CreationTimestamp
    private LocalDateTime createdAt;

    private LocalDateTime respondedAt;

    public enum RequestStatus {
        PENDING, APPROVED, REJECTED, CANCELLED, NO_SHOW, COMPLETED
    }
}
