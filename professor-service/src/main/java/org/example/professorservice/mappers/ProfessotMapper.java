package org.example.professorservice.mappers;

import org.example.professorservice.dto.RegisterRequest;
import org.example.professorservice.entities.Professor;
import org.springframework.stereotype.Component;

@Component
public class ProfessotMapper {
    public Professor toProfessor(RegisterRequest request) {
        Professor professor = new Professor();
        professor.setFirstName(request.firstName());
        professor.setLastName(request.firstName());
        professor.setCin(request.cin());
        return professor;
    }
}
