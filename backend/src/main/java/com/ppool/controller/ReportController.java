package com.ppool.controller;

import com.ppool.entity.Report;
import com.ppool.entity.Ride;
import com.ppool.entity.User;
import com.ppool.repository.ReportRepository;
import com.ppool.repository.RideRepository;
import com.ppool.repository.UserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final RideRepository rideRepository;

    @Data
    public static class ReportRequest {
        @NotBlank private String reportedId;
        private String rideId;
        @NotBlank private String reason;
        private String description;
    }

    /** POST /api/reports */
    @PostMapping
    public ResponseEntity<Void> createReport(
            @AuthenticationPrincipal User reporter,
            @Valid @RequestBody ReportRequest req) {

        User reported = userRepository.findById(req.getReportedId())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        Ride ride = req.getRideId() != null
                ? rideRepository.findById(req.getRideId()).orElse(null)
                : null;

        Report report = Report.builder()
                .reporter(reporter)
                .reported(reported)
                .ride(ride)
                .reason(Report.ReportReason.valueOf(req.getReason()))
                .description(req.getDescription())
                .build();

        reportRepository.save(report);
        return ResponseEntity.noContent().build();
    }
}
