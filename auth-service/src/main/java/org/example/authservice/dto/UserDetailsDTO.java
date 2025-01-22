package org.example.authservice.dto;
import lombok.*;
import org.example.authservice.enums.Role;

import java.util.UUID;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDetailsDTO {
    private UUID id;
    private Role role;
}