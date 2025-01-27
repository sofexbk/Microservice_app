package org.example.professorservice.services;

import org.example.professorservice.dto.ProfessorDTO;
import org.example.professorservice.dto.RegisterRequest;
import org.example.professorservice.entities.Professor;

import java.util.List;
import java.util.UUID;

public interface ProfessorService {
    Professor createProfessor(RegisterRequest request);
    ProfessorDTO getProfessorById(UUID id);
    List<ProfessorDTO> getAllProfessors();
}
