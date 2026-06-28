'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import {
  BarChart3, Shield, Cloud, Zap, PieChart, Wallet, ArrowRight, Check, Star, ChevronDown
} from 'lucide-react';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { useState } from 'react';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 inset-x-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Wallet className="h-5 w-5 text-primary" /> Trackr
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-foreground">Features</Link>
            <Link href="#pricing" className="hover:text-foreground">Pricing</Link>
            <Link href="#faq" className="hover:text-foreground">FAQ</Link>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/auth/login"><Button variant="ghost">Log in</Button></Link>
            <Link href="/auth/register"><Button>Get Started</Button></Link>
          </div>
        </div>
      </header>

      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative">
          <motion.div {...fadeIn} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              Smart Expense Tracking for
              <span className="text-primary"> Modern Living</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
              Take control of your finances with powerful analytics, budgets, and insights. Track every dollar effortlessly.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link href="/auth/register"><Button size="lg" className="gap-2">Get Started Free <ArrowRight className="h-4 w-4" /></Button></Link>
              <Link href="#features"><Button variant="outline" size="lg">Learn More</Button></Link>
            </div>
            <div className="mt-16 relative">
              <div className="rounded-2xl border bg-card shadow-2xl p-2">
                <div className="rounded-xl bg-muted h-[400px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center space-y-4">
                    <BarChart3 className="h-16 w-16 mx-auto opacity-40" />
                    <p>Dashboard Preview</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="py-20 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeIn} className="text-center mb-16">
            <h2 className="text-3xl font-bold">Everything you need to manage money</h2>
            <p className="mt-4 text-muted-foreground">Powerful features to help you track, budget, and save.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: PieChart, title: 'Smart Analytics', desc: 'Visual insights into your spending patterns with beautiful charts and graphs.' },
              { icon: Wallet, title: 'Expense Tracking', desc: 'Log expenses instantly with categories, tags, and payment methods.' },
              { icon: BarChart3, title: 'Budget Management', desc: 'Set monthly budgets per category and track your progress in real-time.' },
              { icon: Shield, title: 'Secure & Private', desc: 'Your data is encrypted and protected with enterprise-grade security.' },
              { icon: Cloud, title: 'Cloud Sync', desc: 'Access your data anywhere, anytime with automatic cloud synchronization.' },
              { icon: Zap, title: 'Lightning Fast', desc: 'Blazing fast performance with instant search and real-time updates.' },
            ].map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="rounded-xl border bg-card p-6 hover:shadow-md transition-shadow">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 border-t bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeIn} className="text-center mb-16">
            <h2 className="text-3xl font-bold">Simple, transparent pricing</h2>
            <p className="mt-4 text-muted-foreground">Start for free, upgrade when you need more.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: 'Free', price: '$0', features: ['Up to 50 transactions/month', 'Basic analytics', '3 categories', '1 budget'], popular: false },
              { name: 'Pro', price: '$9', features: ['Unlimited transactions', 'Advanced analytics', 'Unlimited categories', 'Unlimited budgets', 'Export reports', 'Priority support'], popular: true },
              { name: 'Team', price: '$29', features: ['Everything in Pro', 'Team collaboration', 'Multi-currency', 'API access', 'Custom reports', 'Dedicated support'], popular: false },
            ].map((plan, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`rounded-xl border p-6 ${plan.popular ? 'border-primary bg-card shadow-lg relative' : 'bg-card'}`}>
                {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">Most Popular</span>}
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="mt-4 text-3xl font-bold">{plan.price}<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-emerald-500" /> {f}</li>
                  ))}
                </ul>
                <Link href="/auth/register" className="block mt-8">
                  <Button variant={plan.popular ? 'default' : 'outline'} className="w-full">{plan.popular ? 'Start Free Trial' : 'Get Started'}</Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 border-t">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeIn} className="text-center mb-12">
            <h2 className="text-3xl font-bold">Frequently asked questions</h2>
          </motion.div>
          <div className="space-y-3">
            {[
              { q: 'Is my data secure?', a: 'Yes, we use industry-standard encryption and security practices to protect your data.' },
              { q: 'Can I export my data?', a: 'Absolutely! You can export your data to CSV format at any time.' },
              { q: 'Is there a free plan?', a: 'Yes, we offer a generous free plan with up to 50 transactions per month.' },
              { q: 'Can I set monthly budgets?', a: 'Yes, you can set budgets per category and track your progress in real-time.' },
            ].map((faq, i) => (
              <div key={i} className="rounded-xl border bg-card">
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left font-medium">
                  {faq.q}
                  <ChevronDown className={`h-4 w-4 transition-transform ${faqOpen === i ? 'rotate-180' : ''}`} />
                </button>
                {faqOpen === i && <p className="px-4 pb-4 text-sm text-muted-foreground">{faq.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold">
            <Wallet className="h-5 w-5 text-primary" /> Trackr
          </div>
          <p className="text-sm text-muted-foreground"> &copy; {new Date().getFullYear()} Trackr. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
