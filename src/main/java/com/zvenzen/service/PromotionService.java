package com.zvenzen.service;

import com.zvenzen.dto.FreeItemDto;
import com.zvenzen.dto.PromotionDto;
import com.zvenzen.entity.Promotion;
import com.zvenzen.exception.ResourceNotFoundException;
import com.zvenzen.repository.PromotionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PromotionService {

    private final PromotionRepository promotionRepository;

    public List<PromotionDto> getActivePromotions() {
        LocalDateTime now = LocalDateTime.now();
        return promotionRepository.findAllActiveAndValid(now).stream()
                .map(this::toDto)
                .toList();
    }

    public PromotionDto getPromotionById(Long id) {
        Promotion promotion = promotionRepository.findByIdWithFreeItems(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Promotion not found with id: " + id));
        return toDto(promotion);
    }

    private PromotionDto toDto(Promotion promo) {
        PromotionDto.PromotionDtoBuilder builder = PromotionDto.builder()
                .id(promo.getId())
                .name(promo.getName())
                .discountType(promo.getDiscountType())
                .discountValue(promo.getDiscountValue())
                .minOrderAmount(promo.getMinOrderAmount())
                .maxCoupons(promo.getMaxCoupons())
                .couponsUsed(promo.getCouponsUsed())
                .validFrom(promo.getValidFrom())
                .validUntil(promo.getValidUntil());

        if ("free_items".equals(promo.getDiscountType()) && promo.getFreeItems() != null) {
            List<FreeItemDto> freeItems = promo.getFreeItems().stream()
                    .map(fi -> FreeItemDto.builder()
                            .productId(fi.getProduct().getId())
                            .productName(fi.getProduct().getName())
                            .optionId(fi.getOption() != null ? fi.getOption().getId() : null)
                            .optionName(fi.getOption() != null ? fi.getOption().getOptionName() : null)
                            .quantity(fi.getQuantity())
                            .build())
                    .toList();
            builder.freeItems(freeItems);
        }

        return builder.build();
    }
}
