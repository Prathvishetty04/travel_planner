package com.travelplanner.service;

import com.travelplanner.dto.LoginRequest;
import com.travelplanner.dto.RegisterRequest;
import com.travelplanner.dto.UserResponse;
import com.travelplanner.entity.User;
import com.travelplanner.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(User.UserRole.TRAVELER);

        user = userRepository.save(user);
        return convertToUserResponse(user);
    }

    public UserResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        return convertToUserResponse(user);
    }

    public UserResponse googleLogin(String googleToken) {
        // In a real implementation, you would verify the Google token
        // For now, we'll create a mock user
        User user = new User();
        user.setEmail("google.user@example.com");
        user.setFirstName("Google");
        user.setLastName("User");
        user.setGoogleId("google123");
        user.setRole(User.UserRole.TRAVELER);

        // Check if user already exists
        User existingUser = userRepository.findByGoogleId("google123").orElse(null);
        if (existingUser != null) {
            return convertToUserResponse(existingUser);
        }

        user = userRepository.save(user);
        return convertToUserResponse(user);
    }

    private UserResponse convertToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setRole(user.getRole().toString());
        return response;
    }
}
