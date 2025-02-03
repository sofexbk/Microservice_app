package org.example.gatewayservice.security;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
@Slf4j
public class JwtAuthenticationFilter extends AbstractGatewayFilterFactory<JwtAuthenticationFilter.Config> {

    @Data
    public static class Config {
        private String authServiceName = "localhost:8090";
    }

    private final WebClient.Builder webClientBuilder;

    public JwtAuthenticationFilter(WebClient.Builder webClientBuilder) {
        super(Config.class);
        this.webClientBuilder = webClientBuilder;
    }

    @Override
    public GatewayFilter apply(Config config) {
        WebClient webClient = webClientBuilder
                .baseUrl("http://" + config.getAuthServiceName())
                .build();

        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            log.info("Processing request for path: {}", request.getPath());

            String token = extractToken(request);
            if (token == null) {
                return onError(exchange, "Token manquant ou mal formaté", HttpStatus.UNAUTHORIZED);
            }

            log.info("Tentative de validation du token via {}", config.getAuthServiceName());

            return webClient.post()
                    .uri("/api/auth/validate")
                    .header("Authorization", "Bearer " + token)
                    .retrieve()
                    .bodyToMono(UserDetails.class)
                    .doOnError(error -> {
                        log.error("Erreur lors de la validation du token: {}", error.getMessage());
                    })
                    .flatMap(userDetails -> {
                        log.info("Token validé avec succès pour l'utilisateur: {}", userDetails.getId());
                        ServerHttpRequest modifiedRequest = request.mutate()
                                .header("X-User-Id", userDetails.getId())
                                .header("X-User-Role", userDetails.getRole())
                                .build();
                        return chain.filter(exchange.mutate().request(modifiedRequest).build());
                    })
                    .onErrorResume(error -> {
                        log.error("Erreur détaillée: ", error);
                        return onError(exchange, "Erreur de validation du token: " + error.getMessage(),
                                HttpStatus.UNAUTHORIZED);
                    });
        };
    }

    private String extractToken(ServerHttpRequest request) {
        String authHeader = request.getHeaders().getFirst("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            log.debug("Token extrait: {}", token);
            return token;
        }
        log.debug("Header d'autorisation invalide ou manquant: {}", authHeader);
        return null;
    }

    private Mono<Void> onError(ServerWebExchange exchange, String message, HttpStatus status) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(status);
        response.getHeaders().add("Content-Type", "application/json");
        String errorMessage = String.format("{\"error\": \"%s\", \"status\": %d}", message, status.value());
        log.error("Erreur de validation: {}", errorMessage);
        return response.writeWith(Mono.just(response.bufferFactory().wrap(errorMessage.getBytes())));
    }
}