package com.hairhub.backend.user_management.controllers;

import com.hairhub.backend.user_management.DTOs.ServicioDTO;
import com.hairhub.backend.user_management.models.ServicioModel;
import com.hairhub.backend.user_management.services.ServicioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*") // O especifica el dominio del frontend
public class ServicioController {

    private final ServicioService servicioService;

    public ServicioController(ServicioService servicioService) {
        this.servicioService = servicioService;
    }

    @GetMapping
    public ResponseEntity<List<ServicioModel>> obtenerServicios() {
        List<ServicioModel> servicios = servicioService.getAllServicios();
        return ResponseEntity.ok(servicios);
    }

    @PostMapping
    public ResponseEntity<ServicioModel> crearServicio(@RequestBody ServicioDTO servicioDTO) {
        ServicioModel nuevoServicio = servicioService.saveServicio(servicioDTO);
        return ResponseEntity.ok(nuevoServicio);
    }

    @PutMapping(value = "{idServicio}")
    public ResponseEntity<ServicioModel> editarServicio(@PathVariable("idServicio") int idServicio, @RequestBody ServicioDTO servicioDTO) {
        ServicioModel servicioEditado = servicioService.editServicio(idServicio, servicioDTO);
        return ResponseEntity.ok(servicioEditado);
    }

    @DeleteMapping(value = "{idServicio}")
    public ResponseEntity<Boolean> eliminarServicio(@PathVariable("idServicio") int idServicio) {
        boolean servicioEliminado = servicioService.deleteServicio(idServicio);
        return ResponseEntity.ok(servicioEliminado);
    }
}