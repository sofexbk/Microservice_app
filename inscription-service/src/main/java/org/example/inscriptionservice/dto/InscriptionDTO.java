package org.example.inscriptionservice.dto;

import lombok.*;
import org.example.inscriptionservice.entities.Inscription;

import java.util.UUID;

@Data
public class InscriptionDTO {
    private UUID id;
    private UUID studentId;
    private UUID moduleId;
    private String inscriptionDate;

    public InscriptionDTO(UUID id, UUID studentId, UUID moduleId, String inscriptionDate) {
        this.id = id;
        this.studentId = studentId;
        this.moduleId = moduleId;
        this.inscriptionDate = inscriptionDate;
    }
    public static InscriptionDTO fromEntity(Inscription entity) {
        return new InscriptionDTO(
                entity.getId(),
                entity.getStudentId(),
                entity.getModuleId(),
                entity.getInscriptionDate().toString()  // Assuming InscriptionDate is a Date or LocalDate object
        );
    }
    public UUID getId() {
        return id;
    }

    public UUID getModuleId() {
        return moduleId;
    }

    public String getInscriptionDate() {
        return inscriptionDate;
    }

    public UUID getStudentId() {
        return studentId;
    }

    public void setInscriptionDate(String inscriptionDate) {
        this.inscriptionDate = inscriptionDate;
    }

    public void setModuleId(UUID moduleId) {
        this.moduleId = moduleId;
    }

    public void setStudentId(UUID studentId) {
        this.studentId = studentId;
    }

    public void setId(UUID id) {
        this.id = id;
    }
}