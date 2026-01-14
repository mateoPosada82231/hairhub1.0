package com.hairhub.backend.user_management.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalTime;

@Data
@Builder
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table (name = "servicios")
public class ServicioModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idServicio;

    private String nombreServicio;
    private Double precioBaseServicio;

    @Column(name = "duracion_estimada_servicio")
    private String duracionEstimadaServicio; // Cambiado a String para almacenar el formato HH:mm:ss

    private String notes;


}
