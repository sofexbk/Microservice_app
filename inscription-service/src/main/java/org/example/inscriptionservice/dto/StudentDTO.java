package org.example.inscriptionservice.dto;


import lombok.*;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentDTO {
    private UUID id;
    private String apogee;
    private String firstName;
    private String lastName;
    private String birthDate;
}