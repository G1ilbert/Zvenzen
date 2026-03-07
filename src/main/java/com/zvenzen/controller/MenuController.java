package com.zvenzen.controller;

import com.zvenzen.dto.ApiResponse;
import com.zvenzen.dto.MenuItemDto;
import com.zvenzen.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/menu")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MenuItemDto>>> getAllMenuItems() {
        List<MenuItemDto> items = menuService.getAllActiveMenuItems();
        return ResponseEntity.ok(ApiResponse.ok(items));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MenuItemDto>> getMenuItem(@PathVariable Long id) {
        MenuItemDto item = menuService.getMenuItemById(id);
        return ResponseEntity.ok(ApiResponse.ok(item));
    }
}
