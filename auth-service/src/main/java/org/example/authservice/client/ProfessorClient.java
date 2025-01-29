package org.example.authservice.client;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.UUID;

@FeignClient(name = "auth-service")
public interface AuthServiceClient {

    public interface ProfessorClient {
        @GetMapping("/{id}")
        ProfessorDTO getProfessorById(@PathVariable UUID id);
    }
}
