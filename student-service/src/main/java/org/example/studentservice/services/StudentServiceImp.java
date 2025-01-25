package org.example.studentservice.services;

import jakarta.persistence.EntityNotFoundException;
import org.example.studentservice.dto.StudentRequest;
import org.example.studentservice.dto.StudentResponse;
import org.example.studentservice.entities.Student;
import org.example.studentservice.repositories.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class StudentServiceImp implements StudentService{
    public final StudentRepository studentRepository;

    public StudentServiceImp(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public Student createStudent(StudentRequest student) {

        if (studentRepository.existsByApogee(student.apogee())) {
            throw new IllegalArgumentException("Apogee déjà utilisé");
        }
        Student studentToSave = new Student();
        studentToSave.setFirstName(student.firstName());
        studentToSave.setLastName(student.lastName());
        studentToSave.setGender(student.gender());
        studentToSave.setBirthDate(student.birthDate());
        studentToSave.setApogee(student.apogee());

        return studentRepository.save(studentToSave);
    }

    @Override
    public List<Student> getStudents() {
        return studentRepository.findAll();
    }

    @Override
    public Student getStudent(String studentId) {
        return studentRepository.findById(UUID.fromString(studentId)).orElseThrow(
                () -> new EntityNotFoundException("Etudiant non trouvé")
        );
    }

    @Override
    public Student updateStudent(StudentRequest student, String studentId) {
        Student studentToUpdate = studentRepository.findById(UUID.fromString(studentId)).orElseThrow(
                () -> new EntityNotFoundException("Etudiant non trouvé")
        );

        // Vérifier si l'APOGEE est modifié et s'il existe déjà dans la base
        if (!studentToUpdate.getApogee().equals(student.apogee()) && studentRepository.existsByApogee(student.apogee())) {
            throw new IllegalArgumentException("Apogee déjà utilisé");
        }

        studentToUpdate.setFirstName(student.firstName());
        studentToUpdate.setLastName(student.lastName());
        studentToUpdate.setGender(student.gender());
        studentToUpdate.setBirthDate(student.birthDate());
        studentToUpdate.setApogee(student.apogee());
        return studentRepository.save(studentToUpdate);
    }

    @Override
    public void deleteStudent(String studentId) {
        Student studentToDelete = studentRepository.findById(UUID.fromString(studentId)).orElseThrow(
                () -> new EntityNotFoundException("Etudiant non trouvé")
        );
        studentRepository.delete(studentToDelete);
    }
}
