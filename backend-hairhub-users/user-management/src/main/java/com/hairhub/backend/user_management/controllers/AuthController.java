package com.hairhub.backend.user_management.controllers;
import com.hairhub.backend.user_management.models.*;
import com.hairhub.backend.user_management.repositories.UsuarioRepository;
import com.hairhub.backend.user_management.services.EmailService;
import com.hairhub.backend.user_management.services.PasswordResetService;
import com.hairhub.backend.user_management.services.UsuarioService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.naming.AuthenticationException;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final EmailService emailService;
    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetService passwordResetService;

    public AuthController(EmailService emailService, UsuarioService usuarioService, UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, PasswordResetService passwordResetService) {
        this.emailService = emailService;
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        Usuario user = usuarioService.registerUser(request.getEmail(),
                request.getPassword(),
                request.getFirstName(),
                request.getLastName(),
                request.getPhone());
        return ResponseEntity.ok("Usuario registrado exitosamente (CLIENTE)");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // Autenticar y obtener el token
            String token = usuarioService.authenticateUser(request.getEmail(), request.getPassword());

            // Obtener el usuario y sus permisos
            Usuario user = usuarioService.findUserByEmail(request.getEmail());

            // Crear respuesta enriquecida
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", Map.of(
                    "email", user.getEmailUsuario(),
                    "firstName", user.getFirstNameUsuario(),
                    "lastName", user.getLastNameUsuario(),
                    "role", user.getRol() != null ? user.getRol().getNombreRol() : "CUSTOMER"
            ));

            // Agregar permisos si existen
            if (user.getPermisos() != null && !user.getPermisos().isEmpty()) {
                List<Map<String, Object>> permisos = user.getPermisos().stream()
                        .map(permiso -> {
                            Map<String, Object> permisoMap = new HashMap<>();
                            permisoMap.put("idPermiso", permiso.getPermiso().getIdPermiso());
                            permisoMap.put("nombrePermiso", permiso.getPermiso().getNombrePermiso());
                            return permisoMap;
                        })
                        .collect(Collectors.toList());
                response.put("permissions", permisos);
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error durante el login: " + e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        Optional<Usuario> userOptional = usuarioRepository.findByEmailUsuario(email);

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }

        String token = UUID.randomUUID().toString();
        passwordResetService.saveResetToken(email, token);
        String resetLink = "http://localhost:3000/reset-password?token=" + token;
        emailService.sendEmail(email, "Enlace de Recuperación", "Haz clic en el siguiente enlace para restablecer tu contraseña: " + resetLink);

        return ResponseEntity.ok("Enlace de recuperación enviado a tu email.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");

        String email = passwordResetService.getEmailByToken(token);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token de recuperación inválido");
        }

        Optional<Usuario> userOptional = usuarioRepository.findByEmailUsuario(email);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }

        Usuario user = userOptional.get();
        user.setContrasenaUsuario(passwordEncoder.encode(newPassword));
        usuarioRepository.save(user);
        passwordResetService.removeResetToken(token);

        return ResponseEntity.ok("Contraseña cambiada exitosamente.");
    }

    @GetMapping("/current-user")
    public ResponseEntity<?> getCurrentUser() {
        try {
            // Obtener el usuario autenticado del SecurityContext
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            Usuario user = usuarioService.findUserByEmail(email);

            // Crear un DTO para evitar problemas de serialización
            Map<String, Object> userDTO = new HashMap<>();
            userDTO.put("emailUsuario", user.getEmailUsuario());
            userDTO.put("firstNameUsuario", user.getFirstNameUsuario());
            userDTO.put("lastNameUsuario", user.getLastNameUsuario());
            userDTO.put("telefonoUsuario", user.getTelefonoUsuario());

            if (user.getRol() != null) {
                userDTO.put("rol", Map.of(
                        "idRol", user.getRol().getIdRol(),
                        "nombreRol", user.getRol().getNombreRol()
                ));
            }

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
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error al obtener datos del usuario: " + e.getMessage()));
        }
    }
}
