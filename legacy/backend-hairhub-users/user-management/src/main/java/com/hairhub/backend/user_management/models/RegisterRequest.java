package com.hairhub.backend.user_management.models;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    private String email;
    private String password;
    private String firstName; // Se agrega el campo firstName
    private String lastName; // Se agrega el campo lastName
    private String phone; // Se agrega el campo phoneNumber

}
