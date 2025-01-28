package org.example.moduleservice.services;

import org.example.moduleservice.dto.CreateModuleDTO;
import org.example.moduleservice.dto.ModuleDTO;
import org.example.moduleservice.dto.StudentDTO;

import java.util.List;
import java.util.UUID;

public interface ModuleService {
    CreateModuleDTO createModule(CreateModuleDTO moduleDTO);
    List<ModuleDTO> getAllModules();
    ModuleDTO getModuleById(UUID id);
    void deleteModule(UUID id);
    ModuleDTO updateModule(UUID id, CreateModuleDTO moduleDTO);
    ModuleDTO assignProfessorToModule(UUID moduleId, UUID professorId);
    ModuleDTO assignStudentToModule(UUID moduleId, UUID studentId);
    ModuleDTO removeStudentFromModule(UUID moduleId, UUID studentId);
    List<StudentDTO> getStudentsByModuleId(UUID moduleId);
    long getTotalModules();
}