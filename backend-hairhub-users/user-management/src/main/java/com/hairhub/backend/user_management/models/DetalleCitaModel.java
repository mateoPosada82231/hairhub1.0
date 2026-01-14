package com.hairhub.backend.user_management.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetalleCitaModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idDetalleCita;

    @ManyToOne
    @JoinColumn(name = "id_cita_detalleCita")
    private CitaModel cita;

    @ManyToOne
    @JoinColumn(name = "id_servicio_detalleCita")
    private ServicioModel servicio;
}

