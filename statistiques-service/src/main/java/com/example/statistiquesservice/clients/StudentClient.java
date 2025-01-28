package com.example.statistiquesservice.clients;


import org.example.inscriptionservice.config.FeignClientConfiguration;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.Map;

@FeignClient(name = "student-service", configuration = FeignClientConfiguration.class)
public interface StudentClient {

    @GetMapping("/api/students/count")
    long getTotalStudents();

    @GetMapping("/api/students/count-by-gender")
    Map<String, Long> getStudentsByGender();

    @GetMapping("/api/students/count-by-birthdate")
    Map<String, Long> getStudentsByBirthdateRange();
}

