package com.hairhub.backend.user_management.DTOs;

import lombok.Data;

@Data
public class CitaRequestDTO {

    private Integer barberId;
    private String date; // formato: "2025-04-09"
    private String time; // formato: "14:30"
    private Integer serviceId;
    private String notes;
    private Long clientId;

}
