package com.hairhub.backend.user_management.services;

import com.hairhub.backend.user_management.models.Barbero;
import com.hairhub.backend.user_management.repositories.BarberoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BarberoService {

    private final BarberoRepository barberoRepository;


    public BarberoService(BarberoRepository barberoRepository) {
        this.barberoRepository = barberoRepository;
    }

    public List<Barbero> getAllBarberos() {
        return barberoRepository.findAll();
    }

    public Barbero crearBarbero(Barbero barbero) {
        return barberoRepository.save(barbero);
    }

    public void deleteBarbero(int id) {
        barberoRepository.deleteById(id);
    }
}
