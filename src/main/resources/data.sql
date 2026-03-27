-- Categories (6)
INSERT INTO categories (id, name, sort_order, is_active) VALUES
(1, 'ไอติมสกู๊ป', 1, true),
(2, 'ซันเดย์', 2, true),
(3, 'ท็อปปิ้ง', 3, true),
(4, 'เครื่องดื่ม', 4, true),
(5, 'เค้กและขนม', 5, true),
(6, 'วาฟเฟิล', 6, true)
ON CONFLICT (id) DO NOTHING;

-- Products: ไอติมสกู๊ป (1-10)
INSERT INTO products (id, category_id, name, base_price, image_url, is_active, created_at) VALUES
(1, 1, 'วานิลลา', 45.00, 'https://images.unsplash.com/photo-1570197571499-166b36435e9f?w=400&h=400&fit=crop', true, NOW()),
(2, 1, 'ช็อกโกแลต', 45.00, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop', true, NOW()),
(3, 1, 'สตรอว์เบอร์รี', 45.00, 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=400&fit=crop', true, NOW()),
(4, 1, 'ชาเขียว', 50.00, 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&h=400&fit=crop', true, NOW()),
(5, 1, 'มัทฉะ', 55.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop', true, NOW()),
(6, 1, 'คุกกี้แอนด์ครีม', 50.00, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop', true, NOW()),
(7, 1, 'มะม่วง', 50.00, 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=400&h=400&fit=crop', true, NOW()),
(8, 1, 'รัมเรซิน', 50.00, 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=400&h=400&fit=crop', true, NOW()),
(9, 1, 'มิ้นท์ช็อกชิป', 50.00, 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?w=400&h=400&fit=crop', true, NOW()),
(10, 1, 'ทุเรียน', 60.00, 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400&h=400&fit=crop', false, NOW())
ON CONFLICT (id) DO NOTHING;

-- Products: ซันเดย์ (11-15)
INSERT INTO products (id, category_id, name, base_price, image_url, is_active, created_at) VALUES
(11, 2, 'ซันเดย์คลาสสิก', 89.00, 'https://images.unsplash.com/photo-1563589173312-476d8c36b3c9?w=400&h=400&fit=crop', true, NOW()),
(12, 2, 'ช็อกโกแลตฟัดจ์ซันเดย์', 119.00, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop', true, NOW()),
(13, 2, 'สตรอว์เบอร์รีซันเดย์', 109.00, 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=400&h=400&fit=crop', true, NOW()),
(14, 2, 'บราวนี่ซันเดย์', 139.00, 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=400&fit=crop', true, NOW()),
(15, 2, 'บานาน่าสปลิท', 159.00, 'https://images.unsplash.com/photo-1432457990754-c8b5f21448de?w=400&h=400&fit=crop', true, NOW())
ON CONFLICT (id) DO NOTHING;

-- Products: ท็อปปิ้ง (16-21)
INSERT INTO products (id, category_id, name, base_price, image_url, is_active, created_at) VALUES
(16, 3, 'สปริงเคิล', 10.00, 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=400&h=400&fit=crop', true, NOW()),
(17, 3, 'วิปครีม', 15.00, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop', true, NOW()),
(18, 3, 'ช็อกโกแลตซอส', 15.00, 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=400&fit=crop', true, NOW()),
(19, 3, 'คาราเมลซอส', 15.00, 'https://images.unsplash.com/photo-1582716401356-b9d16ab51a56?w=400&h=400&fit=crop', true, NOW()),
(20, 3, 'ถั่วบด', 20.00, 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=400&h=400&fit=crop', true, NOW()),
(21, 3, 'บราวนี่ชิ้น', 25.00, 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400&h=400&fit=crop', true, NOW())
ON CONFLICT (id) DO NOTHING;

-- Products: เครื่องดื่ม (22-25)
INSERT INTO products (id, category_id, name, base_price, image_url, is_active, created_at) VALUES
(22, 4, 'มิลค์เชค', 75.00, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=400&fit=crop', true, NOW()),
(23, 4, 'ไอติมโซดา', 65.00, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop', true, NOW()),
(24, 4, 'สมูทตี้ผลไม้', 89.00, 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&h=400&fit=crop', true, NOW()),
(25, 4, 'โกโก้ปั่น', 55.00, 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&h=400&fit=crop', true, NOW())
ON CONFLICT (id) DO NOTHING;

-- Products: เค้กและขนม (26-28)
INSERT INTO products (id, category_id, name, base_price, image_url, is_active, created_at) VALUES
(26, 5, 'ลาวาเค้ก', 129.00, 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=400&fit=crop', true, NOW()),
(27, 5, 'เครปไอติม', 99.00, 'https://images.unsplash.com/photo-1519676867240-f03562e64571?w=400&h=400&fit=crop', true, NOW()),
(28, 5, 'ไอติมเค้ก 6 นิ้ว', 179.00, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop', false, NOW())
ON CONFLICT (id) DO NOTHING;

-- Products: วาฟเฟิล (29-31)
INSERT INTO products (id, category_id, name, base_price, image_url, is_active, created_at) VALUES
(29, 6, 'วาฟเฟิลคลาสสิก', 89.00, 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=400&h=400&fit=crop', true, NOW()),
(30, 6, 'วาฟเฟิลช็อกโกแลต', 109.00, 'https://images.unsplash.com/photo-1598839950009-035e3e89c8b8?w=400&h=400&fit=crop', true, NOW()),
(31, 6, 'วาฟเฟิลผลไม้', 129.00, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop', true, NOW())
ON CONFLICT (id) DO NOTHING;

-- Product Options: ไอติมสกู๊ป Single/Double/Triple (products 1-10)
INSERT INTO product_options (id, product_id, option_name, extra_price, is_default) VALUES
(1, 1, 'Single Scoop', 0.00, true),
(2, 1, 'Double Scoop', 20.00, false),
(3, 1, 'Triple Scoop', 40.00, false),
(4, 2, 'Single Scoop', 0.00, true),
(5, 2, 'Double Scoop', 20.00, false),
(6, 2, 'Triple Scoop', 40.00, false),
(7, 3, 'Single Scoop', 0.00, true),
(8, 3, 'Double Scoop', 20.00, false),
(9, 3, 'Triple Scoop', 40.00, false),
(10, 4, 'Single Scoop', 0.00, true),
(11, 4, 'Double Scoop', 20.00, false),
(12, 4, 'Triple Scoop', 40.00, false),
(13, 5, 'Single Scoop', 0.00, true),
(14, 5, 'Double Scoop', 20.00, false),
(15, 5, 'Triple Scoop', 40.00, false),
(16, 6, 'Single Scoop', 0.00, true),
(17, 6, 'Double Scoop', 20.00, false),
(18, 6, 'Triple Scoop', 40.00, false),
(19, 7, 'Single Scoop', 0.00, true),
(20, 7, 'Double Scoop', 20.00, false),
(21, 7, 'Triple Scoop', 40.00, false),
(22, 8, 'Single Scoop', 0.00, true),
(23, 8, 'Double Scoop', 20.00, false),
(24, 8, 'Triple Scoop', 40.00, false),
(25, 9, 'Single Scoop', 0.00, true),
(26, 9, 'Double Scoop', 20.00, false),
(27, 9, 'Triple Scoop', 40.00, false),
(28, 10, 'Single Scoop', 0.00, true),
(29, 10, 'Double Scoop', 20.00, false),
(30, 10, 'Triple Scoop', 40.00, false)
ON CONFLICT (id) DO NOTHING;

-- Product Options: ซันเดย์ Regular/Large (products 11-15)
INSERT INTO product_options (id, product_id, option_name, extra_price, is_default) VALUES
(31, 11, 'Regular', 0.00, true),
(32, 11, 'Large', 30.00, false),
(33, 12, 'Regular', 0.00, true),
(34, 12, 'Large', 30.00, false),
(35, 13, 'Regular', 0.00, true),
(36, 13, 'Large', 30.00, false),
(37, 14, 'Regular', 0.00, true),
(38, 14, 'Large', 30.00, false),
(39, 15, 'Regular', 0.00, true),
(40, 15, 'Large', 30.00, false)
ON CONFLICT (id) DO NOTHING;

-- Product Options: เครื่องดื่ม Regular/Large (products 22-25)
INSERT INTO product_options (id, product_id, option_name, extra_price, is_default) VALUES
(41, 22, 'Regular', 0.00, true),
(42, 22, 'Large', 20.00, false),
(43, 23, 'Regular', 0.00, true),
(44, 23, 'Large', 20.00, false),
(45, 24, 'Regular', 0.00, true),
(46, 24, 'Large', 20.00, false),
(47, 25, 'Regular', 0.00, true),
(48, 25, 'Large', 20.00, false)
ON CONFLICT (id) DO NOTHING;

-- Product Options: มิลค์เชค flavors (product 22)
INSERT INTO product_options (id, product_id, option_name, extra_price, is_default) VALUES
(49, 22, 'รสช็อกโกแลต', 0.00, false),
(50, 22, 'รสสตรอว์เบอร์รี', 0.00, false),
(51, 22, 'รสวานิลลา', 0.00, false)
ON CONFLICT (id) DO NOTHING;

-- Product Options: วาฟเฟิล 1/2 สกู๊ป (products 29-31)
INSERT INTO product_options (id, product_id, option_name, extra_price, is_default) VALUES
(52, 29, 'พร้อมไอติม 1 สกู๊ป', 0.00, true),
(53, 29, 'พร้อมไอติม 2 สกู๊ป', 25.00, false),
(54, 30, 'พร้อมไอติม 1 สกู๊ป', 0.00, true),
(55, 30, 'พร้อมไอติม 2 สกู๊ป', 25.00, false),
(56, 31, 'พร้อมไอติม 1 สกู๊ป', 0.00, true),
(57, 31, 'พร้อมไอติม 2 สกู๊ป', 25.00, false)
ON CONFLICT (id) DO NOTHING;

-- Promotions (5)
INSERT INTO promotions (id, name, discount_type, discount_value, min_order_amount, max_coupons, coupons_used, valid_from, valid_until, is_active) VALUES
(1, 'ลด 20 บาท ทุกบิล', 'fixed', 20.00, NULL, 200, 0, '2024-03-01 00:00:00', '2026-12-31 23:59:59', true),
(2, 'ลด 15%', 'percent', 15.00, 100.00, 150, 0, '2024-03-01 00:00:00', '2026-12-31 23:59:59', true),
(3, 'ครบ 399 รับไอติม+ท็อปปิ้งฟรี', 'free_items', NULL, 399.00, 100, 0, '2024-03-01 00:00:00', '2026-12-31 23:59:59', true),
(4, 'ซื้อครบ 200 ลด 10%', 'percent', 10.00, 200.00, 300, 0, '2024-01-01 00:00:00', '2026-12-31 23:59:59', true),
(5, 'แจกวาฟเฟิลฟรี', 'free_items', NULL, 300.00, 50, 0, '2024-01-01 00:00:00', '2026-12-31 23:59:59', true)
ON CONFLICT (id) DO NOTHING;

-- Promotion Free Items
INSERT INTO promotion_free_items (id, promotion_id, product_id, option_id, quantity) VALUES
(1, 3, 1, 1, 1),
(2, 3, 16, NULL, 1),
(3, 5, 29, 52, 1)
ON CONFLICT (id) DO NOTHING;

-- Update image URLs for existing products (in case rows already existed with NULL images)
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1570197571499-166b36435e9f?w=400&h=400&fit=crop' WHERE id = 1 AND (image_url IS NULL OR image_url = '');
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop' WHERE id = 2 AND (image_url IS NULL OR image_url = '');
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=400&fit=crop' WHERE id = 3 AND (image_url IS NULL OR image_url = '');
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&h=400&fit=crop' WHERE id = 4 AND (image_url IS NULL OR image_url = '');
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop' WHERE id = 5 AND (image_url IS NULL OR image_url = '');
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop' WHERE id = 6 AND (image_url IS NULL OR image_url = '');
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=400&h=400&fit=crop' WHERE id = 7 AND (image_url IS NULL OR image_url = '');
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=400&h=400&fit=crop' WHERE id = 8 AND (image_url IS NULL OR image_url = '');
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?w=400&h=400&fit=crop' WHERE id = 9 AND (image_url IS NULL OR image_url = '');
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400&h=400&fit=crop' WHERE id = 10 AND (image_url IS NULL OR image_url = '');
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1563589173312-476d8c36b3c9?w=400&h=400&fit=crop' WHERE id = 11 AND (image_url IS NULL OR image_url = '');
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop' WHERE id = 12 AND (image_url IS NULL OR image_url = '');
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=400&h=400&fit=crop' WHERE id = 13 AND (image_url IS NULL OR image_url = '');
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=400&fit=crop' WHERE id = 14 AND (image_url IS NULL OR image_url = '');
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1432457990754-c8b5f21448de?w=400&h=400&fit=crop' WHERE id = 15 AND (image_url IS NULL OR image_url = '');
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=400&h=400&fit=crop' WHERE id = 16 AND (image_url IS NULL OR image_url = '');
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop' WHERE id = 17 AND (image_url IS NULL OR image_url = '');
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=400&fit=crop' WHERE id = 18 AND (image_url IS NULL OR image_url = '');
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1582716401356-b9d16ab51a56?w=400&h=400&fit=crop' WHERE id = 19 AND (image_url IS NULL OR image_url = '');
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=400&h=400&fit=crop' WHERE id = 20 AND (image_url IS NULL OR image_url = '');
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400&h=400&fit=crop' WHERE id = 21 AND (image_url IS NULL OR image_url = '');
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=400&fit=crop' WHERE id = 22 AND (image_url IS NULL OR image_url = '');
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop' WHERE id = 23 AND (image_url IS NULL OR image_url = '');
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&h=400&fit=crop' WHERE id = 24 AND (image_url IS NULL OR image_url = '');
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&h=400&fit=crop' WHERE id = 25 AND (image_url IS NULL OR image_url = '');
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=400&fit=crop' WHERE id = 26 AND (image_url IS NULL OR image_url = '');
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1519676867240-f03562e64571?w=400&h=400&fit=crop' WHERE id = 27 AND (image_url IS NULL OR image_url = '');
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop' WHERE id = 28 AND (image_url IS NULL OR image_url = '');
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=400&h=400&fit=crop' WHERE id = 29 AND (image_url IS NULL OR image_url = '');
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1598839950009-035e3e89c8b8?w=400&h=400&fit=crop' WHERE id = 30 AND (image_url IS NULL OR image_url = '');
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop' WHERE id = 31 AND (image_url IS NULL OR image_url = '');

-- Remove products with no image (child records first to respect FK constraints)
DELETE FROM order_items WHERE product_id IN (SELECT id FROM products WHERE image_url IS NULL OR image_url = '');
DELETE FROM promotion_free_items WHERE product_id IN (SELECT id FROM products WHERE image_url IS NULL OR image_url = '');
DELETE FROM product_options WHERE product_id IN (SELECT id FROM products WHERE image_url IS NULL OR image_url = '');
DELETE FROM products WHERE image_url IS NULL OR image_url = '';
