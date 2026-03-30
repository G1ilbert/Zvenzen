"use client";

import { useState } from "react";
import { IceCreamCone, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { SidebarNav } from "./sidebar-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-full">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-60 md:flex-col md:border-r bg-white">
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <IceCreamCone className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold tracking-tight">Zvenzen</span>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <SidebarNav />
        </div>
      </aside>

      {/* Mobile header + sheet */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center gap-2 border-b bg-white px-4 md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="inline-flex items-center justify-center rounded-md p-2 hover:bg-accent">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-60 p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex h-14 items-center gap-2 border-b px-4">
                <IceCreamCone className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">Zvenzen</span>
              </div>
              <div className="py-4">
                <SidebarNav onNavigate={() => setOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
          <IceCreamCone className="h-5 w-5 text-primary" />
          <span className="font-bold">Zvenzen</span>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
