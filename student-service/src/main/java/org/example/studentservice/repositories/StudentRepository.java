package org.example.studentservice.repositories;

import org.example.studentservice.entities.Student;
import org.example.studentservice.enums.Gender;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentRepository extends JpaRepository<Student, UUID> {

    boolean existsByApogee(String apogee);

    // Recherche par prénom, nom, apogée et date de naissance
    List<Student> findByFirstNameAndLastNameAndApogeeAndBirthDate(String firstName, String lastName, String apogee, LocalDate birthDate);

    // Recherche par prénom, nom et date de naissance
    List<Student> findByFirstNameAndLastNameAndBirthDate(String firstName, String lastName, LocalDate birthDate);

    // Recherche par prénom, apogée et date de naissance
    List<Student> findByFirstNameAndApogeeAndBirthDate(String firstName, String apogee, LocalDate birthDate);

    // Recherche par nom, apogée et date de naissance
    List<Student> findByLastNameAndApogeeAndBirthDate(String lastName, String apogee, LocalDate birthDate);

    // Recherche par prénom
    List<Student> findByFirstName(String firstName);

    // Recherche par nom
    List<Student> findByLastName(String lastName);

    // Recherche par apogée
    List<Student> findByApogee(String apogee);

    // Recherche par date de naissance
    List<Student> findByBirthDate(LocalDate birthDate);

    @Query("SELECT s.gender, COUNT(s) FROM Student s GROUP BY s.gender")
    List<Object[]> countByGender();


    @Query("SELECT " +
            "CASE " +
            "WHEN s.birthDate BETWEEN :start1 AND :end1 THEN 'Range1' " +
            "WHEN s.birthDate BETWEEN :start2 AND :end2 THEN 'Range2' " +
            "ELSE 'Other' END AS range, " +
            "COUNT(s) FROM Student s GROUP BY range")
    Map<String, Long> countByBirthdateRange();
    long countByBirthDateBetween(LocalDate startDate, LocalDate endDate);

}
