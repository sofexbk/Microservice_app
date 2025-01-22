package org.example.studentservice.repositories;

import org.example.studentservice.entities.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.UUID;

@RepositoryRestResource
public interface StudentRepository extends JpaRepository<Student, UUID> {

}
