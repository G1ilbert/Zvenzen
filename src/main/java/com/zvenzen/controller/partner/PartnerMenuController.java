package com.zvenzen.controller.partner;

import com.zvenzen.dto.ApiResponse;
import com.zvenzen.dto.MenuItemDto;
import com.zvenzen.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/partner/menu")
@RequiredArgsConstructor
@io.swagger.v3.oas.annotations.tags.Tag(name = "Partner - Menu", description = "Menu for partners (requires X-API-KEY)")
@io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "api-key")
public class PartnerMenuController {

    private final MenuService menuService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MenuItemDto>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(menuService.getAllActiveMenuItems()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MenuItemDto>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(menuService.getMenuItemById(id)));
    }
}
