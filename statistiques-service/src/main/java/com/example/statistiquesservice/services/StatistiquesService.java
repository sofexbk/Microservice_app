package com.example.statistiquesservice.services;


import com.example.statistiquesservice.dto.ProfessorDTO;

import java.util.List;
import java.util.Map;

public interface StatistiquesService {

    Map<String, Object> getStatistics();

    long getTotalStudents();

    Map<String, Long> getStudentsByGender();

    Map<String, Long> getStudentsByBirthdateRange();

    long getTotalProfessors();

    long getTotalModules();

    String getMostSubscribedModule();

    String getMostPopularProfessor();

    String getMostPopularPeriod();
}

