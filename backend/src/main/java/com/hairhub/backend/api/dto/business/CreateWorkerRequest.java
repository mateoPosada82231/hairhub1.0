package com.hairhub.backend.api.dto.business;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateWorkerRequest {

    @NotNull(message = "El ID del usuario es obligatorio")
    private Long userId;

    @Size(max = 100, message = "La posición no puede exceder 100 caracteres")
    private String position;
}

