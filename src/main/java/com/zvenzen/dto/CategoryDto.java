package com.zvenzen.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class CategoryDto {
    private Long id;
    private String name;
    private Boolean isActive;
}
