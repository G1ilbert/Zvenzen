"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Minus, Plus, Trash2, ShoppingCart, Ticket, Gift, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { getCategories, getMenu, createOrder, createCollabCoupon } from "@/lib/api";
import { money, formatDateTime } from "@/lib/format";
import type { Category, Product, CartItem, ProductOption, Order, CollabCoupon } from "@/lib/types";

export default function PosPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [optionDialog, setOptionDialog] = useState<Product | null>(null);

  // Receipt state
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);

  // Collab coupon state
  const [collabLoading, setCollabLoading] = useState(false);
  const [collabCoupon, setCollabCoupon] = useState<CollabCoupon | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Promise.all([getCategories(), getMenu()]).then(([cats, prods]) => {
      const activeCats = cats.filter((c) => c.isActive);
      setCategories(activeCats);
      setProducts(prods.filter((p) => p.isActive !== false));
      if (activeCats.length > 0) setActiveCategory(activeCats[0].id);
    });
  }, []);

  const filteredProducts = activeCategory
    ? products.filter((p) => p.categoryId === activeCategory)
    : products;

  const addToCart = useCallback(
    (product: Product, option?: ProductOption) => {
      setCart((prev) => {
        const key = `${product.id}-${option?.id ?? "none"}`;
        const existing = prev.findIndex(
          (i) => `${i.productId}-${i.optionId ?? "none"}` === key
        );
        if (existing >= 0) {
          const copy = [...prev];
          copy[existing] = { ...copy[existing], quantity: copy[existing].quantity + 1 };
          return copy;
        }
        return [
          ...prev,
          {
            productId: product.id,
            productName: product.name,
            optionId: option?.id ?? null,
            optionName: option?.optionName ?? null,
            unitPrice: product.basePrice + (option?.extraPrice ?? 0),
            quantity: 1,
          },
        ];
      });
    },
    []
  );

  const handleProductClick = (product: Product) => {
    if (product.options && product.options.length > 0) {
      setOptionDialog(product);
    } else {
      addToCart(product);
    }
  };

  const updateQty = (index: number, delta: number) => {
    setCart((prev) => {
      const copy = [...prev];
      const newQty = copy[index].quantity + delta;
      if (newQty <= 0) return copy.filter((_, i) => i !== index);
      copy[index] = { ...copy[index], quantity: newQty };
      return copy;
    });
  };

  const removeItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = cart.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    try {
      const order = await createOrder({
        items: cart.map((i) => ({
          productId: i.productId,
          optionId: i.optionId,
          quantity: i.quantity,
        })),
        couponCode: couponCode.trim() || null,
      });
      // Show receipt dialog instead of just toast
      setReceiptOrder(order);
      setCollabCoupon(null);
      setCopied(false);
      setReceiptOpen(true);
      setCart([]);
      setCouponCode("");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to create order";
      const axiosMsg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      toast.error(axiosMsg || msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGetCollabCoupon = async () => {
    setCollabLoading(true);
    try {
      const coupon = await createCollabCoupon();
      setCollabCoupon(coupon);
      toast.success("ได้รับคูปองแล้ว!");
    } catch {
      toast.error("ไม่สามารถรับคูปองได้ กรุณาลองใหม่");
    } finally {
      setCollabLoading(false);
    }
  };

  const handleCopyCoupon = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-6rem)]">
      {/* Left: Product Grid */}
      <div className="flex-[3] flex flex-col min-h-0">
        <div className="flex gap-2 overflow-x-auto pb-3 shrink-0">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? "default" : "outline"}
              size="sm"
              className="whitespace-nowrap"
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.name}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto flex-1">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="cursor-pointer transition-shadow hover:shadow-md py-0"
              onClick={() => handleProductClick(product)}
            >
              <CardContent className="flex flex-col items-center justify-center p-4 h-full text-center gap-1">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="h-16 w-16 rounded-lg object-cover mb-1" />
                ) : (
                  <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center mb-1">
                    <span className="text-2xl">🍦</span>
                  </div>
                )}
                <span className="font-medium text-sm">{product.name}</span>
                <span className="text-primary font-bold">{money(product.basePrice)}</span>
                {product.options?.length > 0 && (
                  <Badge variant="secondary" className="text-xs mt-1">
                    {product.options.length} options
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground py-12">
              No products in this category
            </div>
          )}
        </div>
      </div>

      {/* Right: Cart */}
      <div className="flex-[2] flex flex-col bg-white rounded-xl border p-4 min-h-0">
        <div className="flex items-center gap-2 mb-3">
          <ShoppingCart className="h-5 w-5" />
          <h2 className="font-semibold text-lg">Cart</h2>
          <Badge variant="secondary" className="ml-auto">{cart.length} items</Badge>
        </div>
        <Separator className="mb-3" />

        <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
          {cart.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              Add items to get started
            </div>
          )}
          {cart.map((item, idx) => (
            <div
              key={`${item.productId}-${item.optionId}-${idx}`}
              className="flex items-center gap-2 rounded-lg border p-2"
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{item.productName}</div>
                {item.optionName && (
                  <div className="text-xs text-muted-foreground">{item.optionName}</div>
                )}
                <div className="text-sm text-primary font-semibold">
                  {money(item.unitPrice)}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQty(idx, -1)}>
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQty(idx, 1)}>
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => removeItem(idx)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>

        <Separator className="my-3" />

        {/* Coupon */}
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <Ticket className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-1 text-sm mb-3">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-medium">{money(subtotal)}</span>
          </div>
        </div>

        <Button
          className="w-full h-12 text-base font-semibold bg-emerald-600 hover:bg-emerald-700"
          disabled={cart.length === 0 || loading}
          onClick={handlePlaceOrder}
        >
          {loading ? "Creating..." : `Place Order  ${money(subtotal)}`}
        </Button>
      </div>

      {/* Option picker dialog */}
      <Dialog open={!!optionDialog} onOpenChange={(open) => !open && setOptionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{optionDialog?.name}</DialogTitle>
            <DialogDescription>Select an option</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {optionDialog?.options?.map((opt) => (
              <Button
                key={opt.id}
                variant="outline"
                className="w-full justify-between h-auto py-3"
                onClick={() => {
                  if (optionDialog) addToCart(optionDialog, opt);
                  setOptionDialog(null);
                }}
              >
                <span>{opt.optionName}</span>
                <span className="text-primary font-semibold">
                  {opt.extraPrice > 0 ? `+${money(opt.extraPrice)}` : money(optionDialog!.basePrice)}
                </span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Receipt dialog */}
      <Dialog open={receiptOpen} onOpenChange={setReceiptOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-lg">ใบเสร็จ / Receipt</DialogTitle>
            <DialogDescription className="text-center">
              {receiptOrder?.orderRef} &mdash; {receiptOrder && formatDateTime(receiptOrder.createdAt)}
            </DialogDescription>
          </DialogHeader>

          {receiptOrder && (
            <div className="space-y-3">
              {/* Items */}
              <div className="space-y-1">
                {receiptOrder.items?.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.productName}
                      {item.optionName && (
                        <span className="text-muted-foreground"> ({item.optionName})</span>
                      )}
                      {" x"}{item.quantity}
                    </span>
                    <span>{money(item.subtotal)}</span>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{money(receiptOrder.totalAmount)}</span>
                </div>
                {receiptOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-orange-600">
                    <span>
                      Discount
                      {receiptOrder.coupon && (
                        <span className="text-xs ml-1">({receiptOrder.coupon.promotionName})</span>
                      )}
                    </span>
                    <span>-{money(receiptOrder.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base pt-1">
                  <span>Total</span>
                  <span className="text-emerald-600">{money(receiptOrder.finalAmount)}</span>
                </div>
              </div>

              {/* Coupon info if applied */}
              {receiptOrder.coupon && (
                <>
                  <Separator />
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Ticket className="h-4 w-4 text-orange-600" />
                      <span className="font-semibold text-orange-800">Coupon Applied</span>
                    </div>
                    <div className="text-orange-700">
                      {receiptOrder.coupon.promotionName} &mdash; {`-${receiptOrder.coupon.discountValue} บาท`}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* Collaboration Coupon Section */}
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="h-5 w-5 text-pink-600" />
                  <span className="font-semibold text-pink-800">
                    Zvenzen x น้ำเต้าหู้ Collaboration
                  </span>
                </div>

                {!collabCoupon ? (
                  <>
                    <p className="text-sm text-pink-700 mb-3">
                      รับคูปองส่วนลดพิเศษจาก collaboration กับกลุ่มน้ำเต้าหู้!
                    </p>
                    <Button
                      className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                      onClick={handleGetCollabCoupon}
                      disabled={collabLoading}
                    >
                      <Gift className="h-4 w-4 mr-2" />
                      {collabLoading ? "กำลังสร้างคูปอง..." : "รับคูปอง"}
                    </Button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-pink-800">
                      {collabCoupon.coupoun_name}
                    </div>
                    <div className="text-sm text-pink-700">
                      ส่วนลด: {collabCoupon.coupoun_discount} บาท
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-white border border-pink-300 rounded px-3 py-2 text-center font-mono text-sm font-bold tracking-wider">
                        {collabCoupon.coupon_code}
                      </code>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-9 w-9 border-pink-300"
                        onClick={() => handleCopyCoupon(collabCoupon.coupon_code)}
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <Copy className="h-4 w-4 text-pink-600" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-pink-600">
                      ใช้โค้ดนี้ในการสั่งซื้อครั้งถัดไปเพื่อรับส่วนลด!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
