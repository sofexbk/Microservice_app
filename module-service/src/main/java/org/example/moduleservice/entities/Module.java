package org.example.moduleservice.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.Set;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Module {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String code;

    @Column(nullable = false)
    private String name;

    private UUID professorId;

    @ElementCollection
    private Set<UUID> studentIds;

    // Ajoutez explicitement les getters et setters si Lombok ne fonctionne pas
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
