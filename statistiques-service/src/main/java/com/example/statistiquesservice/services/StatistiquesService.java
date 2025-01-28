package com.example.statistiquesservice.services;

import org.example.moduleservice.dto.ProfessorDTO;

import java.util.List;
import java.util.Map;

public interface StatistiquesService {

    Map<String, Object> getStatistics();

    long getTotalStudents();

    Map<String, Long> getStudentsByGender();

    Map<String, Long> getStudentsByBirthdateRange();

    List<ProfessorDTO> getTotalProfessors();

    long getTotalModules();

//    String getMostSubscribedModule();
//
//    String getMostPopularProfessor();
//
//    String getMostPopularPeriod();
}

