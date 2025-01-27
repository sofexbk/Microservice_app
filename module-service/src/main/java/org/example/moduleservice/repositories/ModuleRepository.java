package org.example.moduleservice.repositories;

import org.example.moduleservice.entities.Module;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ModuleRepository extends JpaRepository<Module, UUID> {
    // Récupérer les modules assignés (professor_id != null)
    List<Module> findByProfessorIdIsNotNull();

    // Récupérer les modules non assignés (professor_id == null)
    List<Module> findByProfessorIdIsNull();
}