package com.hairhub.backend.user_management.services;

import com.hairhub.backend.user_management.config.JwtUtil;
import com.hairhub.backend.user_management.models.Permiso;
import com.hairhub.backend.user_management.models.PermisosPorUsuario;
import com.hairhub.backend.user_management.models.Rol;
import com.hairhub.backend.user_management.models.Usuario;
import com.hairhub.backend.user_management.repositories.PermisoRepository;
import com.hairhub.backend.user_management.repositories.PermisosPorUsuarioRepository;
import com.hairhub.backend.user_management.repositories.RolRepository;
import com.hairhub.backend.user_management.repositories.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class UsuarioService {

    private final PermisosPorUsuarioRepository permisosPorUsuarioRepository;
    private final UsuarioRepository usuarioRepository;
    private final PermisoRepository permisoRepository;
    private final RolRepository rolRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private JdbcTemplate jdbcTemplate;


    public UsuarioService(PermisosPorUsuarioRepository permisosPorUsuarioRepository, UsuarioRepository usuarioRepository, PermisoRepository permisoRepository, RolRepository rolRepository, JwtUtil jwtUtil, PasswordEncoder passwordEncoder, JdbcTemplate jdbcTemplate) {
        this.permisosPorUsuarioRepository = permisosPorUsuarioRepository;
        this.usuarioRepository = usuarioRepository;
        this.permisoRepository = permisoRepository;
        this.rolRepository = rolRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.jdbcTemplate = jdbcTemplate;
    }

    public Usuario registerUser(String email, String password, String firstName, String lastName, String phoneNumber) {
        if (usuarioRepository.findByEmailUsuario(email).isPresent()) {
            throw new RuntimeException("Email ya registrado");
        }

        Usuario user = new Usuario();
        user.setEmailUsuario(email);
        user.setContrasenaUsuario(passwordEncoder.encode(password));
        user.setFirstNameUsuario(firstName);
        user.setLastNameUsuario(lastName);
        user.setTelefonoUsuario(phoneNumber);
        user.setRol(rolRepository.findById(2).orElseThrow(() -> new RuntimeException("Rol no encontrado"))); // Rol CLIENTE

        log.info("Usuario registrado");
        return usuarioRepository.save(user);
    }

    public String authenticateUser(String email, String password) {
        Usuario user = usuarioRepository.findByEmailUsuario(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(password, user.getContrasenaUsuario())) {
            log.error("Password incorrecta");
            throw new RuntimeException("Contraseña incorrecta");
        }

        return jwtUtil.generateToken(user);
    }

    public Usuario findUserByEmail(String email) {
        return usuarioRepository.findByEmailUsuario(email)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public Usuario updateUserRole(String email, Integer idRol) {
        Usuario usuario = usuarioRepository.findByEmailUsuario(email)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

        Rol nuevoRol = rolRepository.findById(idRol)
                .orElseThrow(() -> new EntityNotFoundException("Rol no encontrado"));

        usuario.setRol(nuevoRol);
        return usuarioRepository.save(usuario);
    }



    @Transactional
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public Usuario updatePermisosUsuario(String email, List<Integer> nuevosPermisos) {
        try {
            Usuario user = usuarioRepository.findByEmailUsuario(email)
                    .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

            // Eliminar permisos existentes
            jdbcTemplate.update("DELETE FROM permisos_por_usuario WHERE email_usuario = ?", email);

            // Insertar nuevos permisos usando JDBC batch para mejor rendimiento
            if (!nuevosPermisos.isEmpty()) {
                String insertSql = "INSERT INTO permisos_por_usuario (id_permiso, email_usuario) VALUES (?, ?)";
                List<Object[]> batchArgs = nuevosPermisos.stream()
                        .map(permisoId -> new Object[]{permisoId, email})
                        .collect(Collectors.toList());

                jdbcTemplate.batchUpdate(insertSql, batchArgs);
            }

            // Recargar el usuario con sus nuevos permisos
            return usuarioRepository.findByEmailUsuario(email)
                    .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));
        } catch (Exception e) {
            throw new RuntimeException("Error al actualizar permisos: " + e.getMessage(), e);
        }
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public Usuario addPermisoToUsuario(String email, Integer permisoId) {
        Usuario user = usuarioRepository.findByEmailUsuario(email)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

        Permiso permiso = permisoRepository.findById(permisoId)
                .orElseThrow(() -> new EntityNotFoundException("Permiso no encontrado"));

        // Verificar si el permiso ya existe para evitar duplicados
        boolean permisoExistente = user.getPermisos().stream()
                .anyMatch(p -> p.getPermiso().getIdPermiso().equals(permisoId));

        if (!permisoExistente) {
            PermisosPorUsuario nuevoPermiso = new PermisosPorUsuario();
            nuevoPermiso.setUsuario(user);
            nuevoPermiso.setPermiso(permiso);
            user.getPermisos().add(nuevoPermiso);
            usuarioRepository.save(user);
        }

        return user;
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public Usuario removePermisoFromUsuario(String email, Integer permisoId) {
        Usuario user = usuarioRepository.findByEmailUsuario(email)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));
        Permiso permiso = permisoRepository.findById(permisoId)
                .orElseThrow(() -> new EntityNotFoundException("Permiso no encontrado"));
        user.getPermisos().remove(permiso);
        return usuarioRepository.save(user);
    }
}