package com.zvenzen.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class CategoryDto {
    private Long id;
    private String name;
    private Integer sortOrder;
    private Boolean isActive;
}
