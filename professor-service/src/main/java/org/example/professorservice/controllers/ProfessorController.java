package org.example.professorservice.controllers;

import org.example.professorservice.dto.RegisterRequest;
import org.example.professorservice.services.ProfessorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

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
}
