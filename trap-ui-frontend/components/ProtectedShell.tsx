"use client";

import type { ReactNode } from "react";
import { TopNav } from "@/components/TopNav";

export function ProtectedShell({ children }: { children: ReactNode }) {
  return (
    <>
      <TopNav />
      {children}
    </>
  );
}
