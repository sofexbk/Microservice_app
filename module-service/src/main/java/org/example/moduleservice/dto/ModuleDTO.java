package org.example.moduleservice.dto;

import lombok.*;

import java.util.Set;
import java.util.UUID;

@Data
public class ModuleDTO {
    private UUID id;
    private String code;
    private String name;
    private String professorName;

    public ModuleDTO(UUID id, String code, String name, String professorName) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.professorName = professorName;
    }



    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public void setProfessorName(String professorName) {
        this.professorName = professorName;
    }
    public String getProfessorName() {
        return professorName;
    }
}
