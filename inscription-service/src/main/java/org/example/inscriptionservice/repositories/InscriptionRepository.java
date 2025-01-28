package org.example.inscriptionservice.repositories;

import org.example.inscriptionservice.dto.InscriptionDTO;
import org.example.inscriptionservice.entities.Inscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InscriptionRepository extends JpaRepository<Inscription, UUID> {
    boolean existsByStudentIdAndModuleId(UUID studentId, UUID moduleId);
    Optional<Inscription> findByStudentIdAndModuleId(UUID studentId, UUID moduleId);
    List<Inscription> findByModuleId(UUID moduleId);

}
