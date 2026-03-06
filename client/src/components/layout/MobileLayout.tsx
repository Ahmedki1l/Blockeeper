/**
 * BLOCKEEPER MOBILE LAYOUT
 * Design: Dark Navy + Neon Cyan (Dark) / Clean White + Blue (Light)
 * Bottom tab navigation, status bar, safe area, theme toggle
 * Notification dropdown on bell icon click
 */
import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, Bell, Camera, BarChart2, Settings,
  Sun, Moon, AlertTriangle, CheckCircle, Info, Clock, X, ChevronRight
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const WHITE_LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663089570646/RFGDf2S7CSskxcLJx8eG2q/blockeeper_1white_14a1b3c8.png";
const COLOR_LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663089570646/RFGDf2S7CSskxcLJx8eG2q/blockeeper_1_color_new_7811eaf0.png";

const TABS = [
  { href: "/mobile", icon: LayoutDashboard, label: "Home" },
  { href: "/mobile/alerts", icon: Bell, label: "Alerts", badge: 3 },
  { href: "/mobile/cameras", icon: Camera, label: "Cameras" },
  { href: "/mobile/analytics", icon: BarChart2, label: "Analytics" },
  { href: "/mobile/settings", icon: Settings, label: "Settings" },
];

const NOTIFICATIONS = [
  {
    id: 1,
    icon: AlertTriangle,
    iconColor: "#EF4444",
    iconBg: "rgba(239,68,68,0.12)",
    title: "Loitering Detected",
    desc: "Entrance A · Score 87",
    time: "2 min ago",
    unread: true,
  },
  {
    id: 2,
    icon: AlertTriangle,
    iconColor: "#F97316",
    iconBg: "rgba(249,115,22,0.12)",
    title: "Suspicious Pose",
    desc: "Aisle 3 · Score 73",
    time: "8 min ago",
    unread: true,
  },
  {
    id: 3,
    icon: AlertTriangle,
    iconColor: "#EF4444",
    iconBg: "rgba(239,68,68,0.12)",
    title: "Unauthorized Access",
    desc: "Storage Room · Score 91",
    time: "15 min ago",
    unread: true,
  },
  {
    id: 4,
    icon: Info,
    iconColor: "#3B82F6",
    iconBg: "rgba(59,130,246,0.12)",
    title: "Camera Back Office offline",
    desc: "Connection lost",
    time: "32 min ago",
    unread: false,
  },
  {
    id: 5,
    icon: CheckCircle,
    iconColor: "#10B981",
    iconBg: "rgba(16,185,129,0.12)",
    title: "Alert ALT-003 Resolved",
    desc: "Marked resolved by Operator AA",
    time: "1 hr ago",
    unread: false,
  },
];

interface MobileLayoutProps {
  children: React.ReactNode;
  title?: string;
  showHeader?: boolean;
}

