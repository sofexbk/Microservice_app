package org.example.professorservice.services;

import org.example.professorservice.dto.ProfessorDTO;
import org.example.professorservice.dto.RegisterRequest;
import org.example.professorservice.entities.Professor;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface ProfessorService {
    Professor createProfessor(RegisterRequest request);
    ProfessorDTO getProfessorById(UUID id);
    public Page<ProfessorDTO> getAllProfessors(int page, int size);

    // Méthode pour mettre à jour un professeur
    ProfessorDTO updateProfessor(UUID professorId, ProfessorDTO request);

    // Méthode pour supprimer un professeur
    void deleteProfessor(UUID professorId);

    long getTotalProfessors();
    String professorName(UUID id);

    List<ProfessorDTO> searchStudents(String firstName, String lastName, String cin);

    List<ProfessorDTO> getAllProfessors();
}
