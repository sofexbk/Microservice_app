package org.example.professorservice.services;

import org.example.professorservice.dto.RegisterRequest;
import org.example.professorservice.entities.Professor;

public interface ProfessorService {
    Professor createProfessor(RegisterRequest request);

}
