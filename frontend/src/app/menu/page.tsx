"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Upload, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { getMenu, getCategories, createMenuItem, updateMenuItem, toggleMenuItem, uploadProductImage } from "@/lib/api";
import { money } from "@/lib/format";
import type { Product, Category } from "@/lib/types";

interface OptionForm {
  optionName: string;
  extraPrice: string;
  isDefault: boolean;
}

interface MenuForm {
  categoryId: string;
  name: string;
  basePrice: string;
  imageUrl: string;
  options: OptionForm[];
}

const emptyForm: MenuForm = {
  categoryId: "",
  name: "",
  basePrice: "",
  imageUrl: "",
  options: [],
};

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<MenuForm>(emptyForm);
  const [uploading, setUploading] = useState(false);

  const load = () => {
    getMenu().then(setProducts).catch(() => {});
    getCategories().then(setCategories).catch(() => {});
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditId(p.id);
    setForm({
      categoryId: String(p.categoryId),
      name: p.name,
      basePrice: String(p.basePrice),
      imageUrl: p.imageUrl || "",
      options: p.options.map((o) => ({
        optionName: o.optionName,
        extraPrice: String(o.extraPrice),
        isDefault: o.isDefault,
      })),
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const body = {
      categoryId: Number(form.categoryId),
      name: form.name,
      basePrice: Number(form.basePrice),
      imageUrl: form.imageUrl || null,
      options: form.options.map((o) => ({
        optionName: o.optionName,
        extraPrice: Number(o.extraPrice),
        isDefault: o.isDefault,
      })),
    };
    try {
      if (editId) {
        await updateMenuItem(editId, body);
        toast.success("Product updated");
      } else {
        await createMenuItem(body);
        toast.success("Product created");
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
      await toggleMenuItem(id);
      load();
    } catch {
      toast.error("Toggle failed");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const imageUrl = await uploadProductImage(file);
      setForm((f) => ({ ...f, imageUrl }));
      toast.success("Image uploaded");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const addOption = () => {
    setForm((f) => ({
      ...f,
      options: [...f.options, { optionName: "", extraPrice: "0", isDefault: false }],
    }));
  };

  const removeOption = (idx: number) => {
    setForm((f) => ({ ...f, options: f.options.filter((_, i) => i !== idx) }));
  };

  const updateOption = (idx: number, key: keyof OptionForm, value: string | boolean) => {
    setForm((f) => {
      const opts = [...f.options];
      opts[idx] = { ...opts[idx], [key]: value };
      return { ...f, options: opts };
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Menu</h1>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-1" /> Add Product
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Base Price</TableHead>
                <TableHead className="text-center">Options</TableHead>
                <TableHead className="text-center">Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow
                  key={p.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => openEdit(p)}
                >
                  <TableCell className="w-12">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} className="h-8 w-8 rounded object-cover" />
                    ) : (
                      <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.categoryName}</TableCell>
                  <TableCell className="text-right">{money(p.basePrice)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{p.options?.length || 0}</Badge>
                  </TableCell>
                  <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                    <Switch
                      checked={p.isActive !== false}
                      onCheckedChange={() => handleToggle(p.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No products yet
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
            <DialogTitle>{editId ? "Edit Product" : "Add Product"}</DialogTitle>
            <DialogDescription>Fill in product details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Category</Label>
              <Select value={form.categoryId} onValueChange={(v) => setForm((f) => ({ ...f, categoryId: v ?? "" }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Product Name</Label>
              <Input className="mt-1" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <Label>Base Price</Label>
              <Input className="mt-1" type="number" step="0.01" value={form.basePrice} onChange={(e) => setForm((f) => ({ ...f, basePrice: e.target.value }))} />
            </div>
            <div>
              <Label>Product Image</Label>
              <div className="mt-1 space-y-2">
                {form.imageUrl && (
                  <div className="relative w-full h-32 rounded-lg border overflow-hidden bg-muted">
                    <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => setForm((f) => ({ ...f, imageUrl: "" }))}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <label className="flex items-center justify-center gap-2 rounded-lg border border-dashed p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {uploading ? "Uploading..." : "Upload image"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>

            {/* Options */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Options</Label>
                <Button variant="outline" size="sm" onClick={addOption}>
                  <Plus className="h-3 w-3 mr-1" /> Add
                </Button>
              </div>
              <div className="space-y-2">
                {form.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2 rounded-lg border p-2">
                    <Input
                      placeholder="Option name"
                      value={opt.optionName}
                      onChange={(e) => updateOption(idx, "optionName", e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Extra"
                      value={opt.extraPrice}
                      onChange={(e) => updateOption(idx, "extraPrice", e.target.value)}
                      className="w-24"
                    />
                    <label className="flex items-center gap-1 text-xs whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={opt.isDefault}
                        onChange={(e) => updateOption(idx, "isDefault", e.target.checked)}
                      />
                      Default
                    </label>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive shrink-0" onClick={() => removeOption(idx)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full" onClick={handleSave}>
              {editId ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
