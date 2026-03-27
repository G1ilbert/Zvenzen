package com.zvenzen.repository;

import com.zvenzen.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface CouponRepository extends JpaRepository<Coupon, Long> {

    @Query("SELECT c FROM Coupon c " +
           "JOIN FETCH c.promotion " +
           "WHERE c.code = :code")
    Optional<Coupon> findByCode(String code);
}
