package org.example.professorservice.repositories;

import org.example.professorservice.entities.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.UUID;

@RepositoryRestResource
public interface ProfessorRepository extends JpaRepository<Professor, UUID> {
}
