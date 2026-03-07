package com.zvenzen.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ProductOptionDto {
    private Long id;
    private String optionName;
    private BigDecimal extraPrice;
    private Boolean isDefault;
}
