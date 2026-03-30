package com.zvenzen.dto.partner;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.math.BigDecimal;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PartnerCouponResponseDto {
    private String code;
    private String promotionName;
    private BigDecimal discountValue;
    private String productName;
    private String optionName;
    private BigDecimal minOrderAmount;
}
