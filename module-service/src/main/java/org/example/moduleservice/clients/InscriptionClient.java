package org.example.moduleservice.clients;

import org.example.moduleservice.config.FeignClientConfiguration;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(name = "inscription-service", configuration = FeignClientConfiguration.class)
public interface InscriptionClient {

    @DeleteMapping("/api/inscriptions/module/{moduleId}")
    void supprimerInscriptionsParModule(@PathVariable("moduleId") UUID moduleId);
}
