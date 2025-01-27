package org.example.inscriptionservice.dto;


import lombok.*;

import java.util.UUID;


public class StudentDTO {
    private UUID id;
    private String apogee;
    private String firstName;
    private String lastName;
    private String birthDate;

    public StudentDTO() {
    }
    public StudentDTO(UUID id, String apogee, String firstName, String lastName, String birthDate) {
        this.id = id;
        this.apogee = apogee;
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthDate = birthDate;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setBirthDate(String birthDate) {
        this.birthDate = birthDate;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setApogee(String apogee) {
        this.apogee = apogee;
    }

    public UUID getId() {
        return id;
    }

    public String getBirthDate() {
        return birthDate;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getApogee() {
        return apogee;
    }

    public String getLastName() {
        return lastName;
    }
}