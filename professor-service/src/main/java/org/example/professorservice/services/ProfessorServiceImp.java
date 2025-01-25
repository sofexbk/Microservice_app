package org.example.professorservice.services;

import jakarta.transaction.Transactional;
import org.example.professorservice.client.AuthServiceClient;
import org.example.professorservice.dto.RegisterRequest;
import org.example.professorservice.dto.User;
import org.example.professorservice.entities.Professor;
import org.example.professorservice.enums.Role;
import org.example.professorservice.mappers.ProfessotMapper;
import org.example.professorservice.repositories.ProfessorRepository;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

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
        Professor savedProf =  professorRepository.save(professotMapper.toProfessor(request));
        String password = generateRandomPassword();

        User user = new User(
               request.email(), password, Role.PROFESSOR, savedProf.getId()
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
}
