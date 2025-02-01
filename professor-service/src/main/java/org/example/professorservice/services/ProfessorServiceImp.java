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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


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

    @Transactional
    @Override
    public Professor createProfessor(RegisterRequest request) {
        // CHECK IF CIN EXISTS
        if (professorRepository.existsByCin(request.cin())) {
            throw new RuntimeException("CIN déjà utilisé");
        }
        Professor savedProf = professorRepository.save(professotMapper.toProfessor(request));
        String password = generateRandomPassword();


        User user = new User(
                request.email(), password, Role.PROFESSOR, savedProf.getId().toString()
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

    @Override
    public ProfessorDTO getProfessorById(UUID id) {
        // Recherche du professeur avec l'ID UUID
        Professor professor = professorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Professeur non trouvé"));
        return new ProfessorDTO(professor);
    }

    @Override
    public Page<ProfessorDTO> getAllProfessors(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Professor> professorsPage = professorRepository.findAll(pageable);
        return professorsPage.map(professor -> new ProfessorDTO(professor));
    }

    // Méthode pour mettre à jour un professeur
    @Override
    public ProfessorDTO updateProfessor(UUID professorId, ProfessorDTO request) {
        // Vérifier si le professeur existe
        Professor professorToUpdate = professorRepository.findById(professorId)
                .orElseThrow(() -> new RuntimeException("Professeur non trouvé"));

        // Vérifier si le CIN est déjà utilisé
        if (professorRepository.existsByCin(request.getCin()) && !professorToUpdate.getCin().equals(request.getCin())) {
            throw new RuntimeException("CIN déjà utilisé");
        }
        // Mettre à jour les champs du professeur
        professorToUpdate.setFirstName(request.getFirstName());
        professorToUpdate.setLastName(request.getLastName());
        professorToUpdate.setCin(request.getCin());

        // Sauvegarder les modifications
        professorRepository.save(professorToUpdate);

        // Retourner le DTO mis à jour
        return new ProfessorDTO(professorToUpdate);
    }

    @Transactional
    @Override
    public void deleteProfessor(UUID professorId) {


        Professor professorToDelete = professorRepository.findById(professorId)
                .orElseThrow(() -> new RuntimeException("Professeur non trouvé"));

        authServiceClient.deleteUser(professorToDelete.getId());
        professorRepository.delete(professorToDelete);

    }

    @Override
    public long getTotalProfessors() {
        return professorRepository.count();
    }

    @Override
    public String professorName(UUID id) {
        Professor professor = professorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Professeur non trouvé"));
        return professor.getFirstName() + " " + professor.getLastName();
    }

    @Override
    public List<ProfessorDTO> searchStudents(String firstName, String lastName, String cin) {
        professorRepository.findByCriteria(firstName, lastName, cin);
        return professorRepository.findByCriteria(firstName, lastName, cin)
                .stream()
                .map(professor -> new ProfessorDTO(professor))
                .collect(Collectors.toList());
    }

    @Override
    public List<ProfessorDTO> getAllProfessors() {
        return professorRepository.findAll()
                .stream()
                .map(professor -> new ProfessorDTO(professor))
                .collect(Collectors.toList());
    }

}
