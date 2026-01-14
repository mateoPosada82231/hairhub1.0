package com.hairhub.backend.user_management.models;

import lombok.Data;
@Data
public class UpdateRoleRequest {
    private String email;
    private Integer idRole;
    // Getters y setters


    public Integer getIdRole() {
        return idRole;
    }

    public void setIdRole(Integer idRole) {
        this.idRole = idRole;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
