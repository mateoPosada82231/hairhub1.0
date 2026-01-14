package com.hairhub.backend.user_management.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Usuario implements UserDetails {
    @Id
    @EqualsAndHashCode.Include
    private String emailUsuario;

    private String contrasenaUsuario;
    private String firstNameUsuario;
    private String lastNameUsuario;
    private String telefonoUsuario;

    @ManyToOne
    @JoinColumn(name = "id_rol_usuario")
    private Rol rol;

    @ToString.Exclude
    @ManyToMany(mappedBy = "usuario")
    private Set<PermisosPorUsuario> permisos;

    @Override
    public String getUsername() {
        return emailUsuario;
    }

    @Override
    public String getPassword() {
        return contrasenaUsuario;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(rol.getNombreRol())); // por ejemplo, "ROLE_CLIENTE"
    }


    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }
}
