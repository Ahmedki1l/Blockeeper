/**
 * BLOCKEEPER WEB DASHBOARD
 * Design: Dark Navy + Neon Cyan (Dark) / Clean White + Blue (Light)
 * HLD Section 6.2.1 - Alert Feed, Camera Status, Stats, Quick Actions
 */
import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  Bell, Camera, ShieldAlert, TrendingUp, TrendingDown,
  Eye, Clock, CheckCircle, XCircle, AlertTriangle, Play,
  ChevronRight, Wifi, Activity, Zap
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { CameraFeedWidget } from "@/components/CameraFeedWidget";
import { useStore } from "@/contexts/StoreContext";

const STATS_KEYS = [
  { labelKey: "dashboard.totalAlerts", value: "24", change: "+12%", up: true, icon: Bell, color: "#EF4444" },
  { labelKey: "dashboard.activeCameras", value: "8/10", changeKey: "dashboard.offline", changeSuffix: "2 ", up: false, icon: Camera, color: "#00D4FF" },
  { labelKey: "dashboard.avgAnomalyScore", value: "67.4", change: "-5.2%", up: false, icon: ShieldAlert, color: "#F59E0B" },
  { labelKey: "dashboard.incidentsResolved", value: "18", change: "+8%", up: true, icon: CheckCircle, color: "#10B981" },
];

const ALERTS = [
  { id: "ALT-001", camera: "Entrance A", score: 87, typeKey: "alert.loitering", time: "2", timeUnit: "min", status: "new", zoneKey: "cameras.entryZone", dwellTime: 42 },
  { id: "ALT-002", camera: "Aisle 3", score: 73, typeKey: "alert.suspiciousPose", time: "8", timeUnit: "min", status: "reviewing", zoneKey: "cameras.productZone", dwellTime: 28 },
  { id: "ALT-003", camera: "Storage Room", score: 91, typeKey: "alert.unauthorizedAccess", time: "15", timeUnit: "min", status: "new", zoneKey: "cameras.restricted", dwellTime: 65 },
  { id: "ALT-004", camera: "Checkout", score: 62, typeKey: "alert.dwellTime", time: "22", timeUnit: "min", status: "resolved", zoneKey: "cameras.checkoutZone", dwellTime: 90 },
  { id: "ALT-005", camera: "Parking Lot", score: 78, typeKey: "alert.loitering", time: "31", timeUnit: "min", status: "reviewing", zoneKey: "cameras.exterior", dwellTime: 55 },
  { id: "ALT-006", camera: "Entrance B", score: 55, typeKey: "alert.suspiciousPose", time: "45", timeUnit: "min", status: "resolved", zoneKey: "cameras.entryZone", dwellTime: 18 },
];

const CAMERAS = [
  { id: "CAM-01", nameKey: "Entrance A", status: "online", fps: 5, alerts: 3 },
  { id: "CAM-02", nameKey: "Aisle 1", status: "online", fps: 5, alerts: 0 },
  { id: "CAM-03", nameKey: "Aisle 3", status: "online", fps: 5, alerts: 1 },
  { id: "CAM-04", nameKey: "Storage Room", status: "online", fps: 5, alerts: 2 },
  { id: "CAM-05", nameKey: "Checkout", status: "online", fps: 5, alerts: 0 },
  { id: "CAM-06", nameKey: "Parking Lot", status: "online", fps: 5, alerts: 1 },
  { id: "CAM-07", nameKey: "Entrance B", status: "offline", fps: 0, alerts: 0 },
  { id: "CAM-08", nameKey: "Back Office", status: "offline", fps: 0, alerts: 0 },
];

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 85 ? "#EF4444" : score >= 70 ? "#F97316" : score >= 55 ? "#F59E0B" : "#10B981";
  const bg = score >= 85 ? "rgba(239,68,68,0.1)" : score >= 70 ? "rgba(249,115,22,0.1)" : score >= 55 ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)";
  return (
    <span className="font-bold px-2 py-0.5 rounded-md text-xs" style={{ color, background: bg, border: `1px solid ${color}30` }}>
      {score}
    </span>
  );
}

