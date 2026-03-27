package com.zvenzen.controller.partner;

import com.zvenzen.dto.ApiResponse;
import com.zvenzen.dto.PromotionDto;
import com.zvenzen.service.PromotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/partner/promotions")
@RequiredArgsConstructor
@io.swagger.v3.oas.annotations.tags.Tag(name = "Partner - Promotions", description = "Promotions for partners (requires X-API-KEY)")
@io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "api-key")
public class PartnerPromotionController {

    private final PromotionService promotionService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PromotionDto>>> getActive() {
        return ResponseEntity.ok(ApiResponse.ok(promotionService.getActivePromotions()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PromotionDto>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(promotionService.getPromotionById(id)));
    }
}
