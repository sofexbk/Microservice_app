package org.example.inscriptionservice.services;

import org.example.inscriptionservice.dto.InscriptionDTO;
import org.example.inscriptionservice.dto.InscriptionWithDetailsDTO;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;
import java.util.UUID;

public interface InscriptionService {
    InscriptionDTO inscrireEtudiant(InscriptionDTO inscriptionDTO);
    List<InscriptionWithDetailsDTO> getAllInscriptions();
    void annulerInscription(UUID inscriptionId);
    void supprimerInscriptionsParModule(UUID moduleId);
    String getMostSubscribedModule();
    String getMostPopularPeriod();
    String getMostPopularProfessor();
}
