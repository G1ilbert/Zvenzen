package com.zvenzen.repository;

import com.zvenzen.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface PromotionRepository extends JpaRepository<Promotion, Long> {

    @Query("SELECT DISTINCT p FROM Promotion p " +
           "LEFT JOIN FETCH p.freeItems fi " +
           "LEFT JOIN FETCH fi.product " +
           "LEFT JOIN FETCH fi.option " +
           "WHERE p.isActive = true " +
           "AND p.validFrom <= :now " +
           "AND p.validUntil >= :now")
    List<Promotion> findAllActiveAndValid(LocalDateTime now);
}
