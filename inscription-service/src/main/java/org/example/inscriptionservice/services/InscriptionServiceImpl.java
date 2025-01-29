package org.example.inscriptionservice.services;

import jakarta.transaction.Transactional;
import org.example.inscriptionservice.clients.ModuleClient;
import org.example.inscriptionservice.clients.ProfessorClient;
import org.example.inscriptionservice.clients.StudentClient;
import org.example.inscriptionservice.dto.InscriptionDTO;
import org.example.inscriptionservice.dto.InscriptionWithDetailsDTO;
import org.example.inscriptionservice.dto.ModuleDTO;
import org.example.inscriptionservice.dto.StudentDTO;
import org.example.inscriptionservice.entities.Inscription;
import org.example.inscriptionservice.repositories.InscriptionRepository;
import org.example.inscriptionservice.services.InscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class InscriptionServiceImpl implements InscriptionService {

    @Autowired
    private InscriptionRepository inscriptionRepository;

    @Autowired
    private ProfessorClient professorClient; // Injection du client Feign

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

    @Override
    public String getMostSubscribedModule() {
        // Récupérer la liste des inscriptions
        List<Inscription> inscriptions = inscriptionRepository.findAll();

        // Compter le nombre d'inscriptions par module
        long maxCount = 0;
        UUID mostSubscribedModuleId = null;
        for (Inscription inscription : inscriptions) {
            UUID moduleId = inscription.getModuleId();
            long count = inscriptions.stream()
                    .filter(i -> i.getModuleId().equals(moduleId))
                    .count();

            if (count > maxCount) {
                maxCount = count;
                mostSubscribedModuleId = moduleId;
            }
        }

        // Récupérer le nom du module le plus inscrit
        ModuleDTO mostSubscribedModule = moduleClient.getModuleById(mostSubscribedModuleId);
        return mostSubscribedModule.getName();
    }

    @Override
    public String getMostPopularPeriod() {
        // Récupérer la liste des inscriptions
        List<Inscription> inscriptions = inscriptionRepository.findAll();

        // Compter le nombre d'inscriptions par période
        long maxCount = 0;
        LocalDate mostPopularPeriod = null;
        for (Inscription inscription : inscriptions) {
            LocalDate period = inscription.getInscriptionDate();
            long count = inscriptions.stream()
                    .filter(i -> i.getInscriptionDate().equals(period))
                    .count();

            if (count > maxCount) {
                maxCount = count;
                mostPopularPeriod = period;
            }
        }

        return mostPopularPeriod.toString();
    }

    @Override
    public String getMostPopularProfessor() {
        // Récupérer la liste des inscriptions
        List<Inscription> inscriptions = inscriptionRepository.findAll();
        System.out.println("Inscriptions1: " + inscriptions);

        // Vérifier si la liste est vide
        if (inscriptions.isEmpty()) {
            return "Aucun professeur trouvé"; // Gérer le cas où il n'y a pas d'inscriptions
        }

        // Utilisation d'une Map pour compter les occurrences des professeurs
        Map<String, Long> professorCountMap = new HashMap<>();

        for (Inscription inscription : inscriptions) {
            ModuleDTO module = moduleClient.getModuleById(inscription.getModuleId());
            if (module == null) {
                continue; // Éviter les modules non trouvés
            }

            String professorName = module.getProfessorName();
            if (professorName == null) {
                continue;
            }

            professorCountMap.put(professorName, professorCountMap.getOrDefault(professorName, 0L) + 1);
        }

        // Trouver le professeur avec le plus d'inscriptions
        String mostPopularProfessor = professorCountMap.entrySet().stream()
                .max(Map.Entry.comparingByValue()) // Trouver le max selon le nombre d'inscriptions
                .map(Map.Entry::getKey)
                .orElse(null); // Retourner null si aucun professeur n'est trouvé
        System.out.println("mostPOPULAR4" + mostPopularProfessor);
        if (mostPopularProfessor == null) {
            return "Aucun professeur trouvé"; // Gérer le cas où aucun professeur n'est enregistré
        }

        // Récupérer le nom du professeur

        return mostPopularProfessor;
    }

}
