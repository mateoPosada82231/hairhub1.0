package com.hairhub.backend.user_management.config;

import com.hairhub.backend.user_management.models.Usuario;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private final String SECRET_KEY = "76d6c3f880b3ed015d11b0d3c9b92772f6092ec5ad20352f39db7f6f04fd0583"; // Usa una clave más segura
    private final long EXPIRATION_TIME = 86400000; // 1 día en milisegundos

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    public String generateToken(Usuario user) {
        String role = user.getRol().getNombreRol();

        // Verificación simple
        if (role.equalsIgnoreCase("ROLE")) {
            throw new IllegalArgumentException("Rol inválido para generar token");
        }

        if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role;
        }

        return Jwts.builder()
                .setSubject(user.getEmailUsuario())
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }


    public String extractRole(String token) {
        return Jwts.parserBuilder().setSigningKey(getSigningKey()).build()
                .parseClaimsJws(token).getBody().get("ROLE", String.class);
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String extractEmail(String token) {
        return Jwts.parserBuilder().setSigningKey(getSigningKey()).build()
                .parseClaimsJws(token).getBody().getSubject();
    }
}
