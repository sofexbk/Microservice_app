package org.example.studentservice.services;

import org.example.studentservice.dto.StudentRequest;
import org.example.studentservice.dto.StudentResponse;
import org.example.studentservice.entities.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface StudentService {
    Student createStudent(StudentRequest student);

    Page<Student> getStudents(int page, int size);

    Student getStudent(String studentId);

    Student updateStudent(StudentRequest student, String studentId);

    void deleteStudent(String studentId);
    List<Student> searchStudents(String firstName, String lastName, String apogee, LocalDate birthDate);

    long getTotalStudents();
    Map<String, Long> getStudentsCountByGender();
    Map<String, Long> getStudentsCountByBirthdateRange();

    List<Student> getAllStudents();
}
