package com.zvenzen.controller;

import com.zvenzen.dto.ApiResponse;
import com.zvenzen.dto.CouponDto;
import com.zvenzen.dto.IssueCouponRequest;
import com.zvenzen.entity.Partner;
import com.zvenzen.security.PartnerContext;
import com.zvenzen.service.CouponService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;
    private final PartnerContext partnerContext;

    @PostMapping("/issue")
    public ResponseEntity<ApiResponse<CouponDto>> issueCoupon(
            @Valid @RequestBody IssueCouponRequest request) {
        Partner partner = partnerContext.getCurrentPartner();
        CouponDto coupon = couponService.issueCoupon(request.getPromotionId(), partner);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(coupon));
    }

    @GetMapping("/{code}")
    public ResponseEntity<ApiResponse<CouponDto>> getCoupon(@PathVariable String code) {
        Partner partner = partnerContext.getCurrentPartner();
        CouponDto coupon = couponService.getCouponByCode(code, partner);
        return ResponseEntity.ok(ApiResponse.ok(coupon));
    }
}
