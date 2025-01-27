package org.example.inscriptionservice.dto;

import lombok.*;

import java.util.UUID;

@Data
public class InscriptionWithDetailsDTO {
    private UUID id;
    private String studentName;
    private String apogee;
    private String moduleName;
    private String moduleCode;
    private String inscriptionDate;

    public InscriptionWithDetailsDTO(UUID id, String studentName,String apogee, String moduleName,String moduleCode, String inscriptionDate) {
        this.id = id;
        this.studentName = studentName;
        this.apogee = apogee;
        this.moduleName = moduleName;
        this.moduleCode = moduleCode;
        this.inscriptionDate = inscriptionDate;
    }

    public void setApogee(String apogee) {
        this.apogee = apogee;
    }

    public String getApogee() {
        return apogee;
    }

    public String getModuleCode() {
        return moduleCode;
    }

    public void setModuleCode(String moduleCode) {
        this.moduleCode = moduleCode;
    }

    public UUID getId() {
        return id;
    }


    public String getStudentName() {
        return studentName;
    }

    public String getModuleName() {
        return moduleName;
    }

    public String getInscriptionDate() {
        return inscriptionDate;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public void setModuleName(String moduleName) {
        this.moduleName = moduleName;
    }

    public void setInscriptionDate(String inscriptionDate) {
        this.inscriptionDate = inscriptionDate;
    }
}
