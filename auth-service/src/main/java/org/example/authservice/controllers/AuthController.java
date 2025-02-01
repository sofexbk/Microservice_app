package org.example.authservice.controllers;

import lombok.extern.slf4j.Slf4j;
import org.example.authservice.dto.*;
import org.example.authservice.services.AuthService;
import org.example.authservice.services.AuthServiceImp;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthServiceImp authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody @Validated RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Validated LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/validate")
    public ResponseEntity<UserDetailsDTO> validateToken(@RequestHeader("Authorization") String token) {
        token = token.replace("Bearer ", "");
        return ResponseEntity.ok(authService.validateToken(token));
    }

    @DeleteMapping("/delete/{entityId}")
    public void deleteUser(@PathVariable UUID entityId) {
        authService.deleteUser(entityId);
    }

    @PutMapping("/update-password/{id}")
    public ResponseEntity<String> updatePassword(@RequestBody @Validated UpdatePasswordRequest request, @PathVariable UUID id) {
            authService.updatePassword(request, id);
            return ResponseEntity.ok("Mot de passe mis à jour avec succès");
    }

}