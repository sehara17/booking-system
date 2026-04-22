package com.example.bookingsystem.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @GetMapping("/me")
    public Map<String, Object> me(
            Authentication authentication,
            @RequestHeader(value = "X-User-Email", required = false) String headerEmail,
            @RequestHeader(value = "X-User-Role", required = false) String headerRole
    ) {
        Map<String, Object> response = new HashMap<>();

        if (authentication != null && authentication.getPrincipal() instanceof OAuth2User oauth2User) {
            String email = oauth2User.getAttribute("email");
            String name = oauth2User.getAttribute("name");
            response.put("authenticated", true);
            response.put("email", email != null ? email : "oauth-user@booking.local");
            response.put("name", name != null ? name : "OAuth User");
            response.put("role", "USER");
            return response;
        }

        response.put("authenticated", false);
        response.put("email", (headerEmail == null || headerEmail.isBlank()) ? "user@booking.local" : headerEmail);
        response.put("name", "Local User");
        response.put("role", (headerRole == null || headerRole.isBlank()) ? "USER" : headerRole.toUpperCase());
        return response;
    }
}
