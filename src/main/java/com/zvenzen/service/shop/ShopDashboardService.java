package com.zvenzen.service.shop;

import com.zvenzen.dto.DashboardSummaryDto;
import com.zvenzen.dto.TopProductDto;
import com.zvenzen.repository.OrderItemRepository;
import com.zvenzen.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ShopDashboardService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    public DashboardSummaryDto getSummary() {
        LocalDate today = LocalDate.now();
        LocalDateTime from = today.atStartOfDay();
        LocalDateTime to = from.plusDays(1);

        Long totalOrders = orderRepository.countByDate(from, to);
        Long completedOrders = orderRepository.countByStatusAndDate("completed", from, to);
        Long cancelledOrders = orderRepository.countByStatusAndDate("cancelled", from, to);
        BigDecimal totalRevenue = orderRepository.sumRevenueByDate(from, to);
        BigDecimal totalDiscount = orderRepository.sumDiscountByDate(from, to);

        return DashboardSummaryDto.builder()
                .date(today)
                .totalOrders(totalOrders)
                .completedOrders(completedOrders)
                .cancelledOrders(cancelledOrders)
                .totalRevenue(totalRevenue)
                .totalDiscount(totalDiscount)
                .netRevenue(totalRevenue.subtract(totalDiscount))
                .build();
    }

    public List<TopProductDto> getTopProducts() {
        LocalDate today = LocalDate.now();
        LocalDateTime from = today.atStartOfDay();
        LocalDateTime to = from.plusDays(1);

        List<Object[]> results = orderItemRepository.findTopProducts(from, to);

        return results.stream()
                .limit(5)
                .map(row -> TopProductDto.builder()
                        .productId((Long) row[0])
                        .productName((String) row[1])
                        .totalQuantity((Long) row[2])
                        .build())
                .toList();
    }
}
