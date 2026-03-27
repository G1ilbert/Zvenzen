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
import { getPromotions, createPromotion, updatePromotion, togglePromotion, getMenu } from "@/lib/api";
import { money, formatDate } from "@/lib/format";
import type { Promotion, Product } from "@/lib/types";

const typeColors: Record<string, string> = {
  fixed: "bg-blue-100 text-blue-800",
  percent: "bg-purple-100 text-purple-800",
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
        toast.success("Promotion updated");
      } else {
        await createPromotion(body);
        toast.success("Promotion created");
      }
      setDialogOpen(false);
      load();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Save failed";
      toast.error(msg);
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await togglePromotion(id);
      load();
    } catch {
      toast.error("Toggle failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Promotions</h1>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-1" /> Create Promotion
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-center">Usage</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="text-center">Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotions.map((p) => (
                <TableRow
                  key={p.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => openEdit(p)}
                >
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={typeColors[p.discountType] || ""}>
                      {p.discountType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {p.discountType === "percent"
                      ? `${p.discountValue}%`
                      : p.discountType === "fixed"
                      ? money(p.discountValue)
                      : "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {p.couponsUsed}/{p.maxCoupons}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(p.validFrom)} - {formatDate(p.validUntil)}
                  </TableCell>
                  <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                    <Switch
                      checked={p.isActive !== false}
                      onCheckedChange={() => handleToggle(p.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {promotions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No promotions yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Promotion" : "Create Promotion"}</DialogTitle>
            <DialogDescription>Fill in promotion details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input className="mt-1" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <Label>Discount Type</Label>
              <Select value={form.discountType} onValueChange={(v) => setForm((f) => ({ ...f, discountType: v ?? "fixed" }))}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                  <SelectItem value="percent">Percentage</SelectItem>
                  <SelectItem value="free_items">Free Items</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {form.discountType !== "free_items" && (
              <div>
                <Label>Discount Value {form.discountType === "percent" ? "(%)" : "(฿)"}</Label>
                <Input className="mt-1" type="number" step="0.01" value={form.discountValue} onChange={(e) => setForm((f) => ({ ...f, discountValue: e.target.value }))} />
              </div>
            )}
            <div>
              <Label>Min Order Amount</Label>
              <Input className="mt-1" type="number" step="0.01" value={form.minOrderAmount} onChange={(e) => setForm((f) => ({ ...f, minOrderAmount: e.target.value }))} />
            </div>
            <div>
              <Label>Max Coupons</Label>
              <Input className="mt-1" type="number" value={form.maxCoupons} onChange={(e) => setForm((f) => ({ ...f, maxCoupons: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Valid From</Label>
                <Input className="mt-1" type="datetime-local" value={form.validFrom} onChange={(e) => setForm((f) => ({ ...f, validFrom: e.target.value }))} />
              </div>
              <div>
                <Label>Valid Until</Label>
                <Input className="mt-1" type="datetime-local" value={form.validUntil} onChange={(e) => setForm((f) => ({ ...f, validUntil: e.target.value }))} />
              </div>
            </div>

            {form.discountType === "free_items" && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Free Items</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        freeItems: [...f.freeItems, { productId: "", optionId: "", quantity: "1" }],
                      }))
                    }
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {form.freeItems.map((fi, idx) => {
                    const selectedProduct = products.find((p) => String(p.id) === fi.productId);
                    return (
                      <div key={idx} className="flex items-center gap-2 border rounded-lg p-2">
                        <Select
                          value={fi.productId}
                          onValueChange={(v) => {
                            const fis = [...form.freeItems];
                            fis[idx] = { ...fis[idx], productId: v ?? "", optionId: "" };
                            setForm((f) => ({ ...f, freeItems: fis }));
                          }}
                        >
                          <SelectTrigger className="flex-1"><SelectValue placeholder="Product" /></SelectTrigger>
                          <SelectContent>
                            {products.map((p) => (
                              <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
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
                            <SelectTrigger className="w-32"><SelectValue placeholder="Option" /></SelectTrigger>
                            <SelectContent>
                              {selectedProduct.options.map((o) => (
                                <SelectItem key={o.id} value={String(o.id)}>{o.optionName}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        <Input
                          type="number"
                          className="w-16"
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
                          className="h-8 w-8 text-destructive shrink-0"
                          onClick={() =>
                            setForm((f) => ({
                              ...f,
                              freeItems: f.freeItems.filter((_, i) => i !== idx),
                            }))
                          }
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <Button className="w-full" onClick={handleSave}>
              {editId ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
