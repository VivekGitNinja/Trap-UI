"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart2, Zap, Brain, Layout, CheckCircle, Smartphone, Palette, MousePointer } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Design Prediction",
    description: "Our engine suggests the optimal design system, layout, and color psychology for your industry."
  },
  {
    icon: Layout,
    title: "Layout Intelligence",
    description: "Automatically detects your layout type with high-confidence scoring and structural analysis."
  },
  {
    icon: Palette,
    title: "Color Psychology",
    description: "Analyzes your color palette's trust, urgency, and contrast ratios against industry standards."
  },
  {
    icon: MousePointer,
    title: "CTA Optimization",
    description: "Tracks button placement, fold position, and visual hierarchy to maximize conversion."
  }
];

const steps = [
  {
    step: "01",
    title: "Enter URL",
    description: "Paste any landing page or website URL you want to analyze."
  },
  {
    step: "02",
    title: "AI Scanning",
    description: "Our headless browser captures screenshots and parses the DOM in seconds."
  },
  {
    step: "03",
    title: "Get Insights",
    description: "Receive a comprehensive TRAP Score and actionable design predictions."
  }
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-24 pb-20">
      {/* Hero Section */}
      <section className="relative mx-auto flex min-h-[80vh] max-w-4xl flex-col justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mx-auto flex w-fit items-center gap-2 rounded-full bg-orange-100 px-4 py-1.5 text-sm font-semibold uppercase tracking-wider text-orange-600 shadow-sm"
          >
            <Zap className="h-4 w-4 fill-orange-600" />
            <span>Trend Research & Analytics Platform</span>
          </motion.div>
          
          <motion.h1 
            className="text-6xl font-black tracking-tighter text-slate-900 sm:text-8xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
          >
            Design that <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Converts</span>
          </motion.h1>
          
          <motion.p 
            className="mx-auto max-w-2xl text-xl text-slate-600 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Stop guessing. Use <span className="font-bold text-slate-900">AI-powered analytics</span> to audit your UI patterns, 
            optimize density, and predict the perfect layout for your industry.
          </motion.p>

          <motion.div 
            className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-slate-900 px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-slate-900/20 transition hover:bg-slate-800"
              >
                <span>Start Free Analysis</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </Link>
            
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-lg font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
              >
                <BarChart2 className="h-5 w-5" /> 
                View Demo
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Decorative background blobs */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 opacity-40 blur-3xl">
          <div className="h-[400px] w-[600px] animate-pulse rounded-full bg-gradient-to-r from-orange-200 to-amber-100 opacity-70 mix-blend-multiply" />
        </div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Why TRAP UI?</h2>
          <p className="mt-4 text-lg text-slate-600">Comprehensive analysis for modern web design.</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
            >
              <div className="mb-4 inline-flex rounded-lg bg-orange-50 p-3 text-orange-600 group-hover:bg-orange-100">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-900">{feature.title}</h3>
              <p className="text-slate-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="mx-auto max-w-6xl rounded-3xl bg-slate-900 px-4 py-20 text-white">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How It Works</h2>
          <p className="mt-4 text-lg text-slate-400">Three simple steps to better conversion.</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="relative text-center"
            >
              <div className="mb-6 text-6xl font-black text-slate-800 opacity-50">{item.step}</div>
              <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
              <p className="mx-auto max-w-xs text-slate-400">{item.description}</p>
              {idx !== steps.length - 1 && (
                <div className="absolute top-1/2 -right-4 hidden h-0.5 w-8 -translate-y-1/2 bg-slate-800 lg:block" />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="mx-auto max-w-4xl text-center">
        <div className="grid grid-cols-2 gap-8 rounded-2xl border border-slate-200 bg-white p-12 shadow-sm sm:grid-cols-4">
          {[
            { label: "Analyses Run", value: "10k+" },
            { label: "Design Patterns", value: "50+" },
            { label: "Accuracy", value: "99%" },
            { label: "Time Saved", value: "∞" }
          ].map((stat, idx) => (
            <div key={idx}>
              <div className="text-3xl font-black text-slate-900">{stat.value}</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
