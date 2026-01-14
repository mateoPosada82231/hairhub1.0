package com.hairhub.backend.user_management.services;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class PasswordResetService {
    private Map<String, String> resetTokens = new HashMap<>();

    public void saveResetToken(String email, String token) {
        resetTokens.put(token, email);
    }

    public String getEmailByToken(String token) {
        return resetTokens.get(token);
    }

    public void removeResetToken(String token) {
        resetTokens.remove(token);
    }
}
