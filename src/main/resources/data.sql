-- =============================================
-- Partners
-- =============================================
INSERT INTO partners (api_key, business_name, business_type, status, created_at) VALUES
('pk_live_mookata_abc123', 'ร้านหมูกระทะน้องนุ่น', 'restaurant', 'active', NOW()),
('pk_live_laundry_def456', 'ร้านซักผ้าสะอาดใจ', 'laundry', 'active', NOW());

-- =============================================
-- Categories
-- =============================================
INSERT INTO categories (name, sort_order, is_active) VALUES
('ไอติมสกู๊ป', 1, true),
('ซันเดย์', 2, true),
('ท็อปปิ้ง', 3, true);

-- =============================================
-- Products
-- =============================================
INSERT INTO products (category_id, name, base_price, image_url, is_active, created_at) VALUES
(1, 'วานิลลา', 45.00, NULL, true, NOW()),
(1, 'ช็อกโกแลต', 45.00, NULL, true, NOW()),
(1, 'สตรอว์เบอร์รี', 45.00, NULL, true, NOW()),
(2, 'ซันเดย์คลาสสิก', 89.00, NULL, true, NOW()),
(3, 'สปริงเคิล', 10.00, NULL, true, NOW());

-- =============================================
-- Product Options (for วานิลลา id=1, ช็อกโกแลต id=2)
-- =============================================
INSERT INTO product_options (product_id, option_name, extra_price, is_default) VALUES
(1, 'Single Scoop', 0.00, true),
(1, 'Double Scoop', 20.00, false),
(2, 'Single Scoop', 0.00, true),
(2, 'Double Scoop', 20.00, false);

-- =============================================
-- Promotions
-- =============================================
INSERT INTO promotions (name, discount_type, discount_value, min_order_amount, max_coupons, coupons_used, valid_from, valid_until, is_active) VALUES
('ลด 20 บาท ทุกบิล', 'fixed', 20.00, NULL, 200, 0, '2024-03-01 00:00:00', '2026-12-31 23:59:59', true),
('ลด 15%', 'percent', 15.00, 100.00, 150, 0, '2024-03-01 00:00:00', '2026-12-31 23:59:59', true),
('ครบ 399 รับไอติม+ท็อปปิ้งฟรี', 'free_items', NULL, 399.00, 100, 0, '2024-03-01 00:00:00', '2026-12-31 23:59:59', true);

-- =============================================
-- Promotion Free Items (promotion id=3)
-- product id=1 (วานิลลา), option id=1 (Single Scoop)
-- product id=5 (สปริงเคิล), option=NULL
-- =============================================
INSERT INTO promotion_free_items (promotion_id, product_id, option_id, quantity) VALUES
(3, 1, 1, 1),
(3, 5, NULL, 1);
