package com.zvenzen.controller.shop;

import com.zvenzen.dto.ApiResponse;
import com.zvenzen.dto.CreatePromotionRequest;
import com.zvenzen.dto.PromotionDto;
import com.zvenzen.service.shop.ShopPromotionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/shop/promotions")
@RequiredArgsConstructor
@io.swagger.v3.oas.annotations.tags.Tag(name = "Shop - Promotions", description = "Promotion management (internal)")
public class ShopPromotionController {

    private final ShopPromotionService shopPromotionService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PromotionDto>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(shopPromotionService.getAllPromotions()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PromotionDto>> create(@Valid @RequestBody CreatePromotionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(shopPromotionService.createPromotion(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PromotionDto>> update(
            @PathVariable Long id, @Valid @RequestBody CreatePromotionRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(shopPromotionService.updatePromotion(id, request)));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<ApiResponse<PromotionDto>> toggle(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(shopPromotionService.toggleActive(id)));
    }
}
