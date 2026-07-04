import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  FiZap,
  FiMenu,
  FiX,
  FiPlusCircle,
  FiTrash2,
  FiEdit3,
  FiMap,
  FiBarChart2,
  FiBell,
  FiUsers,
  FiArrowRight,
  FiStar,
  FiShield,
  FiWifi,
  FiClock,
} from "react-icons/fi";

function CurrentDivider({ className = "" }) {
  return (
    <div className={`w-full overflow-hidden leading-none ${className}`}>
      <svg viewBox="0 0 1200 32" preserveAspectRatio="none" className="w-full h-4">
        <line x1="0" y1="16" x2="1200" y2="16" stroke="#1E2A45" strokeWidth="2" />
        <motion.line
          x1="0"
          y1="16"
          x2="1200"
          y2="16"
          stroke="#4A8BFF"
          strokeWidth="2"
          strokeDasharray="1 1199"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: [-1200, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
        />
        {[0, 0.33, 0.66].map((delay, i) => (
          <motion.circle
            key={i}
            cy="16"
            r="4"
            fill="#F5B342"
            initial={{ cx: -20 }}
            animate={{ cx: 1220 }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "linear", delay: delay * 3.5 }}
          />
        ))}
      </svg>
    </div>
  );
}

function useCountUp(target, inView, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = null;
    let raf;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);
  return value;
}

function StatCounter({ label, target, suffix = "", dark = false }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const value = useCountUp(target, inView);
  return (
    <div ref={ref} className="text-center">
      <p
        className="font-mono text-2xl sm:text-3xl md:text-4xl font-semibold"
        style={{ color: dark ? "#F5B342" : "#1A6BFF" }}
      >
        {value}
        {suffix}
      </p>
      <p
        className="mt-1 text-xs sm:text-sm"
        style={{ color: dark ? "rgba(255,255,255,0.72)" : "#45526E" }}
      >
        {label}
      </p>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, accent, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      whileHover={{ y: -8, borderColor: accent, boxShadow: `0 20px 40px -20px ${accent}40` }}
      className="group relative rounded-2xl border border-[#E3E9F4] bg-white p-5 sm:p-6 md:p-7 shadow-sm transition-all duration-300"
    >
      <div
        className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
        style={{ backgroundColor: `${accent}18`, color: accent }}
      >
        <Icon size={22} />
      </div>
      <h3 className="font-display text-lg font-semibold mb-2" style={{ color: "#0A1A2F" }}>
        {title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: "#45526E" }}>
        {desc}
      </p>
    </motion.div>
  );
}

