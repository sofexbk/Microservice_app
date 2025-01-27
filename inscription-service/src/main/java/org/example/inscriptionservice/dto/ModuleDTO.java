package org.example.inscriptionservice.dto;

import lombok.*;

import java.util.Set;
import java.util.UUID;

@Data
public class ModuleDTO {
    private UUID id;
    private String code;
    private String name;
    private UUID professorId;
    private String professorName;
    private Set<UUID> studentIds;

    public ModuleDTO() { }
    public ModuleDTO(UUID id, String code, String name, UUID professorId, Set<UUID> studentIds) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.professorId = professorId;
        this.studentIds = studentIds;
    }
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public UUID getProfessorId() { return professorId; }
    public void setProfessorId(UUID professorId) { this.professorId = professorId; }

    public Set<UUID> getStudentIds() { return studentIds; }
    public void setStudentIds(Set<UUID> studentIds) { this.studentIds = studentIds; }
}
