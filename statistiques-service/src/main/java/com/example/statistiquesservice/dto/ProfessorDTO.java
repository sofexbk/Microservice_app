package org.example.professorservice.dto;

import org.example.professorservice.entities.Professor;

import java.util.UUID;

public class ProfessorDTO {
    private UUID id;
    private String firstName;
    private String lastName;
    private String cin;

    public ProfessorDTO() {
    }
    public ProfessorDTO(Professor professor) {
        this.id = professor.getId();
        this.firstName = professor.getFirstName();
        this.lastName = professor.getLastName();
        this.cin = professor.getCin();
    }

    public UUID getId() {
        return id;
    }

    public String getCin() {
        return cin;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setCin(String cin) {
        this.cin = cin;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
}
