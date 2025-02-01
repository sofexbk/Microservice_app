package org.example.professorservice;

import org.example.professorservice.client.AuthServiceClient;
import org.example.professorservice.dto.ProfessorDTO;
import org.example.professorservice.dto.RegisterRequest;
import org.example.professorservice.dto.User;
import org.example.professorservice.entities.Professor;
import org.example.professorservice.mappers.ProfessotMapper;
import org.example.professorservice.repositories.ProfessorRepository;
import org.example.professorservice.services.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import static org.junit.jupiter.api.Assertions.*;

class ProfessorServiceImpTest {

    @InjectMocks
    private ProfessorServiceImp professorService;

    @Mock
    private ProfessorRepository professorRepository;

    @Mock
    private ProfessotMapper professotMapper;

    @Mock
    private AuthServiceClient authServiceClient;

    @Mock
    private EmailService emailService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateProfessor() {
        // Given
        RegisterRequest request = new RegisterRequest("test@email.com", "Ahmed", "Ben Ali", "CIN123");
        Professor professor = new Professor();
        professor.setId(UUID.randomUUID());
        professor.setFirstName("Ahmed");
        professor.setLastName("Ben Ali");
        professor.setCin("CIN123");

        when(professorRepository.existsByCin(anyString())).thenReturn(false);
        when(professotMapper.toProfessor(request)).thenReturn(professor);
        when(professorRepository.save(any(Professor.class))).thenReturn(professor);

        // When
        Professor result = professorService.createProfessor(request);

        // Then
        assertNotNull(result);
        assertEquals("Ahmed", result.getFirstName());
        assertEquals("Ben Ali", result.getLastName());
        verify(authServiceClient, times(1)).registerUser(any(User.class));
        verify(emailService, times(1)).sendPasswordEmail(anyString(), anyString());
    }

    @Test
    void testCreateProfessorCINAlreadyUsed() {
        // Given
        RegisterRequest request = new RegisterRequest("test@email.com", "Ahmed", "Ben Ali", "CIN123");

        when(professorRepository.existsByCin(anyString())).thenReturn(true);

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> professorService.createProfessor(request));
        assertEquals("CIN déjà utilisé", exception.getMessage());
    }

    @Test
    void testGetProfessorById() {
        // Given
        UUID professorId = UUID.randomUUID();
        Professor professor = new Professor();
        professor.setId(professorId);
        professor.setFirstName("Ahmed");
        professor.setLastName("Ben Ali");
        professor.setCin("CIN123");

        when(professorRepository.findById(professorId)).thenReturn(Optional.of(professor));

        // When
        ProfessorDTO result = professorService.getProfessorById(professorId);

        // Then
        assertNotNull(result);
        assertEquals(professorId, result.getId());
        assertEquals("Ahmed", result.getFirstName());
        assertEquals("Ben Ali", result.getLastName());
    }

    @Test
    void testGetProfessorByIdNotFound() {
        // Given
        UUID professorId = UUID.randomUUID();
        when(professorRepository.findById(professorId)).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> professorService.getProfessorById(professorId));
        assertEquals("Professeur non trouvé", exception.getMessage());
    }

    @Test
    void testUpdateProfessor() {
        // Given
        UUID professorId = UUID.randomUUID();
        ProfessorDTO request = new ProfessorDTO();
        request.setFirstName("Updated Ahmed");
        request.setLastName("Updated Ben Ali");
        request.setCin("CIN456");

        Professor existingProfessor = new Professor();
        existingProfessor.setId(professorId);
        existingProfessor.setFirstName("Ahmed");
        existingProfessor.setLastName("Ben Ali");
        existingProfessor.setCin("CIN123");

        when(professorRepository.findById(professorId)).thenReturn(Optional.of(existingProfessor));
        when(professorRepository.existsByCin("CIN456")).thenReturn(false);
        when(professorRepository.save(any(Professor.class))).thenReturn(existingProfessor);

        // When
        ProfessorDTO result = professorService.updateProfessor(professorId, request);

        // Then
        assertNotNull(result);
        assertEquals("Updated Ahmed", result.getFirstName());
        assertEquals("Updated Ben Ali", result.getLastName());
    }

    @Test
    void testDeleteProfessor() {
        // Given
        UUID professorId = UUID.randomUUID();
        Professor professor = new Professor();
        professor.setId(professorId);

        when(professorRepository.findById(professorId)).thenReturn(Optional.of(professor));

        // When
        professorService.deleteProfessor(professorId);

        // Then
        verify(authServiceClient, times(1)).deleteUser(professorId);
        verify(professorRepository, times(1)).delete(professor);
    }

    @Test
    void testGetAllProfessors() {
        // Given
        PageRequest pageable = PageRequest.of(0, 10);
        Page<Professor> professorsPage = mock(Page.class);

        // Prepare a list of Professors
        Professor professor1 = new Professor();
        professor1.setId(UUID.randomUUID());
        professor1.setFirstName("Ahmed");
        professor1.setLastName("Ben Ali");
        professor1.setCin("CIN123");

        Professor professor2 = new Professor();
        professor2.setId(UUID.randomUUID());
        professor2.setFirstName("Moulay");
        professor2.setLastName("Rachid");
        professor2.setCin("CIN124");

        // Mock the professorRepository to return a Page of Professors
        when(professorRepository.findAll(pageable)).thenReturn(new PageImpl<>(List.of(professor1, professor2), pageable, 2));

        // Mock the mapping to ProfessorDTO
        ProfessorDTO professorDTO1 = new ProfessorDTO();
        professorDTO1.setFirstName("Ahmed");
        professorDTO1.setLastName("Ben Ali");
        professorDTO1.setCin("CIN123");

        ProfessorDTO professorDTO2 = new ProfessorDTO();
        professorDTO2.setFirstName("Moulay");
        professorDTO2.setLastName("Rachid");
        professorDTO2.setCin("CIN124");

        // Mock the mapper
        when(professotMapper.toProfessorDTO(professor1)).thenReturn(professorDTO1);
        when(professotMapper.toProfessorDTO(professor2)).thenReturn(professorDTO2);

        // When
        Page<ProfessorDTO> result = professorService.getAllProfessors(0, 10);

        // Then
        assertNotNull(result);
        assertEquals(2, result.getContent().size());
        assertEquals("Ahmed", result.getContent().get(0).getFirstName());
        assertEquals("Moulay", result.getContent().get(1).getFirstName());
    }

}
