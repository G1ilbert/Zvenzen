package com.zvenzen.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class FreeItemRequest {

    @NotNull(message = "productId is required")
    private Long productId;

    private Long optionId;

    @NotNull(message = "quantity is required")
    @Min(1)
    private Integer quantity;
}
