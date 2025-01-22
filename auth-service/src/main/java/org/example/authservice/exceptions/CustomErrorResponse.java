package org.example.authservice.exceptions;


import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CustomErrorResponse {
    private String message;
    private LocalDateTime timestamp;
    private int status;
}