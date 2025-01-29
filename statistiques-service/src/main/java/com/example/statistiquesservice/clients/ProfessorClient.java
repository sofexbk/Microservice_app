package com.example.statistiquesservice.clients;


import com.example.statistiquesservice.config.FeignClientConfiguration;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;


@FeignClient(name = "professor-service", configuration = FeignClientConfiguration.class)
public interface ProfessorClient {

    @GetMapping("/api/professors/count")
    long getTotalProfessors();
}
