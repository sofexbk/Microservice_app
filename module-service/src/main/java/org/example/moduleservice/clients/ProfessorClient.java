package org.example.moduleservice.clients;


import org.example.moduleservice.config.FeignClientConfiguration;
import org.example.moduleservice.dto.ProfessorDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(name = "professor-service", configuration = FeignClientConfiguration.class)
public interface ProfessorClient {
    @GetMapping("/api/professors/{professorId}")
    ProfessorDTO getProfessorById(@PathVariable("professorId") UUID professorId);
}
