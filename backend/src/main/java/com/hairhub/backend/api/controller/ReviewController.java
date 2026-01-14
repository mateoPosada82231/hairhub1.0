package com.hairhub.backend.api.controller;

import com.hairhub.backend.api.dto.appointment.ReviewResponse;
import com.hairhub.backend.api.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/businesses/{businessId}/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final AppointmentService appointmentService;

    /**
     * Get all reviews for a business (public)
     */
    @GetMapping
    public ResponseEntity<List<ReviewResponse>> getBusinessReviews(@PathVariable Long businessId) {
        return ResponseEntity.ok(appointmentService.getBusinessReviews(businessId));
    }
}

