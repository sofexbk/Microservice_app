package org.example.professorservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients

public class ProfessorServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProfessorServiceApplication.class, args);
    }

}
