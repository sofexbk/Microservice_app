package org.example.authservice.dto;

import jakarta.validation.constraints.NotEmpty;
public class UpdatePasswordRequest {

    @NotEmpty(message = "L'ancien mot de passe est requis")
    private String oldPassword;

    @NotEmpty(message = "Le nouveau mot de passe est requis")
    private String newPassword;

    // Getters and Setters
    public String getOldPassword() {
        return oldPassword;
    }
    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}