package com.zvenzen.repository;

import com.zvenzen.entity.Partner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PartnerRepository extends JpaRepository<Partner, Long> {

    Optional<Partner> findByApiKeyAndStatus(String apiKey, String status);
}
