package com.zvenzen.controller.partner;

import com.zvenzen.dto.ApiResponse;
import com.zvenzen.dto.CouponDto;
import com.zvenzen.dto.IssueCouponRequest;
import com.zvenzen.service.CouponService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/partner/coupons")
@RequiredArgsConstructor
@io.swagger.v3.oas.annotations.tags.Tag(name = "Partner - Coupons", description = "Coupon issuance for partners (requires X-API-KEY)")
@io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "api-key")
public class PartnerCouponController {

    private final CouponService couponService;

    @PostMapping("/issue")
    public ResponseEntity<ApiResponse<CouponDto>> issue(@Valid @RequestBody IssueCouponRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(couponService.issueCoupon(request.getPromotionId())));
    }

    @GetMapping("/{code}")
    public ResponseEntity<ApiResponse<CouponDto>> getByCode(@PathVariable String code) {
        return ResponseEntity.ok(ApiResponse.ok(couponService.getCouponByCode(code)));
    }
}
