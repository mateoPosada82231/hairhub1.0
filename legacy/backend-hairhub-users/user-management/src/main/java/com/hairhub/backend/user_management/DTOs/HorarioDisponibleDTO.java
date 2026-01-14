package com.hairhub.backend.user_management.DTOs;

import lombok.*;

@Data
@Builder
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class HorarioDisponibleDTO {

    private String time;
    private boolean available;

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
}
