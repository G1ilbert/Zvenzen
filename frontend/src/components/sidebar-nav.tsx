"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  IceCreamCone,
  ClipboardList,
  ShoppingCart,
  Gift,
} from "lucide-react";

const navItems = [
  { href: "/pos", label: "POS", icon: ShoppingCart },
  { href: "/menu", label: "Menu", icon: IceCreamCone },
  { href: "/orders", label: "Orders", icon: ClipboardList },
  { href: "/promotions", label: "Promotions", icon: Gift },
];

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2 px-4">
      <div className="px-3 mb-2">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Main Menu</span>
      </div>
      {navItems.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-200",
              active
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                : "text-muted-foreground hover:bg-primary/5 hover:text-primary hover:translate-x-1"
            )}
          >
            <item.icon className={cn(
              "h-5 w-5 transition-transform duration-200",
              active ? "scale-110" : "group-hover:scale-110"
            )} />
            <span className="tracking-tight">{item.label}</span>
            {active && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground/50" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
