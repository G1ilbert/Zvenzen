package com.zvenzen.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class ProductOptionRequest {

    @NotBlank(message = "optionName is required")
    private String optionName;

    @NotNull(message = "extraPrice is required")
    @Min(0)
    private BigDecimal extraPrice;

    private Boolean isDefault = false;
}
