package com.example.statistiquesservice.dto;


import java.util.UUID;

public class ProfessorDTO {
    private UUID id;
    private String firstName;
    private String lastName;
    private String cin;

    public ProfessorDTO(UUID id, String cin, String firstName, String lastName) {
        this.id = id;
        this.cin = cin;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public ProfessorDTO() {

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
