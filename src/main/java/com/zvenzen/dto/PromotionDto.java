package com.zvenzen.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PromotionDto {
    private Long id;
    private String name;
    private String discountType;
    private BigDecimal discountValue;
    private BigDecimal minOrderAmount;
    private Integer maxCoupons;
    private Integer couponsUsed;
    private LocalDateTime validFrom;
    private LocalDateTime validUntil;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<FreeItemDto> freeItems;
}
