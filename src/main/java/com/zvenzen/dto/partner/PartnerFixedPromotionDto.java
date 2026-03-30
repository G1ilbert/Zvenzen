package com.zvenzen.dto.partner;

import lombok.*;

import java.math.BigDecimal;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PartnerFixedPromotionDto {
    private String name;
    private BigDecimal discountValue;
    private int couponsRemaining;
}
