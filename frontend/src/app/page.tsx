"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, DollarSign, Tag, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getDashboardSummary, getTopProducts, getOrders } from "@/lib/api";
import { money, formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { DashboardSummary, TopProduct, Order } from "@/lib/types";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    getDashboardSummary().then(setSummary).catch(() => {});
    getTopProducts().then(setTopProducts).catch(() => {});
    getOrders()
      .then((orders) => setRecentOrders(orders.slice(0, 10)))
      .catch(() => {});
  }, []);

  const cards = summary
    ? [
        { 
          title: "Total Orders", 
          value: summary.totalOrders, 
          icon: ShoppingCart, 
          color: "text-blue-600",
          bg: "bg-blue-50/50",
          iconBg: "bg-blue-100"
        },
        { 
          title: "Total Revenue", 
          value: money(summary.totalRevenue), 
          icon: DollarSign, 
          color: "text-emerald-600",
          bg: "bg-emerald-50/50",
          iconBg: "bg-emerald-100"
        },
        { 
          title: "Discounts", 
          value: money(summary.totalDiscount), 
          icon: Tag, 
          color: "text-orange-600",
          bg: "bg-orange-50/50",
          iconBg: "bg-orange-100"
        },
        { 
          title: "Net Profit", 
          value: money(summary.netRevenue), 
          icon: TrendingUp, 
          color: "text-primary",
          bg: "bg-primary/5",
          iconBg: "bg-primary/10"
        },
      ]
    : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground font-medium">Monitor your shop performance and sales data.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Card key={card.title} className="border-none shadow-sm hover:shadow-md transition-all duration-300 ring-1 ring-black/[0.03]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.iconBg} p-2.5 rounded-xl transition-transform hover:scale-110`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <Badge variant="secondary" className="bg-black/[0.03] text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-none">
                  Live
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{card.title}</p>
                <div className="text-3xl font-black tracking-tight">{card.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
        {!summary && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed">
            <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
            <p className="font-bold text-muted-foreground tracking-wide">Initializing Dashboard...</p>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Top products chart */}
        <Card className="lg:col-span-3 border-none shadow-sm ring-1 ring-black/[0.03] overflow-hidden rounded-3xl">
          <CardHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">Top 5 Best Sellers</CardTitle>
                <p className="text-xs text-muted-foreground font-medium mt-1">Based on total units sold</p>
              </div>
              <div className="h-10 w-10 bg-primary/5 rounded-full flex items-center justify-center text-primary">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {topProducts.length > 0 ? (
              <div className="h-[300px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProducts} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.922 0 0)" />
                    <XAxis 
                      dataKey="productName" 
                      tick={{ fontSize: 11, fontWeight: 600 }} 
                      axisLine={false}
                      tickLine={false}
                      dy={10}
                    />
                    <YAxis 
                      allowDecimals={false} 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fontWeight: 600 }} 
                    />
                    <Tooltip 
                      cursor={{ fill: 'oklch(0.922 0 0 / 0.3)' }}
                      contentStyle={{ 
                        borderRadius: '16px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                        fontWeight: 'bold'
                      }}
                    />
                    <Bar 
                      dataKey="totalQuantity" 
                      fill="oklch(0.65 0.2 15)" 
                      radius={[8, 8, 0, 0]} 
                      name="Units Sold" 
                      barSize={45}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground bg-muted/10 rounded-2xl">
                <span className="text-4xl mb-2">📊</span>
                <p className="font-bold">No sales data yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent orders */}
        <Card className="lg:col-span-2 border-none shadow-sm ring-1 ring-black/[0.03] overflow-hidden rounded-3xl">
          <CardHeader className="p-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
              <Badge variant="outline" className="rounded-full px-3 font-bold border-muted-foreground/20">
                Latest 10
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="px-6 h-10 font-bold uppercase text-[10px] tracking-widest">Reference</TableHead>
                    <TableHead className="h-10 font-bold uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                    <TableHead className="px-6 h-10 font-bold uppercase text-[10px] tracking-widest text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id} className="group hover:bg-muted/20 border-black/[0.02]">
                      <TableCell className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-mono text-[11px] font-bold text-primary tracking-tighter">{order.orderRef}</span>
                          <span className="text-[10px] text-muted-foreground font-medium">{formatTime(order.createdAt)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className={cn(
                          "px-2 py-0.5 text-[10px] font-black uppercase tracking-tight rounded-md border-none",
                          statusColors[order.status] || ""
                        )}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <span className="font-black text-sm">{money(order.finalAmount)}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                  {recentOrders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-20 text-muted-foreground">
                        <span className="text-3xl block mb-2">📄</span>
                        <p className="font-bold uppercase text-xs tracking-widest">No orders recorded</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
