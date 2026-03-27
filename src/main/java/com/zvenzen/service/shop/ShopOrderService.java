package com.zvenzen.service.shop;

import com.zvenzen.dto.*;
import com.zvenzen.entity.*;
import com.zvenzen.exception.BusinessException;
import com.zvenzen.exception.ResourceNotFoundException;
import com.zvenzen.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ShopOrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ProductOptionRepository productOptionRepository;
    private final CouponRepository couponRepository;
    private final CouponUsageRepository couponUsageRepository;
    private final PromotionRepository promotionRepository;

    @Transactional
    public OrderDto createOrder(CreateOrderRequest request) {
        Order order = Order.builder().build();

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Product not found with id: " + itemReq.getProductId()));

            BigDecimal unitPrice = product.getBasePrice();
            ProductOption option = null;

            if (itemReq.getOptionId() != null) {
                option = productOptionRepository.findById(itemReq.getOptionId())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Option not found with id: " + itemReq.getOptionId()));
                unitPrice = unitPrice.add(option.getExtraPrice());
            }

            BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(itemReq.getQuantity()));

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .option(option)
                    .quantity(itemReq.getQuantity())
                    .unitPrice(unitPrice)
                    .subtotal(subtotal)
                    .build();

            orderItems.add(orderItem);
            totalAmount = totalAmount.add(subtotal);
        }

        order.setItems(orderItems);
        order.setTotalAmount(totalAmount);
        order.setOrderRef(generateOrderRef());

        BigDecimal discountAmount = BigDecimal.ZERO;
        CouponUsage couponUsage = null;

        if (request.getCouponCode() != null && !request.getCouponCode().isBlank()) {
            Coupon coupon = couponRepository.findByCode(request.getCouponCode())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Coupon not found with code: " + request.getCouponCode()));

            if (!"active".equals(coupon.getStatus())) {
                throw new BusinessException("Coupon is not active");
            }
            if (coupon.getExpiresAt().isBefore(LocalDateTime.now())) {
                throw new BusinessException("Coupon has expired");
            }

            Promotion promotion = coupon.getPromotion();

            if (promotion.getMinOrderAmount() != null
                    && totalAmount.compareTo(promotion.getMinOrderAmount()) < 0) {
                throw new BusinessException("Order amount does not meet minimum requirement of " + promotion.getMinOrderAmount());
            }

            switch (promotion.getDiscountType()) {
                case "fixed" -> discountAmount = promotion.getDiscountValue();
                case "percent" -> discountAmount = totalAmount
                        .multiply(promotion.getDiscountValue())
                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                case "free_items" -> discountAmount = BigDecimal.ZERO;
            }

            coupon.setStatus("used");
            couponRepository.save(coupon);

            promotion.setCouponsUsed(promotion.getCouponsUsed() + 1);
            promotionRepository.save(promotion);

            couponUsage = CouponUsage.builder()
                    .coupon(coupon)
                    .order(order)
                    .discountApplied(discountAmount)
                    .build();
        }

        order.setDiscountAmount(discountAmount);
        BigDecimal finalAmount = totalAmount.subtract(discountAmount);
        order.setFinalAmount(finalAmount.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : finalAmount);

        order = orderRepository.save(order);

        if (couponUsage != null) {
            couponUsage.setOrder(order);
            couponUsageRepository.save(couponUsage);
        }

        return toDto(order);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getOrders(String status, LocalDate date) {
        List<Order> orders;

        if (status != null && date != null) {
            LocalDateTime from = date.atStartOfDay();
            LocalDateTime to = from.plusDays(1);
            orders = orderRepository.findByStatusAndCreatedAtBetween(status, from, to);
        } else if (status != null) {
            orders = orderRepository.findByStatus(status);
        } else if (date != null) {
            LocalDateTime from = date.atStartOfDay();
            LocalDateTime to = from.plusDays(1);
            orders = orderRepository.findByCreatedAtBetween(from, to);
        } else {
            orders = orderRepository.findAllOrdered();
        }

        return orders.stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public OrderDto getOrderById(Long id) {
        Order order = orderRepository.findByIdWithItems(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        return toDto(order);
    }

    @Transactional
    public OrderDto updateStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        order.setStatus(status);
        return toDto(orderRepository.save(order));
    }

    private String generateOrderRef() {
        String dateStr = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String prefix = "ZVN-" + dateStr + "-";

        List<String> latest = orderRepository.findLatestOrderRefByPrefix(prefix);
        int nextNum = 1;
        if (!latest.isEmpty()) {
            String lastRef = latest.get(0);
            String numPart = lastRef.substring(prefix.length());
            nextNum = Integer.parseInt(numPart) + 1;
        }

        return prefix + String.format("%04d", nextNum);
    }

    private OrderDto toDto(Order order) {
        List<OrderItemDto> items = order.getItems() != null
                ? order.getItems().stream()
                    .map(item -> OrderItemDto.builder()
                            .id(item.getId())
                            .productId(item.getProduct().getId())
                            .productName(item.getProduct().getName())
                            .optionId(item.getOption() != null ? item.getOption().getId() : null)
                            .optionName(item.getOption() != null ? item.getOption().getOptionName() : null)
                            .quantity(item.getQuantity())
                            .unitPrice(item.getUnitPrice())
                            .subtotal(item.getSubtotal())
                            .build())
                    .toList()
                : new ArrayList<>();

        return OrderDto.builder()
                .id(order.getId())
                .orderRef(order.getOrderRef())
                .totalAmount(order.getTotalAmount())
                .discountAmount(order.getDiscountAmount())
                .finalAmount(order.getFinalAmount())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .items(items)
                .build();
    }
}
