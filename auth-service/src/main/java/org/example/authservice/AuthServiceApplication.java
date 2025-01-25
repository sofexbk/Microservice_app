package org.example.authservice;

import org.example.authservice.dto.RegisterRequest;
import org.example.authservice.entities.User;
import org.example.authservice.enums.Role;
import org.example.authservice.repositories.UserRepository;
import org.example.authservice.services.AuthService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class AuthServiceApplication  {


    public static void main(String[] args) {
		SpringApplication.run(AuthServiceApplication.class, args);
	}

}
