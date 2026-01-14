package com.hairhub.backend.user_management.repositories;

import com.hairhub.backend.user_management.models.Barbero;
import com.hairhub.backend.user_management.models.CitaModel;
import com.hairhub.backend.user_management.models.Usuario;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CitaModelRepository extends JpaRepository<CitaModel, Integer> {

    boolean existsByBarberoAndFechaHora(Barbero barbero, LocalDateTime fechaHora);
    boolean existsByClienteAndFechaHoraBetween(Usuario cliente, LocalDateTime inicio, LocalDateTime fin);
    List<CitaModel> findByCliente(Usuario cliente);
    boolean existsByBarberoAndFechaHoraBetween(
            Barbero barbero,
            LocalDateTime inicio,
            LocalDateTime fin
    );

    List<CitaModel> findByBarberoAndFechaHoraBetween(
            Barbero barbero,
            LocalDateTime inicio,
            LocalDateTime fin
    );

    List<CitaModel> findByFechaHoraBetween(LocalDateTime start, LocalDateTime end);

    List<CitaModel> findByBarbero(Barbero barbero);

    CitaModel save(CitaModel citaModel);
}
