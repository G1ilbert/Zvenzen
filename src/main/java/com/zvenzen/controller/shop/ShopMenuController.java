package com.zvenzen.controller.shop;

import com.zvenzen.dto.ApiResponse;
import com.zvenzen.dto.CreateMenuRequest;
import com.zvenzen.dto.MenuItemDto;
import com.zvenzen.service.shop.ShopMenuService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/api/v1/shop/menu")
@RequiredArgsConstructor
@Tag(name = "5. Shop - Menu", description = "จัดการเมนูสินค้า")
public class ShopMenuController {

    private final ShopMenuService shopMenuService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MenuItemDto>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(shopMenuService.getAllMenuItems()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MenuItemDto>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(shopMenuService.getMenuItemById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MenuItemDto>> create(@Valid @RequestBody CreateMenuRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(shopMenuService.createMenuItem(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MenuItemDto>> update(
            @PathVariable Long id, @Valid @RequestBody CreateMenuRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(shopMenuService.updateMenuItem(id, request)));
    }
}
