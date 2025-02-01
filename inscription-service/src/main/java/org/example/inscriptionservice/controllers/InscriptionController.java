package org.example.inscriptionservice.controllers;

import org.example.inscriptionservice.dto.InscriptionDTO;
import org.example.inscriptionservice.dto.InscriptionWithDetailsDTO;
import org.example.inscriptionservice.services.InscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/inscriptions")
public class InscriptionController {

    @Autowired
    private InscriptionService inscriptionService;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<InscriptionDTO> inscrireEtudiant(@RequestBody InscriptionDTO inscriptionDTO) {
        return ResponseEntity.ok(inscriptionService.inscrireEtudiant(inscriptionDTO));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<List<InscriptionWithDetailsDTO>> getAllInscriptions() {
        List<InscriptionWithDetailsDTO> inscriptions = inscriptionService.getAllInscriptions();
        return ResponseEntity.ok(inscriptions);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{inscriptionId}")
    public ResponseEntity<String> désinscrireEtudiant(@PathVariable UUID inscriptionId) {
        inscriptionService.annulerInscription(inscriptionId);
        return ResponseEntity.ok("L'étudiant a été désinscrit avec succès du module.");
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/module/{moduleId}")
    public ResponseEntity<String> supprimerInscriptionsParModule(@PathVariable UUID moduleId) {
        inscriptionService.supprimerInscriptionsParModule(moduleId);
        return ResponseEntity.ok("Toutes les inscriptions pour ce module ont été supprimées.");
    }



    @GetMapping("/most-subscribed")
    public ResponseEntity<String> getMostSubscribedModule() {
        return ResponseEntity.ok(inscriptionService.getMostSubscribedModule());
    }

    @GetMapping("/most-popular-professor")
    public ResponseEntity<String> getMostPopularProfessor() {
        return ResponseEntity.ok(inscriptionService.getMostPopularProfessor());
    }

    @GetMapping("/most-popular-period")
    public ResponseEntity<String> getMostPopularPeriod() {
        return ResponseEntity.ok(inscriptionService.getMostPopularPeriod());
    }
}