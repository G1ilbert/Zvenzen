package com.zvenzen.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class TopProductDto {
    private Long productId;
    private String productName;
    private Long totalQuantity;
}
