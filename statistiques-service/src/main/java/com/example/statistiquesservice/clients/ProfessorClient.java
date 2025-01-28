package com.example.statistiquesservice.clients;


import org.example.moduleservice.config.FeignClientConfiguration;
import org.example.moduleservice.dto.ProfessorDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@FeignClient(name = "professor-service", configuration = FeignClientConfiguration.class)
public interface ProfessorClient {

    @GetMapping("/api/professors/count")
    List<ProfessorDTO> getTotalProfessors();
}
