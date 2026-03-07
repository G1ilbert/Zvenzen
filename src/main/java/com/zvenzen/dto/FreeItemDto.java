package com.zvenzen.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class FreeItemDto {
    private Long productId;
    private String productName;
    private Long optionId;
    private String optionName;
    private Integer quantity;
}