export default function MobileLayout({ children, title, showHeader = true }: MobileLayoutProps) {
  const [location] = useLocation();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const notifRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const unreadCount = notifications.filter(n => n.unread).length;

  // Close dropdown on outside click
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

  const bg          = isDark ? "#0A0F1E" : "#F1F5F9";
  const headerBg    = isDark ? "#0A0D1A" : "#FFFFFF";
  const accent      = isDark ? "#00D4FF" : "#3B82F6";
  const textPrimary = isDark ? "#F1F5F9" : "#0F172A";
  const textMuted   = isDark ? "#94A3B8" : "#64748B";
  const border      = isDark ? "rgba(0,212,255,0.1)" : "rgba(0,100,200,0.1)";
  const dropdownBg  = isDark ? "#0D1526" : "#FFFFFF";
  const dropdownBorder = isDark ? "rgba(0,212,255,0.15)" : "rgba(0,100,200,0.15)";
  const hoverRowBg  = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";

  return (
    <div className="flex flex-col" style={{ minHeight: "100vh", background: bg, maxWidth: "430px", margin: "0 auto", position: "relative" }}>
      {/* Status Bar Simulation */}
      <div className="flex items-center justify-between px-5 pt-3 pb-1 flex-shrink-0" style={{ background: headerBg }}>
        <span style={{ color: textPrimary, fontSize: "0.75rem", fontWeight: 600, fontFamily: "monospace" }}>10:23</span>
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5 items-end">
            {[3, 4, 5, 6].map(h => <div key={h} className="w-1 rounded-sm" style={{ height: `${h}px`, background: textPrimary }} />)}
          </div>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <path d="M8 2.5C9.8 2.5 11.4 3.2 12.6 4.4L14 3C12.4 1.4 10.3 0.5 8 0.5C5.7 0.5 3.6 1.4 2 3L3.4 4.4C4.6 3.2 6.2 2.5 8 2.5Z" fill={textPrimary}/>
            <path d="M8 5.5C9.1 5.5 10.1 5.9 10.8 6.7L12.2 5.3C11.1 4.2 9.6 3.5 8 3.5C6.4 3.5 4.9 4.2 3.8 5.3L5.2 6.7C5.9 5.9 6.9 5.5 8 5.5Z" fill={textPrimary}/>
            <circle cx="8" cy="10" r="1.5" fill={textPrimary}/>
          </svg>
          <div className="flex items-center gap-0.5">
            <div className="rounded-sm" style={{ width: "22px", height: "11px", border: `1px solid ${textMuted}`, padding: "1px" }}>
              <div className="h-full rounded-sm" style={{ width: "75%", background: "#10B981" }} />
            </div>
          </div>
        </div>
      </div>

      {/* App Header */}
      {showHeader && (
        <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ background: headerBg, borderBottom: `1px solid ${border}` }}>
          <img src={isDark ? WHITE_LOGO : COLOR_LOGO} alt="BlocKeeper" style={{ height: "24px", objectFit: "contain" }} />
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button onClick={toggleTheme} className="w-8 h-8 rounded-full flex items-center justify-center transition-all" style={{ background: `${accent}15`, border: `1px solid ${accent}30`, color: accent }}>
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(o => !o)}
                className="relative w-8 h-8 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: notifOpen ? `${accent}20` : `${accent}10`,
                  border: `1px solid ${notifOpen ? accent : border}`,
                  color: notifOpen ? accent : textMuted,
                }}
              >
                <Bell size={15} />
                {unreadCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 min-w-[14px] h-3.5 rounded-full flex items-center justify-center font-bold"
                    style={{ background: "#EF4444", color: "#fff", fontSize: "0.5rem", padding: "0 2px" }}
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
                    width: "300px",
                    background: dropdownBg,
                    border: `1px solid ${dropdownBorder}`,
                    boxShadow: isDark
                      ? "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,212,255,0.05)"
                      : "0 20px 60px rgba(0,0,0,0.15)",
                    zIndex: 200,
                  }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-3 py-2.5" style={{ borderBottom: `1px solid ${dropdownBorder}` }}>
                    <div className="flex items-center gap-2">
                      <Bell size={13} style={{ color: accent }} />
                      <span className="font-semibold text-sm" style={{ color: textPrimary }}>Notifications</span>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444", fontSize: "0.6rem" }}>
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-xs font-medium" style={{ color: accent }}>
                          Mark all read
                        </button>
                      )}
                      <button onClick={() => setNotifOpen(false)} style={{ color: textMuted }}>
                        <X size={14} />
                      </button>
                    </div>
                  </div>

                  {/* List */}
                  <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                    {notifications.map(n => {
                      const Icon = n.icon;
                      return (
                        <div
                          key={n.id}
                          onClick={() => markRead(n.id)}
                          className="flex items-start gap-2.5 px-3 py-2.5 cursor-pointer transition-all"
                          style={{
                            background: n.unread ? (isDark ? "rgba(0,212,255,0.04)" : "rgba(59,130,246,0.04)") : "transparent",
                            borderBottom: `1px solid ${dropdownBorder}`,
                          }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = hoverRowBg; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = n.unread ? (isDark ? "rgba(0,212,255,0.04)" : "rgba(59,130,246,0.04)") : "transparent"; }}
                        >
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: n.iconBg }}>
                            <Icon size={13} style={{ color: n.iconColor }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1">
                              <span className="text-xs font-medium leading-tight" style={{ color: textPrimary }}>{n.title}</span>
                              {n.unread && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1" style={{ background: accent }} />}
                            </div>
                            <p className="text-xs mt-0.5" style={{ color: textMuted, fontSize: "0.68rem" }}>{n.desc}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Clock size={9} style={{ color: textMuted }} />
                              <span style={{ color: textMuted, fontSize: "0.62rem" }}>{n.time}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div className="px-3 py-2" style={{ borderTop: `1px solid ${dropdownBorder}` }}>
                    <Link
                      href="/mobile/alerts"
                      onClick={() => setNotifOpen(false)}
                      className="flex items-center justify-center gap-1 text-xs font-medium w-full py-1.5 rounded-lg"
                      style={{ color: accent, textDecoration: "none", background: isDark ? "rgba(0,212,255,0.06)" : "rgba(59,130,246,0.06)" }}
                    >
                      View all alerts <ChevronRight size={11} />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs" style={{ background: `linear-gradient(135deg, ${accent}, #3B82F6)`, color: isDark ? "#0A0F1E" : "#FFFFFF" }}>AA</div>
          </div>
        </div>
      )}

      {/* Page Title */}
      {title && (
        <div className="px-4 py-3 flex-shrink-0" style={{ background: bg }}>
          <h1 className="font-bold" style={{ color: textPrimary, fontSize: "1.1rem" }}>{title}</h1>
        </div>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto" style={{ paddingBottom: "80px" }}>
        {children}
      </div>

      {/* Bottom Tab Navigation */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full flex items-center justify-around px-2 py-2" style={{ maxWidth: "430px", background: headerBg, borderTop: `1px solid ${border}`, backdropFilter: "blur(12px)" }}>
        {TABS.map(({ href, icon: Icon, label, badge }) => {
          const isActive = location === href || (href !== "/mobile" && location.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all relative"
              style={{ color: isActive ? accent : textMuted, background: isActive ? `${accent}12` : "transparent", minWidth: "52px", textDecoration: "none" }}
            >
              <div className="relative">
                <Icon size={20} />
                {badge && !isActive && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "#EF4444", color: "#fff", fontSize: "0.6rem" }}>{badge}</span>
                )}
              </div>
              <span style={{ fontSize: "0.62rem", fontWeight: isActive ? 600 : 400 }}>{label}</span>
              {isActive && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background: accent }} />}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
