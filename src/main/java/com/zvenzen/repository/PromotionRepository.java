package com.zvenzen.repository;

import com.zvenzen.entity.Promotion;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PromotionRepository extends JpaRepository<Promotion, Long> {

    @Query("SELECT DISTINCT p FROM Promotion p " +
           "LEFT JOIN FETCH p.freeItems fi " +
           "LEFT JOIN FETCH fi.product " +
           "LEFT JOIN FETCH fi.option " +
           "WHERE p.isActive = true " +
           "AND p.validFrom <= :now " +
           "AND p.validUntil >= :now")
    List<Promotion> findAllActiveAndValid(LocalDateTime now);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Promotion p WHERE p.id = :id")
    Optional<Promotion> findByIdWithLock(@Param("id") Long id);

    @Query("SELECT p FROM Promotion p " +
           "LEFT JOIN FETCH p.freeItems fi " +
           "LEFT JOIN FETCH fi.product " +
           "LEFT JOIN FETCH fi.option " +
           "WHERE p.id = :id")
    Optional<Promotion> findByIdWithFreeItems(@Param("id") Long id);
}
