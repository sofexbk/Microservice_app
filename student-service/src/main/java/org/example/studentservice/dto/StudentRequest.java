package org.example.studentservice.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import org.example.studentservice.enums.Gender;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

public record StudentRequest(
         @NotNull(message = "Prénom obligatoire")
         String firstName,
         @NotNull(message = "Nom obligatoire")
         String lastName,
         @NotNull(message = "Apogée obligatoire")
         String apogee,
         @NotNull(message = "Date de naissance obligatoire")
         @Past(message = "La date de naissance doit être dans le passé")
         @JsonFormat(pattern = "dd-MM-yyyy")  // Format attendu pour la date
         LocalDate birthDate,
         Gender gender
) {
}
