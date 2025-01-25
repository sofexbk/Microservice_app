package org.example.studentservice.services;

import org.example.studentservice.dto.StudentRequest;
import org.example.studentservice.dto.StudentResponse;
import org.example.studentservice.entities.Student;

import java.util.List;

public interface StudentService {
    Student createStudent(StudentRequest student);

    List<Student> getStudents();

    Student getStudent(String studentId);

    Student updateStudent(StudentRequest student, String studentId);

    void deleteStudent(String studentId);
}
