package com.zvenzen.dto.partner;

import lombok.*;

import java.math.BigDecimal;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PartnerFreeItemPromotionDto {
    private Long id;
    private String name;
    private String productName;
    private String optionName;
    private BigDecimal minOrderAmount;
    private int couponsRemaining;
}
