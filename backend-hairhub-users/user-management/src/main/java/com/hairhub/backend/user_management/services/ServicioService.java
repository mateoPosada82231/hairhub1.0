package com.hairhub.backend.user_management.services;

import com.hairhub.backend.user_management.DTOs.ServicioDTO;
import com.hairhub.backend.user_management.models.ServicioModel;
import com.hairhub.backend.user_management.repositories.BarberoRepository;
import com.hairhub.backend.user_management.repositories.ServicioModelRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServicioService {

    private final ServicioModelRepository servicioModelRepository;

    public ServicioService(ServicioModelRepository servicioModelRepository) {
        this.servicioModelRepository = servicioModelRepository;
    }

    public List<ServicioModel> getAllServicios() {
        return servicioModelRepository.findAll();
    }

    public ServicioModel saveServicio(ServicioDTO servicioDTO) {
        ServicioModel servicio = new ServicioModel();
        servicio.setNombreServicio(servicioDTO.getNombreServicio());
        servicio.setPrecioBaseServicio(servicioDTO.getPrecioBaseServicio());
        servicio.setDuracionEstimadaServicio(String.valueOf(servicioDTO.getDuracionEstimadaServicio()));
        return servicioModelRepository.save(servicio);
    }

    public ServicioModel editServicio(int idServicio, ServicioDTO servicioDTO) {
        ServicioModel servicio = servicioModelRepository.findById(idServicio).orElse(null);
        if (servicio != null) {
            servicio.setNombreServicio(servicioDTO.getNombreServicio());
            servicio.setPrecioBaseServicio(servicioDTO.getPrecioBaseServicio());
            servicio.setDuracionEstimadaServicio(String.valueOf(servicioDTO.getDuracionEstimadaServicio()));
            return servicioModelRepository.save(servicio);
        }
        return null;
    }

    public boolean deleteServicio(int idServicio) {
        ServicioModel servicio = servicioModelRepository.findById(idServicio).orElse(null);
        if (servicio != null) {
            servicioModelRepository.delete(servicio);
            return true;
        }
        return false;
    }
}
