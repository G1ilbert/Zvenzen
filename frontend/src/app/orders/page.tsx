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
import type { Order, CollabCoupon } from "@/lib/types";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
};

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
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Orders</h1>

      <div className="flex gap-3 flex-wrap">
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="date"
          className="w-44"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
        {dateFilter && (
          <Button variant="ghost" size="sm" onClick={() => setDateFilter("")}>
            Clear date
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Ref</TableHead>
                <TableHead className="text-center">Items</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Discount</TableHead>
                <TableHead className="text-right">Final</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => (
                <TableRow
                  key={o.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => openDetail(o.id)}
                >
                  <TableCell className="font-mono text-xs">{o.orderRef}</TableCell>
                  <TableCell className="text-center">{o.items?.length ?? "-"}</TableCell>
                  <TableCell className="text-right">{money(o.totalAmount)}</TableCell>
                  <TableCell className="text-right text-orange-600">
                    {o.discountAmount > 0 ? `-${money(o.discountAmount)}` : "-"}
                  </TableCell>
                  <TableCell className="text-right font-semibold">{money(o.finalAmount)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={statusColors[o.status] || ""}>
                      {o.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {formatDateTime(o.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order detail / Receipt dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-lg">ใบเสร็จ / Receipt</DialogTitle>
            <DialogDescription className="text-center">
              {detail?.orderRef} &mdash; {detail && formatDateTime(detail.createdAt)}
            </DialogDescription>
          </DialogHeader>
          {detail && (
            <div className="space-y-3">
              <Badge variant="secondary" className={statusColors[detail.status] || ""}>
                {detail.status}
              </Badge>

              <div className="space-y-1">
                {detail.items?.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.productName}
                      {item.optionName && <span className="text-muted-foreground"> ({item.optionName})</span>}
                      {" x"}{item.quantity}
                    </span>
                    <span>{money(item.subtotal)}</span>
                  </div>
                ))}
              </div>

              <Separator />
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span><span>{money(detail.totalAmount)}</span>
                </div>
                {detail.discountAmount > 0 && (
                  <div className="flex justify-between text-orange-600">
                    <span>
                      Discount
                      {detail.coupon && (
                        <span className="text-xs ml-1">({detail.coupon.promotionName})</span>
                      )}
                    </span>
                    <span>-{money(detail.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base pt-1">
                  <span>Total</span>
                  <span className="text-emerald-600">{money(detail.finalAmount)}</span>
                </div>
              </div>

              {/* Coupon info if applied */}
              {detail.coupon && (
                <>
                  <Separator />
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Ticket className="h-4 w-4 text-orange-600" />
                      <span className="font-semibold text-orange-800">Coupon Applied</span>
                    </div>
                    <div className="text-orange-700">
                      {detail.coupon.promotionName} &mdash;{" "}
                      {`-${detail.coupon.discountValue} บาท`}
                    </div>
                    <div className="text-xs text-orange-600 mt-1 font-mono">
                      Code: {detail.coupon.code}
                    </div>
                  </div>
                </>
              )}

              {/* Status actions */}
              {detail.status === "pending" && (
                <>
                  <Separator />
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handleStatus(detail.id, "completed")}
                    >
                      Complete
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => handleStatus(detail.id, "cancelled")}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              )}

              {detail.status === "completed" && (<>
              <Separator />

              {/* Collaboration Coupon Section — only for completed orders */}
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
              </>)}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
