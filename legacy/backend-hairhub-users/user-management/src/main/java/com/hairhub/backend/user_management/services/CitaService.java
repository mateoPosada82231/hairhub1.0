package com.hairhub.backend.user_management.services;

import com.hairhub.backend.user_management.DTOs.CitaRequestDTO;
import com.hairhub.backend.user_management.DTOs.TimeSlotDTO;
import com.hairhub.backend.user_management.models.*;
import com.hairhub.backend.user_management.repositories.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CitaService {

    private final BarberoRepository barberoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ServicioModelRepository servicioModelRepository;
    private final CitaModelRepository citaModelRepository;
    private final DisponibilidadBarberoRepository disponibilidadRepository;

    public CitaService(BarberoRepository barberoRepository, UsuarioRepository usuarioRepository, ServicioModelRepository servicioModelRepository, CitaModelRepository citaModelRepository, DisponibilidadBarberoRepository disponibilidadRepository) {
        this.barberoRepository = barberoRepository;
        this.usuarioRepository = usuarioRepository;
        this.servicioModelRepository = servicioModelRepository;
        this.citaModelRepository = citaModelRepository;
        this.disponibilidadRepository = disponibilidadRepository;
    }
    public List<CitaModel> obtenerCitasPorBarberoYFecha(Integer barberId, LocalDate fecha) {
        Barbero barbero = barberoRepository.findById(barberId)
                .orElseThrow(() -> new RuntimeException("Barbero no encontrado"));

        LocalDateTime inicioDia = fecha.atStartOfDay();
        LocalDateTime finDia = fecha.atTime(23, 59, 59);

        return citaModelRepository.findByBarberoAndFechaHoraBetween(barbero, inicioDia, finDia);
    }

    public CitaModel agendarCita(CitaRequestDTO dto) {
        // 1. Obtener el usuario autenticado
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Usuario cliente = usuarioRepository.findByEmailUsuario(email)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        // 2. Validar y obtener el barbero
        if (dto.getBarberId() == null) {
            throw new IllegalArgumentException("El ID del barbero no puede ser nulo.");
        }

        Barbero barbero = barberoRepository.findById(dto.getBarberId())
                .orElseThrow(() -> new RuntimeException("Barbero no encontrado"));

        // 3. Validar y obtener el servicio
        if (dto.getServiceId() == null) {
            throw new IllegalArgumentException("El ID del servicio no puede ser nulo.");
        }

        ServicioModel servicio = servicioModelRepository.findById(dto.getServiceId())
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));

        // 4. Parsear y validar fecha y hora
        LocalDate fecha;
        LocalTime hora;
        try {
            fecha = LocalDate.parse(dto.getDate()); // Espera formato "yyyy-MM-dd"
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Formato de fecha inválido. Se esperaba 'yyyy-MM-dd'.");
        }

        try {
            hora = LocalTime.parse(dto.getTime()); // Espera formato "HH:mm"
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Formato de hora inválido. Se esperaba 'HH:mm'.");
        }

        LocalDateTime fechaHora = LocalDateTime.of(fecha, hora);

        // 5. Parsear duración estimada del servicio
        String duracionStr = servicio.getDuracionEstimadaServicio();
        int duracionServicio;

        try {
            // Intenta parsear el formato HH:mm:ss
            LocalTime duracionTime = LocalTime.parse(duracionStr, DateTimeFormatter.ofPattern("HH:mm:ss"));
            duracionServicio = duracionTime.getHour() * 60 + duracionTime.getMinute();
        } catch (DateTimeParseException e) {
            try {
                // Si falla, intenta parsear el formato mm
                duracionServicio = Integer.parseInt(duracionStr);
            } catch (NumberFormatException ex) {
                throw new IllegalArgumentException("Duración del servicio mal formateada. Se esperaba 'HH:mm:ss' o minutos.");
            }
        }

        LocalDateTime fechaHoraFin = fechaHora.plusMinutes(duracionServicio);

        // 6. Validaciones
        validarFechaHora(fechaHora);

        if (fechaHoraFin.toLocalTime().isAfter(LocalTime.of(20, 0))) {
            throw new RuntimeException("La duración del servicio excede el horario de trabajo (hasta las 20:00).");
        }

        validarDisponibilidadCompleta(barbero, fechaHora, fechaHoraFin);
        validarCitasExistentes(cliente, barbero, fechaHora, servicio);

        // 7. Crear y guardar la cita
        CitaModel cita = new CitaModel();
        cita.setCliente(cliente);
        cita.setBarbero(barbero);
        cita.setServicio(servicio);
        cita.setFechaHora(fechaHora);
        cita.setNotas(dto.getNotes());

        actualizarDisponibilidadCompleta(barbero, fechaHora, fechaHoraFin);

        return citaModelRepository.save(cita);
    }


    // Nuevo método para validar disponibilidad completa
    private void validarDisponibilidadCompleta(Barbero barbero, LocalDateTime inicio, LocalDateTime fin) {
        // Verificar si hay citas que se superpongan en el período
        boolean existeSuperposicion = citaModelRepository.existsByBarberoAndFechaHoraBetween(
                barbero,
                inicio,
                fin
        );

        if (existeSuperposicion) {
            throw new RuntimeException("Ya existe una cita programada que se superpone con este horario");
        }

        // Verificar disponibilidad continua del barbero
        LocalDate fecha = inicio.toLocalDate();
        LocalTime horaInicio = inicio.toLocalTime();
        LocalTime horaFin = fin.toLocalTime();

        List<DisponibilidadBarbero> slotsDisponibles = disponibilidadRepository
                .findByBarberoAndFechaAndHoraInicioBetween(
                        barbero,
                        fecha,
                        horaInicio,
                        horaFin
                );

        // Verificar que todos los slots necesarios estén disponibles
        boolean todosDisponibles = slotsDisponibles.stream()
                .allMatch(DisponibilidadBarbero::isDisponible);

        if (!todosDisponibles) {
            throw new RuntimeException("El barbero no está disponible durante todo el tiempo necesario para el servicio");
        }
    }

    // Nuevo método para actualizar la disponibilidad durante todo el servicio
    private void actualizarDisponibilidadCompleta(Barbero barbero, LocalDateTime inicio, LocalDateTime fin) {
        LocalDate fecha = inicio.toLocalDate();
        LocalTime horaInicio = inicio.toLocalTime();
        LocalTime horaFin = fin.toLocalTime();

        // Obtener todos los slots que cubren la duración del servicio
        List<DisponibilidadBarbero> slots = disponibilidadRepository
                .findByBarberoAndFechaAndHoraInicioBetween(
                        barbero,
                        fecha,
                        horaInicio,
                        horaFin
                );

        // Marcar como no disponibles todos los slots que cubre el servicio
        for (DisponibilidadBarbero slot : slots) {
            slot.setDisponible(false);
            disponibilidadRepository.save(slot);
        }
    }

    private void validarFechaHora(LocalDateTime fechaHora) {
        // No permitir citas en el pasado
        if (fechaHora.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("No se pueden agendar citas en el pasado");
        }

        // Validar que sea un día laboral (lunes a sábado)
        if (fechaHora.getDayOfWeek() == DayOfWeek.SUNDAY) {
            throw new RuntimeException("No se pueden agendar citas los domingos");
        }

        // Validar horario de trabajo (por ejemplo, de 9:00 a 20:00)
        LocalTime hora = fechaHora.toLocalTime();
        if (hora.isBefore(LocalTime.of(9, 0)) || hora.isAfter(LocalTime.of(20, 0))) {
            throw new RuntimeException("El horario debe estar entre las 9:00 y las 20:00");
        }
    }

    private void validarCitasExistentes(Usuario cliente, Barbero barbero, LocalDateTime fechaHora, ServicioModel servicio) {
        // Obtener la duración del servicio actual
        String duracionStr = servicio.getDuracionEstimadaServicio();
        int duracionMinutos;

        try {
            // Intenta parsear el formato HH:mm:ss
            LocalTime duracionTime = LocalTime.parse(duracionStr, DateTimeFormatter.ofPattern("HH:mm:ss"));
            duracionMinutos = duracionTime.getHour() * 60 + duracionTime.getMinute();
        } catch (DateTimeParseException e) {
            // Si falla, asume que es directamente en minutos
            duracionMinutos = Integer.parseInt(duracionStr);
        }

        LocalDateTime fechaHoraFin = fechaHora.plusMinutes(duracionMinutos);

        // Obtener las citas del barbero para ese día
        List<CitaModel> citasDelDia = citaModelRepository.findByBarberoAndFechaHoraBetween(
                barbero,
                fechaHora.toLocalDate().atStartOfDay(),
                fechaHora.toLocalDate().atTime(23, 59, 59)
        );

        // Verificar superposición con otras citas del barbero
        boolean tieneCitaSolapada = citasDelDia.stream().anyMatch(cita -> {
            LocalDateTime citaInicio = cita.getFechaHora();
            String duracionCitaStr = cita.getServicio().getDuracionEstimadaServicio();
            int duracionCitaMinutos;

            try {
                LocalTime duracionCitaTime = LocalTime.parse(duracionCitaStr, DateTimeFormatter.ofPattern("HH:mm:ss"));
                duracionCitaMinutos = duracionCitaTime.getHour() * 60 + duracionCitaTime.getMinute();
            } catch (DateTimeParseException e) {
                duracionCitaMinutos = Integer.parseInt(duracionCitaStr);
            }

            LocalDateTime citaFin = citaInicio.plusMinutes(duracionCitaMinutos);
            return !(fechaHoraFin.isBefore(citaInicio) || fechaHora.isAfter(citaFin));
        });

        if (tieneCitaSolapada) {
            throw new RuntimeException("El barbero ya tiene una cita programada en este horario");
        }
    }

    private void actualizarDisponibilidad(Barbero barbero, LocalDate fecha, LocalTime hora, Integer duracionServicio) {
        // Calcular la hora de fin basada en la duración del servicio
        LocalTime horaFin = hora.plusMinutes(duracionServicio);

        // Marcar los slots como no disponibles
        List<DisponibilidadBarbero> slots = disponibilidadRepository
                .findByBarberoAndFechaAndHoraInicioBetween(
                        barbero, fecha, hora, horaFin);

        for (DisponibilidadBarbero slot : slots) {
            slot.setDisponible(false);
            disponibilidadRepository.save(slot);
        }
    }

    public List<CitaModel> findCitasByCliente(String email) {

        Usuario cliente = usuarioRepository.findByEmailUsuario(email)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        return citaModelRepository.findByCliente(cliente);
    }

