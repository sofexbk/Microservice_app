package org.example.gatewayservice.config;

import org.example.gatewayservice.security.JwtAuthenticationFilter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RouteConfiguration {
    @Bean
    public RouteLocator routeLocator(RouteLocatorBuilder builder, JwtAuthenticationFilter jwtFilter) {
        JwtAuthenticationFilter.Config filterConfig = new JwtAuthenticationFilter.Config();

        return builder.routes()
                .route("auth-service", r -> r
                        .path("/api/auth/**")
                        .uri("lb://auth-service"))
                .route("student-service", r -> r
                        .path("/student-service/**", "/students/**")  // Match both paths
                        .filters(f -> f
                                .filter(jwtFilter.apply(filterConfig))
                                .rewritePath("/student-service/(?<segment>.*)", "/${segment}"))  // Remove prefix if present
                        .uri("lb://student-service"))
                .build();
    }
}