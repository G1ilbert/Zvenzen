package com.zvenzen.repository;

import com.zvenzen.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items i " +
           "LEFT JOIN FETCH i.product LEFT JOIN FETCH i.option " +
           "WHERE o.id = :id")
    Optional<Order> findByIdWithItems(Long id);

    @Query("SELECT o FROM Order o WHERE o.createdAt >= :from AND o.createdAt < :to ORDER BY o.createdAt DESC")
    List<Order> findByCreatedAtBetween(LocalDateTime from, LocalDateTime to);

    @Query("SELECT o FROM Order o WHERE o.status = :status ORDER BY o.createdAt DESC")
    List<Order> findByStatus(String status);

    @Query("SELECT o FROM Order o ORDER BY o.createdAt DESC")
    List<Order> findAllOrdered();

    @Query("SELECT o FROM Order o WHERE o.status = :status AND o.createdAt >= :from AND o.createdAt < :to ORDER BY o.createdAt DESC")
    List<Order> findByStatusAndCreatedAtBetween(String status, LocalDateTime from, LocalDateTime to);

    @Query("SELECT o.orderRef FROM Order o WHERE o.orderRef LIKE :prefix% ORDER BY o.orderRef DESC")
    List<String> findLatestOrderRefByPrefix(String prefix);
}
