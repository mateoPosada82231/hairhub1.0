package com.hairhub.backend.user_management.DTOs;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ServicioDTO {

    private String nombreServicio;
    private Double precioBaseServicio;
    private Integer duracionEstimadaServicio;

}
