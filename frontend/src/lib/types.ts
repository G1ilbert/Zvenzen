export interface Category {
  id: number;
  name: string;
  sortOrder: number;
  isActive: boolean;
}

export interface ProductOption {
  id: number;
  optionName: string;
  extraPrice: number;
  isDefault: boolean;
}

export interface Product {
  id: number;
  categoryId: number;
  categoryName: string;
  name: string;
  basePrice: number;
  imageUrl: string | null;
  isActive?: boolean;
  options: ProductOption[];
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  optionId: number | null;
  optionName: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface CouponInfo {
  id: number;
  code: string;
  qrToken: string;
  status: string;
  issuedAt: string;
  expiresAt: string;
  promotionName: string;
  discountType: string;
  discountValue: number;
}

export interface Order {
  id: number;
  orderRef: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
  coupon?: CouponInfo | null;
}

export interface FreeItem {
  productId: number;
  productName: string;
  optionId: number | null;
  optionName: string | null;
  quantity: number;
}

export interface Promotion {
  id: number;
  name: string;
  discountType: string;
  discountValue: number | null;
  minOrderAmount: number | null;
  maxCoupons: number;
  couponsUsed: number;
  validFrom: string;
  validUntil: string;
  isActive?: boolean;
  freeItems?: FreeItem[];
}

export interface DashboardSummary {
  date: string;
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  totalDiscount: number;
  netRevenue: number;
}

export interface TopProduct {
  productId: number;
  productName: string;
  totalQuantity: number;
}

export interface CartItem {
  productId: number;
  productName: string;
  optionId: number | null;
  optionName: string | null;
  unitPrice: number;
  quantity: number;
}
