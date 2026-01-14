package com.hairhub.backend.user_management.models;


import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class LoginResponse {
    private String token;
    private Map<String, Object> user;
    private List<Map<String, Object>> permissions;

    // Constructor, getters y setters
}