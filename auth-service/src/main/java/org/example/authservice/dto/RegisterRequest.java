package org.example.authservice.dto;

import lombok.*;
import org.example.authservice.enums.Role;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String email;
    private String password;
    private Role role;
    private String entityId;
}