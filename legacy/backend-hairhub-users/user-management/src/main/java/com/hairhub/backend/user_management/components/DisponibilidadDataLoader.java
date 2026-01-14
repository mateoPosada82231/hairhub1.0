package com.hairhub.backend.user_management.components;

import com.hairhub.backend.user_management.models.DisponibilidadBarbero;
import com.hairhub.backend.user_management.repositories.BarberoRepository;
import com.hairhub.backend.user_management.repositories.DisponibilidadBarberoRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;

@Component
@RequiredArgsConstructor
public class DisponibilidadDataLoader {
    private final DisponibilidadBarberoRepository disponibilidadRepository;
    private final BarberoRepository barberoRepository;

    @PostConstruct
    public void loadData() {
        // Crear disponibilidad para cada barbero
        barberoRepository.findAll().forEach(barbero -> {
            // Crear slots para los próximos 7 días
            LocalDate now = LocalDate.now();
            for (int i = 0; i < 7; i++) {
                LocalDate fecha = now.plusDays(i);
                // Crear slots de 1 hora desde las 9:00 hasta las 18:00
                for (int hour = 9; hour < 18; hour++) {
                    DisponibilidadBarbero slot = new DisponibilidadBarbero();
                    slot.setBarbero(barbero);
                    slot.setFecha(fecha);
                    slot.setHoraInicio(LocalTime.of(hour, 0));
                    slot.setHoraFin(LocalTime.of(hour + 1, 0));
                    slot.setDisponible(true);
                    disponibilidadRepository.save(slot);
                }
            }
        });
    }
}