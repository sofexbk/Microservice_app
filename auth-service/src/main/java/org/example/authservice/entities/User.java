package org.example.authservice.entities;

import jakarta.persistence.*;
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
    @Enumerated(EnumType.STRING)
    private Role role;
    private UUID entityId;

}
