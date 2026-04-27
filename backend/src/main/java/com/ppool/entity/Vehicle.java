package com.ppool.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vehicles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private String plateNumber;

    @Column(nullable = false)
    private String carModel;

    @Column(nullable = false)
    private int maxSeats;

    @Column(nullable = false)
    private boolean insuranceVerified = false;

    @Column(nullable = false)
    private boolean licenseVerified = false;

    @Column(nullable = false)
    private boolean nonCommercialConfirmed = false;
}
