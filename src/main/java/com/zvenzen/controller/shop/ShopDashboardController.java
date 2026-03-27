package com.zvenzen.controller.shop;

import com.zvenzen.dto.ApiResponse;
import com.zvenzen.dto.DashboardSummaryDto;
import com.zvenzen.dto.TopProductDto;
import com.zvenzen.service.shop.ShopDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/shop/dashboard")
@RequiredArgsConstructor
@io.swagger.v3.oas.annotations.tags.Tag(name = "Shop - Dashboard", description = "Sales dashboard (internal)")
public class ShopDashboardController {

    private final ShopDashboardService shopDashboardService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DashboardSummaryDto>> getSummary() {
        return ResponseEntity.ok(ApiResponse.ok(shopDashboardService.getSummary()));
    }

    @GetMapping("/top-products")
    public ResponseEntity<ApiResponse<List<TopProductDto>>> getTopProducts() {
        return ResponseEntity.ok(ApiResponse.ok(shopDashboardService.getTopProducts()));
    }
}
