package org.example.inscriptionservice.services;

import jakarta.transaction.Transactional;
import org.example.inscriptionservice.clients.ModuleClient;
import org.example.inscriptionservice.clients.StudentClient;
import org.example.inscriptionservice.dto.InscriptionDTO;
import org.example.inscriptionservice.dto.InscriptionWithDetailsDTO;
import org.example.inscriptionservice.dto.ModuleDTO;
import org.example.inscriptionservice.dto.StudentDTO;
import org.example.inscriptionservice.entities.Inscription;
import org.example.inscriptionservice.repositories.InscriptionRepository;
import org.example.inscriptionservice.services.InscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class InscriptionServiceImpl implements InscriptionService {

    @Autowired
    private InscriptionRepository inscriptionRepository;
    @Autowired
    private ModuleClient moduleClient; // Injection du client Feign
    @Autowired
    private StudentClient studentClient; // Injection du client Feign

    @Override
    @Transactional
    public InscriptionDTO inscrireEtudiant(InscriptionDTO inscriptionDTO) {
        // Vérification préalable
        validateInscription(inscriptionDTO);

        // Créer l'inscription
        Inscription inscription = new Inscription();
        inscription.setStudentId(inscriptionDTO.getStudentId());
        inscription.setModuleId(inscriptionDTO.getModuleId());
        inscription.setInscriptionDate(LocalDate.now());

        // Sauvegarder l'inscription
        Inscription savedInscription = inscriptionRepository.save(inscription);

        // Mettre à jour le module en ajoutant l'ID de l'étudiant
        ModuleDTO updatedModule = moduleClient.assignStudentToModule(inscriptionDTO.getModuleId(), inscriptionDTO.getStudentId());

        // Log or check the updated module's studentIds list
        System.out.println("Updated module: " + updatedModule);

        // Retourner l'inscription en DTO
        return mapToDTO(savedInscription);
    }


    private void validateInscription(InscriptionDTO dto) {
        // Vérifier que l'étudiant n'est pas déjà inscrit
        boolean dejaInscrit = inscriptionRepository
                .existsByStudentIdAndModuleId(dto.getStudentId(), dto.getModuleId());

        if (dejaInscrit) {
            throw new RuntimeException("Étudiant déjà inscrit à ce module");
        }
    }

    @Override
    @Transactional
    public void annulerInscription(UUID inscriptionId) {
        // Vérifier si l'inscription existe
        Inscription inscription = inscriptionRepository
                .findById(inscriptionId)
                .orElseThrow(() -> new RuntimeException("Inscription introuvable pour cet ID"));

        // Récupérer les détails du module et de l'étudiant avant suppression
        UUID moduleId = inscription.getModuleId();
        UUID studentId = inscription.getStudentId();

        // Supprimer l'inscription de la table des inscriptions
        inscriptionRepository.delete(inscription);

        // Mettre à jour le module en retirant l'étudiant
        moduleClient.removeStudentFromModule(moduleId, studentId);

    }

    @Override
    public List<InscriptionWithDetailsDTO> getAllInscriptions() {
        List<Inscription> inscriptions = inscriptionRepository.findAll();
        return inscriptions.stream()
                .map(this::mapToDTOWithDetails) // Map to InscriptionWithDetailsDTO
                .collect(Collectors.toList());
    }

    private InscriptionDTO mapToDTO(Inscription inscription) {
        return new InscriptionDTO(
                inscription.getId(),
                inscription.getStudentId(),
                inscription.getModuleId(),
                inscription.getInscriptionDate().toString()
        );
    }
    private InscriptionWithDetailsDTO mapToDTOWithDetails(Inscription inscription) {
        // Récupérer l'étudiant et le module correspondant
        StudentDTO student = studentClient.getStudentById(inscription.getStudentId());
        ModuleDTO module = moduleClient.getModuleById(inscription.getModuleId());

        // Créer et retourner l'InscriptionWithDetailsDTO avec les détails
        return new InscriptionWithDetailsDTO(
                inscription.getId(),
                student.getFirstName() + " " + student.getLastName(), // Ajouter le nom complet de l'étudiant
                student.getApogee(), // l'apogée de l'étudiant
                module.getName(), // Nom du module
                module.getCode(), // Code du module
                inscription.getInscriptionDate().toString()
        );
    }

    public void supprimerInscriptionsParModule(UUID moduleId) {
        List<Inscription> inscriptions = inscriptionRepository.findByModuleId(moduleId);
        for (Inscription inscription : inscriptions) {
            InscriptionDTO inscriptionDTO = InscriptionDTO.fromEntity(inscription);
            annulerInscription(inscriptionDTO.getId());
        }
    }


}
