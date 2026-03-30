"use client";

import { useState } from "react";
import { IceCreamCone, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SidebarNav } from "./sidebar-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col border-r bg-white/80 backdrop-blur-md shadow-xl shadow-black/[0.02] z-50">
        <div className="flex h-20 items-center gap-3 px-6">
          <div className="bg-primary/10 p-2 rounded-2xl">
            <IceCreamCone className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xl font-black tracking-tight text-foreground">Zvenzen</span>
        </div>
        <div className="flex-1 overflow-y-auto py-6 custom-scrollbar">
          <SidebarNav />
        </div>
        <div className="p-6 border-t bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">AD</div>
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase tracking-widest text-foreground">Admin Mode</span>
              <span className="text-[10px] font-medium text-muted-foreground">Store Manager</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="flex h-16 items-center justify-between border-b bg-white/80 backdrop-blur-md px-4 md:hidden z-40">
          <div className="flex items-center gap-3">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 border-none">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <div className="flex h-20 items-center gap-3 px-6 border-b">
                  <div className="bg-primary/10 p-2 rounded-2xl">
                    <IceCreamCone className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-xl font-black tracking-tight">Zvenzen</span>
                </div>
                <div className="py-6 overflow-y-auto">
                  <SidebarNav onNavigate={() => setOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
            <span className="font-black text-lg tracking-tight">Zvenzen</span>
          </div>
          <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <IceCreamCone className="h-5 w-5 text-primary" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
