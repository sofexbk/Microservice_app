package org.example.professorservice.controllers;

import org.example.professorservice.dto.ProfessorDTO;
import org.example.professorservice.dto.RegisterRequest;
import org.example.professorservice.services.ProfessorService;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
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

    @GetMapping("/{id}")
    public ResponseEntity<ProfessorDTO> getProfessorById(@PathVariable UUID id) {
        ProfessorDTO professorDTO = professorService.getProfessorById(id);
        return ResponseEntity.ok(professorDTO);
    }

    // Méthode pour obtenir tous les prfesseurs sans pagination
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/all")
    public List<ProfessorDTO> getAllProfessors() {
        return professorService.getAllProfessors();
    }
    // Méthode pour obtenir tous les professeurs
    @GetMapping
    public ResponseEntity<Page<ProfessorDTO>> getAllProfessors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        Page<ProfessorDTO> professors = professorService.getAllProfessors(page, size);
        return ResponseEntity.ok(professors);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/search")
    public List<ProfessorDTO> searchStudents(@RequestParam(required = false) String firstName,
                                        @RequestParam(required = false) String lastName,
                                        @RequestParam(required = false) String cin)
    {
        return professorService.searchStudents(firstName, lastName, cin);
    }


    @PutMapping("/{id}")
    public ResponseEntity<ProfessorDTO> updateProfessor(@PathVariable UUID id,
                                                        @RequestBody @Validated ProfessorDTO request) {
        ProfessorDTO updatedProfessor = professorService.updateProfessor(id, request);
        return ResponseEntity.ok(updatedProfessor);
    }


    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProfessor(@PathVariable("id") UUID id) {
        professorService.deleteProfessor(id);
        return ResponseEntity.ok("Professeur supprimé avec succès");
    }

    @GetMapping("/count")
    public long getTotalProfessors() {
        return professorService.getTotalProfessors();
    }

    @GetMapping("/profNameStats")
    public String getProfessorName(UUID id) {
        return professorService.professorName(id);
    }
}
