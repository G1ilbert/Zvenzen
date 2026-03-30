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
import { cn } from "@/lib/utils";
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
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-6rem)]">
      {/* Left: Product Grid */}
      <div className="flex-[3] flex flex-col min-h-0 space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide shrink-0 px-1">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? "default" : "secondary"}
              size="default"
              className={cn(
                "whitespace-nowrap px-6 rounded-full transition-all duration-200 shadow-sm hover:shadow",
                activeCategory === cat.id ? "scale-105" : "opacity-80 hover:opacity-100"
              )}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.name}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="cursor-pointer rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all h-[220px] relative"
              onClick={() => handleProductClick(product)}
            >
              <img
                src={product.imageUrl || ""}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="font-medium text-white text-sm drop-shadow">{product.name}</p>
                <p className="text-rose-300 font-semibold text-sm drop-shadow">{money(product.basePrice)}</p>
              </div>
              {product.options && product.options.length > 0 && (
                <span className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                  {product.options.length} options
                </span>
              )}
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground bg-muted/20 rounded-2xl border-2 border-dashed">
              <span className="text-4xl mb-4">🍨</span>
              <p className="text-lg font-medium">No products in this category</p>
              <p className="text-sm">Please try selecting another category</p>
            </div>
          )}
        </div>
      </div>

      {/* Right: Cart */}
      <div className="flex-[1.2] flex flex-col bg-white rounded-3xl shadow-2xl shadow-primary/5 border border-primary/5 p-6 min-h-0">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            <h2 className="font-bold text-xl tracking-tight">Order Details</h2>
          </div>
          <Badge variant="outline" className="px-3 py-1 rounded-full bg-primary/5 border-primary/20 text-primary font-bold">
            {cart.reduce((acc, item) => acc + item.quantity, 0)} Items
          </Badge>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 min-h-0 pr-2 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 px-4">
              <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center text-3xl">🛒</div>
              <div>
                <p className="font-semibold text-muted-foreground">Your cart is empty</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Add some delicious ice cream to start your order!</p>
              </div>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div
                key={`${item.productId}-${item.optionId}-${idx}`}
                className="group flex items-center gap-3 rounded-2xl bg-muted/30 p-3 hover:bg-muted/50 transition-colors border border-transparent hover:border-primary/10"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate pr-2">{item.productName}</div>
                  {item.optionName && (
                    <Badge variant="outline" className="text-[10px] py-0 h-4 bg-white/50 border-none font-medium mt-1">
                      {item.optionName}
                    </Badge>
                  )}
                  <div className="text-sm text-primary font-black mt-1">
                    {money(item.unitPrice)}
                  </div>
                </div>
                
                <div className="flex items-center gap-1 bg-white rounded-full p-1 shadow-sm border border-black/5">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-colors" 
                    onClick={() => updateQty(idx, -1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-7 text-center text-sm font-bold">{item.quantity}</span>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-colors" 
                    onClick={() => updateQty(idx, 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/5" 
                  onClick={() => removeItem(idx)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 space-y-4 pt-6 border-t border-dashed border-muted-foreground/20">
          {/* Coupon */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10 h-11 bg-muted/30 border-none rounded-xl focus-visible:ring-1 focus-visible:ring-primary/50"
                placeholder="Promo Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-2 py-2">
            <div className="flex justify-between items-end">
              <span className="text-sm font-medium text-muted-foreground">Subtotal</span>
              <span className="font-bold text-lg">{money(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-primary">
              <span className="text-sm font-semibold">Total Discount</span>
              <span className="font-bold">-{money(0)}</span>
            </div>
            <Separator className="bg-muted-foreground/10" />
            <div className="flex justify-between items-center pt-2">
              <span className="text-base font-bold">Payable Amount</span>
              <span className="text-2xl font-black text-primary">{money(subtotal)}</span>
            </div>
          </div>

          <Button
            className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-200"
            disabled={cart.length === 0 || loading}
            onClick={handlePlaceOrder}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center justify-between w-full px-2">
                <span>Place Order</span>
                <span className="bg-white/20 px-3 py-1 rounded-lg text-sm">{money(subtotal)}</span>
              </div>
            )}
          </Button>
        </div>
      </div>

      {/* Option picker dialog */}
      <Dialog open={!!optionDialog} onOpenChange={(open) => !open && setOptionDialog(null)}>
        <DialogContent className="rounded-3xl border-none p-0 overflow-hidden max-md:max-w-[95vw] md:max-w-md">
          <div className="bg-primary/5 p-8 text-center space-y-2 border-b">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center text-4xl mx-auto mb-4">🍨</div>
            <DialogTitle className="text-2xl font-bold">{optionDialog?.name}</DialogTitle>
            <DialogDescription className="text-muted-foreground">Customize your delicious ice cream</DialogDescription>
          </div>
          <div className="p-6 space-y-3">
            {optionDialog?.options?.map((opt) => (
              <Button
                key={opt.id}
                variant="outline"
                className="w-full justify-between h-auto py-5 px-6 rounded-2xl border-muted hover:border-primary hover:bg-primary/5 transition-all group"
                onClick={() => {
                  if (optionDialog) addToCart(optionDialog, opt);
                  setOptionDialog(null);
                }}
              >
                <div className="flex flex-col items-start gap-1 text-left">
                  <span className="font-bold text-base group-hover:text-primary transition-colors">{opt.optionName}</span>
                  <span className="text-xs text-muted-foreground font-medium">Extra topping or size</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none font-bold">
                    {opt.extraPrice > 0 ? `+${money(opt.extraPrice)}` : "Free"}
                  </Badge>
                  <Plus className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Receipt dialog */}
      <Dialog open={receiptOpen} onOpenChange={setReceiptOpen}>
        <DialogContent className="max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-black">Success!</DialogTitle>
            <DialogDescription className="text-center font-medium">
              Order {receiptOrder?.orderRef} has been placed.
            </DialogDescription>
          </DialogHeader>

          {receiptOrder && (
            <div className="mt-4 space-y-4">
              <div className="bg-muted/30 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  <span>Item</span>
                  <span>Price</span>
                </div>
                <div className="space-y-2">
                  {receiptOrder.items?.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm font-bold">
                      <span className="flex flex-col">
                        <span>{item.productName} <span className="text-primary">x{item.quantity}</span></span>
                        {item.optionName && (
                          <span className="text-[10px] text-muted-foreground uppercase">{item.optionName}</span>
                        )}
                      </span>
                      <span>{money(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
                <Separator className="bg-black/5" />
                <div className="space-y-1 text-sm font-bold">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{money(receiptOrder.totalAmount)}</span>
                  </div>
                  {receiptOrder.discountAmount > 0 && (
                    <div className="flex justify-between text-primary">
                      <span>Discount</span>
                      <span>-{money(receiptOrder.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg pt-1">
                    <span>Total Amount</span>
                    <span className="text-primary font-black">{money(receiptOrder.finalAmount)}</span>
                  </div>
                </div>
              </div>

              <Button className="w-full h-12 rounded-2xl font-bold" variant="secondary" onClick={() => setReceiptOpen(false)}>
                Close Receipt
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
