package com.example.statistiquesservice.services;

import com.example.statistiquesservice.clients.InscriptionClient;
import com.example.statistiquesservice.clients.ModuleClient;
import com.example.statistiquesservice.clients.ProfessorClient;
import com.example.statistiquesservice.clients.StudentClient;
import com.example.statistiquesservice.dto.ProfessorDTO;
import com.example.statistiquesservice.services.StatistiquesService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StatistiquesServiceImpl implements StatistiquesService {

    private final StudentClient studentClient;
    private final ProfessorClient professorClient;
    private final ModuleClient moduleClient;
    private final InscriptionClient inscriptionClient;

    public StatistiquesServiceImpl(StudentClient studentClient, ProfessorClient professorClient,
                                   ModuleClient moduleClient, InscriptionClient inscriptionClient) {
        this.studentClient = studentClient;
        this.professorClient = professorClient;
        this.moduleClient = moduleClient;
        this.inscriptionClient = inscriptionClient;
    }

    @Override
    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStudents", getTotalStudents());
        stats.put("studentsByGender", getStudentsByGender());
        stats.put("studentsByBirthdate", getStudentsByBirthdateRange());
       stats.put("totalProfessors", getTotalProfessors());
        stats.put("totalModules", getTotalModules());
        stats.put("mostSubscribedModule", getMostSubscribedModule());
        stats.put("mostPopularProfessor", getMostPopularProfessor());
        stats.put("mostPopularPeriod", getMostPopularPeriod());
        return stats;
    }

    @Override
    public long getTotalStudents() {
        return studentClient.getTotalStudents();
    }

    @Override
    public Map<String, Long> getStudentsByGender() {
        try {
            return studentClient.getStudentsByGender();
        } catch (Exception e) {
            return new HashMap<>();
        }
    }

    @Override
    public Map<String, Long> getStudentsByBirthdateRange() {
        try{
            return studentClient.getStudentsByBirthdateRange();
        } catch (Exception e) {
            return new HashMap<>();
        }
    }

    @Override
   public long getTotalProfessors() {
       return professorClient.getTotalProfessors();
   }

    @Override
    public long getTotalModules() {
        return moduleClient.getTotalModules();
    }

    @Override
    public String getMostSubscribedModule() {
        try {
            String mostSubscribedModule = inscriptionClient.getMostSubscribedModule();
            return mostSubscribedModule;
        } catch (Exception e) {
            return "N/A";
        }
    }

    @Override
    public String getMostPopularProfessor() {
            try{
                return inscriptionClient.getMostPopularProfessor();
            } catch (Exception e) {
                return "N/A";
            }
    }

    @Override
    public String getMostPopularPeriod() {
        try{
            return inscriptionClient.getMostPopularPeriod();
        } catch (Exception e) {
            return "N/A";
        }
    }
}
