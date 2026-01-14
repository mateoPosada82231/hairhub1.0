package com.hairhub.backend.user_management.DTOs;

import com.hairhub.backend.user_management.models.CitaModel;
import lombok.Data;

@Data
public class CitaResponseDTO {
    private Integer idCita;
    private String fechaHora; // formato completo: "2025-04-09T14:30"
    private String nombreBarbero;
    private String nombreCliente;
    private String notas;

    public CitaResponseDTO(CitaModel cita) {
        this.idCita = cita.getIdCita();
        this.fechaHora = cita.getFechaHora().toString(); // puedes formatearlo si lo prefieres
        this.nombreBarbero = cita.getBarbero() != null
                ? cita.getBarbero().getNombreBarbero()
                : "Sin asignar";
        this.nombreCliente = cita.getCliente().getFirstNameUsuario() + " " + cita.getCliente().getLastNameUsuario();
        this.notas = cita.getNotas();
    }

    // getters y setters
}