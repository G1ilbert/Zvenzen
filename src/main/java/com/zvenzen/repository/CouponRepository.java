package com.zvenzen.repository;

import com.zvenzen.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface CouponRepository extends JpaRepository<Coupon, Long> {

    @Query("SELECT c FROM Coupon c " +
           "JOIN FETCH c.promotion " +
           "JOIN FETCH c.partner " +
           "WHERE c.code = :code AND c.partner.id = :partnerId")
    Optional<Coupon> findByCodeAndPartnerId(String code, Long partnerId);
}
