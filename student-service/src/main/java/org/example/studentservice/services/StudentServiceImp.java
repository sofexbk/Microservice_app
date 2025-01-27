package org.example.studentservice.services;

import jakarta.persistence.EntityNotFoundException;
import org.example.studentservice.dto.StudentRequest;
import org.example.studentservice.dto.StudentResponse;
import org.example.studentservice.entities.Student;
import org.example.studentservice.repositories.StudentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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
    public Student updateStudent(StudentRequest studentRequest, String studentId) {
        // Récupérer l'étudiant à mettre à jour ou lancer une exception si non trouvé
        Student studentToUpdate = studentRepository.findById(UUID.fromString(studentId))
                .orElseThrow(() -> new EntityNotFoundException("Etudiant non trouvé avec l'ID : " + studentId));

        // Vérification si l'APOGEE est modifié et déjà existant dans la base de données
        if (!studentToUpdate.getApogee().equals(studentRequest.apogee())
                && studentRepository.existsByApogee(studentRequest.apogee())) {
            throw new IllegalArgumentException("L'APOGEE " + studentRequest.apogee() + " est déjà utilisé.");
        }

        // Mise à jour des informations de l'étudiant
        studentToUpdate.setFirstName(studentRequest.firstName());
        studentToUpdate.setLastName(studentRequest.lastName());
        studentToUpdate.setGender(studentRequest.gender());
        studentToUpdate.setBirthDate(studentRequest.birthDate());
        studentToUpdate.setApogee(studentRequest.apogee());

        // Sauvegarder les modifications dans la base de données
        return studentRepository.save(studentToUpdate);
    }

    @Override
    public void deleteStudent(String studentId) {
        Student studentToDelete = studentRepository.findById(UUID.fromString(studentId)).orElseThrow(
                () -> new EntityNotFoundException("Etudiant non trouvé")
        );
        studentRepository.delete(studentToDelete);
    }
    // Méthode de recherche des étudiants en fonction des critères
    public List<Student> searchStudents(String firstName, String lastName, String apogee, LocalDate birthDate) {
        if (firstName != null && lastName != null && apogee != null && birthDate != null) {
            return studentRepository.findByFirstNameAndLastNameAndApogeeAndBirthDate(firstName, lastName, apogee, birthDate);
        } else if (firstName != null && lastName != null && birthDate != null) {
            return studentRepository.findByFirstNameAndLastNameAndBirthDate(firstName, lastName, birthDate);
        } else if (firstName != null && apogee != null && birthDate != null) {
            return studentRepository.findByFirstNameAndApogeeAndBirthDate(firstName, apogee, birthDate);
        } else if (lastName != null && apogee != null && birthDate != null) {
            return studentRepository.findByLastNameAndApogeeAndBirthDate(lastName, apogee, birthDate);
        } else if (firstName != null) {
            return studentRepository.findByFirstName(firstName);
        } else if (lastName != null) {
            return studentRepository.findByLastName(lastName);
        } else if (apogee != null) {
            return studentRepository.findByApogee(apogee);
        } else if (birthDate != null) {
            return studentRepository.findByBirthDate(birthDate);
        } else {
            return studentRepository.findAll(); // Si aucun critère, retournez tous les étudiants
        }
    }
}
