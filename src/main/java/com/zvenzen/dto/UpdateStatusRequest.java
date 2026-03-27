package com.zvenzen.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class UpdateStatusRequest {

    @NotBlank(message = "status is required")
    private String status;
}
