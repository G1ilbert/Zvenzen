package com.zvenzen.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class CreateOrderRequest {

    @NotEmpty(message = "items is required")
    @Valid
    private List<OrderItemRequest> items;

    private String couponCode;
}
