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
                .route("professor-service", r -> r
                        .path("/api/professors/**")
                        .filters(f -> f
                                .filter(jwtFilter.apply(filterConfig))
                                .rewritePath("/professor-service/(?<segment>.*)", "/${segment}"))  // Remove prefix if present
                        .uri("lb://professor-service"))

                .route("student-service", r -> r
                        .path("/api/students/**")
                        .filters(f -> f
                                .filter(jwtFilter.apply(filterConfig))
                                .rewritePath("/student-service/(?<segment>.*)", "/${segment}"))  // Remove prefix if present
                        .uri("lb://student-service"))

                .route("module-service", r -> r
                        .path("/api/modules/**")
                        .filters(f -> f
                                .filter(jwtFilter.apply(filterConfig))
                                .rewritePath("/module-service/(?<segment>.*)", "/${segment}"))  // Remove prefix if present
                        .uri("lb://module-service"))

                .route("inscription-service", r -> r
                        .path("/api/inscriptions/**")
                        .filters(f -> f
                                .filter(jwtFilter.apply(filterConfig))
                                .rewritePath("/inscription-service/(?<segment>.*)", "/${segment}"))  // Remove prefix if present
                        .uri("lb://inscription-service"))

                .route("statistiques-service", r -> r
                        .path("/api/statistics/**")
                        .filters(f -> f
                                .filter(jwtFilter.apply(filterConfig))
                                .rewritePath("/statistiques-service/(?<segment>.*)", "/${segment}"))  // Remove prefix if present
                        .uri("lb://statistiques-service"))
                .build();
    }
}