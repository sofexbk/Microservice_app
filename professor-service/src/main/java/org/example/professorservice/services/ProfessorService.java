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

    // Méthode pour mettre à jour un professeur
    ProfessorDTO updateProfessor(UUID professorId, RegisterRequest request);

    // Méthode pour supprimer un professeur
    void deleteProfessor(UUID professorId);

    long getTotalProfessors();
    String professorName(UUID id);
}
