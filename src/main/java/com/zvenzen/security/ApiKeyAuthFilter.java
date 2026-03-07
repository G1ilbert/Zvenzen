package com.zvenzen.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zvenzen.dto.ApiResponse;
import com.zvenzen.entity.Partner;
import com.zvenzen.repository.PartnerRepository;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.annotation.Order;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;

@Component
@Order(1)
@RequiredArgsConstructor
public class ApiKeyAuthFilter implements Filter {

    private static final String API_KEY_HEADER = "X-API-KEY";
    private static final String PARTNER_ATTR = "authenticatedPartner";

    private final PartnerRepository partnerRepository;
    private final ObjectMapper objectMapper;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        String path = httpRequest.getRequestURI();

        // Only filter /api/ endpoints
        if (!path.startsWith("/api/")) {
            chain.doFilter(request, response);
            return;
        }

        String apiKey = httpRequest.getHeader(API_KEY_HEADER);
        if (apiKey == null || apiKey.isBlank()) {
            writeError(httpResponse, HttpServletResponse.SC_UNAUTHORIZED,
                    "Missing X-API-KEY header");
            return;
        }

        Optional<Partner> partner = partnerRepository.findByApiKeyAndStatus(apiKey, "active");
        if (partner.isEmpty()) {
            writeError(httpResponse, HttpServletResponse.SC_UNAUTHORIZED,
                    "Invalid or inactive API key");
            return;
        }

        httpRequest.setAttribute(PARTNER_ATTR, partner.get());
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
