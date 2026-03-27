package com.zvenzen.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zvenzen.dto.ApiResponse;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Order(1)
public class ApiKeyAuthFilter implements Filter {

    private static final String API_KEY_HEADER = "X-API-KEY";

    private final String apiKey;
    private final ObjectMapper objectMapper;

    public ApiKeyAuthFilter(@Value("${app.api-key}") String apiKey, ObjectMapper objectMapper) {
        this.apiKey = apiKey;
        this.objectMapper = objectMapper;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        // Let CORS preflight through without auth
        if ("OPTIONS".equalsIgnoreCase(httpRequest.getMethod())) {
            chain.doFilter(request, response);
            return;
        }

        String path = httpRequest.getRequestURI();

        // Only /api/v1/partner/** requires API key
        if (!path.startsWith("/api/v1/partner/")) {
            chain.doFilter(request, response);
            return;
        }

        String headerKey = httpRequest.getHeader(API_KEY_HEADER);
        if (headerKey == null || headerKey.isBlank()) {
            writeError(httpResponse, HttpServletResponse.SC_UNAUTHORIZED,
                    "Missing X-API-KEY header");
            return;
        }

        if (!apiKey.equals(headerKey)) {
            writeError(httpResponse, HttpServletResponse.SC_UNAUTHORIZED,
                    "Invalid API key");
            return;
        }

        chain.doFilter(request, response);
    }

    private void writeError(HttpServletResponse response, int status, String message)
            throws IOException {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        objectMapper.writeValue(response.getWriter(), ApiResponse.error(message));
    }
}
