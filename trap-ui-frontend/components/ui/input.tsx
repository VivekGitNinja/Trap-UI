import * as React from "react";
import { cn } from "@/utils/cn";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("w-full rounded-md border border-slate-300 px-3 py-2 text-sm", props.className)} />;
}
