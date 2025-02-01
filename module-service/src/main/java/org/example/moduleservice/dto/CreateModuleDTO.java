package org.example.moduleservice.dto;


import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class CreateModuleDTO {
    private UUID id;
    @NotNull(message = "Le code est requis")
    private String code;
    @NotNull(message = "Le nom est requis")
    private String name;

    public CreateModuleDTO() { }


    public CreateModuleDTO(UUID id, String name, String code) {
        this.id = id;
        this.name = name;
        this.code = code;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getId() {
        return id;
    }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
