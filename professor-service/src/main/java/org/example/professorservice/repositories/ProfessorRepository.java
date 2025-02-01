package org.example.professorservice.repositories;

import org.example.professorservice.entities.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface ProfessorRepository extends JpaRepository<Professor, UUID> {

    @Query("SELECT COUNT(p) FROM Professor p")
    long count();


    @Query("SELECT p FROM Professor p WHERE (:firstName IS NULL OR p.firstName = :firstName) " +
            "AND (:lastName IS NULL OR p.lastName = :lastName) " +
            "AND (:cin IS NULL OR p.cin = :cin) ")
    List<Professor> findByCriteria(@Param("firstName") String firstName,
                                   @Param("lastName") String lastName,
                                   @Param("cin") String cin);

    boolean existsByCin(String cin);
}
