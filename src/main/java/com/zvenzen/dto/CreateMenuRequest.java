package com.zvenzen.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class CreateMenuRequest {

    @NotNull(message = "categoryId is required")
    private Long categoryId;

    @NotBlank(message = "name is required")
    @Size(max = 150)
    private String name;

    @NotNull(message = "basePrice is required")
    @Min(0)
    private BigDecimal basePrice;

    private String imageUrl;

    @Valid
    private List<ProductOptionRequest> options;
}
