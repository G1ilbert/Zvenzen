package com.zvenzen.service;

import com.zvenzen.exception.BusinessException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
public class StorageService {

    private static final Logger log = LoggerFactory.getLogger(StorageService.class);

    private final String supabaseUrl;
    private final String serviceKey;
    private final String bucket;
    private final RestTemplate restTemplate;

    public StorageService(
            @Value("${supabase.url}") String supabaseUrl,
            @Value("${supabase.service-key}") String serviceKey,
            @Value("${supabase.bucket}") String bucket) {
        this.supabaseUrl = supabaseUrl;
        this.serviceKey = serviceKey;
        this.bucket = bucket;
        this.restTemplate = new RestTemplate();
    }

    public String uploadImage(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BusinessException("File is empty");
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String filename = UUID.randomUUID() + extension;

        String uploadUrl = supabaseUrl + "/storage/v1/object/" + bucket + "/" + filename;
        String contentType = file.getContentType() != null ? file.getContentType() : "application/octet-stream";

        log.info("Uploading to: {}", uploadUrl);
        log.info("Content-Type: {}, Size: {} bytes", contentType, file.getSize());
        log.info("Service key starts with: {}...", serviceKey.length() > 10 ? serviceKey.substring(0, 10) : serviceKey);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + serviceKey);
        headers.setContentType(MediaType.parseMediaType(contentType));

        try {
            HttpEntity<byte[]> entity = new HttpEntity<>(file.getBytes(), headers);
            ResponseEntity<String> response = restTemplate.exchange(
                    uploadUrl, HttpMethod.POST, entity, String.class);

            log.info("Upload response status: {}", response.getStatusCode());
            log.info("Upload response body: {}", response.getBody());

            return supabaseUrl + "/storage/v1/object/public/" + bucket + "/" + filename;
        } catch (HttpClientErrorException e) {
            log.error("Upload failed - Status: {}, Body: {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new BusinessException("Upload failed (" + e.getStatusCode() + "): " + e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("Upload failed - Exception: {}", e.getMessage(), e);
            throw new BusinessException("Failed to upload image: " + e.getMessage());
        }
    }

    public void deleteImage(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            return;
        }

        String publicPrefix = "/storage/v1/object/public/" + bucket + "/";
        int idx = imageUrl.indexOf(publicPrefix);
        if (idx < 0) {
            return;
        }
        String filename = imageUrl.substring(idx + publicPrefix.length());

        String deleteUrl = supabaseUrl + "/storage/v1/object/" + bucket + "/" + filename;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + serviceKey);

        try {
            restTemplate.exchange(deleteUrl, HttpMethod.DELETE,
                    new HttpEntity<>(headers), String.class);
        } catch (Exception e) {
            log.warn("Image deletion failed for {}: {}", imageUrl, e.getMessage());
        }
    }
}
