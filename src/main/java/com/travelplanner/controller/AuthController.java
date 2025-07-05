package com.travelplanner.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.travelplanner.dto.LoginRequest;
import com.travelplanner.dto.RegisterRequest;
import com.travelplanner.dto.UserResponse;
import com.travelplanner.exception.AuthException;
import com.travelplanner.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@Validated
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        logger.info("Registration request received for email: {}", request.getEmail());
        try {
            UserResponse user = authService.register(request);
            logger.info("User registered successfully with email: {}", request.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED).body(user);
        } catch (AuthException e) {
            logger.error("Registration failed for email: {}, error: {}", request.getEmail(), e.getMessage());
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Registration failed for email: {}, unexpected error: {}", request.getEmail(), e.getMessage(), e);
            return ResponseEntity.internalServerError().body(new ErrorResponse("Registration failed"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        logger.info("Login request received for email: {}", request.getEmail());
        try {
            UserResponse user = authService.login(request);
            logger.info("User logged in successfully with email: {}", request.getEmail());
            return ResponseEntity.ok(user);
        } catch (AuthException e) {
            logger.error("Login failed for email: {}, error: {}", request.getEmail(), e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Login failed for email: {}, unexpected error: {}", request.getEmail(), e.getMessage(), e);
            return ResponseEntity.internalServerError().body(new ErrorResponse("Login failed"));
        }
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleLoginRequest request) {
        logger.info("Google login request received");
        try {
            if (request.getToken() == null || request.getToken().isBlank()) {
                logger.error("Google login failed: Token is required");
                return ResponseEntity.badRequest().body(new ErrorResponse("Google token is required"));
            }
            
            UserResponse user = authService.googleLogin(request.getToken());
            logger.info("Google login successful");
            return ResponseEntity.ok(user);
        } catch (AuthException e) {
            logger.error("Google login failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Google login failed with unexpected error: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(new ErrorResponse("Google login failed"));
        }
    }

    // Helper class for consistent error responses
    public static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    // Helper class for Google login request
    public static class GoogleLoginRequest {
        private String token;

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }
    }
}