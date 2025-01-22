package org.example.authservice.dto;

import lombok.*;
import org.example.authservice.enums.Role;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private UUID userId;
    private Role role;
}