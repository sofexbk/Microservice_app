package org.example.professorservice.controllers;

import org.example.professorservice.dto.ProfessorDTO;
import org.example.professorservice.dto.RegisterRequest;
import org.example.professorservice.services.ProfessorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/professors")
public class ProfessorController {
    public final ProfessorService professorService;

    public ProfessorController(ProfessorService professorService) {
        this.professorService = professorService;
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<String> createProfessor(@RequestBody @Validated RegisterRequest request) {
        professorService.createProfessor(request);
        return ResponseEntity.ok("Professeur créé avec succès");
    }
    // Méthode pour obtenir un professeur par son id
    @GetMapping("/{id}")
    public ResponseEntity<ProfessorDTO> getProfessorById(@PathVariable UUID id) {
        ProfessorDTO professorDTO = professorService.getProfessorById(id);
        return ResponseEntity.ok(professorDTO);
    }

    // Méthode pour obtenir tous les professeurs
    @GetMapping
    public ResponseEntity<List<ProfessorDTO>> getAllProfessors() {
        List<ProfessorDTO> professors = professorService.getAllProfessors();
        return ResponseEntity.ok(professors);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProfessorDTO> updateProfessor(@PathVariable UUID id,
                                                        @RequestBody @Validated RegisterRequest request) {
        ProfessorDTO updatedProfessor = professorService.updateProfessor(id, request);
        return ResponseEntity.ok(updatedProfessor);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProfessor(@PathVariable UUID id) {
        professorService.deleteProfessor(id);
        return ResponseEntity.ok("Professeur supprimé avec succès");
    }

}
