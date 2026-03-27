package com.zvenzen.service.shop;

import com.zvenzen.dto.CreateMenuRequest;
import com.zvenzen.dto.MenuItemDto;
import com.zvenzen.dto.ProductOptionDto;
import com.zvenzen.dto.ProductOptionRequest;
import com.zvenzen.entity.Category;
import com.zvenzen.entity.Product;
import com.zvenzen.entity.ProductOption;
import com.zvenzen.exception.ResourceNotFoundException;
import com.zvenzen.repository.CategoryRepository;
import com.zvenzen.repository.ProductRepository;
import com.zvenzen.service.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ShopMenuService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final StorageService storageService;

    @Transactional(readOnly = true)
    public List<MenuItemDto> getAllMenuItems() {
        return productRepository.findAllWithCategoryAndOptions().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public MenuItemDto getMenuItemById(Long id) {
        Product product = productRepository.findByIdWithCategoryAndOptions(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return toDto(product);
    }

    @Transactional
    public MenuItemDto createMenuItem(CreateMenuRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        Product product = Product.builder()
                .category(category)
                .name(request.getName())
                .basePrice(request.getBasePrice())
                .imageUrl(request.getImageUrl())
                .build();

        if (request.getOptions() != null) {
            for (ProductOptionRequest optReq : request.getOptions()) {
                ProductOption option = ProductOption.builder()
                        .product(product)
                        .optionName(optReq.getOptionName())
                        .extraPrice(optReq.getExtraPrice())
                        .isDefault(optReq.getIsDefault() != null ? optReq.getIsDefault() : false)
                        .build();
                product.getOptions().add(option);
            }
        }

        return toDto(productRepository.save(product));
    }

    @Transactional
    public MenuItemDto updateMenuItem(Long id, CreateMenuRequest request) {
        Product product = productRepository.findByIdWithCategoryAndOptions(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        // Delete old image from storage if being replaced
        String oldImageUrl = product.getImageUrl();
        String newImageUrl = request.getImageUrl();
        if (oldImageUrl != null && !oldImageUrl.isBlank()
                && (newImageUrl == null || !oldImageUrl.equals(newImageUrl))) {
            storageService.deleteImage(oldImageUrl);
        }

        product.setCategory(category);
        product.setName(request.getName());
        product.setBasePrice(request.getBasePrice());
        product.setImageUrl(request.getImageUrl());

        // Replace options
        product.getOptions().clear();
        if (request.getOptions() != null) {
            for (ProductOptionRequest optReq : request.getOptions()) {
                ProductOption option = ProductOption.builder()
                        .product(product)
                        .optionName(optReq.getOptionName())
                        .extraPrice(optReq.getExtraPrice())
                        .isDefault(optReq.getIsDefault() != null ? optReq.getIsDefault() : false)
                        .build();
                product.getOptions().add(option);
            }
        }

        return toDto(productRepository.save(product));
    }

    @Transactional
    public MenuItemDto toggleActive(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        product.setIsActive(!product.getIsActive());
        return toDto(productRepository.save(product));
    }

    private MenuItemDto toDto(Product product) {
        List<ProductOptionDto> options = product.getOptions() != null
                ? product.getOptions().stream()
                    .map(opt -> ProductOptionDto.builder()
                            .id(opt.getId())
                            .optionName(opt.getOptionName())
                            .extraPrice(opt.getExtraPrice())
                            .isDefault(opt.getIsDefault())
                            .build())
                    .toList()
                : new ArrayList<>();

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
