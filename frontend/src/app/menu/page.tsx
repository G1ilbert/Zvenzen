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
        toast.success("Product updated successfully");
      } else {
        await createMenuItem(body);
        toast.success("Product created successfully");
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
      toast.success("Image uploaded successfully");
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
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Menu Management</h1>
          <p className="text-muted-foreground font-medium">Add, edit and organize your ice cream products.</p>
        </div>
        <Button onClick={openCreate} className="rounded-2xl h-12 px-6 font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
          <Plus className="h-5 w-5 mr-2" /> Add New Product
        </Button>
      </div>

      <Card className="border-none shadow-sm ring-1 ring-black/[0.03] overflow-hidden rounded-3xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="w-20 px-6 h-12 font-bold uppercase text-[10px] tracking-widest text-center">Image</TableHead>
                  <TableHead className="h-12 font-bold uppercase text-[10px] tracking-widest">Product Info</TableHead>
                  <TableHead className="h-12 font-bold uppercase text-[10px] tracking-widest">Category</TableHead>
                  <TableHead className="h-12 font-bold uppercase text-[10px] tracking-widest text-right">Price</TableHead>
                  <TableHead className="h-12 font-bold uppercase text-[10px] tracking-widest text-center">Variants</TableHead>
                  <TableHead className="px-6 h-12 font-bold uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p) => (
                  <TableRow
                    key={p.id}
                    className="group cursor-pointer hover:bg-muted/20 border-black/[0.02]"
                    onClick={() => openEdit(p)}
                  >
                    <TableCell className="px-6 py-4 flex justify-center">
                      <div className="relative h-12 w-12 rounded-xl overflow-hidden ring-1 ring-black/[0.05] shadow-sm group-hover:shadow-md transition-all">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                        ) : (
                          <div className="h-full w-full bg-primary/5 flex items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-primary/40" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-sm block group-hover:text-primary transition-colors">{p.name}</span>
                      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">ID: {String(p.id).padStart(4, '0')}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="rounded-full bg-white/50 border-muted-foreground/10 px-3 font-medium">
                        {p.categoryName}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-black text-primary">
                      {money(p.basePrice)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center gap-1 bg-muted/40 px-2 py-0.5 rounded-md font-bold text-[11px] text-muted-foreground">
                        {p.options?.length || 0}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 text-center" onClick={(e) => e.stopPropagation()}>
                      <Switch
                        checked={p.isActive !== false}
                        onCheckedChange={() => handleToggle(p.id)}
                        className="data-[state=checked]:bg-primary"
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {products.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-24 text-muted-foreground">
                      <div className="flex flex-col items-center gap-3">
                        <span className="text-5xl">🍦</span>
                        <p className="font-bold uppercase text-xs tracking-widest">Your menu is empty</p>
                        <Button variant="link" onClick={openCreate} className="text-primary font-bold">Add your first product</Button>
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
            <DialogTitle className="text-2xl font-black tracking-tight">{editId ? "Update Menu Item" : "Create New Item"}</DialogTitle>
            <DialogDescription className="font-medium">Modify product details and pricing strategies.</DialogDescription>
          </div>
          
          <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Category</Label>
                <Select value={form.categoryId} onValueChange={(v) => setForm((f) => ({ ...f, categoryId: v ?? "" }))}>
                  <SelectTrigger className="h-12 rounded-2xl bg-muted/30 border-none font-bold">
                    <SelectValue placeholder="Pick a category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-xl">
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)} className="rounded-xl focus:bg-primary/5">
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Base Price</Label>
                <div className="relative">
                  <Input 
                    className="h-12 rounded-2xl bg-muted/30 border-none font-bold pl-10" 
                    type="number" 
                    step="0.01" 
                    placeholder="0.00"
                    value={form.basePrice} 
                    onChange={(e) => setForm((f) => ({ ...f, basePrice: e.target.value }))} 
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-primary">฿</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Product Name</Label>
              <Input 
                className="h-12 rounded-2xl bg-muted/30 border-none font-bold text-base" 
                placeholder="e.g. Strawberry Cheesecake Sundae"
                value={form.name} 
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} 
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Visual Branding</Label>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 h-32 rounded-2xl bg-muted/30 border-2 border-dashed border-muted-foreground/10 overflow-hidden flex items-center justify-center group relative">
                  {form.imageUrl ? (
                    <>
                      <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          size="icon"
                          variant="destructive"
                          className="h-8 w-8 rounded-full"
                          onClick={() => setForm((f) => ({ ...f, imageUrl: "" }))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <ImageIcon className="h-8 w-8 text-muted-foreground/30 mx-auto mb-1" />
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">No Image</p>
                    </div>
                  )}
                </div>
                <label className="col-span-2 h-32 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-all group">
                  <div className="bg-primary/10 p-2 rounded-xl group-hover:scale-110 transition-transform">
                    <Upload className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-bold block">{uploading ? "Uploading..." : "Click to Upload"}</span>
                    <span className="text-[10px] font-medium text-muted-foreground">PNG, JPG up to 5MB</span>
                  </div>
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
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between ml-1">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Product Variants</Label>
                <Button variant="ghost" size="sm" onClick={addOption} className="h-7 text-[10px] font-black uppercase tracking-wider text-primary hover:bg-primary/5">
                  <Plus className="h-3 w-3 mr-1" /> Add Variant
                </Button>
              </div>
              <div className="space-y-3">
                {form.options.map((opt, idx) => (
                  <div key={idx} className="group flex items-center gap-3 rounded-2xl bg-muted/20 p-3 border border-transparent hover:border-primary/10 transition-colors">
                    <Input
                      placeholder="Variant Name (e.g. Extra Large)"
                      value={opt.optionName}
                      onChange={(e) => updateOption(idx, "optionName", e.target.value)}
                      className="flex-1 bg-white/50 border-none rounded-xl h-10 font-bold text-sm"
                    />
                    <div className="relative w-28 shrink-0">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={opt.extraPrice}
                        onChange={(e) => updateOption(idx, "extraPrice", e.target.value)}
                        className="bg-white/50 border-none rounded-xl h-10 font-bold text-sm pl-7"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-primary">฿</span>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={opt.isDefault}
                          onChange={(e) => updateOption(idx, "isDefault", e.target.checked)}
                          className="peer sr-only"
                        />
                        <div className="h-5 w-5 rounded-md border-2 border-primary/20 peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-white scale-0 peer-checked:scale-100 transition-transform" />
                        </div>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Default</span>
                    </label>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/5 shrink-0" 
                      onClick={() => removeOption(idx)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {form.options.length === 0 && (
                  <div className="text-center py-4 rounded-2xl bg-muted/10 border-2 border-dashed border-muted-foreground/10">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">No variants defined</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-8 bg-muted/30 border-t border-black/[0.03] flex gap-3">
            <Button variant="ghost" className="flex-1 h-12 rounded-2xl font-bold" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button className="flex-[2] h-12 rounded-2xl font-bold shadow-lg shadow-primary/20" onClick={handleSave}>
              {editId ? "Save Changes" : "Create Product"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
