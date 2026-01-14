package com.hairhub.backend.user_management.controllers;

import com.hairhub.backend.user_management.DTOs.BarberoDTO;
import com.hairhub.backend.user_management.DTOs.HorarioDisponibleDTO;
import com.hairhub.backend.user_management.models.Barbero;
import com.hairhub.backend.user_management.services.BarberoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/hh/barbero")
public class BarberoController {

    private final BarberoService barberoService;

    public BarberoController(BarberoService barberoService) {
        this.barberoService = barberoService;
    }

    @GetMapping
    public ResponseEntity<List<BarberoDTO>> getAllBarberos() {
        List<Barbero> barberos = barberoService.getAllBarberos();

        // Convertir Barbero -> BarberoDTO
        List<BarberoDTO> dtoList = barberos.stream().map(barbero -> {
            BarberoDTO dto = new BarberoDTO();
            dto.setIdBarbero(barbero.getIdBarbero());
            dto.setNombreBarbero(barbero.getNombreBarbero());
            dto.setApellidoBarbero(barbero.getApellidoBarbero());
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/{barberoId}/availability")
    public ResponseEntity<List<HorarioDisponibleDTO>> getDisponibilidadBarbero(
            @PathVariable Integer barberoId,
            @RequestParam String date // formato yyyy-MM-dd
    ) {
        try {
            // Lógica para obtener horas disponibles (esto puede venir de BD o ser mock por ahora)
            List<HorarioDisponibleDTO> horasDisponibles = new ArrayList<>();

            for (int hour = 9; hour <= 18; hour++) {
                HorarioDisponibleDTO hora = new HorarioDisponibleDTO();
                hora.setTime(hour + ":00");
                hora.setAvailable(Math.random() > 0.3); // simula disponibilidad
                horasDisponibles.add(hora);
            }

            return ResponseEntity.ok(horasDisponibles);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @PostMapping
    public ResponseEntity<Barbero> crearBarbero(@RequestBody Barbero barbero) {
        try {
            Barbero nuevoBarbero = barberoService.crearBarbero(barbero);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoBarbero);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{idBarbero}")
    public ResponseEntity<Void> eliminarBarbero(@PathVariable Integer idBarbero) {
        try {
            barberoService.deleteBarbero(idBarbero);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
