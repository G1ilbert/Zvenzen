package com.zvenzen.service;

import com.zvenzen.dto.MenuItemDto;
import com.zvenzen.dto.ProductOptionDto;
import com.zvenzen.entity.Product;
import com.zvenzen.exception.ResourceNotFoundException;
import com.zvenzen.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MenuService {

    private final ProductRepository productRepository;

    public List<MenuItemDto> getAllActiveMenuItems() {
        return productRepository.findAllActiveWithCategoryAndOptions().stream()
                .map(this::toDto)
                .toList();
    }

    public MenuItemDto getMenuItemById(Long id) {
        Product product = productRepository.findByIdWithCategoryAndOptions(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product not found with id: " + id));
        return toDto(product);
    }

    private MenuItemDto toDto(Product product) {
        List<ProductOptionDto> options = product.getOptions().stream()
                .map(opt -> ProductOptionDto.builder()
                        .id(opt.getId())
                        .optionName(opt.getOptionName())
                        .extraPrice(opt.getExtraPrice())
                        .isDefault(opt.getIsDefault())
                        .build())
                .toList();

        return MenuItemDto.builder()
                .id(product.getId())
                .name(product.getName())
                .basePrice(product.getBasePrice())
                .imageUrl(product.getImageUrl())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .options(options)
                .build();
    }
}
