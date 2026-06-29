'use client';

import { ThemeToggle } from '@/components/common/theme-toggle';
import { Button } from '@/components/ui';
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  Cloud,
  DollarSign,
  Menu,
  PieChart,
  Shield,
  Sparkles,
  Star,
  Wallet,
  X,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

function FloatingShape({
  className,
  delay = 0,
}: {
  className: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`absolute rounded-full mix-blend-multiply dark:mix-blend-screen ${className}`}
      animate={{
        x: [0, 30, -20, 10, 0],
        y: [0, -40, 20, -10, 0],
        scale: [1, 1.1, 0.95, 1.05, 1],
      }}
      transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  );
}

function TypeWriter({ text, className }: { text: string; className?: string }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setDone(true);
      }
    }, 40);
    return () => clearInterval(timer);
  }, [text]);

  return (
    <span className={className}>
      {displayed}
      {!done && (
        <span className="inline-block w-[3px] h-[1em] bg-primary ml-1 animate-pulse" />
      )}
    </span>
  );
}

function StatCounter({
  end,
  suffix = '',
  label,
}: {
  end: number;
  suffix?: string;
  label: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          let start = 0;
          const duration = 2000;
          const step = 50;
          const increment = end / (duration / step);
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, step);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
        {count.toLocaleString()}
        {suffix}
      </p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

const features = [
  {
    icon: PieChart,
    title: 'Smart Analytics',
    desc: 'Visual insights into your spending patterns with beautiful charts and graphs.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Wallet,
    title: 'Expense Tracking',
    desc: 'Log expenses instantly with categories, tags, and payment methods.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: BarChart3,
    title: 'Budget Management',
    desc: 'Set monthly budgets per category and track your progress in real-time.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    desc: 'Your data is encrypted and protected with enterprise-grade security.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: Cloud,
    title: 'Cloud Sync',
    desc: 'Access your data anywhere, anytime with automatic cloud synchronization.',
    color: 'from-sky-500 to-indigo-500',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    desc: 'Blazing fast performance with instant search and real-time updates.',
    color: 'from-yellow-500 to-amber-500',
  },
];

const pricing = [
  {
    name: 'Free',
    price: '$0',
    desc: 'Perfect for getting started',
    features: [
      'Up to 50 transactions/mo',
      'Basic analytics',
      '3 categories',
      '1 budget',
    ],
    popular: false,
  },
  {
    name: 'Pro',
    price: '$9',
    desc: 'Best for power users',
    features: [
      'Unlimited transactions',
      'Advanced analytics',
      'Unlimited categories',
      'Unlimited budgets',
      'Export reports',
      'Priority support',
    ],
    popular: true,
  },
  {
    name: 'Team',
    price: '$29',
    desc: 'For teams & businesses',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Multi-currency',
      'API access',
      'Custom reports',
      'Dedicated support',
    ],
    popular: false,
  },
];

const faqs = [
  {
    q: 'Is my data secure?',
    a: 'Yes, we use industry-standard encryption (AES-256) and security practices to protect your data. All connections are HTTPS.',
  },
  {
    q: 'Can I export my data?',
    a: 'Absolutely! You can export your transactions to CSV format at any time from the Reports page.',
  },
  {
    q: 'Is there a free plan?',
    a: 'Yes, we offer a generous free plan with up to 50 transactions per month — no credit card required.',
  },
  {
    q: 'Can I set monthly budgets?',
    a: 'Yes, you can set budgets per category for any month and year. Track your progress in real-time with visual indicators.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'Yes, we offer a 30-day money-back guarantee on all paid plans. No questions asked.',
  },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Freelancer',
    content:
      'Trackr completely changed how I manage my finances. The budget tracking is a game-changer.',
    rating: 5,
  },
  {
    name: 'James Wilson',
    role: 'Small Business Owner',
    content:
      "Finally, an expense tracker that doesn't feel like a chore. The analytics are incredibly insightful.",
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Product Manager',
    content:
      "I've tried dozens of finance apps. Trackr is the only one that stuck. Beautiful and functional.",
    rating: 5,
  },
];

