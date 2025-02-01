package org.example.moduleservice.controllers;

import org.example.moduleservice.dto.CreateModuleDTO;
import org.example.moduleservice.dto.ModuleDTO;
import org.example.moduleservice.dto.StudentDTO;
import org.example.moduleservice.services.ModuleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/modules")
public class ModuleController {
    private static final Logger logger = LoggerFactory.getLogger(ModuleController.class);

    @Autowired
    private ModuleService moduleService;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<?> createModule(@RequestBody @Validated CreateModuleDTO moduleDTO) {

            CreateModuleDTO createdModule = moduleService.createModule(moduleDTO);
            return ResponseEntity.ok().body(createdModule);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<ModuleDTO>> getAllModules() {
        return ResponseEntity.ok(moduleService.getModules());
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<Page<ModuleDTO>> getAllModules(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = Pageable.ofSize(size).withPage(page);
        Page<ModuleDTO> modules = moduleService.getAllModules(pageable);

        return ResponseEntity.ok(modules);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ModuleDTO> getModuleById(@PathVariable UUID id) {
        return ResponseEntity.ok(moduleService.getModuleById(id));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/{moduleId}/assign-professor/{professorId}")
    public ResponseEntity<ModuleDTO> assignProfessorToModule(
            @PathVariable UUID moduleId,
            @PathVariable UUID professorId) {
        return ResponseEntity.ok(moduleService.assignProfessorToModule(moduleId, professorId));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ModuleDTO> updateModule(@PathVariable UUID id, @RequestBody CreateModuleDTO moduleDTO) {
        return ResponseEntity.ok(moduleService.updateModule(id, moduleDTO));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteModule(@PathVariable UUID id) {
        moduleService.deleteModule(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/search")
    public List<ModuleDTO> searchModules(@RequestParam(required = false) String code,
                                             @RequestParam(required = false) String name)
    {
        return moduleService.searchModules(code, name);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/{moduleId}/assign-student/{studentId}")
    public ResponseEntity<ModuleDTO> assignStudentToModule(
            @PathVariable UUID moduleId,
            @PathVariable UUID studentId) {
        logger.info("Assigning student with id {} to module with id {}", studentId, moduleId);
        ModuleDTO updatedModule = moduleService.assignStudentToModule(moduleId, studentId);
        logger.info("Student assigned successfully: {}", updatedModule);
        return ResponseEntity.ok(updatedModule);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/{moduleId}/remove-student/{studentId}")
    public ResponseEntity<ModuleDTO> removeStudentFromModule(
            @PathVariable UUID moduleId,
            @PathVariable UUID studentId) {
        logger.info("Removing student with id {} from module with id {}", studentId, moduleId);
        ModuleDTO updatedModule = moduleService.removeStudentFromModule(moduleId, studentId);
        logger.info("Student removed successfully: {}", updatedModule);
        return ResponseEntity.ok(updatedModule);
    }




    
    @GetMapping("/{moduleId}/students")
    public List<StudentDTO> getStudentsByModuleId(@PathVariable UUID moduleId) {
        return moduleService.getStudentsByModuleId(moduleId);
    }

    @GetMapping("/count")
    public long getTotalModules() {
        return moduleService.getTotalModules();
    }

//    @GetMapping("/most-subscribed")
//    public String getMostSubscribedModule() {
//        return moduleService.getMostSubscribedModule();
//    }

    @GetMapping("/professor/{professorId}")
    public List<ModuleDTO> getModulesByProfessorId(@PathVariable UUID professorId) {
        return moduleService.getModulesByProfessorId(professorId);
    }

}