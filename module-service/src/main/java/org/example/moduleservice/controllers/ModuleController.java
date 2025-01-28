package org.example.moduleservice.controllers;

import org.example.moduleservice.dto.CreateModuleDTO;
import org.example.moduleservice.dto.ModuleDTO;
import org.example.moduleservice.dto.StudentDTO;
import org.example.moduleservice.services.ModuleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @PostMapping
    public ResponseEntity<?> createModule(@RequestBody CreateModuleDTO moduleDTO) {
        try {
            // Appeler la méthode du service pour créer le module
            CreateModuleDTO createdModule = moduleService.createModule(moduleDTO);
            return ResponseEntity.ok().body(createdModule);
        } catch (Exception e) {
            // En cas d'erreur, on capture l'exception et on renvoie une réponse avec l'erreur
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la création du module : " + e.getMessage());
        }
    }


    @GetMapping
    public ResponseEntity<List<ModuleDTO>> getAllModules() {
        List<ModuleDTO> modules = moduleService.getAllModules();
        if (modules.isEmpty()) {

            return ResponseEntity.ok(Collections.emptyList());
        }
        return ResponseEntity.ok(modules);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ModuleDTO> getModuleById(@PathVariable UUID id) {
        return ResponseEntity.ok(moduleService.getModuleById(id));
    }

    @PutMapping("/{moduleId}/assign-professor/{professorId}")
    public ResponseEntity<ModuleDTO> assignProfessorToModule(
            @PathVariable UUID moduleId,
            @PathVariable UUID professorId) {
        return ResponseEntity.ok(moduleService.assignProfessorToModule(moduleId, professorId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ModuleDTO> updateModule(@PathVariable UUID id, @RequestBody CreateModuleDTO moduleDTO) {
        return ResponseEntity.ok(moduleService.updateModule(id, moduleDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteModule(@PathVariable UUID id) {
        moduleService.deleteModule(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{moduleId}/assign-student/{studentId}")
    public ResponseEntity<ModuleDTO> assignStudentToModule(
            @PathVariable UUID moduleId,
            @PathVariable UUID studentId) {
        logger.info("Assigning student with id {} to module with id {}", studentId, moduleId);
        ModuleDTO updatedModule = moduleService.assignStudentToModule(moduleId, studentId);
        logger.info("Student assigned successfully: {}", updatedModule);
        return ResponseEntity.ok(updatedModule);
    }

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

}