export default function WebDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { theme } = useTheme();
  const { t, isRTL, lang } = useLanguage();
  const { selectedStore } = useStore();
  const isDark = theme === "dark";

  useEffect(() => { const timer = setInterval(() => setCurrentTime(new Date()), 1000); return () => clearInterval(timer); }, []);

  const textPrimary = isDark ? "#F1F5F9" : "#0F172A";
  const textMuted   = isDark ? "#94A3B8" : "#64748B";
  const accent      = isDark ? "#00D4FF" : "#3B82F6";
  const cardBg      = isDark ? "rgba(255,255,255,0.03)" : "#FFFFFF";
  const cardBorder  = isDark ? "rgba(0,212,255,0.1)" : "rgba(0,100,200,0.1)";
  const divider     = isDark ? "rgba(0,212,255,0.06)" : "rgba(0,0,0,0.06)";
  const rowHover    = isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)";

  const statusLabel = (status: string) => {
    const map: Record<string, { color: string; bg: string; key: string }> = {
      new:       { color: "#EF4444", bg: "rgba(239,68,68,0.1)",    key: "status.new" },
      reviewing: { color: "#F59E0B", bg: "rgba(245,158,11,0.1)",   key: "status.reviewing" },
      resolved:  { color: "#10B981", bg: "rgba(16,185,129,0.1)",   key: "status.resolved" },
    };
    const s = map[status] || map.new;
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ color: s.color, background: s.bg }}>
        {t(s.key)}
      </span>
    );
  };

  const quickActions = [
    { labelKey: "dashboard.reviewNewAlerts", icon: Eye, href: "/alerts", color: "#EF4444" },
    { labelKey: "dashboard.viewCameraFeeds", icon: Play, href: "/cameras", color: "#00D4FF" },
    { labelKey: "dashboard.analyticsReport", icon: TrendingUp, href: "/analytics", color: "#10B981" },
    { labelKey: "dashboard.systemSettings", icon: AlertTriangle, href: "/settings", color: "#F59E0B" },
  ];

  const systemHealth = [
    { labelKey: "dashboard.edgeDeviceCPU", value: 34, color: "#10B981" },
    { labelKey: "dashboard.edgeDeviceRAM", value: 61, color: "#F59E0B" },
    { labelKey: "dashboard.storageUsed", value: 48, color: "#00D4FF" },
    { labelKey: "dashboard.networkLatency", value: 12, color: "#10B981", suffix: t("common.ms") },
  ];

  const recentActivity = [
    { textKey: "dashboard.alertEscalated", time: "2m", icon: ShieldAlert, color: "#EF4444" },
    { textKey: "dashboard.cameraWentOffline", time: "18m", icon: XCircle, color: "#EF4444" },
    { textKey: "dashboard.alertResolved", time: "22m", icon: CheckCircle, color: "#10B981" },
    { textKey: "dashboard.heartbeatOK", time: "1h", icon: Wifi, color: accent },
    { textKey: "dashboard.dailyReport", time: "6h", icon: TrendingUp, color: textMuted },
  ];

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-6 animate-bk-fade-up" dir={isRTL ? "rtl" : "ltr"}>

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-xl" style={{ color: textPrimary }}>{t("dashboard.title")}</h2>
            <p style={{ color: textMuted, fontSize: "0.8rem" }}>
              {currentTime.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              {" · "}
              <span style={{ color: accent, fontFamily: "monospace" }}>{currentTime.toLocaleTimeString()}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <Activity size={13} style={{ color: "#10B981" }} />
              <span style={{ color: "#10B981", fontSize: "0.75rem", fontWeight: 500 }}>{t("dashboard.live")}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS_KEYS.map((stat, i) => (
            <div
              key={i}
              className="rounded-xl p-4 animate-bk-fade-up"
              style={{
                animationDelay: `${i * 0.05}s`,
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}>
                  <stat.icon size={17} style={{ color: stat.color }} />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium" style={{ color: stat.up ? "#10B981" : "#EF4444" }}>
                  {stat.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {stat.changeKey ? `${stat.changeSuffix}${t(stat.changeKey)}` : stat.change}
                </div>
              </div>
              <div className="font-bold text-2xl mb-0.5" style={{ color: textPrimary }}>{stat.value}</div>
              <div style={{ color: textMuted, fontSize: "0.75rem" }}>{t(stat.labelKey)}</div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Alert Feed - 2/3 width */}
          <div className="lg:col-span-2 rounded-xl overflow-hidden" style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${divider}` }}>
              <div className="flex items-center gap-2">
                <Bell size={16} style={{ color: accent }} />
                <span className="font-semibold" style={{ color: textPrimary, fontSize: "0.9rem" }}>{t("dashboard.liveAlertFeed")}</span>
                <span className="px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444" }}>3 {t("dashboard.new")}</span>
              </div>
              <Link href="/alerts" className="flex items-center gap-1 text-xs" style={{ color: accent, textDecoration: "none" }}>
                {t("dashboard.viewAll")} <ChevronRight size={13} style={{ transform: isRTL ? "rotate(180deg)" : "none" }} />
              </Link>
            </div>
            <div className="divide-y" style={{ borderColor: divider }}>
              {ALERTS.map((alert) => (
                <Link
                  key={alert.id}
                  href={`/alerts/${alert.id}`}
                  className="flex items-center gap-4 px-5 py-3.5 transition-colors cursor-pointer block"
                  style={{ textDecoration: "none" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = rowHover}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                >
                  <div className="w-14 h-10 rounded-lg flex-shrink-0 flex items-center justify-center relative overflow-hidden" style={{ background: isDark ? "rgba(0,212,255,0.05)" : "rgba(59,130,246,0.05)", border: `1px solid ${cardBorder}` }}>
                    <Camera size={16} style={{ color: textMuted }} />
                    {alert.status === "new" && (
                      <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full" style={{ background: "#EF4444" }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-sm truncate" style={{ color: textPrimary }}>{t(alert.typeKey)}</span>
                      <ScoreBadge score={alert.score} />
                    </div>
                    <div className="flex items-center gap-3">
                      <span style={{ color: textMuted, fontSize: "0.75rem" }}>{alert.camera}</span>
                      <span style={{ color: textMuted, fontSize: "0.7rem" }}>·</span>
                      <span style={{ color: textMuted, fontSize: "0.75rem" }}>{t(alert.zoneKey)}</span>
                      <span style={{ color: textMuted, fontSize: "0.7rem" }}>·</span>
                      <span style={{ color: textMuted, fontSize: "0.7rem" }}>{t("dashboard.dwell")}: {alert.dwellTime}{t("common.sec")}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    {statusLabel(alert.status)}
                    <span style={{ color: textMuted, fontSize: "0.7rem" }}>{alert.time} {t("common.minAgo")}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Camera Status - 1/3 width */}
          <div className="rounded-xl overflow-hidden" style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${divider}` }}>
              <div className="flex items-center gap-2">
                <Camera size={16} style={{ color: accent }} />
                <span className="font-semibold" style={{ color: textPrimary, fontSize: "0.9rem" }}>{t("dashboard.cameraStatus")}</span>
                {selectedStore && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(0,212,255,0.1)", color: accent, border: "1px solid rgba(0,212,255,0.2)" }}>
                    {selectedStore.name}
                  </span>
                )}
              </div>
              <Link href="/cameras" className="flex items-center gap-1 text-xs" style={{ color: accent, textDecoration: "none" }}>
                {t("dashboard.manage")} <ChevronRight size={13} style={{ transform: isRTL ? "rotate(180deg)" : "none" }} />
              </Link>
            </div>

            {/* Camera Feed Thumbnail Widget */}
            <div className="p-3" style={{ borderBottom: `1px solid ${divider}` }}>
              <CameraFeedWidget />
            </div>

            <div className="p-4 space-y-2">
              {CAMERAS.map((cam) => (
                <div key={cam.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors" style={{ border: `1px solid ${divider}` }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = rowHover} onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full" style={{ background: cam.status === "online" ? "#10B981" : "#EF4444" }} />
                    {cam.status === "online" && <div className="absolute inset-0 w-2 h-2 rounded-full animate-bk-ping" style={{ background: "#10B981" }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate" style={{ color: textPrimary, fontSize: "0.8rem" }}>{cam.nameKey}</div>
                    <div style={{ color: textMuted, fontSize: "0.7rem" }}>
                      {cam.status === "online" ? `${cam.fps} ${t("dashboard.fps")} · 720p` : t("status.offline")}
                    </div>
                  </div>
                  {cam.alerts > 0 && (
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444" }}>{cam.alerts}</span>
                  )}
                  {cam.status === "online" && (
                    <Wifi size={13} style={{ color: accent, opacity: 0.6 }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="rounded-xl p-5" style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div className="flex items-center gap-2 mb-4">
              <Zap size={15} style={{ color: accent }} />
              <span className="font-semibold" style={{ color: textPrimary, fontSize: "0.875rem" }}>{t("dashboard.quickActions")}</span>
            </div>
            <div className="space-y-2">
              {quickActions.map((action, i) => (
                <Link
                  key={i}
                  href={action.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all"
                  style={{ border: `1px solid ${divider}`, textDecoration: "none" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = rowHover}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${action.color}15` }}>
                    <action.icon size={14} style={{ color: action.color }} />
                  </div>
                  <span style={{ color: textPrimary, fontSize: "0.8rem", fontWeight: 500 }}>{t(action.labelKey)}</span>
                  <ChevronRight size={13} className="ml-auto" style={{ color: textMuted, transform: isRTL ? "rotate(180deg)" : "none" }} />
                </Link>
              ))}
            </div>
          </div>

          {/* System Health */}
          <div className="rounded-xl p-5" style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div className="flex items-center gap-2 mb-4">
              <Activity size={15} style={{ color: accent }} />
              <span className="font-semibold" style={{ color: textPrimary, fontSize: "0.875rem" }}>{t("dashboard.systemHealth")}</span>
            </div>
            <div className="space-y-3">
              {systemHealth.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span style={{ color: textMuted, fontSize: "0.75rem" }}>{t(item.labelKey)}</span>
                    <span style={{ color: item.color, fontSize: "0.75rem", fontWeight: 600, fontFamily: "monospace" }}>
                      {item.value}{item.suffix || "%"}
                    </span>
                  </div>
                  {!item.suffix && (
                    <div className="h-1.5 rounded-full" style={{ background: isDark ? "rgba(0,212,255,0.08)" : "rgba(0,0,0,0.06)" }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${item.value}%`, background: item.color, boxShadow: `0 0 6px ${item.color}60` }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl p-5" style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div className="flex items-center gap-2 mb-4">
              <Clock size={15} style={{ color: accent }} />
              <span className="font-semibold" style={{ color: textPrimary, fontSize: "0.875rem" }}>{t("dashboard.recentActivity")}</span>
            </div>
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${item.color}15` }}>
                    <item.icon size={11} style={{ color: item.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ color: textPrimary, fontSize: "0.78rem" }}>{t(item.textKey)}</p>
                    <p style={{ color: textMuted, fontSize: "0.7rem" }}>{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
