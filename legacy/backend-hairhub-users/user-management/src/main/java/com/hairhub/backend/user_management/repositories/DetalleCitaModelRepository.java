package com.hairhub.backend.user_management.repositories;

import com.hairhub.backend.user_management.models.DetalleCitaModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetalleCitaModelRepository extends JpaRepository<DetalleCitaModel, Integer> {
}
