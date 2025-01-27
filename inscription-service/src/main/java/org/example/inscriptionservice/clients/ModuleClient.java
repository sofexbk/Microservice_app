package org.example.inscriptionservice.clients;

import org.example.inscriptionservice.config.FeignClientConfiguration;
import org.example.inscriptionservice.dto.ModuleDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

import java.util.UUID;

@FeignClient(name = "module-service", configuration = FeignClientConfiguration.class)
public interface ModuleClient {

    @GetMapping("/api/modules/{moduleId}")
    ModuleDTO getModuleById(@PathVariable("moduleId") UUID moduleId);

    @PutMapping("/api/modules/{moduleId}/assign-student/{studentId}")
    ModuleDTO assignStudentToModule(@PathVariable("moduleId") UUID moduleId,
                                    @PathVariable("studentId") UUID studentId);

    @PutMapping("/api/modules/{moduleId}/remove-student/{studentId}")
    ModuleDTO removeStudentFromModule(@PathVariable("moduleId") UUID moduleId,
                                      @PathVariable("studentId") UUID studentId);


}
