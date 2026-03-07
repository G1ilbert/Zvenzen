package com.zvenzen.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class MenuItemDto {
    private Long id;
    private String name;
    private BigDecimal basePrice;
    private String imageUrl;
    private String categoryName;
    private Long categoryId;
    private List<ProductOptionDto> options;
}
