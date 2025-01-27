package org.example.professorservice.services;

import jakarta.transaction.Transactional;
import org.example.professorservice.client.AuthServiceClient;
import org.example.professorservice.dto.ProfessorDTO;
import org.example.professorservice.dto.RegisterRequest;
import org.example.professorservice.dto.User;
import org.example.professorservice.entities.Professor;
import org.example.professorservice.enums.Role;
import org.example.professorservice.mappers.ProfessotMapper;
import org.example.professorservice.repositories.ProfessorRepository;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Transactional
@Service
public class ProfessorServiceImp implements ProfessorService{
    private final ProfessorRepository professorRepository;
    private final ProfessotMapper professotMapper;
    private final AuthServiceClient authServiceClient;
    private final EmailService emailService;
    public ProfessorServiceImp(ProfessorRepository professorRepository, ProfessotMapper professotMapper, AuthServiceClient authServiceClient, EmailService emailService) {
        this.professorRepository = professorRepository;
        this.professotMapper = professotMapper;
        this.authServiceClient = authServiceClient;
        this.emailService = emailService;
    }


    @Override
    public Professor createProfessor(RegisterRequest request) {
        Professor savedProf = professorRepository.save(professotMapper.toProfessor(request));
        String password = generateRandomPassword();

        User user = new User(
                request.email(), password, Role.PROFESSOR, savedProf.getId().toString() // Convertir UUID en String
        );

        authServiceClient.registerUser(user);
        emailService.sendPasswordEmail(request.email(), password);

        return savedProf;
    }


    private String generateRandomPassword() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder();

        for (int i = 0; i < 12; i++) {  // Par exemple, un mot de passe de 12 caractères
            int index = random.nextInt(characters.length());
            password.append(characters.charAt(index));
        }

        return password.toString();
    }

    public ProfessorDTO getProfessorById(UUID id) {
        // Recherche du professeur avec l'ID UUID
        Professor professor = professorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Professeur non trouvé"));
        return new ProfessorDTO(professor);
    }

    // Méthode pour obtenir tous les professeurs
    public List<ProfessorDTO> getAllProfessors() {
        return professorRepository.findAll()
                .stream()
                .map(professor -> new ProfessorDTO(professor))
                .collect(Collectors.toList());
    }
    // Méthode pour mettre à jour un professeur
    @Override
    public ProfessorDTO updateProfessor(UUID professorId, RegisterRequest request) {
        // Vérifier si le professeur existe
        Professor professorToUpdate = professorRepository.findById(professorId)
                .orElseThrow(() -> new RuntimeException("Professeur non trouvé"));

        // Mettre à jour les champs du professeur
        professorToUpdate.setFirstName(request.firstName());
        professorToUpdate.setLastName(request.lastName());
        professorToUpdate.setCin(request.cin());

        // Sauvegarder les modifications
        professorRepository.save(professorToUpdate);

        // Retourner le DTO mis à jour
        return new ProfessorDTO(professorToUpdate);
    }

    // Méthode pour supprimer un professeur
    @Override
    public void deleteProfessor(UUID professorId) {
        // Vérifier si le professeur existe
        Professor professorToDelete = professorRepository.findById(professorId)
                .orElseThrow(() -> new RuntimeException("Professeur non trouvé"));

        // Supprimer le professeur
        professorRepository.delete(professorToDelete);

    }
}
