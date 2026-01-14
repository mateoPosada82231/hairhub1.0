package com.hairhub.backend.user_management.controllers;

import com.hairhub.backend.user_management.DTOs.BarberReportDTO;
import com.hairhub.backend.user_management.DTOs.ServiceReportDTO;
import com.hairhub.backend.user_management.DTOs.WeekDayReportDTO;
import com.hairhub.backend.user_management.services.ReportsService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportsController {

    private ReportsService reportsService;

    public ReportsController(ReportsService reportsService) {
        this.reportsService = reportsService;
    }

    @GetMapping("/barbers")
    public List<BarberReportDTO> getBarberReports(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return reportsService.getBarberReports(startDate, endDate);
    }

    @GetMapping("/weekdays")
    public List<WeekDayReportDTO> getWeekdayReports(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return reportsService.getWeekdayReports(startDate, endDate);
    }

    @GetMapping("/services")
    public List<ServiceReportDTO> getServiceReports(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return reportsService.getServiceReports(startDate, endDate);
    }
}
