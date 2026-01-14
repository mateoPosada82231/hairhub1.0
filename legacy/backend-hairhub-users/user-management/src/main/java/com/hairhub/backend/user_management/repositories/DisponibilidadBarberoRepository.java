package com.hairhub.backend.user_management.repositories;

import com.hairhub.backend.user_management.models.Barbero;
import com.hairhub.backend.user_management.models.DisponibilidadBarbero;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface DisponibilidadBarberoRepository extends JpaRepository<DisponibilidadBarbero, Integer> {
    List<DisponibilidadBarbero> findByBarberoAndFechaAndDisponibleTrue(Barbero barbero, LocalDate fecha);
    List<DisponibilidadBarbero> findByBarberoAndFechaAndHoraInicioBetween(
            Barbero barbero, LocalDate fecha, LocalTime horaInicio, LocalTime horaFin);
    boolean existsByBarberoAndFechaAndHoraInicioLessThanEqualAndHoraFinGreaterThanEqualAndDisponibleTrue(
            Barbero barbero, LocalDate fecha, LocalTime horaInicio, LocalTime horaFin);

    List<DisponibilidadBarbero> findByBarberoAndFecha(Barbero barbero, LocalDate fecha);


}