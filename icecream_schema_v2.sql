-- ============================================================
--  ICE CREAM SHOP — DATABASE SCHEMA
--  Version: 2.0  (simplified, partner-focused API)
-- ============================================================

-- ============================================================
--  GROUP 1: เมนูและสินค้า
-- ============================================================

CREATE TABLE categories (
  id          INT           NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100)  NOT NULL,
  sort_order  INT           NOT NULL DEFAULT 0,
  is_active   BOOLEAN       NOT NULL DEFAULT TRUE,

  PRIMARY KEY (id)
);

-- -------------------------------------------------------

CREATE TABLE products (
  id              INT            NOT NULL AUTO_INCREMENT,
  category_id     INT            NOT NULL,
  name            VARCHAR(150)   NOT NULL,
  base_price      DECIMAL(10,2)  NOT NULL,
  image_url       TEXT,
  available_from  DATE,
  available_until DATE,
  is_active       BOOLEAN        NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  CONSTRAINT fk_product_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- -------------------------------------------------------

CREATE TABLE product_options (
  id           INT            NOT NULL AUTO_INCREMENT,
  product_id   INT            NOT NULL,
  option_name  VARCHAR(100)   NOT NULL,
  extra_price  DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  is_default   BOOLEAN        NOT NULL DEFAULT FALSE,

  PRIMARY KEY (id),
  CONSTRAINT fk_option_product
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ============================================================
--  GROUP 2: การขาย
-- ============================================================

CREATE TABLE orders (
  id               INT            NOT NULL AUTO_INCREMENT,
  order_ref        VARCHAR(20)    NOT NULL,
  total_amount     DECIMAL(10,2)  NOT NULL,
  discount_amount  DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  final_amount     DECIMAL(10,2)  NOT NULL,
  coupon_usage_id  INT,
  status           ENUM('pending','completed','cancelled') NOT NULL DEFAULT 'pending',
  created_at       TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_order_ref (order_ref),
  KEY idx_order_created (created_at)
);

-- -------------------------------------------------------

CREATE TABLE order_items (
  id          INT            NOT NULL AUTO_INCREMENT,
  order_id    INT            NOT NULL,
  product_id  INT            NOT NULL,
  option_id   INT,
  quantity    INT            NOT NULL DEFAULT 1,
  unit_price  DECIMAL(10,2)  NOT NULL,
  subtotal    DECIMAL(10,2)  NOT NULL,

  PRIMARY KEY (id),
  CONSTRAINT fk_item_order
    FOREIGN KEY (order_id) REFERENCES orders(id),
  CONSTRAINT fk_item_product
    FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT fk_item_option
    FOREIGN KEY (option_id) REFERENCES product_options(id)
);

-- ============================================================
--  GROUP 3: Partner API
-- ============================================================

CREATE TABLE partners (
  id             INT           NOT NULL AUTO_INCREMENT,
  api_key        VARCHAR(64)   NOT NULL,
  business_name  VARCHAR(150)  NOT NULL,
  business_type  VARCHAR(50),
  status         ENUM('active','suspended') NOT NULL DEFAULT 'active',
  created_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_api_key (api_key)
);

-- -------------------------------------------------------
--  promotions ไม่ผูก partner — ร้านสร้างเอง partner ไหนมาใช้ก็ได้
-- -------------------------------------------------------

CREATE TABLE promotions (
  id                INT            NOT NULL AUTO_INCREMENT,
  name              VARCHAR(150)   NOT NULL,
  discount_type     ENUM('fixed','percent','free_items') NOT NULL,
  discount_value    DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  min_order_amount  DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  max_coupons       INT            NOT NULL DEFAULT 100,
  coupons_used      INT            NOT NULL DEFAULT 0,
  valid_from        DATETIME       NOT NULL,
  valid_until       DATETIME       NOT NULL,
  is_active         BOOLEAN        NOT NULL DEFAULT TRUE,

  PRIMARY KEY (id),
  KEY idx_promo_active (is_active, valid_from, valid_until)
);

-- -------------------------------------------------------

CREATE TABLE promotion_free_items (
  id            INT  NOT NULL AUTO_INCREMENT,
  promotion_id  INT  NOT NULL,
  product_id    INT  NOT NULL,
  option_id     INT,
  quantity      INT  NOT NULL DEFAULT 1,

  PRIMARY KEY (id),
  UNIQUE KEY uq_promo_product_option (promotion_id, product_id, option_id),
  CONSTRAINT fk_freeitem_promotion
    FOREIGN KEY (promotion_id) REFERENCES promotions(id),
  CONSTRAINT fk_freeitem_product
    FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT fk_freeitem_option
    FOREIGN KEY (option_id) REFERENCES product_options(id)
);

-- -------------------------------------------------------
--  coupons เก็บ partner_id แทน issued_to_ref
-- -------------------------------------------------------

CREATE TABLE coupons (
  id            INT           NOT NULL AUTO_INCREMENT,
  promotion_id  INT           NOT NULL,
  partner_id    INT           NOT NULL,   -- partner ไหนออก coupon ใบนี้
  code          VARCHAR(32)   NOT NULL,
  qr_token      VARCHAR(128)  NOT NULL,
  status        ENUM('active','used','expired') NOT NULL DEFAULT 'active',
  issued_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at    TIMESTAMP     NOT NULL,

  PRIMARY KEY (id),
  UNIQUE KEY uq_coupon_code (code),
  UNIQUE KEY uq_coupon_token (qr_token),
  KEY idx_coupon_status (status),
  CONSTRAINT fk_coupon_promotion
    FOREIGN KEY (promotion_id) REFERENCES promotions(id),
  CONSTRAINT fk_coupon_partner
    FOREIGN KEY (partner_id) REFERENCES partners(id)
);

-- -------------------------------------------------------

CREATE TABLE coupon_usages (
  id                INT            NOT NULL AUTO_INCREMENT,
  coupon_id         INT            NOT NULL,
  order_id          INT,
  discount_applied  DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  used_at           TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  staff_note        TEXT,

  PRIMARY KEY (id),
  UNIQUE KEY uq_coupon_usage (coupon_id),   -- 1 coupon ใช้ได้แค่ 1 ครั้ง
  CONSTRAINT fk_usage_coupon
    FOREIGN KEY (coupon_id) REFERENCES coupons(id),
  CONSTRAINT fk_usage_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- FK วนกลับ orders → coupon_usages
ALTER TABLE orders
  ADD CONSTRAINT fk_order_coupon_usage
    FOREIGN KEY (coupon_usage_id) REFERENCES coupon_usages(id);

-- ============================================================
--  API Endpoints (Partner only)
--
--  GET  /api/v1/menu                     ดูเมนูทั้งหมด
--  GET  /api/v1/menu/:id                 ดูสินค้าชิ้นเดียว
--  GET  /api/v1/promotions               ดู promotion ที่ active อยู่
--  POST /api/v1/coupons/issue            ออก coupon ให้ลูกค้า
--  GET  /api/v1/coupons/:code            เช็คสถานะ coupon
-- ============================================================

-- ============================================================
--  Sample Data
-- ============================================================

INSERT INTO categories (name, sort_order) VALUES
  ('ไอติมสกู๊ป', 1),
  ('ซันเดย์',    2),
  ('ท็อปปิ้ง',   3);

INSERT INTO products (category_id, name, base_price) VALUES
  (1, 'วานิลลา',        45.00),
  (1, 'ช็อกโกแลต',      45.00),
  (1, 'สตรอว์เบอร์รี', 45.00),
  (2, 'ซันเดย์คลาสสิก', 89.00),
  (3, 'สปริงเคิล',      10.00);

INSERT INTO product_options (product_id, option_name, extra_price, is_default) VALUES
  (1, 'Single Scoop', 0.00,  TRUE),
  (1, 'Double Scoop', 20.00, FALSE),
  (2, 'Single Scoop', 0.00,  TRUE),
  (2, 'Double Scoop', 20.00, FALSE);

INSERT INTO partners (api_key, business_name, business_type) VALUES
  ('pk_live_mookata_abc123', 'ร้านหมูกระทะน้องนุ่น', 'restaurant'),
  ('pk_live_laundry_def456', 'ร้านซักผ้าสะอาดใจ',    'laundry');

-- promotion ลอย ไม่ผูก partner
INSERT INTO promotions
  (name, discount_type, discount_value, min_order_amount, max_coupons, valid_from, valid_until)
VALUES
  ('ลด 20 บาท ทุกบิล',                  'fixed',      20.00, 0.00,   200, '2024-03-01', '2024-05-31'),
  ('ลด 15%',                             'percent',    15.00, 100.00, 150, '2024-03-01', '2024-05-31'),
  ('ครบ 399 รับไอติม + ท็อปปิ้งฟรี',   'free_items',  0.00, 0.00,   100, '2024-03-01', '2024-05-31');

-- ของฟรีใน campaign ที่ 3
INSERT INTO promotion_free_items (promotion_id, product_id, option_id, quantity) VALUES
  (3, 1, 1, 1),   -- วานิลลา Single Scoop
  (3, 5, NULL, 1); -- สปริงเคิล

-- ============================================================
--  Useful Queries
-- ============================================================

-- GET /menu
-- SELECT p.id, p.name, p.base_price, p.image_url,
--        c.name AS category,
--        po.option_name, po.extra_price
-- FROM products p
-- JOIN categories c ON c.id = p.category_id
-- LEFT JOIN product_options po ON po.product_id = p.id
-- WHERE p.is_active = TRUE
-- ORDER BY c.sort_order, p.id;

-- GET /promotions (active เท่านั้น)
-- SELECT * FROM promotions
-- WHERE is_active = TRUE
--   AND valid_from <= NOW()
--   AND valid_until >= NOW();

-- GET /coupons/:code (partner เช็คสถานะ)
-- SELECT c.code, c.status, c.expires_at,
--        p.name AS promotion_name,
--        p.discount_type, p.discount_value
-- FROM coupons c
-- JOIN promotions p ON p.id = c.promotion_id
-- WHERE c.code = 'MUK-A3F9X2'
--   AND c.partner_id = 1;

-- ดูของฟรีที่แถมใน coupon (free_items)
-- SELECT pfi.quantity, pr.name AS product_name, po.option_name
-- FROM promotion_free_items pfi
-- JOIN products pr ON pr.id = pfi.product_id
-- LEFT JOIN product_options po ON po.id = pfi.option_id
-- WHERE pfi.promotion_id = 3;
