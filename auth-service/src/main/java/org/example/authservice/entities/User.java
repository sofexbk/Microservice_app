package org.example.authservice.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;
import org.example.authservice.enums.Role;

import java.util.UUID;

@Entity
@Builder @NoArgsConstructor @AllArgsConstructor @Getter @Setter @ToString

public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String email;
    private String password;
    private Role role;

    private UUID entityId;

    public User(String email, String password, Role role) {
        this.email = email;
        this.password = password;
        this.role = role;
    }
}
