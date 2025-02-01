package org.example.studentservice;

import org.example.studentservice.dto.StudentRequest;
import org.example.studentservice.entities.Student;
import org.example.studentservice.enums.Gender;
import org.example.studentservice.repositories.StudentRepository;
import org.example.studentservice.services.StudentServiceImp;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


public class StudentServiceImpTest {

    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private StudentServiceImp studentService;

    private StudentRequest validStudentRequest;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        validStudentRequest = new StudentRequest(
                "MOHAMMED YASSINE",
                "EL AALOUCH",
                "200011",
                LocalDate.of(2000, 1, 1),
                Gender.HOMME
        );
    }

    @Test
    void testCreateStudent() {
        // Simuler que l'apogée n'est pas déjà utilisé
        when(studentRepository.existsByApogee(validStudentRequest.apogee())).thenReturn(false);
        Student studentToSave = new Student();
        studentToSave.setFirstName(validStudentRequest.firstName());
        studentToSave.setLastName(validStudentRequest.lastName());
        studentToSave.setApogee(validStudentRequest.apogee());
        studentToSave.setBirthDate(validStudentRequest.birthDate());
        studentToSave.setGender(validStudentRequest.gender());

        when(studentRepository.save(any(Student.class))).thenReturn(studentToSave);

        // Appeler la méthode
        Student savedStudent = studentService.createStudent(validStudentRequest);

        assertNotNull(savedStudent);
        assertEquals(validStudentRequest.firstName(), savedStudent.getFirstName());
        verify(studentRepository, times(1)).save(any(Student.class));
    }

    @Test
    void testCreateStudentWithDuplicateApogee() {
        when(studentRepository.existsByApogee(validStudentRequest.apogee())).thenReturn(true);

        IllegalArgumentException thrown = assertThrows(IllegalArgumentException.class, () -> {
            studentService.createStudent(validStudentRequest);
        });

        assertEquals("Apogee déjà utilisé", thrown.getMessage());
    }

    @Test
    void testGetStudent() {
        UUID studentId = UUID.randomUUID();
        Student student = new Student();
        student.setId(studentId);
        student.setFirstName("John");
        student.setLastName("Doe");

        when(studentRepository.findById(studentId)).thenReturn(Optional.of(student));

        Student foundStudent = studentService.getStudent(studentId.toString());

        assertNotNull(foundStudent);
        assertEquals(studentId, foundStudent.getId());
    }

    @Test
    void testGetStudentNotFound() {
        UUID studentId = UUID.randomUUID();

        when(studentRepository.findById(studentId)).thenReturn(Optional.empty());

        EntityNotFoundException thrown = assertThrows(EntityNotFoundException.class, () -> {
            studentService.getStudent(studentId.toString());
        });

        assertEquals("Etudiant non trouvé", thrown.getMessage());
    }

    @Test
    void testUpdateStudent() {
        UUID studentId = UUID.randomUUID();
        StudentRequest updatedStudentRequest = new StudentRequest(
                "John",
                "Doe",
                "A12345",
                LocalDate.of(1999, 12, 1),
                Gender.HOMME
        );

        Student studentToUpdate = new Student();
        studentToUpdate.setId(studentId);
        studentToUpdate.setApogee("A12345");
        studentToUpdate.setFirstName("test");
        studentToUpdate.setLastName("Doe");
        studentToUpdate.setBirthDate(LocalDate.of(2000, 1, 1));
        studentToUpdate.setGender(Gender.HOMME);

        when(studentRepository.findById(studentId)).thenReturn(Optional.of(studentToUpdate));
        when(studentRepository.existsByApogee(updatedStudentRequest.apogee())).thenReturn(false);
        when(studentRepository.save(any(Student.class))).thenReturn(studentToUpdate);

        Student updatedStudent = studentService.updateStudent(updatedStudentRequest, studentId.toString());

        assertEquals(updatedStudentRequest.firstName(), updatedStudent.getFirstName());
        assertEquals(updatedStudentRequest.birthDate(), updatedStudent.getBirthDate());
        verify(studentRepository, times(1)).save(any(Student.class));
    }

    @Test
    void testUpdateStudentWithDuplicateApogee() {
        UUID studentId = UUID.randomUUID();
        StudentRequest updatedStudentRequest = new StudentRequest(
                "John",
                "Doe",
                "A12345",
                LocalDate.of(2000, 1, 1),
                Gender.HOMME
        );

        Student studentToUpdate = new Student();
        studentToUpdate.setId(studentId);
        studentToUpdate.setApogee("B12345");

        when(studentRepository.findById(studentId)).thenReturn(Optional.of(studentToUpdate));
        when(studentRepository.existsByApogee(updatedStudentRequest.apogee())).thenReturn(true);

        IllegalArgumentException thrown = assertThrows(IllegalArgumentException.class, () -> {
            studentService.updateStudent(updatedStudentRequest, studentId.toString());
        });

        assertEquals("L'APOGEE A12345 est déjà utilisé.", thrown.getMessage());
    }

    @Test
    void testDeleteStudent() {
        UUID studentId = UUID.randomUUID();
        Student student = new Student();
        student.setId(studentId);

        when(studentRepository.findById(studentId)).thenReturn(Optional.of(student));

        studentService.deleteStudent(studentId.toString());

        verify(studentRepository, times(1)).delete(student);
    }

    @Test
    void testDeleteStudentNotFound() {
        UUID studentId = UUID.randomUUID();

        when(studentRepository.findById(studentId)).thenReturn(Optional.empty());

        EntityNotFoundException thrown = assertThrows(EntityNotFoundException.class, () -> {
            studentService.deleteStudent(studentId.toString());
        });

        assertEquals("Etudiant non trouvé", thrown.getMessage());
    }
}
