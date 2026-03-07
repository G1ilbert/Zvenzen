package com.zvenzen.service;

import com.zvenzen.dto.CouponDto;
import com.zvenzen.entity.Coupon;
import com.zvenzen.entity.Partner;
import com.zvenzen.entity.Promotion;
import com.zvenzen.exception.BusinessException;
import com.zvenzen.exception.ResourceNotFoundException;
import com.zvenzen.repository.CouponRepository;
import com.zvenzen.repository.PromotionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;
    private final PromotionRepository promotionRepository;

    private static final SecureRandom RANDOM = new SecureRandom();
    private static final String CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    @Transactional
    public CouponDto issueCoupon(Long promotionId, Partner partner) {
        Promotion promotion = promotionRepository.findById(promotionId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Promotion not found with id: " + promotionId));

        // Validate promotion is active
        if (!promotion.getIsActive()) {
            throw new BusinessException("Promotion is not active");
        }

        // Validate promotion is within valid date range
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(promotion.getValidFrom()) || now.isAfter(promotion.getValidUntil())) {
            throw new BusinessException("Promotion is not within valid date range");
        }

        // Validate max coupons not exceeded
        if (promotion.getCouponsUsed() >= promotion.getMaxCoupons()) {
            throw new BusinessException("Maximum number of coupons has been reached for this promotion");
        }

        // Generate coupon
        String code = generateCouponCode();
        String qrToken = UUID.randomUUID().toString();

        Coupon coupon = Coupon.builder()
                .promotion(promotion)
                .partner(partner)
                .code(code)
                .qrToken(qrToken)
                .status("active")
                .expiresAt(promotion.getValidUntil())
                .build();

        coupon = couponRepository.save(coupon);

        // Increment coupons_used
        promotion.setCouponsUsed(promotion.getCouponsUsed() + 1);
        promotionRepository.save(promotion);

        return toDto(coupon);
    }

    @Transactional(readOnly = true)
    public CouponDto getCouponByCode(String code, Partner partner) {
        Coupon coupon = couponRepository.findByCodeAndPartnerId(code, partner.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Coupon not found with code: " + code));
        return toDto(coupon);
    }

    private String generateCouponCode() {
        StringBuilder sb = new StringBuilder("ICE-");
        for (int i = 0; i < 6; i++) {
            sb.append(CHARS.charAt(RANDOM.nextInt(CHARS.length())));
        }
        return sb.toString();
    }

    private CouponDto toDto(Coupon coupon) {
        Promotion promo = coupon.getPromotion();
        return CouponDto.builder()
                .id(coupon.getId())
                .code(coupon.getCode())
                .qrToken(coupon.getQrToken())
                .status(coupon.getStatus())
                .issuedAt(coupon.getIssuedAt())
                .expiresAt(coupon.getExpiresAt())
                .promotionName(promo.getName())
                .discountType(promo.getDiscountType())
                .discountValue(promo.getDiscountValue())
                .build();
    }
}
