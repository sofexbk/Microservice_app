package org.example.studentservice.controllers;

import org.example.studentservice.entities.Student;
import org.example.studentservice.repositories.StudentRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// JUSTE POUR TESTER ...
@RestController
@RequestMapping("/students/")
public class StudentController {

    public  final StudentRepository studentRepository;

    public StudentController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/test")
    public List<Student> getStudents() {
        return studentRepository.findAll();
    }
}
