package com.unishop.service;

import com.unishop.dto.AuthResponse;
import com.unishop.dto.LoginRequest;
import com.unishop.dto.RegisterRequest;
import com.unishop.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthResponse login(LoginRequest request) {
        User user = userService.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user);
    }

    public AuthResponse register(RegisterRequest request) {
        User user = userService.registerUser(request);
        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user);
    }
}