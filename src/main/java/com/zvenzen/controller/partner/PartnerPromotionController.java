package com.zvenzen.controller.partner;

import com.zvenzen.dto.*;
import com.zvenzen.service.CouponService;
import com.zvenzen.service.MenuService;
import com.zvenzen.service.PromotionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/partner")
@RequiredArgsConstructor
@Tag(name = "1. Partner API", description = "ดูโปรโมชั่นพร้อมเมนู และออกคูปอง")
public class PartnerPromotionController {

    private final PromotionService promotionService;
    private final MenuService menuService;
    private final CouponService couponService;

    @GetMapping("/promotions")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPromotions() {
        Map<String, Object> result = new HashMap<>();
        result.put("promotions", promotionService.getActivePromotions());
        result.put("menu", menuService.getAllActiveMenuItems());
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @PostMapping("/coupons/issue")
    public ResponseEntity<ApiResponse<CouponDto>> issueCoupon(
            @Valid @RequestBody IssueCouponRequest request) {
        CouponDto coupon = couponService.issueCoupon(request.getPromotionId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(coupon));
    }
}
