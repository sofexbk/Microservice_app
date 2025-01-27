package org.example.inscriptionservice.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
public class Inscription {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private UUID studentId;

    private UUID moduleId;

    private LocalDate inscriptionDate;

    public Inscription(UUID id, UUID moduleId, LocalDate inscriptionDate, UUID studentId) {
        this.id = id;
        this.moduleId = moduleId;
        this.inscriptionDate = inscriptionDate;
        this.studentId = studentId;
    }
    public Inscription() {
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setInscriptionDate(LocalDate inscriptionDate) {
        this.inscriptionDate = inscriptionDate;
    }

    public void setModuleId(UUID moduleId) {
        this.moduleId = moduleId;
    }

    public void setStudentId(UUID studentId) {
        this.studentId = studentId;
    }

    public UUID getId() {
        return id;
    }

    public LocalDate getInscriptionDate() {
        return inscriptionDate;
    }

    public UUID getModuleId() {
        return moduleId;
    }

    public UUID getStudentId() {
        return studentId;
    }
}