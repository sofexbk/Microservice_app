package org.example.inscriptionservice.clients;


import org.example.inscriptionservice.config.FeignClientConfiguration;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.UUID;


@FeignClient(name = "professor-service", configuration = FeignClientConfiguration.class)
public interface ProfessorClient {

    @GetMapping("/api/professors/profNameStats")
    String getProfessorName(UUID id);
}
