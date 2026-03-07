package com.zvenzen.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class CouponDto {
    private Long id;
    private String code;
    private String qrToken;
    private String status;
    private LocalDateTime issuedAt;
    private LocalDateTime expiresAt;
    private String promotionName;
    private String discountType;
    private BigDecimal discountValue;
}
