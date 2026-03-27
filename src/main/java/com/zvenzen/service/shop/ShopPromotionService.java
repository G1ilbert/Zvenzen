package com.zvenzen.service.shop;

import com.zvenzen.dto.*;
import com.zvenzen.entity.Product;
import com.zvenzen.entity.ProductOption;
import com.zvenzen.entity.Promotion;
import com.zvenzen.entity.PromotionFreeItem;
import com.zvenzen.exception.ResourceNotFoundException;
import com.zvenzen.repository.ProductOptionRepository;
import com.zvenzen.repository.ProductRepository;
import com.zvenzen.repository.PromotionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ShopPromotionService {

    private final PromotionRepository promotionRepository;
    private final ProductRepository productRepository;
    private final ProductOptionRepository productOptionRepository;

    @Transactional(readOnly = true)
    public List<PromotionDto> getAllPromotions() {
        return promotionRepository.findAllWithFreeItems().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public PromotionDto createPromotion(CreatePromotionRequest request) {
        Promotion promotion = Promotion.builder()
                .name(request.getName())
                .discountType(request.getDiscountType())
                .discountValue(request.getDiscountValue())
                .minOrderAmount(request.getMinOrderAmount())
                .maxCoupons(request.getMaxCoupons())
                .validFrom(request.getValidFrom())
                .validUntil(request.getValidUntil())
                .build();

        if ("free_items".equals(request.getDiscountType()) && request.getFreeItems() != null) {
            for (FreeItemRequest fi : request.getFreeItems()) {
                Product product = productRepository.findById(fi.getProductId())
                        .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + fi.getProductId()));

                ProductOption option = null;
                if (fi.getOptionId() != null) {
                    option = productOptionRepository.findById(fi.getOptionId())
                            .orElseThrow(() -> new ResourceNotFoundException("Option not found with id: " + fi.getOptionId()));
                }

                PromotionFreeItem freeItem = PromotionFreeItem.builder()
                        .promotion(promotion)
                        .product(product)
                        .option(option)
                        .quantity(fi.getQuantity())
                        .build();
                promotion.getFreeItems().add(freeItem);
            }
        }

        return toDto(promotionRepository.save(promotion));
    }

    @Transactional
    public PromotionDto updatePromotion(Long id, CreatePromotionRequest request) {
        Promotion promotion = promotionRepository.findByIdWithFreeItems(id)
                .orElseThrow(() -> new ResourceNotFoundException("Promotion not found with id: " + id));

        promotion.setName(request.getName());
        promotion.setDiscountType(request.getDiscountType());
        promotion.setDiscountValue(request.getDiscountValue());
        promotion.setMinOrderAmount(request.getMinOrderAmount());
        promotion.setMaxCoupons(request.getMaxCoupons());
        promotion.setValidFrom(request.getValidFrom());
        promotion.setValidUntil(request.getValidUntil());

        // Replace free items
        promotion.getFreeItems().clear();
        if ("free_items".equals(request.getDiscountType()) && request.getFreeItems() != null) {
            for (FreeItemRequest fi : request.getFreeItems()) {
                Product product = productRepository.findById(fi.getProductId())
                        .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + fi.getProductId()));

                ProductOption option = null;
                if (fi.getOptionId() != null) {
                    option = productOptionRepository.findById(fi.getOptionId())
                            .orElseThrow(() -> new ResourceNotFoundException("Option not found with id: " + fi.getOptionId()));
                }

                PromotionFreeItem freeItem = PromotionFreeItem.builder()
                        .promotion(promotion)
                        .product(product)
                        .option(option)
                        .quantity(fi.getQuantity())
                        .build();
                promotion.getFreeItems().add(freeItem);
            }
        }

        return toDto(promotionRepository.save(promotion));
    }

    @Transactional
    public PromotionDto toggleActive(Long id) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Promotion not found with id: " + id));
        promotion.setIsActive(!promotion.getIsActive());
        return toDto(promotionRepository.save(promotion));
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
