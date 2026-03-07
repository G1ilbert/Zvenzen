package com.zvenzen.repository;

import com.zvenzen.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT DISTINCT p FROM Product p " +
           "LEFT JOIN FETCH p.category " +
           "LEFT JOIN FETCH p.options " +
           "WHERE p.isActive = true " +
           "ORDER BY p.category.sortOrder, p.name")
    List<Product> findAllActiveWithCategoryAndOptions();

    @Query("SELECT p FROM Product p " +
           "LEFT JOIN FETCH p.category " +
           "LEFT JOIN FETCH p.options " +
           "WHERE p.id = :id")
    Optional<Product> findByIdWithCategoryAndOptions(Long id);
}
