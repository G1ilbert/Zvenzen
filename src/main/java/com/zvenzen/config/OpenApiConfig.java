package com.zvenzen.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Zvenzen Ice Cream API")
                        .version("3.0")
                        .description("API for Zvenzen Ice Cream Shop - Shop (internal) and Partner (external)"))
                .addSecurityItem(new SecurityRequirement().addList("X-API-KEY"))
                .schemaRequirement("X-API-KEY", new SecurityScheme()
                        .type(SecurityScheme.Type.APIKEY)
                        .in(SecurityScheme.In.HEADER)
                        .name("X-API-KEY")
                        .description("API key required for Partner endpoints only"));
    }
}
