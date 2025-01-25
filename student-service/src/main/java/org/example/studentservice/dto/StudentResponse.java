package org.example.studentservice.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import org.example.studentservice.enums.Gender;

import java.time.LocalDate;
import java.util.UUID;

public record StudentResponse(
        UUID id,
        String firstName,
        String lastName,
        String apogee,
        LocalDate birthDate,
        Gender gender
) {
}
