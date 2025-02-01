package org.example.moduleservice.services;

import org.example.moduleservice.dto.CreateModuleDTO;
import org.example.moduleservice.dto.ModuleDTO;
import org.example.moduleservice.dto.StudentDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface ModuleService {
    CreateModuleDTO createModule(CreateModuleDTO moduleDTO);
    Page<ModuleDTO> getAllModules(Pageable pageable);
    ModuleDTO getModuleById(UUID id);
    void deleteModule(UUID id);
    ModuleDTO updateModule(UUID id, CreateModuleDTO moduleDTO);
    ModuleDTO assignProfessorToModule(UUID moduleId, UUID professorId);
    ModuleDTO assignStudentToModule(UUID moduleId, UUID studentId);
    ModuleDTO removeStudentFromModule(UUID moduleId, UUID studentId);
    List<StudentDTO> getStudentsByModuleId(UUID moduleId);
    long getTotalModules();

    List<ModuleDTO> searchModules(String code, String name);

    List<ModuleDTO> getModules();

    List<ModuleDTO> getModulesByProfessorId(UUID professorId);
        }