package org.example.studentservice.config;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;

public class CustomAuthenticationToken extends AbstractAuthenticationToken {

    private final String userId;
    private final String role;

    public CustomAuthenticationToken(String userId, String role) {
        super(Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role)));
        this.userId = userId;
        this.role = role;
        setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return null;  // Aucun mot de passe nécessaire
    }

    @Override
    public Object getPrincipal() {
        return userId;
    }

    public String getRole() {
        return role;
    }

}