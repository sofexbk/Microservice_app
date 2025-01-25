package org.example.professorservice.dto;

import lombok.Builder;
import org.example.professorservice.enums.Role;

public record User(
        String email,
        String password,
        Role role,
        String entityId
) {
}
