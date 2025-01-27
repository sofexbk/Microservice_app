package org.example.professorservice.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        //@NotNull(message = "L'email est requis")  // Validation du champ email
        String email,

        @NotNull(message = "Le prénom est requis")  // Validation du champ firstName
        String firstName,

        @NotNull(message = "Le nom est requis")  // Validation du champ nom
        String lastName,

        @NotNull(message = "Le CIN est requis")  // Validation du champ CIN
        String cin
) {
}
