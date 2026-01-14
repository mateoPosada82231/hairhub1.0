package com.hairhub.backend.user_management.repositories;

import com.hairhub.backend.user_management.models.Barbero;
import com.hairhub.backend.user_management.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BarberoRepository extends JpaRepository<Barbero, Integer> {

    @Override
    List<Barbero> findAll();



//    Optional<Barbero> findByUsuario(Usuario usuario);
//    List<Appointment> findByBarberIdAndDate(Long barberId, LocalDate date);
}
