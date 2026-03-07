package com.zvenzen.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "promotion_free_items")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PromotionFreeItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "promotion_id", nullable = false)
    private Promotion promotion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "option_id")
    private ProductOption option;

    @Column(nullable = false)
    @Builder.Default
    private Integer quantity = 1;
}
