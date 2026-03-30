"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getPromotions, createPromotion, updatePromotion, getMenu } from "@/lib/api";
import { money, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Promotion, Product } from "@/lib/types";

const typeColors: Record<string, string> = {
  fixed: "bg-blue-100 text-blue-800",
  free_items: "bg-emerald-100 text-emerald-800",
};

interface FreeItemForm {
  productId: string;
  optionId: string;
  quantity: string;
}

interface PromoForm {
  name: string;
  discountType: string;
  discountValue: string;
  minOrderAmount: string;
  maxCoupons: string;
  validFrom: string;
  validUntil: string;
  freeItems: FreeItemForm[];
}

const emptyForm: PromoForm = {
  name: "",
  discountType: "fixed",
  discountValue: "",
  minOrderAmount: "0",
  maxCoupons: "",
  validFrom: "",
  validUntil: "",
  freeItems: [],
};

import { Zap, Percent, Clock, Users, Gift, HelpCircle } from "lucide-react";

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<PromoForm>(emptyForm);

  const load = () => {
    getPromotions().then(setPromotions).catch(() => {});
    getMenu().then(setProducts).catch(() => {});
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (p: Promotion) => {
    setEditId(p.id);
    setForm({
      name: p.name,
      discountType: p.discountType,
      discountValue: p.discountValue != null ? String(p.discountValue) : "",
      minOrderAmount: p.minOrderAmount != null ? String(p.minOrderAmount) : "0",
      maxCoupons: String(p.maxCoupons),
      validFrom: p.validFrom?.slice(0, 16) || "",
      validUntil: p.validUntil?.slice(0, 16) || "",
      freeItems:
        p.freeItems?.map((fi) => ({
          productId: String(fi.productId),
          optionId: fi.optionId != null ? String(fi.optionId) : "",
          quantity: String(fi.quantity),
        })) || [],
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const body = {
      name: form.name,
      discountType: form.discountType,
      discountValue: form.discountValue ? Number(form.discountValue) : null,
      minOrderAmount: Number(form.minOrderAmount) || null,
      maxCoupons: Number(form.maxCoupons),
      validFrom: form.validFrom,
      validUntil: form.validUntil,
      freeItems:
        form.discountType === "free_items"
          ? form.freeItems.map((fi) => ({
              productId: Number(fi.productId),
              optionId: fi.optionId ? Number(fi.optionId) : null,
              quantity: Number(fi.quantity),
            }))
          : null,
    };
    try {
      if (editId) {
        await updatePromotion(editId, body);
        toast.success("Promotion updated successfully");
      } else {
        await createPromotion(body);
        toast.success("Promotion created successfully");
      }
      setDialogOpen(false);
      load();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Save failed";
      toast.error(msg);
    }
  };

  const handleToggle = async (id: number) => {
    const promo = promotions.find((p) => p.id === id);
    if (!promo) return;
    try {
      await updatePromotion(id, {
        name: promo.name,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
        minOrderAmount: promo.minOrderAmount,
        maxCoupons: promo.maxCoupons,
        validFrom: promo.validFrom,
        validUntil: promo.validUntil,
        isActive: !(promo.isActive !== false),
        freeItems: promo.freeItems?.map((fi) => ({
          productId: fi.productId,
          optionId: fi.optionId,
          quantity: fi.quantity,
        })) || [],
      });
      load();
    } catch {
      toast.error("Toggle failed");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Promotions & Offers</h1>
          <p className="text-muted-foreground font-medium">Create and manage marketing campaigns.</p>
        </div>
        <Button onClick={openCreate} className="rounded-2xl h-12 px-6 font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
          <Plus className="h-5 w-5 mr-2" /> New Campaign
        </Button>
      </div>

      <Card className="border-none shadow-sm ring-1 ring-black/[0.03] overflow-hidden rounded-[2.5rem]">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="px-8 h-14 font-bold uppercase text-[10px] tracking-widest">Campaign Name</TableHead>
                  <TableHead className="h-14 font-bold uppercase text-[10px] tracking-widest text-center">Type</TableHead>
                  <TableHead className="h-14 font-bold uppercase text-[10px] tracking-widest text-right">Value</TableHead>
                  <TableHead className="h-14 font-bold uppercase text-[10px] tracking-widest text-center">Usage</TableHead>
                  <TableHead className="h-14 font-bold uppercase text-[10px] tracking-widest">Validity Period</TableHead>
                  <TableHead className="px-8 h-14 font-bold uppercase text-[10px] tracking-widest text-center">Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promotions.map((p) => (
                  <TableRow
                    key={p.id}
                    className="group cursor-pointer hover:bg-muted/20 border-black/[0.02] transition-colors"
                    onClick={() => openEdit(p)}
                  >
                    <TableCell className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <Zap className="h-5 w-5" />
                        </div>
                        <span className="font-bold text-sm block group-hover:text-primary transition-colors">{p.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className={cn(
                        "px-3 py-1 text-[10px] font-black uppercase tracking-tight rounded-lg border-none",
                        typeColors[p.discountType] || ""
                      )}>
                        {p.discountType === "fixed" ? "Discount" : "Free Gifts"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-black text-sm text-primary">
                        {p.discountType === "fixed" ? money(p.discountValue) : "N/A"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-black">{p.couponsUsed} <span className="text-muted-foreground/50 font-medium">/ {p.maxCoupons}</span></span>
                        <div className="w-16 h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full" 
                            style={{ width: `${Math.min((p.couponsUsed / p.maxCoupons) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-foreground">From: {formatDate(p.validFrom)}</span>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase">Until: {formatDate(p.validUntil)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 text-center" onClick={(e) => e.stopPropagation()}>
                      <Switch
                        checked={p.isActive !== false}
                        onCheckedChange={() => handleToggle(p.id)}
                        className="data-[state=checked]:bg-primary"
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {promotions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-24 text-muted-foreground">
                      <div className="flex flex-col items-center gap-4">
                        <div className="h-16 w-16 bg-muted/30 rounded-full flex items-center justify-center text-4xl">🎁</div>
                        <div>
                          <p className="font-black uppercase text-xs tracking-[0.2em]">No promotions active</p>
                          <p className="text-xs font-medium mt-1">Start your first marketing campaign to boost sales.</p>
                        </div>
                        <Button variant="link" onClick={openCreate} className="text-primary font-bold">Create Promotion</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl p-0 border-none overflow-hidden rounded-[2.5rem] shadow-2xl">
          <div className="bg-primary/5 px-8 pt-8 pb-6 border-b border-black/[0.03]">
            <DialogTitle className="text-2xl font-black tracking-tight">{editId ? "Update Campaign" : "New Marketing Offer"}</DialogTitle>
            <DialogDescription className="font-medium">Define rewards and eligibility criteria for this campaign.</DialogDescription>
          </div>
          
          <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Campaign Name</Label>
              <Input 
                className="h-12 rounded-2xl bg-muted/30 border-none font-bold text-base" 
                placeholder="e.g. Summer Special 2024"
                value={form.name} 
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} 
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Reward Type</Label>
                <Select value={form.discountType} onValueChange={(v) => setForm((f) => ({ ...f, discountType: v ?? "fixed" }))}>
                  <SelectTrigger className="h-12 rounded-2xl bg-muted/30 border-none font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-xl">
                    <SelectItem value="fixed" className="rounded-xl focus:bg-primary/5">💰 Cash Discount</SelectItem>
                    <SelectItem value="free_items" className="rounded-xl focus:bg-primary/5">🍦 Free Products</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {form.discountType === "fixed" ? (
                <div className="space-y-2 animate-in slide-in-from-right duration-300">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Discount Amount</Label>
                  <div className="relative">
                    <Input 
                      className="h-12 rounded-2xl bg-muted/30 border-none font-bold pl-10" 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00"
                      value={form.discountValue} 
                      onChange={(e) => setForm((f) => ({ ...f, discountValue: e.target.value }))} 
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-primary">฿</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 animate-in slide-in-from-right duration-300">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Min Spend</Label>
                  <div className="relative">
                    <Input 
                      className="h-12 rounded-2xl bg-muted/30 border-none font-bold pl-10" 
                      type="number" 
                      step="0.01" 
                      value={form.minOrderAmount} 
                      onChange={(e) => setForm((f) => ({ ...f, minOrderAmount: e.target.value }))} 
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-primary">฿</span>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6 border-t border-black/[0.03] pt-6">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                  <Calendar className="h-3 w-3" /> Valid From
                </Label>
                <Input 
                  className="h-12 rounded-2xl bg-muted/30 border-none font-bold" 
                  type="datetime-local" 
                  value={form.validFrom} 
                  onChange={(e) => setForm((f) => ({ ...f, validFrom: e.target.value }))} 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                  <Calendar className="h-3 w-3" /> Valid Until
                </Label>
                <Input 
                  className="h-12 rounded-2xl bg-muted/30 border-none font-bold" 
                  type="datetime-local" 
                  value={form.validUntil} 
                  onChange={(e) => setForm((f) => ({ ...f, validUntil: e.target.value }))} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                <Users className="h-3 w-3" /> Coupon Capacity
              </Label>
              <Input 
                className="h-12 rounded-2xl bg-muted/30 border-none font-bold" 
                type="number" 
                placeholder="Unlimited if empty"
                value={form.maxCoupons} 
                onChange={(e) => setForm((f) => ({ ...f, maxCoupons: e.target.value }))} 
              />
            </div>

            {form.discountType === "free_items" && (
              <div className="space-y-4 animate-in fade-in duration-500 pt-2">
                <div className="flex items-center justify-between ml-1">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Complimentary Items</Label>
                  <Button variant="ghost" size="sm" onClick={() => setForm((f) => ({ ...f, freeItems: [...f.freeItems, { productId: "", optionId: "", quantity: "1" }] }))} className="h-7 text-[10px] font-black uppercase tracking-wider text-primary hover:bg-primary/5">
                    <Plus className="h-3 w-3 mr-1" /> Add Item
                  </Button>
                </div>
                <div className="space-y-3">
                  {form.freeItems.map((fi, idx) => {
                    const selectedProduct = products.find((p) => String(p.id) === fi.productId);
                    return (
                      <div key={idx} className="group flex items-center gap-3 rounded-2xl bg-muted/20 p-3 border border-transparent hover:border-primary/10 transition-colors">
                        <Select
                          value={fi.productId}
                          onValueChange={(v) => {
                            const fis = [...form.freeItems];
                            fis[idx] = { ...fis[idx], productId: v ?? "", optionId: "" };
                            setForm((f) => ({ ...f, freeItems: fis }));
                          }}
                        >
                          <SelectTrigger className="flex-1 h-10 rounded-xl bg-white/50 border-none font-bold text-sm">
                            <SelectValue placeholder="Product" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-none shadow-xl">
                            {products.map((p) => (
                              <SelectItem key={p.id} value={String(p.id)} className="rounded-lg">{p.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        {selectedProduct && selectedProduct.options.length > 0 && (
                          <Select
                            value={fi.optionId}
                            onValueChange={(v) => {
                              const fis = [...form.freeItems];
                              fis[idx] = { ...fis[idx], optionId: v ?? "" };
                              setForm((f) => ({ ...f, freeItems: fis }));
                            }}
                          >
                            <SelectTrigger className="w-32 h-10 rounded-xl bg-white/50 border-none font-bold text-sm">
                              <SelectValue placeholder="Option" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-none shadow-xl">
                              {selectedProduct.options.map((o) => (
                                <SelectItem key={o.id} value={String(o.id)} className="rounded-lg">{o.optionName}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        
                        <Input
                          type="number"
                          className="w-16 h-10 rounded-xl bg-white/50 border-none font-black text-center text-sm"
                          value={fi.quantity}
                          onChange={(e) => {
                            const fis = [...form.freeItems];
                            fis[idx] = { ...fis[idx], quantity: e.target.value };
                            setForm((f) => ({ ...f, freeItems: fis }));
                          }}
                        />
                        
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-10 w-10 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5 shrink-0"
                          onClick={() => setForm((f) => ({ ...f, freeItems: f.freeItems.filter((_, i) => i !== idx) }))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                  {form.freeItems.length === 0 && (
                    <div className="text-center py-6 rounded-2xl bg-muted/10 border-2 border-dashed border-muted-foreground/10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Add items to be given away</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="p-8 bg-muted/30 border-t border-black/[0.03] flex gap-3">
            <Button variant="ghost" className="flex-1 h-12 rounded-2xl font-bold" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button className="flex-[2] h-12 rounded-2xl font-bold shadow-lg shadow-primary/20" onClick={handleSave}>
              {editId ? "Save Changes" : "Launch Campaign"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