export default function LandingPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIdx((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 inset-x-0 z-50 border-b bg-background/70 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Wallet className="h-4 w-4 text-primary-foreground" />
            </div>
            Trackr
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            {['Features', 'Pricing', 'FAQ'].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/auth/login" className="hidden sm:block">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/auth/register">
              <Button className="hidden sm:inline-flex">Get Started</Button>
            </Link>
            <button
              onClick={() => setMobileMenu(true)}
              className="sm:hidden p-2"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-0 z-[60] bg-background flex flex-col p-6"
          >
            <div className="flex justify-end">
              <button onClick={() => setMobileMenu(false)} className="p-2">
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-4 mt-8 text-lg font-medium">
              <Link href="#features" onClick={() => setMobileMenu(false)}>
                Features
              </Link>
              <Link href="#pricing" onClick={() => setMobileMenu(false)}>
                Pricing
              </Link>
              <Link href="#faq" onClick={() => setMobileMenu(false)}>
                FAQ
              </Link>
              <hr className="my-4" />
              <Link href="/auth/login" onClick={() => setMobileMenu(false)}>
                <Button variant="outline" className="w-full">
                  Log in
                </Button>
              </Link>
              <Link href="/auth/register" onClick={() => setMobileMenu(false)}>
                <Button className="w-full">Get Started</Button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-primary/3 to-background" />
        <FloatingShape
          className="hidden sm:block w-64 h-64 md:w-72 md:h-72 bg-primary/10 dark:bg-primary/5 blur-3xl top-20 left-10"
          delay={0}
        />
        <FloatingShape
          className="hidden md:block w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 blur-3xl top-40 right-20"
          delay={2}
        />
        <FloatingShape
          className="hidden sm:block w-64 h-64 bg-purple-500/10 dark:bg-purple-500/5 blur-3xl bottom-20 left-1/3"
          delay={4}
        />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-7xl mx-auto px-4 sm:px-6 w-full pt-28 sm:pt-24 pb-16"
        >
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border bg-muted/50 text-xs font-medium mb-6">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span>Smart expense tracking reimagined</span>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-[2rem] sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
              >
                <span className="hidden sm:inline">
                  <TypeWriter text="Take Control of Your" />
                </span>
                <span className="sm:hidden">Take Control of Your</span>
                <br />
                <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Financial Future
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-6 text-base sm:text-lg text-muted-foreground max-w-lg leading-relaxed mx-auto lg:mx-0"
              >
                Track every dollar, set smart budgets, and unlock powerful
                insights. The modern way to manage your money.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3"
              >
                <Link href="/auth/register" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="gap-2 group relative overflow-hidden w-full sm:w-auto"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Get Started Free
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                    <motion.div className="absolute inset-0 bg-gradient-to-r from-primary via-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </Link>
                <Link href="#features" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    See how it works
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="mt-12 flex items-center gap-6 text-sm text-muted-foreground"
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-background bg-gradient-to-br from-primary/30 to-primary/10"
                    />
                  ))}
                </div>
                <p>
                  <span className="font-semibold text-foreground">2,000+</span>{' '}
                  users trust Trackr
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative hidden lg:block"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="rounded-2xl border bg-card/80 backdrop-blur-sm shadow-2xl p-3"
              >
                <div className="rounded-xl bg-gradient-to-br from-muted to-muted/50 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500" />
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                    </div>
                    <div className="flex gap-1">
                      <div className="h-6 w-16 rounded-md bg-primary/20" />
                      <div className="h-6 w-16 rounded-md bg-muted" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[35000, 12000, 23000].map((v, i) => (
                      <div key={i} className="rounded-lg bg-background/50 p-3">
                        <div className="h-2 w-12 rounded bg-muted mb-2" />
                        <div className="h-5 w-16 rounded bg-gradient-to-r from-primary/40 to-primary/20" />
                      </div>
                    ))}
                  </div>
                  <div className="h-32 rounded-lg bg-background/50 p-3">
                    <div className="flex items-end gap-2 h-full">
                      {[40, 65, 45, 80, 55, 90, 70, 50, 75, 60, 85, 95].map(
                        (h, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                            className="flex-1 rounded-t bg-gradient-to-t from-primary to-blue-500 opacity-60 hover:opacity-100 transition-opacity"
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="absolute -bottom-4 -left-4 rounded-xl border bg-card p-4 shadow-lg"
              >
                <p className="text-xs text-muted-foreground">Monthly Savings</p>
                <p className="text-lg font-bold text-emerald-500">+$1,240</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="absolute -top-4 -right-4 rounded-xl border bg-card p-4 shadow-lg"
              >
                <p className="text-xs text-muted-foreground">Budget Left</p>
                <p className="text-lg font-bold text-primary">$3,200</p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </motion.div>
      </section>

      <section className="py-16 sm:py-20 border-y bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCounter end={10000} suffix="+" label="Transactions tracked" />
            <StatCounter end={2000} suffix="+" label="Active users" />
            <StatCounter end={50} suffix="+" label="Countries" />
            <StatCounter end={99.9} suffix="%" label="Uptime" />
          </div>
        </div>
      </section>

      <section id="features" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border bg-muted/50 text-xs font-medium mb-4">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Everything you need to manage money
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Powerful features designed to help you track, budget, and save —
              all in one place.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="group relative rounded-2xl border bg-card p-6 hover:shadow-xl transition-all duration-300"
              >
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />
                <div
                  className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.color} p-2.5 mb-4`}
                >
                  <feature.icon className="h-full w-full text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="pricing"
        className="py-16 sm:py-24 border-t bg-gradient-to-b from-muted/50 to-background"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border bg-muted/50 text-xs font-medium mb-4">
              <DollarSign className="h-3.5 w-3.5 text-primary" />
              <span>Pricing</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-muted-foreground">
              Start for free. Upgrade when you need more.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricing.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -4 }}
                className={`relative rounded-2xl border p-8 ${plan.popular ? 'border-primary shadow-xl shadow-primary/10' : 'bg-card'}`}
              >
                {plan.popular && (
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full"
                  >
                    Most Popular
                  </motion.div>
                )}
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {plan.desc}
                </p>
                <div className="mt-6">
                  <span className="text-3xl sm:text-4xl font-bold">
                    {plan.price}
                  </span>
                  <span className="text-xs sm:text-sm text-muted-foreground ml-1">
                    /month
                  </span>
                </div>
                <ul className="mt-8 space-y-3">
                  {plan.features.map((f, j) => (
                    <motion.li
                      key={j}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 + j * 0.05 }}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-emerald-500" />
                      </div>
                      {f}
                    </motion.li>
                  ))}
                </ul>
                <Link href="/auth/register" className="block mt-8">
                  <Button
                    variant={plan.popular ? 'default' : 'outline'}
                    className="w-full group"
                  >
                    {plan.popular ? 'Start Free Trial' : 'Get Started'}
                    <ArrowRight className="h-4 w-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 border-t">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border bg-muted/50 text-xs font-medium mb-4">
              <Star className="h-3.5 w-3.5 text-primary" />
              <span>Testimonials</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Loved by users</h2>
          </motion.div>

          <div className="relative min-h-[200px] sm:h-48">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIdx}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <div className="rounded-2xl border bg-card p-6 sm:p-8 text-center max-w-xl mx-auto">
                  <div className="flex justify-center gap-1 mb-4">
                    {Array.from({
                      length: testimonials[testimonialIdx].rating,
                    }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-500 text-yellow-500"
                      />
                    ))}
                  </div>
                  <p className="text-lg italic text-muted-foreground">
                    &ldquo;{testimonials[testimonialIdx].content}&rdquo;
                  </p>
                  <div className="mt-6">
                    <p className="font-semibold">
                      {testimonials[testimonialIdx].name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonials[testimonialIdx].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-2 mt-4">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setTestimonialIdx(i)}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${i === testimonialIdx ? 'bg-primary w-6' : 'bg-muted-foreground/30'}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-16 sm:py-24 border-t bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Frequently asked questions
            </h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border bg-card overflow-hidden"
              >
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left font-medium hover:bg-muted/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <motion.div
                    animate={{ rotate: faqOpen === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {faqOpen === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 border-t relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to take control?
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Join thousands of users who have transformed their financial
              habits.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/auth/register" className="w-full sm:w-auto">
                <Button size="lg" className="gap-2 group w-full sm:w-auto">
                  Get Started Free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/auth/login" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t py-12 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-bold">
              <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                <Wallet className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              Trackr
            </div>
            <nav className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link
                href="#features"
                className="hover:text-foreground transition-colors"
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="#faq"
                className="hover:text-foreground transition-colors"
              >
                FAQ
              </Link>
            </nav>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Trackr. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
