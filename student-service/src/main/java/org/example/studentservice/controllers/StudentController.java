package org.example.studentservice.controllers;

import org.example.studentservice.dto.StudentRequest;
import org.example.studentservice.dto.StudentResponse;
import org.example.studentservice.entities.Student;
import org.example.studentservice.repositories.StudentRepository;
import org.example.studentservice.services.StudentService;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
public class StudentController {
    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping
    public Student createStudent(@RequestBody @Validated StudentRequest student) {
        return studentService.createStudent(student);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/all")
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<Page<Student>> getAllStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        Page<Student> studentsPage = studentService.getStudents(page, size);
        return ResponseEntity.ok(studentsPage);
    }

    @GetMapping("/{studentId}")
    public Student getStudent(@PathVariable String studentId) {
        return studentService.getStudent(studentId);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/{studentId}")
    public Student updateStudent(@RequestBody @Validated StudentRequest student, @PathVariable String studentId) {
        return studentService.updateStudent(student, studentId);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{studentId}")
    public void deleteStudent(@PathVariable String studentId) {
        studentService.deleteStudent(studentId);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/search")
    public List<Student> searchStudents(@RequestParam(required = false) String firstName,
                                        @RequestParam(required = false) String lastName,
                                        @RequestParam(required = false) String apogee,
                                        @RequestParam(required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDate birthDate) {
        return studentService.searchStudents(firstName, lastName, apogee, birthDate);
    }

    @GetMapping("/count")
    public long getTotalStudents() {
        return studentService.getTotalStudents();
    }

    @GetMapping("/count-by-gender")
    public Map<String, Long> getStudentsByGender() {
        return studentService.getStudentsCountByGender();
    }

    @GetMapping("/count-by-birthdate")
    public Map<String, Long> getStudentsByBirthdateRange() {
        return studentService.getStudentsCountByBirthdateRange();
    }

}
