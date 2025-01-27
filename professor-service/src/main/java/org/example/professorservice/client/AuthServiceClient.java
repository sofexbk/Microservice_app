package org.example.professorservice.client;

import org.example.professorservice.dto.User;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.UUID;

@FeignClient(name = "auth-service")
public interface AuthServiceClient {

    @PostMapping("/api/auth/register")
    User registerUser(@RequestBody User user);

    @DeleteMapping("/api/auth/delete/{id}")
    void deleteUser(@PathVariable("id") UUID id);
}
