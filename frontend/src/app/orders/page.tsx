"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Ticket, Gift, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { Separator } from "@/components/ui/separator";
import { getOrders, getOrder, updateOrderStatus, createCollabCoupon } from "@/lib/api";
import { money, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Order, CollabCoupon } from "@/lib/types";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
};

import { Search, Filter, Calendar, XCircle, ShoppingBag, ReceiptText } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [detail, setDetail] = useState<Order | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Collab coupon state
  const [collabLoading, setCollabLoading] = useState(false);
  const [collabCoupon, setCollabCoupon] = useState<CollabCoupon | null>(null);
  const [copied, setCopied] = useState(false);

  const load = () => {
    const params: Record<string, string> = {};
    if (statusFilter !== "all") params.status = statusFilter;
    if (dateFilter) params.date = dateFilter;
    getOrders(params).then(setOrders).catch(() => {});
  };

  useEffect(load, [statusFilter, dateFilter]);

  const openDetail = async (id: number) => {
    try {
      const order = await getOrder(id);
      setDetail(order);
      setCollabCoupon(null);
      setCopied(false);
      setDialogOpen(true);
    } catch {
      toast.error("Failed to load order details");
    }
  };

  const handleStatus = async (id: number, status: string) => {
    try {
      await updateOrderStatus(id, status);
      toast.success(`Order ${status}`);
      setDialogOpen(false);
      load();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed";
      toast.error(msg);
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
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight">Order Management</h1>
        <p className="text-muted-foreground font-medium">Track and manage your customer orders.</p>
      </div>

      <div className="flex gap-4 items-end flex-wrap">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Status Filter</label>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
            <SelectTrigger className="w-48 h-12 rounded-2xl bg-white border-none shadow-sm ring-1 ring-black/[0.03] font-bold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-xl">
              <SelectItem value="all" className="rounded-xl focus:bg-primary/5">All Orders</SelectItem>
              <SelectItem value="pending" className="rounded-xl focus:bg-primary/5 text-yellow-600">Pending</SelectItem>
              <SelectItem value="completed" className="rounded-xl focus:bg-primary/5 text-emerald-600">Completed</SelectItem>
              <SelectItem value="cancelled" className="rounded-xl focus:bg-primary/5 text-red-600">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Order Date</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              className="w-52 h-12 pl-12 rounded-2xl bg-white border-none shadow-sm ring-1 ring-black/[0.03] font-bold"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>

        {dateFilter && (
          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl text-muted-foreground hover:bg-destructive/5 hover:text-destructive transition-colors" onClick={() => setDateFilter("")}>
            <XCircle className="h-5 w-5" />
          </Button>
        )}

        <div className="ml-auto bg-primary/10 px-4 py-2 rounded-2xl border border-primary/20 flex items-center gap-3">
          <div className="bg-primary/20 p-1.5 rounded-lg">
            <ShoppingBag className="h-4 w-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary/70 leading-none">Total Results</span>
            <span className="text-lg font-black text-primary leading-tight">{orders.length}</span>
          </div>
        </div>
      </div>

      <Card className="border-none shadow-sm ring-1 ring-black/[0.03] overflow-hidden rounded-[2.5rem]">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="px-8 h-14 font-bold uppercase text-[10px] tracking-widest">Order Ref</TableHead>
                  <TableHead className="h-14 font-bold uppercase text-[10px] tracking-widest text-center">Items</TableHead>
                  <TableHead className="h-14 font-bold uppercase text-[10px] tracking-widest text-right">Final Amount</TableHead>
                  <TableHead className="h-14 font-bold uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                  <TableHead className="px-8 h-14 font-bold uppercase text-[10px] tracking-widest text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o) => (
                  <TableRow
                    key={o.id}
                    className="group cursor-pointer hover:bg-muted/20 border-black/[0.02] transition-colors"
                    onClick={() => openDetail(o.id)}
                  >
                    <TableCell className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <ReceiptText className="h-5 w-5" />
                        </div>
                        <span className="font-mono text-[11px] font-black text-primary tracking-tighter">{o.orderRef}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="rounded-full bg-white/50 border-muted-foreground/10 px-3 font-bold">
                        {o.items?.length ?? 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-black text-sm">{money(o.finalAmount)}</span>
                        {o.discountAmount > 0 && (
                          <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">-{money(o.discountAmount)} Off</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className={cn(
                        "px-3 py-1 text-[10px] font-black uppercase tracking-tight rounded-lg border-none",
                        statusColors[o.status] || ""
                      )}>
                        {o.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-8 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-[11px] font-bold text-foreground">{formatDateTime(o.createdAt).split(' ')[0]}</span>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase">{formatDateTime(o.createdAt).split(' ')[1]}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {orders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-24 text-muted-foreground">
                      <div className="flex flex-col items-center gap-4">
                        <div className="h-16 w-16 bg-muted/30 rounded-full flex items-center justify-center text-4xl">🧾</div>
                        <div>
                          <p className="font-black uppercase text-xs tracking-[0.2em]">No transactions found</p>
                          <p className="text-xs font-medium mt-1">Try changing your filters or checking back later.</p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order detail / Receipt dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md p-0 border-none overflow-hidden rounded-[2.5rem] shadow-2xl">
          <div className="bg-primary/5 p-8 border-b border-black/[0.03]">
            <div className="flex justify-between items-start mb-4">
              <div className="h-14 w-14 bg-white rounded-2xl shadow-lg flex items-center justify-center text-2xl">🧾</div>
              <Badge variant="secondary" className={cn(
                "px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border-none shadow-sm",
                statusColors[detail?.status || ""] || ""
              )}>
                {detail?.status}
              </Badge>
            </div>
            <DialogTitle className="text-2xl font-black tracking-tight">Order Receipt</DialogTitle>
            <DialogDescription className="font-bold flex items-center gap-2 mt-1">
              <span className="text-primary font-mono">{detail?.orderRef}</span>
              <span className="text-muted-foreground/30">•</span>
              <span className="text-muted-foreground">{detail && formatDateTime(detail.createdAt)}</span>
            </DialogDescription>
          </div>

          {detail && (
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">
                  <span>Product Details</span>
                  <span>Amount</span>
                </div>
                <div className="space-y-3">
                  {detail.items?.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm group">
                      <div className="flex flex-col">
                        <span className="font-bold group-hover:text-primary transition-colors">
                          {item.productName} <span className="text-primary/60 text-xs ml-1 font-black">x{item.quantity}</span>
                        </span>
                        {item.optionName && (
                          <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground/70">
                            {item.optionName}
                          </span>
                        )}
                      </div>
                      <span className="font-black">{money(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-muted-foreground/10 border-dashed" />

              <div className="space-y-3 bg-muted/30 p-5 rounded-2xl border border-black/[0.03]">
                <div className="flex justify-between text-xs font-bold text-muted-foreground">
                  <span>Total Subtotal</span>
                  <span>{money(detail.totalAmount)}</span>
                </div>
                {detail.discountAmount > 0 && (
                  <div className="flex justify-between text-xs font-bold text-primary">
                    <div className="flex items-center gap-2">
                      <span>Promotion Discount</span>
                      {detail.coupon && (
                        <Badge variant="outline" className="text-[10px] px-2 py-0 h-4 bg-primary/5 border-primary/20 text-primary font-bold">
                          {detail.coupon.promotionName}
                        </Badge>
                      )}
                    </div>
                    <span>-{money(detail.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 mt-2 border-t border-black/[0.05]">
                  <span className="text-sm font-black uppercase tracking-widest">Total Payable</span>
                  <span className="text-2xl font-black text-primary tracking-tight">{money(detail.finalAmount)}</span>
                </div>
              </div>

              {/* Status actions */}
              {detail.status === "pending" && (
                <div className="flex gap-3 pt-2">
                  <Button
                    className="flex-1 h-12 rounded-2xl font-black shadow-lg shadow-emerald-600/20 bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => handleStatus(detail.id, "completed")}
                  >
                    Mark as Paid
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex-1 h-12 rounded-2xl font-black text-destructive hover:bg-destructive/5"
                    onClick={() => handleStatus(detail.id, "cancelled")}
                  >
                    Void Order
                  </Button>
                </div>
              )}

              {/* Collaboration Coupon Section */}
              <div className="bg-gradient-to-br from-primary/5 to-primary/20 border border-primary/10 rounded-3xl p-6 shadow-inner relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 text-primary/5 group-hover:scale-150 transition-transform duration-1000">
                  <Gift className="h-24 w-24" />
                </div>
                
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="bg-white p-2.5 rounded-2xl shadow-md">
                    <Gift className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-black text-sm tracking-tight">
                    Exclusive Rewards Program
                  </span>
                </div>

                {!collabCoupon ? (
                  <div className="space-y-4 relative z-10">
                    <p className="text-xs font-bold text-muted-foreground leading-relaxed">
                      Every order unlocks a special collaboration code! Grab your discount for the next visit at our partner shops.
                    </p>
                    <Button
                      className="w-full h-12 rounded-2xl bg-primary text-white font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                      onClick={handleGetCollabCoupon}
                      disabled={collabLoading}
                    >
                      {collabLoading ? "Generating..." : "Unlock My Reward"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black uppercase tracking-[0.1em] text-primary">{collabCoupon.coupoun_name}</span>
                      <Badge className="bg-white text-primary border-none font-black shadow-sm px-3">฿{collabCoupon.coupoun_discount} OFF</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-white border-2 border-dashed border-primary/30 rounded-2xl px-6 py-3.5 text-center font-mono text-lg font-black tracking-[0.2em] text-primary shadow-inner">
                        {collabCoupon.coupon_code}
                      </div>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-14 w-14 rounded-2xl shadow-sm bg-white hover:bg-muted"
                        onClick={() => handleCopyCoupon(collabCoupon.coupon_code)}
                      >
                        {copied ? (
                          <Check className="h-6 w-6 text-emerald-600" />
                        ) : (
                          <Copy className="h-6 w-6 text-primary" />
                        )}
                      </Button>
                    </div>
                    <p className="text-[10px] font-black text-center text-primary/60 uppercase tracking-widest bg-primary/5 py-1 rounded-full">
                      Valid at all participating partner outlets
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="p-8 bg-muted/30 border-t border-black/[0.03]">
            <Button className="w-full h-12 rounded-2xl font-black bg-foreground text-background hover:bg-foreground/90 transition-all" onClick={() => setDialogOpen(false)}>
              Close Transaction
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