function TestimonialCard({ quote, name, role, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="rounded-2xl border border-[#E3E9F4] bg-white p-5 sm:p-6 md:p-7 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex gap-1 text-[#F5B342] mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <FiStar key={i} size={14} fill="#F5B342" />
        ))}
      </div>
      <p className="text-sm leading-relaxed mb-6" style={{ color: "#28324A" }}>
        &ldquo;{quote}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1A6BFF] to-[#10B981] flex items-center justify-center text-white text-xs font-semibold shadow-sm shrink-0">
          {name.split(" ").map((n) => n[0]).join("")}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate" style={{ color: "#0A1A2F" }}>
            {name}
          </p>
          <p className="text-xs truncate" style={{ color: "#45526E" }}>
            {role}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function ChargingLoader({ onDone }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const duration = 1000;
    let raf;
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      setPct(Math.floor(p * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(onDone, 300);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#F4F7FC]"
    >
      <div className="relative w-16 h-24 rounded-xl border-2 border-[#1A6BFF]/30 overflow-hidden bg-white shadow-inner">
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-6 h-1.5 rounded-t-sm bg-[#1A6BFF]/50" />
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1A6BFF] via-[#4A8BFF] to-[#F5B342]"
          style={{ height: `${pct}%` }}
        />
      </div>
      <p className="mt-5 font-mono text-sm tracking-widest" style={{ color: "#1A6BFF" }}>
        CHARGING {pct}%
      </p>
    </motion.div>
  );
}

const NAVBAR_HEIGHT_CLASS = "h-16 sm:h-[72px]";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["Home", "Features", "Testimonials", "Contact"];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${NAVBAR_HEIGHT_CLASS} flex items-center ${scrolled ? "bg-white/95 backdrop-blur-md border-b border-slate-200/60 shadow-sm" : "bg-[#F4F7FC]/50 backdrop-blur-sm"
        }`}
    >
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 sm:px-10 lg:px-12">
        <Link to="/" className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: -10, scale: 1.05 }}
            className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-teal-50 border border-teal-100 shadow-sm shrink-0"
          >
            <FiZap className="text-teal-500" size={18} />
          </motion.div>
          <span className="text-xl font-black text-slate-800 tracking-tight" style={{ fontFamily: "Space Grotesk" }}>
            VoltGrid
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
              className="group relative text-sm font-bold text-slate-500 transition-colors hover:text-teal-500"
            >
              {link}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-teal-500 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-bold text-slate-600 transition-colors px-4 py-2 hover:bg-slate-100 rounded-lg"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-300 hover:bg-teal-600 hover:shadow-lg hover:-translate-y-0.5"
          >
            Get Started
          </Link>
        </div>

        <button
          className="md:hidden text-slate-800 transition-colors hover:text-teal-500"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((s) => !s)}
        >
          {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden border-t border-[#E3E9F4] bg-white/98 backdrop-blur-md absolute top-full left-0 right-0 shadow-lg"
          >
            <div className="flex flex-col gap-4 px-6 py-6">
              {links.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium"
                  style={{ color: "#28324A" }}
                >
                  {link}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg border border-[#E3E9F4] py-2.5 text-sm font-medium hover:bg-[#F4F7FC] text-center"
                  style={{ color: "#0A1A2F" }}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg bg-gradient-to-r from-[#1A6BFF] to-[#4A8BFF] py-2.5 text-sm font-semibold text-white shadow-md text-center"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(true);

  const features = [
    {
      icon: FiPlusCircle,
      title: "Add stations",
      desc: "Register new charging points in seconds — set location, connector type, and power rating.",
      accent: "#1A6BFF",
    },
    {
      icon: FiEdit3,
      title: "Update stations",
      desc: "Edit status, pricing, and specs in real time as your network changes.",
      accent: "#B8832E",
    },
    {
      icon: FiTrash2,
      title: "Delete stations",
      desc: "Safely remove decommissioned or incorrect entries with a confirmation step.",
      accent: "#DC2626",
    },
    {
      icon: FiMap,
      title: "Live map view",
      desc: "See every station plotted on an interactive map, updated as your team makes changes.",
      accent: "#0E9A6E",
    },
    {
      icon: FiBarChart2,
      title: "Usage analytics",
      desc: "Track sessions, energy delivered, and revenue per station with exportable reports.",
      accent: "#1A6BFF",
    },
    {
      icon: FiBell,
      title: "Live alerts",
      desc: "Get notified the moment a station goes offline, faults, or needs maintenance.",
      accent: "#DC2626",
    },
    {
      icon: FiUsers,
      title: "Team access",
      desc: "Invite managers and admins with role-based permissions across your whole fleet.",
      accent: "#B8832E",
    },
    {
      icon: FiShield,
      title: "Audit history",
      desc: "Every add, edit, and delete is logged — know exactly who changed what, and when.",
      accent: "#0E9A6E",
    },
  ];

  const testimonials = [
    {
      quote:
        "We manage 60 stations across three cities from one screen now. The live map alone saved us hours a week.",
      name: "Priya Nair",
      role: "Fleet Operations, ChargeWorks",
    },
    {
      quote:
        "Setup took an afternoon. Alerts caught a faulted connector before a single customer complained.",
      name: "Daniel Osei",
      role: "Station Manager, GridPoint",
    },
    {
      quote: "Role-based access means my field techs update status without ever touching billing.",
      name: "Mei Chen",
      role: "Network Admin, VoltWay",
    },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#F4F7FC] font-body selection:bg-[#F5B342]/40" style={{ color: "#0A1A2F" }}>
      <AnimatePresence>{loading && <ChargingLoader onDone={() => setLoading(false)} />}</AnimatePresence>

      {!loading && (
        <>
          <Navbar />
          <div className={NAVBAR_HEIGHT_CLASS} aria-hidden="true" />

          {/* HERO SECTION */}
          <section
            id="home"
            className="relative overflow-hidden px-5 sm:px-8 pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24 bg-[#F4F7FC]"
          >
            <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-40" />
            <div className="pointer-events-none absolute -top-40 right-[-10%] h-96 w-96 rounded-full blur-3xl bg-[#F5B342]/10" />
            <div className="pointer-events-none absolute -bottom-40 left-[-10%] h-96 w-96 rounded-full blur-3xl bg-[#1A6BFF]/10" />

            <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:gap-14 lg:grid-cols-2">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#E3E9F4] bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs font-medium shadow-sm"
                  style={{ color: "#0F4AC4" }}
                >
                  <FiZap size={13} className="text-[#F5B342]" /> Built for station managers
                </motion.div>

                <h1
                  className="font-display text-[2.6rem] leading-[1.1] sm:text-5xl lg:text-[3.4rem] font-bold sm:leading-[1.08] tracking-tight"
                  style={{ color: "#0A1A2F" }}
                >
                  {["Manage every", "charging station.", "Anywhere."].map((line, i) => (
                    <motion.span
                      key={line}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.15 + i * 0.12 }}
                      className={`block ${i === 1 ? "bg-gradient-to-r from-[#1A6BFF] to-[#0F4AC4] bg-clip-text text-transparent pb-3 -mb-3" : ""}`}
                    >
                      {line}
                    </motion.span>
                  ))}
                </h1>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.55 }}
                  className="mt-6 max-w-md text-base leading-relaxed"
                  style={{ color: "#45526E" }}
                >
                  Add, update, and monitor your charging network from one dashboard — with a live map view so
                  you always know what's online.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="mt-9 flex flex-col sm:flex-row gap-4"
                >
                  <Link
                    to="/register"
                    className="w-full sm:w-auto justify-center group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#1A6BFF] to-[#4A8BFF] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1A6BFF]/35 transition-all hover:shadow-xl hover:shadow-[#1A6BFF]/45 hover:scale-105 active:scale-95"
                  >
                    Get Started
                    <FiArrowRight className="transition-transform group-hover:translate-x-1" size={16} />
                  </Link>
                  <a
                    href="#about"
                    className="w-full sm:w-auto text-center rounded-lg border border-[#E3E9F4] bg-white px-6 py-3 text-sm font-semibold transition-all hover:bg-[#F4F7FC] hover:shadow-md"
                    style={{ color: "#0A1A2F" }}
                  >
                    View Live Map
                  </a>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  className="mt-12 sm:mt-14 grid max-w-md grid-cols-3 gap-4 border-t border-[#E3E9F4] pt-8"
                >
                  <StatCounter label="Stations managed" target={512} suffix="+" />
                  <StatCounter label="Cities covered" target={48} suffix="+" />
                  <StatCounter label="Uptime" target={99} suffix=".9%" />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative mx-auto w-full max-w-md lg:-mt-12"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative rounded-[22px] shadow-2xl shadow-[#1A6BFF]/25 overflow-hidden p-[2px]"
                >
                  <div className="absolute inset-0 bg-[#E3E9F4]" />
                  <motion.div
                    className="absolute left-[-50%] top-[-50%] w-[200%] h-[200%] origin-center"
                    style={{ background: 'conic-gradient(from 0deg, transparent 60%, #1A6BFF 100%)' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="relative rounded-[20px] bg-white p-6 z-10 w-full h-full">

                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs" style={{ color: "#45526E" }}>Station #A-114</p>
                        <p className="font-display font-semibold truncate" style={{ color: "#0A1A2F" }}>
                          Nashik Central Hub
                        </p>
                      </div>
                      <span className="flex items-center gap-1.5 rounded-full bg-[#10B981]/10 px-2.5 py-1 text-xs font-medium border border-[#10B981]/25 shrink-0" style={{ color: "#0E7A5A" }}>
                        <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
                        Active
                      </span>
                    </div>

                    <div className="mt-6 flex items-end gap-4">
                      <div className="relative h-32 w-14 rounded-lg border border-[#E3E9F4] overflow-hidden bg-[#F4F7FC] shadow-inner shrink-0">
                        <motion.div
                          initial={{ height: "0%" }}
                          animate={{ height: "78%" }}
                          transition={{ duration: 1.4, delay: 0.6, ease: "easeOut" }}
                          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1A6BFF] via-[#4A8BFF] to-[#F5B342]"
                        />
                      </div>
                      <div>
                        <p className="font-mono text-2xl font-semibold" style={{ color: "#0A1A2F" }}>78%</p>
                        <p className="text-xs" style={{ color: "#45526E" }}>Charged · 22 min left</p>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
                      <div className="rounded-lg bg-[#F4F7FC] p-3 border border-[#E3E9F4]">
                        <p style={{ color: "#45526E" }}>Connector</p>
                        <p className="mt-1 font-medium" style={{ color: "#0A1A2F" }}>CCS Type 2</p>
                      </div>
                      <div className="rounded-lg bg-[#F4F7FC] p-3 border border-[#E3E9F4]">
                        <p style={{ color: "#45526E" }}>Power output</p>
                        <p className="mt-1 font-medium" style={{ color: "#0A1A2F" }}>60 kW</p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-4 text-xs flex-wrap" style={{ color: "#45526E" }}>
                      <span className="flex items-center gap-1.5">
                        <FiWifi size={13} className="text-[#1A6BFF]" /> Online
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FiClock size={13} className="text-[#1A6BFF]" /> Updated 2s ago
                      </span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </section>

          <CurrentDivider />

          {/* Trusted by */}
          <section className="px-5 sm:px-8 py-10 border-b border-[#E3E9F4] bg-white">
            <div className="mx-auto max-w-7xl">
              <p className="text-center text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "#5D6B87" }}>
                Trusted by teams running EV infrastructure
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-12 gap-y-4">
                {["ChargeWorks", "GridPoint", "VoltWay", "AmpCity", "FleetVolt"].map((brand) => (
                  <span
                    key={brand}
                    className="font-display text-base sm:text-lg font-semibold opacity-70 hover:opacity-100 transition-opacity"
                    style={{ color: "#28324A" }}
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <CurrentDivider />

          {/* Features */}
          <section id="features" className="px-5 sm:px-8 py-16 sm:py-24 lg:py-28 bg-white">
            <div className="mx-auto max-w-7xl">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mx-auto mb-12 sm:mb-14 max-w-xl text-center"
              >
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#0F4AC4" }}>
                  Features
                </span>
                <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold" style={{ color: "#0A1A2F" }}>
                  Everything a station manager needs
                </h2>
                <p className="mt-3" style={{ color: "#45526E" }}>
                  Full control over your charging network, from a single point in the field to your entire
                  coverage map.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {features.map((f, i) => (
                  <FeatureCard key={f.title} index={i} {...f} />
                ))}
              </div>
            </div>
          </section>

          {/* About / Map preview */}
          <section id="about" className="px-5 sm:px-8 py-16 sm:py-24 lg:py-28 bg-[#F4F7FC]">
            <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#0F4AC4" }}>
                  Live map
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold" style={{ color: "#0A1A2F" }}>
                  See your whole network at a glance
                </h2>
                <p className="mt-4 leading-relaxed" style={{ color: "#45526E" }}>
                  Every station you manage appears on a live map — filter by status, connector type, or city, and
                  jump straight into editing details without leaving the view.
                </p>
                <Link
                  to="/register"
                  className="mt-7 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#1A6BFF] to-[#4A8BFF] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1A6BFF]/30 transition-all hover:scale-105 hover:shadow-xl active:scale-95"
                >
                  Open the map
                  <FiArrowRight size={16} />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative h-64 sm:h-72 md:h-80 rounded-2xl border border-[#E3E9F4] bg-white overflow-hidden shadow-lg"
              >
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      "linear-gradient(#E3E9F4 1px, transparent 1px), linear-gradient(90deg, #E3E9F4 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                  }}
                />
                {[
                  { top: "30%", left: "25%" },
                  { top: "55%", left: "55%" },
                  { top: "22%", left: "70%" },
                  { top: "70%", left: "35%" },
                ].map((pos, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.12, type: "spring" }}
                    className="absolute flex h-3 w-3 items-center justify-center"
                    style={pos}
                  >
                    <span className="absolute h-3 w-3 rounded-full bg-[#1A6BFF] animate-ping opacity-50" />
                    <span className="relative h-2 w-2 rounded-full bg-[#1A6BFF]" />
                  </motion.span>
                ))}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg bg-white/95 px-3 py-1.5 text-xs backdrop-blur-sm border border-[#E3E9F4] shadow-sm" style={{ color: "#28324A" }}>
                  <FiMap size={14} className="text-[#1A6BFF]" /> Live station map
                </div>
              </motion.div>
            </div>
          </section>

          {/* Stats band */}
          <section className="px-5 sm:px-8 py-14 sm:py-20 bg-[#0B1A30]">
            <div className="mx-auto max-w-7xl">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mx-auto mb-10 sm:mb-12 max-w-xl text-center"
              >
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  Powering fleets, not just dashboards
                </h2>
              </motion.div>
              <div className="grid grid-cols-2 gap-6 sm:gap-8 sm:grid-cols-4">
                <StatCounter label="Sessions logged / mo" target={38} suffix="k+" dark />
                <StatCounter label="MWh delivered / mo" target={410} suffix="+" dark />
                <StatCounter label="Avg. setup time" target={12} suffix=" min" dark />
                <StatCounter label="Support response" target={4} suffix=" min" dark />
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section id="testimonials" className="px-5 sm:px-8 py-16 sm:py-24 lg:py-28 bg-white">
            <div className="mx-auto max-w-7xl">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mx-auto mb-12 sm:mb-14 max-w-xl text-center"
              >
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#0F4AC4" }}>
                  Teams on VoltGrid
                </span>
                <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold" style={{ color: "#0A1A2F" }}>
                  Built with station managers, not just for them
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {testimonials.map((t, i) => (
                  <TestimonialCard key={t.name} index={i} {...t} />
                ))}
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="px-5 sm:px-8 pt-16 sm:pt-24 lg:pt-32 pb-10 sm:pb-16 bg-[#F4F7FC]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative mx-auto max-w-3xl overflow-hidden rounded-[1.5rem] bg-white border border-[#E3E9F4] px-6 pt-10 sm:pt-12 pb-6 text-center shadow-lg shadow-[#1A6BFF]/10 z-10"
            >
              <div
                className="pointer-events-none absolute -top-40 right-[-10%] h-[400px] w-[400px] rounded-full blur-[80px]"
                style={{ background: "radial-gradient(circle, rgba(26,107,255,0.08), transparent 70%)" }}
              />
              <div
                className="pointer-events-none absolute -bottom-40 left-[-10%] h-[300px] w-[300px] rounded-full blur-[70px]"
                style={{ background: "radial-gradient(circle, rgba(245,179,66,0.08), transparent 70%)" }}
              />
              <div className="relative z-10 flex flex-col items-center">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F4F7FC] border border-[#E3E9F4] shadow-inner">
                  <FiZap size={24} className="text-[#1A6BFF]" />
                </div>
                <h2
                  className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-black mb-4"
                  style={{ color: "black" }}
                >
                  Ready to bring your network online?
                </h2>
                <p className="max-w-lg mx-auto text-sm sm:text-base text-[#45526E] mb-6 leading-relaxed">
                  Set up your first charging station in under 15 minutes. No credit card required to start managing your fleet.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                  <Link
                    to="/register"
                    className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-[#1A6BFF] to-[#4A8BFF] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1A6BFF]/30 transition-transform duration-300 hover:scale-105"
                  >
                    Create free account
                  </Link>
                  <Link
                    to="/login"
                    className="w-full sm:w-auto rounded-xl border border-[#E3E9F4] bg-[#F4F7FC] px-6 py-3 text-sm font-semibold text-[#0A1A2F] transition-colors duration-300 hover:bg-[#E3E9F4] text-center"
                  >
                    Log in
                  </Link>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Footer */}
          <footer id="contact" className="border-t border-[#E3E9F4] bg-white px-5 sm:px-8 py-12 sm:py-14">
            <div className="mx-auto max-w-7xl">
              <div className="grid grid-cols-2 gap-8 sm:gap-10 sm:grid-cols-4">
                <div className="col-span-2 sm:col-span-1">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#1A6BFF] to-[#4A8BFF] shadow-md shrink-0">
                      <FiZap className="text-white" size={14} />
                    </div>
                    <span className="font-display text-sm font-semibold" style={{ color: "#0A1A2F" }}>
                      VoltGrid
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed max-w-[200px]" style={{ color: "#45526E" }}>
                    Charging station management, from one pin to a whole fleet.
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#5D6B87" }}>
                    Product
                  </p>
                  <ul className="space-y-2.5 text-sm" style={{ color: "#28324A" }}>
                    <li><a href="#features" className="hover:text-[#1A6BFF] transition-colors">Features</a></li>
                    <li><a href="#about" className="hover:text-[#1A6BFF] transition-colors">Live map</a></li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#5D6B87" }}>
                    Company
                  </p>
                  <ul className="space-y-2.5 text-sm" style={{ color: "#28324A" }}>
                    <li><a href="#testimonials" className="hover:text-[#1A6BFF] transition-colors">Customers</a></li>
                    <li><a href="#contact" className="hover:text-[#1A6BFF] transition-colors">Contact</a></li>
                    <li><a href="#" className="hover:text-[#1A6BFF] transition-colors">Careers</a></li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#5D6B87" }}>
                    Legal
                  </p>
                  <ul className="space-y-2.5 text-sm" style={{ color: "#28324A" }}>
                    <li><a href="#" className="hover:text-[#1A6BFF] transition-colors">Privacy</a></li>
                    <li><a href="#" className="hover:text-[#1A6BFF] transition-colors">Terms</a></li>
                  </ul>
                </div>
              </div>

              <div className="mt-10 sm:mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#E3E9F4] pt-8 sm:flex-row">
                <p className="text-xs" style={{ color: "#5D6B87" }}>
                  © {new Date().getFullYear()} VoltGrid. All rights reserved.
                </p>
                <div className="flex items-center gap-1.5 text-xs" style={{ color: "#5D6B87" }}>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  All systems operational
                </div>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}