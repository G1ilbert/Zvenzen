package com.zvenzen.controller.partner;

import com.zvenzen.dto.*;
import com.zvenzen.dto.partner.PartnerCouponResponseDto;
import com.zvenzen.dto.partner.PartnerFixedPromotionDto;
import com.zvenzen.dto.partner.PartnerFreeItemPromotionDto;
import com.zvenzen.service.CouponService;
import com.zvenzen.service.PromotionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/partner")
@RequiredArgsConstructor
@Tag(name = "Partner API", description = "ดูโปรโมชั่นและออกคูปอง")
public class PartnerPromotionController {

    private final PromotionService promotionService;
    private final CouponService couponService;

    @GetMapping("/promotions")
    public ResponseEntity<ApiResponse<List<Object>>> getPromotions() {
        List<PromotionDto> allPromos = promotionService.getActivePromotions();
        List<Object> promotions = new ArrayList<>();

        for (PromotionDto p : allPromos) {
            int remaining = p.getMaxCoupons() - p.getCouponsUsed();
            if ("fixed".equals(p.getDiscountType())) {
                promotions.add(PartnerFixedPromotionDto.builder()
                        .id(p.getId())
                        .name(p.getName())
                        .discountValue(p.getDiscountValue())
                        .minOrderAmount(p.getMinOrderAmount())
                        .couponsRemaining(remaining)
                        .build());
            } else if ("free_items".equals(p.getDiscountType())) {
                String productName = null;
                String optionName = null;
                if (p.getFreeItems() != null && !p.getFreeItems().isEmpty()) {
                    FreeItemDto fi = p.getFreeItems().get(0);
                    productName = fi.getProductName();
                    optionName = fi.getOptionName();
                }
                promotions.add(PartnerFreeItemPromotionDto.builder()
                        .id(p.getId())
                        .name(p.getName())
                        .productName(productName)
                        .optionName(optionName)
                        .minOrderAmount(p.getMinOrderAmount())
                        .couponsRemaining(remaining)
                        .build());
            }
        }

        return ResponseEntity.ok(ApiResponse.ok(promotions));
    }

    @PostMapping("/coupons/issue")
    public ResponseEntity<ApiResponse<PartnerCouponResponseDto>> issueCoupon(
            @Valid @RequestBody IssueCouponRequest request) {
        CouponDto coupon = couponService.issueCoupon(request.getPromotionId());
        PromotionDto promo = promotionService.getPromotionById(request.getPromotionId());

        PartnerCouponResponseDto.PartnerCouponResponseDtoBuilder builder =
                PartnerCouponResponseDto.builder()
                        .code(coupon.getCode())
                        .promotionName(coupon.getPromotionName())
                        .minOrderAmount(promo.getMinOrderAmount());

        if ("fixed".equals(promo.getDiscountType())) {
            builder.discountValue(promo.getDiscountValue());
        } else if ("free_items".equals(promo.getDiscountType())
                && promo.getFreeItems() != null && !promo.getFreeItems().isEmpty()) {
            FreeItemDto fi = promo.getFreeItems().get(0);
            builder.productName(fi.getProductName());
            builder.optionName(fi.getOptionName());
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(builder.build()));
    }
}
