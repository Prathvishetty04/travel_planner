package com.travelplanner.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/trips/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/trips").permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/trips/**").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/api/trips/**").permitAll()
                 .requestMatchers(HttpMethod.GET, "/api/saved-trips/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/saved-trips").permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/saved-trips/**").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/api/saved-trips/**").permitAll()
                
                .requestMatchers("/api/destinations/**").permitAll()
                .requestMatchers("/api/expenses/**").permitAll()
                .anyRequest().permitAll() // temp for debugging — lock down later
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(Arrays.asList("*"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
