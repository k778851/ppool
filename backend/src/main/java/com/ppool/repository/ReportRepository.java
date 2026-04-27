package com.ppool.repository;

import com.ppool.entity.Report;
import com.ppool.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, String> {
    List<Report> findByReported(User reported);
    List<Report> findByStatus(Report.ReportStatus status);
}
