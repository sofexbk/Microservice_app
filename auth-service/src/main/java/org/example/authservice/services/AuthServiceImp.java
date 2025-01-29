package org.example.authservice.services;
import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;
import org.example.authservice.dto.*;
import org.example.authservice.entities.User;
import org.example.authservice.repositories.UserRepository;
import org.example.authservice.security.JwtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
public class AuthServiceImp implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    public AuthServiceImp(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .entityId(UUID.fromString(request.getEntityId()))
                .build();

        user = userRepository.save(user);
        String jwt = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(jwt)
                .userId(user.getId())
                .role(user.getRole())
                .build();
    }


    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String jwt = jwtService.generateToken(user);


        return AuthResponse.builder()
                .token(jwt)
                .userId(user.getId())
                .role(user.getRole())
                .entityId(user.getEntityId().toString())
                .email(user.getEmail())
                .build();
    }


    public UserDetailsDTO validateToken(String token) {
        if (!jwtService.isTokenValid(token)) {
            throw new RuntimeException("Invalid token");
        }

        Claims claims = jwtService.extractAllClaims(token);
        UUID userId = UUID.fromString(claims.getSubject());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserDetailsDTO(user.getId(), user.getRole());
    }

}