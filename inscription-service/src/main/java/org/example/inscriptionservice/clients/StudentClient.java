package org.example.inscriptionservice.clients;


import org.example.inscriptionservice.config.FeignClientConfiguration;
import org.example.inscriptionservice.dto.StudentDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(name = "student-service", configuration = FeignClientConfiguration.class)
public interface StudentClient {
    @GetMapping("/api/students/{studentId}")
    StudentDTO getStudentById(@PathVariable("studentId") UUID studentId);
}
