package com.hairhub.backend.user_management.services;

import com.hairhub.backend.user_management.DTOs.BarberReportDTO;
import com.hairhub.backend.user_management.DTOs.ServiceReportDTO;
import com.hairhub.backend.user_management.DTOs.WeekDayReportDTO;
import com.hairhub.backend.user_management.models.Barbero;
import com.hairhub.backend.user_management.models.CitaModel;
import com.hairhub.backend.user_management.repositories.BarberoRepository;
import com.hairhub.backend.user_management.repositories.CitaModelRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportsService {

    private BarberoRepository barberoRepository;

    private CitaModelRepository citaModelRepository;

    public ReportsService(BarberoRepository barberoRepository, CitaModelRepository citaModelRepository) {
        this.barberoRepository = barberoRepository;
        this.citaModelRepository = citaModelRepository;
    }

    public List<BarberReportDTO> getBarberReports(LocalDate startDate, LocalDate endDate) {
        List<BarberReportDTO> result = new ArrayList<>();
        List<Barbero> barberos = barberoRepository.findAll();

        // Fechas seguras para la base de datos
        LocalDate safeStart = (startDate != null) ? startDate : LocalDate.of(1970, 1, 1);
        LocalDate safeEnd = (endDate != null) ? endDate : LocalDate.of(2100, 12, 31);

        for (Barbero barbero : barberos) {
            // Filtra citas por barbero y fechas
            List<CitaModel> citas = citaModelRepository.findByBarberoAndFechaHoraBetween(
                    barbero,
                    safeStart.atStartOfDay(),
                    safeEnd.atTime(23, 59, 59)
            );

            int totalCitas = citas.size();
            double ingresoTotal = citas.stream()
                    .mapToDouble(cita -> cita.getPrecioTotal()) // Ajusta según tu modelo
                    .sum();

            result.add(new BarberReportDTO(
                    barbero.getNombreBarbero(),
                    totalCitas, // Convertir a Integer si es necesario
                    ingresoTotal, // Convertir a Double si es necesario
                    barbero.getApellidoBarbero() // Ajustar el orden si es necesario
            ));
        }
        return result;
    }
    public List<WeekDayReportDTO> getWeekdayReports(LocalDate startDate, LocalDate endDate) {
        LocalDate safeStart = (startDate != null) ? startDate : LocalDate.of(1970, 1, 1);
        LocalDate safeEnd = (endDate != null) ? endDate : LocalDate.of(2100, 12, 31);

        List<CitaModel> citas = citaModelRepository.findByFechaHoraBetween(
                safeStart.atStartOfDay(),
                safeEnd.atTime(23, 59, 59)
        );

        Map<Integer, Long> countByDay = citas.stream()
                .collect(Collectors.groupingBy(
                        cita -> cita.getFechaHora().getDayOfWeek().getValue(), // 1=Lunes, 7=Domingo
                        Collectors.counting()
                ));

        int totalCitas = citas.size();
        List<WeekDayReportDTO> result = new ArrayList<>();
        for (int i = 1; i <= 7; i++) {
            int citasDia = countByDay.getOrDefault(i, 0L).intValue();
            double porcentaje = totalCitas > 0 ? (citasDia * 100.0 / totalCitas) : 0.0;
            result.add(new WeekDayReportDTO(i, citasDia, porcentaje));
        }
        return result;
    }

    public List<ServiceReportDTO> getServiceReports(LocalDate startDate, LocalDate endDate) {
        LocalDate safeStart = (startDate != null) ? startDate : LocalDate.of(1970, 1, 1);
        LocalDate safeEnd = (endDate != null) ? endDate : LocalDate.of(2100, 12, 31);

        List<CitaModel> citas = citaModelRepository.findByFechaHoraBetween(
                safeStart.atStartOfDay(),
                safeEnd.atTime(23, 59, 59)
        );

        Map<String, List<CitaModel>> citasPorServicio = citas.stream()
                .collect(Collectors.groupingBy(cita -> cita.getServicio().getNombreServicio()));

        List<ServiceReportDTO> result = new ArrayList<>();
        for (Map.Entry<String, List<CitaModel>> entry : citasPorServicio.entrySet()) {
            String nombreServicio = entry.getKey();
            List<CitaModel> citasServicio = entry.getValue();
            int cantidad = citasServicio.size();
            double ingresoTotal = citasServicio.stream()
                    .mapToDouble(CitaModel::getPrecioTotal)
                    .sum();
            result.add(new ServiceReportDTO(nombreServicio, cantidad, ingresoTotal));
        }
        return result;
    }
}