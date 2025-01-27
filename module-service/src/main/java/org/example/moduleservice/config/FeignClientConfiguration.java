package org.example.moduleservice.config;

import feign.RequestInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Configuration
public class FeignClientConfiguration {
    @Bean
    public RequestInterceptor requestInterceptor() {
        return requestTemplate -> {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication instanceof CustomAuthenticationToken) {
                CustomAuthenticationToken customAuth = (CustomAuthenticationToken) authentication;

                requestTemplate.header("X-User-Role", customAuth.getRole());
                requestTemplate.header("X-User-Id", (String) customAuth.getPrincipal());
            }
        };
    }
}
