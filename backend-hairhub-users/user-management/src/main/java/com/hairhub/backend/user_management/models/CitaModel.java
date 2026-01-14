package com.hairhub.backend.user_management.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CitaModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCita;

    @ManyToOne
    @JoinColumn(name = "id_cliente_cita", nullable = false)
    private Usuario cliente;

    @ManyToOne
    @JoinColumn(name = "id_barbero_cita", nullable = false)
    private Barbero barbero;

    @ManyToOne
    @JoinColumn(name = "id_servicio_cita", nullable = false)
    private ServicioModel servicio;

    @Column(nullable = false)
    private LocalDateTime fechaHora;

    private String notas;

    @Column(nullable = false)
    private String estado; // PENDING, CONFIRMED, CANCELLED, COMPLETED

    @Column(nullable = false)
    private LocalDateTime fechaCreacion;


    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        estado = "PENDING"; // Estado inicial por defecto
    }

    public double getPrecioTotal() {
        return servicio.getPrecioBaseServicio();
    }
}
