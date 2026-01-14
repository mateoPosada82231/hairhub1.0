package com.hairhub.backend.user_management.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimeSlotDTO {
//    private String startTime;
//    private String endTime;
//    private boolean available;
//    private Long serviceId;

        private String horaInicio;
        private String horaFin;
        private boolean disponible;
        private String estado;       // "disponible", "ocupado", "no disponible"
        private String citaInfo;     // información de la cita si está ocupado

}