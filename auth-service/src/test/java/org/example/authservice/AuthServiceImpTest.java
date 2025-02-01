package org.example.authservice;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import io.jsonwebtoken.Claims;
import org.example.authservice.dto.*;
import org.example.authservice.entities.User;
import org.example.authservice.enums.Role;
import org.example.authservice.repositories.UserRepository;
import org.example.authservice.security.JwtService;
import org.example.authservice.services.AuthServiceImp;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

public class AuthServiceImpTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthServiceImp authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private UpdatePasswordRequest updatePasswordRequest;
    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Setup sample data
        registerRequest = new RegisterRequest("test@example.com", "password", Role.ADMIN, null);
        loginRequest = new LoginRequest("test@example.com", "password");
        updatePasswordRequest = new UpdatePasswordRequest();
        updatePasswordRequest.setOldPassword("password");
        updatePasswordRequest.setNewPassword("newPassword");

        user = User.builder()
                .id(UUID.randomUUID())
                .email("test@example.com")
                .password("password")
                .role(Role.ADMIN)
                .build();
    }

    @Test
    void testRegister() {
        // Mock the behavior of the repository and password encoder
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(registerRequest.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(jwtService.generateToken(any(User.class))).thenReturn("jwtToken");

        // Call the method
        AuthResponse response = authService.register(registerRequest);

        // Verify the result
        assertNotNull(response);
        assertEquals("jwtToken", response.getToken());
        assertEquals(user.getId(), response.getUserId());
        assertEquals(user.getRole(), response.getRole());
    }

    @Test
    void testLogin() {
        // Mock the behavior of the repository and password encoder
        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())).thenReturn(true);
        when(jwtService.generateToken(user)).thenReturn("jwtToken");

        // Call the method
        AuthResponse response = authService.login(loginRequest);

        // Verify the result
        assertNotNull(response);
        assertEquals("jwtToken", response.getToken());
        assertEquals(user.getId(), response.getUserId());
        assertEquals(user.getRole(), response.getRole());
        assertEquals(user.getEmail(), response.getEmail());
    }

    @Test
    void testValidateToken() {
        // Prepare a mock JWT token
        String token = "mockToken";
        Claims claims = mock(Claims.class);
        when(jwtService.isTokenValid(token)).thenReturn(true);
        when(jwtService.extractAllClaims(token)).thenReturn(claims);
        when(claims.getSubject()).thenReturn(user.getId().toString());
        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));

        // Call the method
        UserDetailsDTO detailsDTO = authService.validateToken(token);

        // Verify the result
        assertNotNull(detailsDTO);
        assertEquals(user.getId(), detailsDTO.getId());
        assertEquals(user.getRole(), detailsDTO.getRole());
    }

    @Test
    void testUpdatePassword() {
        // Mock behavior
        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(updatePasswordRequest.getOldPassword(), user.getPassword())).thenReturn(true);
        when(passwordEncoder.encode(updatePasswordRequest.getNewPassword())).thenReturn("newEncodedPassword");
        when(userRepository.save(user)).thenReturn(user);

        // Call the method
        authService.updatePassword(updatePasswordRequest, user.getId());

        // Verify that the password was updated
        assertEquals("newEncodedPassword", user.getPassword());
        verify(userRepository, times(1)).save(user);
    }
}
