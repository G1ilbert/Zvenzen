"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
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
import { getOrders, getOrder, updateOrderStatus } from "@/lib/api";
import { money, formatDateTime } from "@/lib/format";
import type { Order } from "@/lib/types";

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

      {/* Order detail dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{detail?.orderRef}</DialogTitle>
            <DialogDescription>
              {detail && formatDateTime(detail.createdAt)}
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
                    <span>Discount</span><span>-{money(detail.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span><span>{money(detail.finalAmount)}</span>
                </div>
              </div>

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
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
