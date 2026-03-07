package com.zvenzen.controller;

import com.zvenzen.dto.ApiResponse;
import com.zvenzen.dto.PromotionDto;
import com.zvenzen.service.PromotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/promotions")
@RequiredArgsConstructor
public class PromotionController {

    private final PromotionService promotionService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PromotionDto>>> getActivePromotions() {
        List<PromotionDto> promotions = promotionService.getActivePromotions();
        return ResponseEntity.ok(ApiResponse.ok(promotions));
    }
}
