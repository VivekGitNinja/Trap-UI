"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { login, register } from "@/lib/api";
import { setToken } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [plan, setPlan] = useState<"free" | "pro" | "enterprise">("free");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result =
        mode === "login"
          ? await login({ email, password })
          : await register({ name, email, password, plan });

      setToken(result.token);
      router.push("/analyze");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mx-auto max-w-md space-y-6 p-8 shadow-xl">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {mode === "login" ? "Welcome back" : "Create an account"}
          </h1>
          <p className="text-sm text-slate-500">
            {mode === "login" ? "Enter your credentials to access your dashboard" : "Start optimizing your UI conversion today"}
          </p>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          {mode === "register" && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}>
              <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
            </motion.div>
          )}
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input
            type="password"
            placeholder="Password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {mode === "register" && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value as "free" | "pro" | "enterprise")}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <option value="free">Free (5 scans)</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </motion.div>
          )}

          <Button disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </Button>
          
          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-center text-sm text-red-600"
            >
              {error}
            </motion.p>
          )}
        </form>
      </Card>
    </motion.div>
  );
}
