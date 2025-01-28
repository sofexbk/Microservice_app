package com.example.statistiquesservice.clients;

import org.example.inscriptionservice.config.FeignClientConfiguration;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.Map;

@FeignClient(name = "inscription-service", configuration = FeignClientConfiguration.class)
public interface InscriptionClient {

    @GetMapping("/api/inscriptions/most-subscribed")
    String getMostSubscribedModule();

    @GetMapping("/api/inscriptions/most-popular-period")
    String getMostPopularPeriod();

    @GetMapping("/api/inscriptions/most-popular-professor")
    String getMostPopularProfessor();
}