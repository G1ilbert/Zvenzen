-- Force clean ALL data
DELETE FROM coupon_usages;
DELETE FROM coupons;
DELETE FROM promotion_free_items;
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM promotions;
DELETE FROM product_options;
DELETE FROM products;
DELETE FROM categories;

-- Reset sequences
ALTER SEQUENCE categories_id_seq RESTART WITH 1;
ALTER SEQUENCE products_id_seq RESTART WITH 1;
ALTER SEQUENCE product_options_id_seq RESTART WITH 1;
ALTER SEQUENCE promotions_id_seq RESTART WITH 1;
ALTER SEQUENCE promotion_free_items_id_seq RESTART WITH 1;
ALTER SEQUENCE orders_id_seq RESTART WITH 1;
ALTER SEQUENCE order_items_id_seq RESTART WITH 1;
ALTER SEQUENCE coupons_id_seq RESTART WITH 1;
ALTER SEQUENCE coupon_usages_id_seq RESTART WITH 1;

-- Drop sort_order column if exists
ALTER TABLE categories DROP COLUMN IF EXISTS sort_order;

-- 3 Categories only
INSERT INTO categories (id, name, is_active) VALUES
  (1, 'ไอติมสกู๊ป', true),
  (2, 'เครื่องดื่ม', true),
  (3, 'เค้ก', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 8 Ice cream
INSERT INTO products (id, category_id, name, base_price, image_url, is_active) VALUES
  (1, 1, 'วานิลลา', 45.00, 'https://images.unsplash.com/photo-1570197571499-166b36435e9f?w=400&h=400&fit=crop', true),
  (2, 1, 'ช็อกโกแลต', 45.00, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop', true),
  (3, 1, 'สตรอว์เบอร์รี', 45.00, 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=400&fit=crop', true),
  (4, 1, 'ชาเขียว', 50.00, 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&h=400&fit=crop', true),
  (5, 1, 'มัทฉะ', 55.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop', true),
  (6, 1, 'คุกกี้แอนด์ครีม', 50.00, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop', true),
  (7, 1, 'มะม่วง', 50.00, 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=400&h=400&fit=crop', true),
  (8, 1, 'มิ้นท์ช็อกชิป', 50.00, 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?w=400&h=400&fit=crop', true)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, base_price = EXCLUDED.base_price, image_url = EXCLUDED.image_url;

-- 4 Drinks
INSERT INTO products (id, category_id, name, base_price, image_url, is_active) VALUES
  (9, 2, 'มิลค์เชค', 75.00, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=400&fit=crop', true),
  (10, 2, 'โกโก้ปั่น', 55.00, 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&h=400&fit=crop', true),
  (11, 2, 'สมูทตี้ผลไม้', 89.00, 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&h=400&fit=crop', true),
  (12, 2, 'ไอติมโซดา', 65.00, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop', true)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, base_price = EXCLUDED.base_price, image_url = EXCLUDED.image_url;

-- 3 Cakes
INSERT INTO products (id, category_id, name, base_price, image_url, is_active) VALUES
  (13, 3, 'ลาวาเค้ก', 129.00, 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=400&fit=crop', true),
  (14, 3, 'เครปไอติม', 99.00, 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&h=400&fit=crop', true),
  (15, 3, 'ชีสเค้ก', 119.00, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop', true)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, base_price = EXCLUDED.base_price, image_url = EXCLUDED.image_url;

-- Delete leftover products with id > 15
DELETE FROM product_options WHERE product_id > 15;
DELETE FROM products WHERE id > 15;

-- Options for ice cream (Single/Double/Triple scoop)
INSERT INTO product_options (product_id, option_name, extra_price, is_default) VALUES
  (1, 'Single Scoop', 0, true), (1, 'Double Scoop', 20, false), (1, 'Triple Scoop', 40, false),
  (2, 'Single Scoop', 0, true), (2, 'Double Scoop', 20, false), (2, 'Triple Scoop', 40, false),
  (3, 'Single Scoop', 0, true), (3, 'Double Scoop', 20, false), (3, 'Triple Scoop', 40, false),
  (4, 'Single Scoop', 0, true), (4, 'Double Scoop', 20, false), (4, 'Triple Scoop', 40, false),
  (5, 'Single Scoop', 0, true), (5, 'Double Scoop', 20, false), (5, 'Triple Scoop', 40, false),
  (6, 'Single Scoop', 0, true), (6, 'Double Scoop', 20, false), (6, 'Triple Scoop', 40, false),
  (7, 'Single Scoop', 0, true), (7, 'Double Scoop', 20, false), (7, 'Triple Scoop', 40, false),
  (8, 'Single Scoop', 0, true), (8, 'Double Scoop', 20, false), (8, 'Triple Scoop', 40, false)
ON CONFLICT DO NOTHING;

-- Options for drinks (Regular/Large)
INSERT INTO product_options (product_id, option_name, extra_price, is_default) VALUES
  (9, 'Regular', 0, true), (9, 'Large', 20, false),
  (10, 'Regular', 0, true), (10, 'Large', 20, false),
  (11, 'Regular', 0, true), (11, 'Large', 20, false),
  (12, 'Regular', 0, true), (12, 'Large', 20, false)
ON CONFLICT DO NOTHING;

-- Cakes have no options

-- Promotions
INSERT INTO promotions (name, discount_type, discount_value, min_order_amount, max_coupons, coupons_used, valid_from, valid_until, is_active)
VALUES
  ('ลด 20 บาท ทุกบิล', 'fixed', 20.00, 0.00, 10, 0, '2024-01-01 00:00:00', '2026-12-31 23:59:59', true),
  ('ลด 50 บาท เมื่อซื้อครบ 200', 'fixed', 50.00, 200.00, 10, 0, '2024-01-01 00:00:00', '2026-12-31 23:59:59', true),
  ('แจกไอติมวานิลลาฟรี', 'free_items', 0.00, 100.00, 10, 0, '2024-01-01 00:00:00', '2026-12-31 23:59:59', true),
  ('แจกเครปไอติมฟรี', 'free_items', 0.00, 300.00, 10, 0, '2024-01-01 00:00:00', '2026-12-31 23:59:59', true);

INSERT INTO promotion_free_items (promotion_id, product_id, option_id, quantity)
SELECT p.id, pr.id, po.id, 1
FROM promotions p, products pr, product_options po
WHERE p.name = 'แจกไอติมวานิลลาฟรี'
  AND pr.name = 'วานิลลา'
  AND po.product_id = pr.id AND po.is_default = true
ON CONFLICT DO NOTHING;

INSERT INTO promotion_free_items (promotion_id, product_id, quantity)
SELECT p.id, pr.id, 1
FROM promotions p, products pr
WHERE p.name = 'แจกเครปไอติมฟรี'
  AND pr.name = 'เครปไอติม'
ON CONFLICT DO NOTHING;

-- Delete products without images
DELETE FROM product_options WHERE product_id IN (SELECT id FROM products WHERE image_url IS NULL OR image_url = '');
DELETE FROM products WHERE image_url IS NULL OR image_url = '';
