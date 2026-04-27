package com.ppool.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_id", nullable = false)
    private User reported;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ride_id")
    private Ride ride;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportReason reason;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportStatus status = ReportStatus.PENDING;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public enum ReportReason { NO_SHOW, RUDE, UNSAFE, FARE, OTHER }

    public enum ReportStatus { PENDING, REVIEWED, DISMISSED }
}
