package org.example.authservice.services;
import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;
import org.example.authservice.dto.*;
import org.example.authservice.entities.User;
import org.example.authservice.enums.Role;
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

    @Override
    public AuthResponse register(RegisterRequest request) {
        logger.info("Registering user with email: {}", request.getEmail());
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email exste déjà");
        }

        UUID entityId = null;
        if (request.getRole() != Role.ADMIN && request.getEntityId() != null && !request.getEntityId().isEmpty()) {
            entityId = UUID.fromString(request.getEntityId());
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .entityId(entityId) // entityId sera null si le rôle est ADMIN
                .build();


        user = userRepository.save(user);
        String jwt = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(jwt)
                .userId(user.getId())
                .role(user.getRole())
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        logger.info("Logging in user with email: {}", request.getEmail());
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("L'utilisateur n'existe pas"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String jwt = jwtService.generateToken(user);

        String entityId = null;
        if (user.getEntityId() != null) {
            entityId = user.getEntityId().toString();
        }

        return AuthResponse.builder()
                .token(jwt)
                .userId(user.getId())
                .role(user.getRole())
                .entityId(entityId)
                .email(user.getEmail())
                .build();
    }

    @Override
    public UserDetailsDTO validateToken(String token) {
        logger.info("Validating token");
        if (!jwtService.isTokenValid(token)) {
            throw new RuntimeException("Invalid token");
        }

        Claims claims = jwtService.extractAllClaims(token);
        UUID userId = UUID.fromString(claims.getSubject());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserDetailsDTO(user.getId(), user.getRole());
    }

    @Override
    public void deleteUser(UUID entityId) {
        logger.info("Deleting user with entityId: {}", entityId);
        // Vérifier si l'utilisateur existe with entityId
         User user =  userRepository.findByEntityId(entityId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userRepository.delete(user);

    }

    @Override
    public void updatePassword(UpdatePasswordRequest request, UUID id) {
        logger.info("Updating password for user with id: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

}