//    public List<TimeSlotDTO> obtenerDisponibilidad(Integer idBarbero, LocalDate fecha) {
//        Barbero barbero = barberoRepository.findById(idBarbero)
//                .orElseThrow(() -> new RuntimeException("Barbero no encontrado"));
//
//        // Obtener todas las citas del barbero para esa fecha
//        List<CitaModel> citasDelDia = citaModelRepository.findByBarberoAndFechaHoraBetween(
//                barbero,
//                fecha.atStartOfDay(),
//                fecha.atTime(23, 59, 59)
//        );
//
//        // Obtener la disponibilidad base del barbero
//        List<DisponibilidadBarbero> disponibilidadBase = disponibilidadRepository
//                .findByBarberoAndFecha(barbero, fecha);
//
//        // Crear slots de 15 minutos
//        List<TimeSlotDTO> slotsDisponibles = new ArrayList<>();
//        LocalTime horaInicio = LocalTime.of(9, 0);
//        LocalTime horaFin = LocalTime.of(20, 0);
//        LocalTime currentTime = horaInicio;
//
//        // Si es hoy, empezar desde la hora actual
//        if (fecha.equals(LocalDate.now())) {
//            LocalTime now = LocalTime.now();
//            if (now.isAfter(horaInicio)) {
//                // Redondear al siguiente intervalo de 15 minutos
//                int minutes = now.getMinute();
//                int roundedMinutes = ((minutes + 14) / 15) * 15;
//                currentTime = now.withMinute(roundedMinutes).withSecond(0).withNano(0);
//            }
//        }
//
//        while (currentTime.isBefore(horaFin)) {
//            LocalTime slotEndTime = currentTime.plusMinutes(15);
//            boolean isAvailable = true;
//
//            // Verificar si el slot está dentro del horario del barbero
//            boolean enHorarioBarbero = false;
//            for (DisponibilidadBarbero disp : disponibilidadBase) {
//                if (currentTime.compareTo(disp.getHoraInicio()) >= 0 &&
//                        slotEndTime.compareTo(disp.getHoraFin()) <= 0 &&
//                        disp.isDisponible()) {
//                    enHorarioBarbero = true;
//                    break;
//                }
//            }
//
//            if (!enHorarioBarbero) {
//                currentTime = slotEndTime;
//                continue;
//            }
//
//            // Verificar si hay superposición con citas existentes
//            for (CitaModel cita : citasDelDia) {
//                LocalTime citaInicio = cita.getFechaHora().toLocalTime();
//                LocalTime citaFin = citaInicio.plusMinutes(
//                        Integer.parseInt(cita.getServicio().getDuracionEstimadaServicio())
//                );
//
//                if (!(slotEndTime.isBefore(citaInicio) || currentTime.isAfter(citaFin))) {
//                    isAvailable = false;
//                    break;
//                }
//            }
//
//            if (isAvailable) {
//                // Verificar si hay suficiente tiempo hasta la próxima cita
//                boolean tiempoSuficiente = true;
//                for (CitaModel cita : citasDelDia) {
//                    LocalTime citaInicio = cita.getFechaHora().toLocalTime();
//                    if (citaInicio.isAfter(currentTime)) {
//                        long minutosHastaCita = Duration.between(currentTime, citaInicio).toMinutes();
//                        if (minutosHastaCita < 15) { // Mínimo 15 minutos entre citas
//                            tiempoSuficiente = false;
//                            break;
//                        }
//                    }
//                }
//
//                if (tiempoSuficiente) {
//                    slotsDisponibles.add(new TimeSlotDTO(
//                            currentTime.toString(),
//                            slotEndTime.toString(),
//                            true
//                    ));
//                }
//            }
//
//            currentTime = slotEndTime;
//        }
//
//        return slotsDisponibles;
//    }

    private void validarDisponibilidad(Barbero barbero, LocalDateTime fechaHora, ServicioModel servicio) {
        LocalTime horaInicio = fechaHora.toLocalTime();
        LocalTime horaFin = horaInicio.plusMinutes(
                Integer.parseInt(servicio.getDuracionEstimadaServicio())
        );

        // Verificar si hay citas que se superpongan
        boolean existeSuperposicion = citaModelRepository.existsByBarberoAndFechaHoraBetween(
                barbero,
                fechaHora,
                fechaHora.plusMinutes(Integer.parseInt(servicio.getDuracionEstimadaServicio()))
        );

        if (existeSuperposicion) {
            throw new RuntimeException("Ya existe una cita programada que se superpone con este horario");
        }

        // Verificar disponibilidad continua del barbero durante toda la duración del servicio
        LocalDate fecha = fechaHora.toLocalDate();
        boolean disponibleCompleto = disponibilidadRepository
                .existsByBarberoAndFechaAndHoraInicioLessThanEqualAndHoraFinGreaterThanEqualAndDisponibleTrue(
                        barbero, fecha, horaInicio, horaFin);

        if (!disponibleCompleto) {
            throw new RuntimeException("El barbero no está disponible durante todo el tiempo necesario para el servicio");
        }
    }

    public void actualizarEstadoCita(Integer appointmentId, String newStatus) {
        CitaModel cita = citaModelRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));

        cita.setEstado(newStatus);
        citaModelRepository.save(cita);
    }
}
