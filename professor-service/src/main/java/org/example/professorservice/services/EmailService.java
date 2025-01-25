package org.example.professorservice.services;

public interface EmailService {
    public void sendPasswordEmail(String toEmail, String password);
}
