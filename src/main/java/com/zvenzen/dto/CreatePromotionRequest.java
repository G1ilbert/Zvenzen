package com.zvenzen.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class CreatePromotionRequest {

    @NotBlank(message = "name is required")
    private String name;

    @NotBlank(message = "discountType is required")
    private String discountType;

    private BigDecimal discountValue;

    @Min(0)
    private BigDecimal minOrderAmount;

    @NotNull(message = "maxCoupons is required")
    @Min(1)
    private Integer maxCoupons;

    @NotNull(message = "validFrom is required")
    private LocalDateTime validFrom;

    @NotNull(message = "validUntil is required")
    private LocalDateTime validUntil;

    @Valid
    private List<FreeItemRequest> freeItems;
}
