"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, BarChart2, FileText, Search, LayoutDashboard } from "lucide-react";
import { clearToken } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

const links = [
  { href: "/analyze", label: "Analyze", icon: Search },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/reports", label: "Reports", icon: FileText }
];

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
    >
      <Link href="/" className="flex items-center gap-2 text-xl font-black tracking-tight text-slate-900">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white">
          <BarChart2 className="h-5 w-5" />
        </div>
        TRAP UI
      </Link>
      
      <nav className="flex items-center gap-1 overflow-x-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className="relative"
            >
              <div
                className={cn(
                  "relative z-10 flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  isActive ? "text-orange-600" : "text-slate-600 hover:text-slate-900"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </div>
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 z-0 rounded-md bg-orange-50"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <Button
        className="bg-transparent text-slate-500 hover:bg-red-50 hover:text-red-600 shadow-none"
        onClick={() => {
          clearToken();
          router.push("/login");
        }}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </motion.header>
  );
}
