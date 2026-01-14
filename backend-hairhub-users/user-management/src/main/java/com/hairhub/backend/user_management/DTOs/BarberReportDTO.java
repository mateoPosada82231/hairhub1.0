package com.hairhub.backend.user_management.DTOs;


import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class BarberReportDTO {
    // Getters y setters
    private String nombreBarbero;
    private String apellidoBarbero;
    private Integer totalCitas;
    private Double ingresoTotal;

    public BarberReportDTO(String nombreBarbero, Integer totalCitas, Double ingresoTotal, String apellidoBarbero) {
        this.nombreBarbero = nombreBarbero;
        this.totalCitas = totalCitas;
        this.apellidoBarbero = apellidoBarbero;
        this.ingresoTotal = ingresoTotal;
    }

}
