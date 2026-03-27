package com.zvenzen.controller.shop;

import com.zvenzen.dto.ApiResponse;
import com.zvenzen.dto.CreateMenuRequest;
import com.zvenzen.dto.MenuItemDto;
import com.zvenzen.service.StorageService;
import com.zvenzen.service.shop.ShopMenuService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/shop/menu")
@RequiredArgsConstructor
@Tag(name = "Shop - Menu", description = "Product management (internal)")
public class ShopMenuController {

    private final ShopMenuService shopMenuService;
    private final StorageService storageService;

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

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<ApiResponse<MenuItemDto>> toggle(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(shopMenuService.toggleActive(id)));
    }

    @PostMapping(value = "/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadImage(
            @RequestParam("file") MultipartFile file) {
        String imageUrl = storageService.uploadImage(file);
        return ResponseEntity.ok(ApiResponse.ok(Map.of("imageUrl", imageUrl)));
    }
}
