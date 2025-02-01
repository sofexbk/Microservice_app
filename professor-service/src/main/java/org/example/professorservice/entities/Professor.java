package org.example.professorservice.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
public class Professor {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(unique = true)
    private String cin;
    private String firstName;

    public Professor() {
    }
    public Professor(UUID id, String cin, String firstName, String lastName) {
        this.id = id;
        this.cin = cin;
        this.firstName = firstName;
        this.lastName = lastName;
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

    private String lastName;

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
}
