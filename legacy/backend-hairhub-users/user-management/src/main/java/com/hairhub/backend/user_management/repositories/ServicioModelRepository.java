package com.hairhub.backend.user_management.repositories;

import com.hairhub.backend.user_management.models.ServicioModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServicioModelRepository extends JpaRepository<ServicioModel, Integer> {

    @Override
    List<ServicioModel> findAll();

    ServicioModel save(ServicioModel servicioModel);

    boolean deleteServicioModelByIdServicio(Integer idServicio);

//    ServicioModel update(ServicioModel servicioModel);
//    boolean deleteServicioModelByIdServicio(int idServicio);

//    boolean updateServicioModelByIdServicio(int idServicio, ServicioModel servicioModel);
    // Add any custom query methods if needed
}
