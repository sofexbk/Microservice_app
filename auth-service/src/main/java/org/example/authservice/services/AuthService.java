package org.example.authservice.services;

import org.example.authservice.dto.*;

import java.util.UUID;

public interface AuthService {
    AuthResponse register(RegisterRequest registerRequest);
    AuthResponse login(LoginRequest loginRequest);
    UserDetailsDTO validateToken(String token);

    void deleteUser(UUID entityId);

    void updatePassword(UpdatePasswordRequest request, UUID id);
}
