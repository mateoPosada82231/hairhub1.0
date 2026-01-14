package com.hairhub.backend.user_management.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "permisos_por_usuario")
@Getter
@Setter
@NoArgsConstructor
@ToString(exclude = {"usuario", "permiso"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class PermisosPorUsuario {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "permisos_por_usuario_seq")
    @SequenceGenerator(name = "permisos_por_usuario_seq", sequenceName = "permisos_por_usuario_id_seq", allocationSize = 1)
    @Column(name = "id_permisos_por_usuario")
    @EqualsAndHashCode.Include
    private Integer idPermisosPorUsuario;

    @ManyToOne
    @JoinColumn(name = "id_permiso")
    private Permiso permiso;

    @ManyToOne
    @JoinColumn(name = "email_usuario")
    private Usuario usuario;

    public PermisosPorUsuario(Usuario user, Permiso permiso) {
        this.usuario = user;
        this.permiso = permiso;
    }
}