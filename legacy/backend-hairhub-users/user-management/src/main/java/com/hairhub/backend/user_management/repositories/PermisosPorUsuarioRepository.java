package com.hairhub.backend.user_management.repositories;

import com.hairhub.backend.user_management.models.PermisosPorUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PermisosPorUsuarioRepository extends JpaRepository<PermisosPorUsuario, Integer> {
    void deleteByUsuarioEmailUsuario(String emailUsuario);
}