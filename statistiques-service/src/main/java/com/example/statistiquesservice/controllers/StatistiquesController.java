package com.example.statistiquesservice.controllers;

import com.example.statistiquesservice.services.StatistiquesService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
public class StatistiquesController {

        private final StatistiquesService statistiquesService;

        public StatistiquesController(StatistiquesService statistiquesService) {
            this.statistiquesService = statistiquesService;
        }

        @PreAuthorize("hasRole('ROLE_ADMIN')")
        @GetMapping("/allStats")
        public ResponseEntity<Map<String, Object>> getStatistics() {
            return ResponseEntity.ok(statistiquesService.getStatistics());
        }

}

