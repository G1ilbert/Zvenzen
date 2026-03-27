package com.zvenzen.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class CreateCategoryRequest {

    @NotBlank(message = "name is required")
    @Size(max = 100)
    private String name;

    private Integer sortOrder;
}
