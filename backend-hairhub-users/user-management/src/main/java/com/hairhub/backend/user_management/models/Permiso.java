package com.hairhub.backend.user_management.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Permiso {
    @Id
    @EqualsAndHashCode.Include
    private Integer idPermiso;

    private String nombrePermiso;
}
