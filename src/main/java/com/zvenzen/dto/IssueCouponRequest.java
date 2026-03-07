package com.zvenzen.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class IssueCouponRequest {

    @NotNull(message = "promotion_id is required")
    private Long promotionId;
}
