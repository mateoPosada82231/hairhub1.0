package com.hairhub.backend.user_management.controllers;

import com.hairhub.backend.user_management.models.UpdateRoleRequest;
import com.hairhub.backend.user_management.models.Usuario;
import com.hairhub.backend.user_management.services.UsuarioService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UsuarioService usuarioService;

    public AdminController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/search-user")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> searchUser(@RequestParam String email) {
        try {
            Usuario user = usuarioService.findUserByEmail(email);

            // Crear un DTO con solo la información necesaria
            Map<String, Object> userDTO = new HashMap<>();
            userDTO.put("emailUsuario", user.getEmailUsuario());
            userDTO.put("firstNameUsuario", user.getFirstNameUsuario());
            userDTO.put("lastNameUsuario", user.getLastNameUsuario());
            userDTO.put("telefonoUsuario", user.getTelefonoUsuario());

            // Manejar el rol de manera segura
            if (user.getRol() != null) {
                Map<String, Object> rolMap = new HashMap<>();
                rolMap.put("idRol", user.getRol().getIdRol());
                rolMap.put("nombreRol", user.getRol().getNombreRol());
                userDTO.put("rol", rolMap);
            }

            // Manejar los permisos de manera segura
            if (user.getPermisos() != null) {
                List<Map<String, Object>> permisosList = user.getPermisos().stream()
                        .map(permiso -> {
                            Map<String, Object> permisoMap = new HashMap<>();
                            Map<String, Object> permisoInnerMap = new HashMap<>();
                            permisoInnerMap.put("idPermiso", permiso.getPermiso().getIdPermiso());
                            permisoInnerMap.put("nombrePermiso", permiso.getPermiso().getNombrePermiso());
                            permisoMap.put("permiso", permisoInnerMap);
                            return permisoMap;
                        })
                        .collect(Collectors.toList());
                userDTO.put("permisos", permisosList);
            }

            return ResponseEntity.ok(userDTO);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Usuario no encontrado"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error al buscar el usuario: " + e.getMessage()));
        }
    }

    @PutMapping("/update-role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateRole(@RequestBody UpdateRoleRequest request) {
        try {
            Usuario updatedUser = usuarioService.updateUserRole(request.getEmail(), request.getIdRole());
            return ResponseEntity.ok(updatedUser);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Usuario no encontrado");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar el rol");
        }
    }

    @PutMapping("/update-permisos")
    public ResponseEntity<?> updatePermisos(@RequestParam String email, @RequestBody List<Integer> permisos) {
        try {
            Usuario usuario = usuarioService.updatePermisosUsuario(email, permisos);

            Map<String, Object> response = new HashMap<>();
            response.put("email", usuario.getEmailUsuario());
            response.put("permissions", usuario.getPermisos().stream()
                    .map(p -> p.getPermiso().getIdPermiso())
                    .collect(Collectors.toList()));

            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar los permisos: " + e.getMessage());
        }
    }
}