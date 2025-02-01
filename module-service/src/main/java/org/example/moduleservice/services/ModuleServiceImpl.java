package org.example.moduleservice.services;

import jakarta.transaction.Transactional;
import org.example.moduleservice.clients.InscriptionClient;
import org.example.moduleservice.clients.ProfessorClient;
import org.example.moduleservice.clients.StudentClient;
import org.example.moduleservice.dto.CreateModuleDTO;
import org.example.moduleservice.dto.ModuleDTO;
import org.example.moduleservice.dto.ProfessorDTO;
import org.example.moduleservice.dto.StudentDTO;
import org.example.moduleservice.entities.Module;
import org.example.moduleservice.repositories.ModuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ModuleServiceImpl implements ModuleService {

    @Autowired
    private ProfessorClient professorClient;

    @Autowired
    private StudentClient studentClient; // Client Feign pour récupérer les détails des étudiants

    @Autowired
    private ModuleRepository moduleRepository;

    @Autowired
    private InscriptionClient inscriptionClient; // Injection du client Feign pour les inscriptions

    @Override
    public CreateModuleDTO createModule(CreateModuleDTO moduleDTO) {
            // check si code existe
            if (moduleRepository.existsByCode(moduleDTO.getCode())) {
                throw new IllegalArgumentException("Code déjà utilisé");
            }
            Module module = new Module();
            module.setCode(moduleDTO.getCode());
            module.setName(moduleDTO.getName());
            Module createdModule = moduleRepository.save(module);
            return new CreateModuleDTO(createdModule.getId(), createdModule.getCode(), createdModule.getName());
            // Lancer une exception si quelque chose échoue

    }
    @Override
    public Page<ModuleDTO> getAllModules(Pageable pageable) {
        return moduleRepository.findAll(pageable).map(this::mapToDTO);
    }

    @Override
    public ModuleDTO getModuleById(UUID id) {
        return moduleRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Module not found"));
    }
    @Override
    public void deleteModule(UUID id) {
        // Vérifier que le module existe avant la suppression
        if (!moduleRepository.existsById(id)) {
            throw new RuntimeException("Le module avec l'id : " + id + " n'existe pas.");
        }

        // Supprimer toutes les inscriptions associées au module
        inscriptionClient.supprimerInscriptionsParModule(id);  // Appel du service d'inscription via Feign

        // Supprimer le module
        moduleRepository.deleteById(id);
    }

    @Override
    public ModuleDTO updateModule(UUID id, CreateModuleDTO moduleDTO) {
        // Vérifier que le module existe
        Module module = moduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Module introuvable avec l'id : " + id));
        // Vérifier si le code est déjà utilisé par un autre module
        if (moduleRepository.existsByCode(moduleDTO.getCode()) && !module.getCode().equals(moduleDTO.getCode())) {
            throw new RuntimeException("Code déjà utilisé");
        }
        // Mettre à jour les propriétés
        module.setCode(moduleDTO.getCode());
        module.setName(moduleDTO.getName());

        // Sauvegarder le module mis à jour
        Module updatedModule = moduleRepository.save(module);
        return mapToDTO(updatedModule);
    }

    @Override
    public ModuleDTO assignProfessorToModule(UUID moduleId, UUID professorId) {
        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module not found"));

        module.setProfessorId(professorId);
        return mapToDTO(moduleRepository.save(module));
    }

    private ModuleDTO mapToDTO(Module module) {
        ProfessorDTO professorDTO = null;

        // Vérifiez si un professeur est assigné au module
        if (module.getProfessorId() != null) {
            try {
                // Récupérez les détails du professeur via le client Feign
                professorDTO = professorClient.getProfessorById(module.getProfessorId());
            } catch (Exception e) {
                // Gérer les erreurs de communication avec le service des professeurs
                System.err.println("Erreur lors de la récupération des informations du professeur : " + e.getMessage());
            }
        }

        // Si un professeur est assigné, retourne son nom, sinon laisse le champ professeurName vide
        String professorName = (professorDTO != null) ? professorDTO.getFirstName() + " " + professorDTO.getLastName() : null;

        // Retourner le DTO avec les informations du professeur ou sans professeur
        return new ModuleDTO(
                module.getId(),
                module.getCode(),
                module.getName(),
                professorName
        );
    }

    public ModuleDTO assignStudentToModule(UUID moduleId, UUID studentId) {
        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module not found"));

        // Ensure studentIds Set is initialized as a HashSet if it's null
        if (module.getStudentIds() == null) {
            module.setStudentIds(new HashSet<>());
        }

        // Add the studentId to the studentIds set if not already added
        if (!module.getStudentIds().contains(studentId)) {
            module.getStudentIds().add(studentId);
            moduleRepository.save(module); // Save the updated module
        }

        return mapToDTO(module);
    }

    @Transactional
    public ModuleDTO removeStudentFromModule(UUID moduleId, UUID studentId) {
        // Récupérer le module
        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module introuvable avec l'id : " + moduleId));
        // Vérifier que l'étudiant est bien inscrit au module
        if (!module.getStudentIds().contains(studentId)) {
            throw new RuntimeException("L'étudiant n'est pas inscrit à ce module");
        }
        // Supprimer l'étudiant de la liste des étudiants du module
        module.getStudentIds().remove(studentId);
        // Sauvegarder les modifications dans la base de données
        moduleRepository.save(module);
        // Mapper le module mis à jour en DTO et le retourner
        return mapToDTO(module);
    }

    @Override
    public List<StudentDTO> getStudentsByModuleId(UUID moduleId) {
        // Récupérer le module
        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module introuvable avec l'id : " + moduleId));

        // Vérifier si le module a des étudiants assignés
        if (module.getStudentIds() == null || module.getStudentIds().isEmpty()) {
            return Collections.emptyList(); // Retourner une liste vide si aucun étudiant n'est assigné
        }

        // Récupérer les informations des étudiants via leur ID
        return module.getStudentIds().stream()
                .map(studentId -> {
                    try {
                        return studentClient.getStudentById(studentId); // Appel Feign pour chaque étudiant
                    } catch (Exception e) {
                        System.err.println("Erreur lors de la récupération de l'étudiant avec l'id : " + studentId);
                        return null; // En cas d'erreur, retourner null pour cet étudiant
                    }
                })
                .filter(Objects::nonNull) // Exclure les résultats null
                .collect(Collectors.toList());
    }

    @Override
    public long getTotalModules() {
        return moduleRepository.count();
    }

    @Override
    public List<ModuleDTO> searchModules(String code, String name) {
        return moduleRepository.findByCriteria(code, name)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ModuleDTO> getModules() {
        return moduleRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ModuleDTO> getModulesByProfessorId(UUID professorId) {

        return moduleRepository.findByProfessorId(professorId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }


}