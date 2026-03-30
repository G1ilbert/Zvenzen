package com.zvenzen.dto.partner;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PartnerCouponResponseDto {
    private String code;
    private String promotionName;
}
