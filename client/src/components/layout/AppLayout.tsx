/**
 * BLOCKEEPER APP LAYOUT
 * Design: Dark Navy + Neon Cyan (Dark) / Clean White + Blue (Light)
 * Persistent sidebar with top header for web dashboard
 * Supports dark/light mode toggle + notification dropdown
 */
import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, Bell, Camera, BarChart2, Settings,
  LogOut, Menu, X, ChevronRight, Wifi, Shield, Sun, Moon,
  AlertTriangle, CheckCircle, Info, Clock
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const WHITE_LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663089570646/RFGDf2S7CSskxcLJx8eG2q/blockeeper_1white_14a1b3c8.png";
const COLOR_LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663089570646/RFGDf2S7CSskxcLJx8eG2q/blockeeper_1_color_new_7811eaf0.png";

const NAV_ITEMS = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/alerts", icon: Bell, label: "Alerts", badge: 3 },
  { href: "/cameras", icon: Camera, label: "Cameras" },
  { href: "/analytics", icon: BarChart2, label: "Analytics" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

const NOTIFICATIONS = [
  {
    id: 1,
    type: "critical",
    icon: AlertTriangle,
    iconColor: "#EF4444",
    iconBg: "rgba(239,68,68,0.12)",
    title: "Loitering Detected",
    desc: "Entrance A · Score 87 · Entry Zone",
    time: "2 min ago",
    unread: true,
  },
  {
    id: 2,
    type: "warning",
    icon: AlertTriangle,
    iconColor: "#F97316",
    iconBg: "rgba(249,115,22,0.12)",
    title: "Suspicious Pose",
    desc: "Aisle 3 · Score 73 · Product Zone",
    time: "8 min ago",
    unread: true,
  },
  {
    id: 3,
    type: "critical",
    icon: AlertTriangle,
    iconColor: "#EF4444",
    iconBg: "rgba(239,68,68,0.12)",
    title: "Unauthorized Access",
    desc: "Storage Room · Score 91 · Restricted",
    time: "15 min ago",
    unread: true,
  },
  {
    id: 4,
    type: "info",
    icon: Info,
    iconColor: "#3B82F6",
    iconBg: "rgba(59,130,246,0.12)",
    title: "Camera Back Office went offline",
    desc: "Connection lost · Check device",
    time: "32 min ago",
    unread: false,
  },
  {
    id: 5,
    type: "success",
    icon: CheckCircle,
    iconColor: "#10B981",
    iconBg: "rgba(16,185,129,0.12)",
    title: "Alert ALT-003 Resolved",
    desc: "Marked resolved by Operator AA",
    time: "1 hr ago",
    unread: false,
  },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const notifRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const unreadCount = notifications.filter(n => n.unread).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifOpen]);

  const markAllRead = () => setNotifications(ns => ns.map(n => ({ ...n, unread: false })));
  const markRead = (id: number) => setNotifications(ns => ns.map(n => n.id === id ? { ...n, unread: false } : n));

  // Theme-aware color tokens
  const bg            = isDark ? "#0A0F1E" : "#F0F4FA";
  const sidebarBg     = isDark ? "#0A0D1A" : "#FFFFFF";
  const headerBg      = isDark ? "#0A0D1A" : "#FFFFFF";
  const borderColor   = isDark ? "rgba(0,212,255,0.1)" : "rgba(0,100,200,0.12)";
  const textPrimary   = isDark ? "#F1F5F9" : "#0F172A";
  const textMuted     = isDark ? "#94A3B8" : "#64748B";
  const accent        = isDark ? "#00D4FF" : "#3B82F6";
  const accentBg      = isDark ? "rgba(0,212,255,0.05)" : "rgba(59,130,246,0.06)";
  const activeItemBg  = isDark ? "rgba(0,212,255,0.1)" : "rgba(59,130,246,0.1)";
  const hoverItemBg   = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
  const dropdownBg    = isDark ? "#0D1526" : "#FFFFFF";
  const dropdownBorder = isDark ? "rgba(0,212,255,0.15)" : "rgba(0,100,200,0.15)";
  const hoverRowBg    = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: bg }}>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{
          width: "240px",
          background: sidebarBg,
          borderRight: `1px solid ${borderColor}`,
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5" style={{ borderBottom: `1px solid ${borderColor}` }}>
          <img
            src={isDark ? WHITE_LOGO : COLOR_LOGO}
            alt="BlocKeeper"
            style={{ height: "32px", objectFit: "contain" }}
          />
          <button
            className="lg:hidden p-1 rounded"
            style={{ color: textMuted }}
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* System Status */}
        <div className="mx-3 mt-3 mb-1 px-3 py-2 rounded-lg flex items-center gap-2" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
          <div className="relative flex items-center justify-center">
            <div className="w-2 h-2 rounded-full" style={{ background: "#10B981" }} />
            <div className="absolute w-2 h-2 rounded-full animate-bk-ping" style={{ background: "#10B981" }} />
          </div>
          <span style={{ fontSize: "0.75rem", color: "#10B981", fontWeight: 500 }}>All Systems Online</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto bk-scrollbar">
          {NAV_ITEMS.map(({ href, icon: Icon, label, badge }) => {
            const isActive = location === href || (href !== "/" && location.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer"
                style={{
                  background: isActive ? activeItemBg : "transparent",
                  color: isActive ? accent : textMuted,
                  border: isActive ? `1px solid ${isDark ? "rgba(0,212,255,0.15)" : "rgba(59,130,246,0.2)"}` : "1px solid transparent",
                  textDecoration: "none",
                  display: "flex",
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = hoverItemBg; }}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={18} />
                <span className="flex-1">{label}</span>
                {badge && (
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(239,68,68,0.2)", color: "#EF4444", fontSize: "0.65rem" }}>
                    {badge}
                  </span>
                )}
                {isActive && <ChevronRight size={14} style={{ color: accent }} />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 pb-4 space-y-1" style={{ borderTop: `1px solid ${borderColor}`, paddingTop: "0.75rem" }}>
          <div className="px-3 py-2 rounded-lg mb-2" style={{ background: accentBg }}>
            <div className="flex items-center gap-2 mb-1">
              <Wifi size={12} style={{ color: accent }} />
              <span style={{ fontSize: "0.7rem", color: textMuted }}>Edge Device</span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: "0.7rem", color: textPrimary, fontFamily: "monospace" }}>RPi-5-001</span>
              <span style={{ fontSize: "0.65rem", color: "#10B981" }}>● Online</span>
            </div>
          </div>
          <button
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full transition-all"
            style={{ color: "#EF4444" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.08)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" style={{ background: "rgba(0,0,0,0.6)" }} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header
          className="flex items-center justify-between px-4 lg:px-6 py-3 flex-shrink-0"
          style={{ borderBottom: `1px solid ${borderColor}`, background: headerBg }}
        >
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg"
              style={{ color: textMuted, background: accentBg }}
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={18} />
            </button>
            <div>
              <h1 className="font-semibold" style={{ fontSize: "0.95rem", color: textPrimary }}>
                {NAV_ITEMS.find(n => n.href === location || (n.href !== "/" && location.startsWith(n.href)))?.label || "Dashboard"}
              </h1>
              <p style={{ fontSize: "0.7rem", color: textMuted }}>Real-time AI security monitoring</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-all"
              style={{ background: accentBg, border: `1px solid ${borderColor}`, color: accent }}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Notification Bell + Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(o => !o)}
                className="relative p-2 rounded-lg transition-all"
                style={{
                  background: notifOpen ? (isDark ? "rgba(0,212,255,0.12)" : "rgba(59,130,246,0.1)") : accentBg,
                  border: `1px solid ${notifOpen ? accent : borderColor}`,
                  color: notifOpen ? accent : textMuted,
                }}
                title="Notifications"
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full flex items-center justify-center font-bold"
                    style={{ background: "#EF4444", color: "#fff", fontSize: "0.55rem", padding: "0 3px" }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown Panel */}
              {notifOpen && (
                <div
                  className="absolute right-0 mt-2 rounded-xl overflow-hidden"
                  style={{
                    width: "340px",
                    background: dropdownBg,
                    border: `1px solid ${dropdownBorder}`,
                    boxShadow: isDark
                      ? "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,212,255,0.05)"
                      : "0 20px 60px rgba(0,0,0,0.15)",
                    zIndex: 100,
                  }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${dropdownBorder}` }}>
                    <div className="flex items-center gap-2">
                      <Bell size={15} style={{ color: accent }} />
                      <span className="font-semibold text-sm" style={{ color: textPrimary }}>Notifications</span>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444" }}>
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-xs font-medium transition-all"
                        style={{ color: accent }}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* Notification List */}
                  <div style={{ maxHeight: "360px", overflowY: "auto" }} className="bk-scrollbar">
                    {notifications.map(n => {
                      const Icon = n.icon;
                      return (
                        <div
                          key={n.id}
                          onClick={() => markRead(n.id)}
                          className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-all"
                          style={{
                            background: n.unread ? (isDark ? "rgba(0,212,255,0.04)" : "rgba(59,130,246,0.04)") : "transparent",
                            borderBottom: `1px solid ${dropdownBorder}`,
                          }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = hoverRowBg; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = n.unread ? (isDark ? "rgba(0,212,255,0.04)" : "rgba(59,130,246,0.04)") : "transparent"; }}
                        >
                          {/* Icon */}
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: n.iconBg }}>
                            <Icon size={15} style={{ color: n.iconColor }} />
                          </div>
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-sm font-medium leading-tight" style={{ color: textPrimary }}>{n.title}</span>
                              {n.unread && <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: accent }} />}
                            </div>
                            <p className="text-xs mt-0.5 leading-snug" style={{ color: textMuted }}>{n.desc}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <Clock size={10} style={{ color: textMuted }} />
                              <span style={{ color: textMuted, fontSize: "0.68rem" }}>{n.time}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-2.5" style={{ borderTop: `1px solid ${dropdownBorder}` }}>
                    <Link
                      href="/alerts"
                      onClick={() => setNotifOpen(false)}
                      className="flex items-center justify-center gap-1.5 text-xs font-medium w-full py-1.5 rounded-lg transition-all"
                      style={{ color: accent, textDecoration: "none", background: isDark ? "rgba(0,212,255,0.06)" : "rgba(59,130,246,0.06)" }}
                    >
                      View all alerts <ChevronRight size={12} />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Shield Status */}
            <div
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ background: accentBg, border: `1px solid ${borderColor}` }}
            >
              <Shield size={14} style={{ color: accent }} />
              <span style={{ fontSize: "0.75rem", color: accent, fontWeight: 500 }}>Protected</span>
            </div>

            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
              style={{ background: "linear-gradient(135deg, #00D4FF, #3B82F6)", color: "#0A0F1E", fontSize: "0.75rem" }}
            >
              AA
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bk-scrollbar" style={{ background: bg }}>
          {children}
        </main>
      </div>
    </div>
  );
}
