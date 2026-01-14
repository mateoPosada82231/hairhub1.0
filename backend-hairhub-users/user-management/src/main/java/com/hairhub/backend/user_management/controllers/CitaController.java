package com.hairhub.backend.user_management.controllers;

import com.hairhub.backend.user_management.DTOs.CitaRequestDTO;
import com.hairhub.backend.user_management.DTOs.CitaResponseDTO;
import com.hairhub.backend.user_management.DTOs.TimeSlotDTO;
import com.hairhub.backend.user_management.models.Barbero;
import com.hairhub.backend.user_management.models.CitaModel;
import com.hairhub.backend.user_management.models.ServicioModel;
import com.hairhub.backend.user_management.models.Usuario;
import com.hairhub.backend.user_management.repositories.BarberoRepository;
import com.hairhub.backend.user_management.repositories.CitaModelRepository;
import com.hairhub.backend.user_management.services.CitaService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Slf4j
@RestController
@RequestMapping("/api/appointments")
public class CitaController {

    private final CitaService citaService;
    private final BarberoRepository barberoRepository;
    private final CitaModelRepository citaModelRepository;

    public CitaController(CitaService citaService, BarberoRepository barberoRepository, CitaModelRepository citaModelRepository) {
        this.citaService = citaService;
        this.barberoRepository = barberoRepository;
        this.citaModelRepository = citaModelRepository;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> crearCita(@RequestBody CitaRequestDTO dto) {
        citaService.agendarCita(dto);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Cita creada con éxito");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/mis-citas")
    public ResponseEntity<List<CitaResponseDTO>> obtenerMisCitas(Principal principal) {
        System.out.println("Recibiendo petición para obtener citas del usuario: " + principal.getName());
        try {
            String email = principal.getName();
            List<CitaModel> citas = citaService.findCitasByCliente(email);
            List<CitaResponseDTO> citasDTO = citas.stream()
                    .map(CitaResponseDTO::new)
                    .toList();
            return ResponseEntity.ok(citasDTO);
        } catch (RuntimeException e) {
            System.err.println("Error al obtener citas: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
        }
    }

    @GetMapping("/barber-citas")
    @PreAuthorize("hasRole('ROLE_BARBER')")
    public ResponseEntity<List<Map<String, Object>>> obtenerCitasPorBarbero(
            @RequestParam Integer barberId) {
        try {
            Barbero barbero = obtenerBarbero(barberId);
            List<CitaModel> citas = citaModelRepository.findByBarbero(barbero);

            List<Map<String, Object>> citasResponse = citas.stream().map(cita -> {
                Map<String, Object> citaMap = new HashMap<>();
                citaMap.put("idCita", cita.getIdCita());
                citaMap.put("fechaHora", cita.getFechaHora());
                citaMap.put("estado", cita.getEstado());
                citaMap.put("nombreCliente", cita.getCliente().getFirstNameUsuario() + " " + cita.getCliente().getLastNameUsuario());
                citaMap.put("nombreServicio", cita.getServicio().getNombreServicio());
                citaMap.put("duracionServicio", obtenerDuracionEnMinutos(cita.getServicio().getDuracionEstimadaServicio()));
                citaMap.put("precioServicio", cita.getServicio().getPrecioBaseServicio());
                citaMap.put("notas", cita.getNotas());
                return citaMap;
            }).toList();

            return ResponseEntity.ok(citasResponse);
        } catch (RuntimeException e) {
            log.error("Error al obtener citas para el barbero con ID {}: {}", barberId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
        }
    }

    @PutMapping("/{appointmentId}/status/{status}")
    public ResponseEntity<Void> actualizarEstadoCita(
            @PathVariable Integer appointmentId,
            @PathVariable String status) {
        try {

            // Verificar que el ID del path coincida con el del body
            citaService.actualizarEstadoCita(appointmentId, status);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping("/barbers/{barberId}/availability/{date}")
@PreAuthorize("hasRole('ROLE_USER')")
public ResponseEntity<List<TimeSlotDTO>> obtenerDisponibilidad(
        @PathVariable Integer barberId,
        @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
        @RequestParam int duracionMinutos) {

    validarFecha(date);
    Barbero barbero = obtenerBarbero(barberId);
    List<CitaModel> citasDelDia = obtenerCitasOrdenadas(barbero, date);

    LocalTime horaInicio = determinarHoraInicio(date);
    LocalTime horaFin = LocalTime.of(18, 30);
    List<TimeSlotDTO> slotsDisponibles = new ArrayList<>();

    for (LocalTime currentTime = horaInicio;
         currentTime.plusMinutes(duracionMinutos).isBefore(horaFin.plusSeconds(1));
         currentTime = currentTime.plusMinutes(15)) {

        if (esHoraAlmuerzo(currentTime)) {
            continue;
        }

        TimeSlot slot = new TimeSlot(currentTime, duracionMinutos);
        boolean slotDisponible = verificarDisponibilidad(slot, citasDelDia);

        TimeSlotDTO slotDTO = crearTimeSlotDTO(slot, slotDisponible, citasDelDia);
        slotsDisponibles.add(slotDTO);
    }

    return ResponseEntity.ok(slotsDisponibles);
}

private void validarFecha(LocalDate date) {
    if (date.isBefore(LocalDate.now())) {
        throw new IllegalArgumentException("No se pueden consultar fechas pasadas");
    }
}

private Barbero obtenerBarbero(Integer barberId) {
    return barberoRepository.findById(barberId)
            .orElseThrow(() -> new RuntimeException("Barbero no encontrado"));
}

private List<CitaModel> obtenerCitasOrdenadas(Barbero barbero, LocalDate date) {
    List<CitaModel> citas = citaModelRepository.findByBarberoAndFechaHoraBetween(
            barbero,
            date.atStartOfDay(),
            date.atTime(23, 59, 59)
    );
    citas.sort(Comparator.comparing(CitaModel::getFechaHora));
    return citas;
}

private LocalTime determinarHoraInicio(LocalDate date) {
    LocalTime horaInicio = LocalTime.of(10, 0);

    if (date.equals(LocalDate.now())) {
        LocalTime now = LocalTime.now();
        if (now.isAfter(horaInicio)) {
            int minutosRedondeados = ((now.getMinute() + 4) / 5) * 5;
            if (minutosRedondeados == 60) {
                horaInicio = now.plusHours(1).withMinute(0);
            } else {
                horaInicio = now.withMinute(minutosRedondeados);
            }
            horaInicio = horaInicio.withSecond(0).withNano(0);
        }
    }
    return horaInicio;
}

private boolean esHoraAlmuerzo(LocalTime time) {
    return time.isAfter(LocalTime.of(13, 0)) && time.isBefore(LocalTime.of(14, 0));
}

private boolean verificarDisponibilidad(TimeSlot slot, List<CitaModel> citasDelDia) {
    return citasDelDia.stream().noneMatch(cita -> existeSuperposicion(slot, cita));
}

private boolean existeSuperposicion(TimeSlot slot, CitaModel cita) {
    LocalTime citaInicio = cita.getFechaHora().toLocalTime();
    int duracionCita = obtenerDuracionEnMinutos(cita.getServicio().getDuracionEstimadaServicio());
    LocalTime citaFin = citaInicio.plusMinutes(duracionCita);

    return !(slot.getFin().isBefore(citaInicio) || slot.getInicio().isAfter(citaFin));
}

private int obtenerDuracionEnMinutos(String duracionStr) {
    try {
        return Integer.parseInt(duracionStr);
    } catch (NumberFormatException e) {
        LocalTime duracionTime = LocalTime.parse(duracionStr);
        return duracionTime.getHour() * 60 + duracionTime.getMinute();
    }
}

private TimeSlotDTO crearTimeSlotDTO(TimeSlot slot, boolean disponible, List<CitaModel> citasDelDia) {
    String estado = disponible ? "disponible" : "ocupado";
    String citaInfo = null;

    if (!disponible) {
        Optional<CitaModel> citaOcupada = buscarCitaEnSlot(slot, citasDelDia);
        citaInfo = citaOcupada.map(this::generarInfoCita).orElse(null);
    }

    return new TimeSlotDTO(
            slot.getInicio().format(DateTimeFormatter.ofPattern("HH:mm")),
            slot.getFin().format(DateTimeFormatter.ofPattern("HH:mm")),
            disponible,
            estado,
            citaInfo
    );
}

private Optional<CitaModel> buscarCitaEnSlot(TimeSlot slot, List<CitaModel> citasDelDia) {
    return citasDelDia.stream()
            .filter(cita -> existeSuperposicion(slot, cita))
            .findFirst();
}

private String generarInfoCita(CitaModel cita) {
    int duracionCita = obtenerDuracionEnMinutos(cita.getServicio().getDuracionEstimadaServicio());
    return String.format("Servicio: %s (%d min)",
            cita.getServicio().getNombreServicio(),
            duracionCita);
}

private static class TimeSlot {
    private final LocalTime inicio;
    private final LocalTime fin;

    public TimeSlot(LocalTime inicio, int duracionMinutos) {
        this.inicio = inicio;
        this.fin = inicio.plusMinutes(duracionMinutos);
    }

    public LocalTime getInicio() {
        return inicio;
    }

    public LocalTime getFin() {
        return fin;
    }
}

}