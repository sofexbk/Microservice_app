package org.example.studentservice;

import org.example.studentservice.entities.Student;
import org.example.studentservice.repositories.StudentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class StudentServiceApplication {

    private final StudentRepository studentRepository;

    public StudentServiceApplication(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public static void main(String[] args) {
        SpringApplication.run(StudentServiceApplication.class, args);
    }


}
