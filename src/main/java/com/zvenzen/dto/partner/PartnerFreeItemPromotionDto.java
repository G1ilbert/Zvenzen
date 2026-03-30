package com.zvenzen.dto.partner;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PartnerFreeItemPromotionDto {
    private String name;
    private String productName;
    private String optionName;
    private int couponsRemaining;
}
