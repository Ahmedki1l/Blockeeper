/**
 * BLOCKEEPER ALERTS PAGE
 * Design: Dark Navy + Neon Cyan (Dark) / Clean White + Blue (Light)
 * HLD Section 6.2.2 - Alert list, filter, review, false-positive, pagination
 */
import { useState } from "react";
import { Link } from "wouter";
import { Bell, Search, Camera, ChevronRight, Play, Clock, SlidersHorizontal, ThumbsDown, Eye } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

const ALL_ALERTS = [
  { id: "ALT-001", camera: "Entrance A", score: 87, typeKey: "alert.loitering", time: "2026-03-02 14:32", status: "new", zoneKey: "cameras.entryZone", dwell: 45, trackId: "TRK-2201" },
  { id: "ALT-002", camera: "Aisle 3", score: 73, typeKey: "alert.suspiciousPose", time: "2026-03-02 14:26", status: "reviewing", zoneKey: "cameras.productZone", dwell: 28, trackId: "TRK-2198" },
  { id: "ALT-003", camera: "Storage Room", score: 91, typeKey: "alert.unauthorizedAccess", time: "2026-03-02 14:19", status: "new", zoneKey: "cameras.restricted", dwell: 62, trackId: "TRK-2195" },
  { id: "ALT-004", camera: "Checkout", score: 62, typeKey: "alert.dwellTime", time: "2026-03-02 14:12", status: "resolved", zoneKey: "cameras.checkoutZone", dwell: 35, trackId: "TRK-2190" },
  { id: "ALT-005", camera: "Parking Lot", score: 78, typeKey: "alert.loitering", time: "2026-03-02 14:03", status: "reviewing", zoneKey: "cameras.exterior", dwell: 52, trackId: "TRK-2187" },
  { id: "ALT-006", camera: "Entrance B", score: 55, typeKey: "alert.suspiciousPose", time: "2026-03-02 13:49", status: "resolved", zoneKey: "cameras.entryZone", dwell: 22, trackId: "TRK-2183" },
  { id: "ALT-007", camera: "Aisle 1", score: 80, typeKey: "alert.loitering", time: "2026-03-02 13:30", status: "new", zoneKey: "cameras.productZone", dwell: 48, trackId: "TRK-2178" },
  { id: "ALT-008", camera: "Back Office", score: 95, typeKey: "alert.unauthorizedAccess", time: "2026-03-02 12:55", status: "reviewing", zoneKey: "cameras.restricted", dwell: 75, trackId: "TRK-2170" },
];

function ScoreBadge({ score, t }: { score: number; t: (k: string) => string }) {
  const color = score >= 85 ? "#EF4444" : score >= 70 ? "#F97316" : score >= 55 ? "#F59E0B" : "#10B981";
  const bg = score >= 85 ? "rgba(239,68,68,0.1)" : score >= 70 ? "rgba(249,115,22,0.1)" : score >= 55 ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)";
  const labelKey = score >= 85 ? "alertDetail.critical" : score >= 70 ? "status.reviewing" : score >= 55 ? "mobile.criticalOnly" : "status.resolved";
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-bold text-sm" style={{ color }}>{score}</span>
      <span className="px-1.5 py-0.5 rounded text-xs font-medium" style={{ color, background: bg }}>{t(labelKey)}</span>
    </div>
  );
}

export default function AlertsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const { theme } = useTheme();
  const { t, isRTL } = useLanguage();
  const isDark = theme === "dark";

  const textPrimary = isDark ? "#F1F5F9" : "#0F172A";
  const textMuted   = isDark ? "#94A3B8" : "#64748B";
  const accent      = isDark ? "#00D4FF" : "#3B82F6";
  const cardBg      = isDark ? "rgba(255,255,255,0.03)" : "#FFFFFF";
  const cardBorder  = isDark ? "rgba(0,212,255,0.1)" : "rgba(0,100,200,0.1)";
  const divider     = isDark ? "rgba(0,212,255,0.06)" : "rgba(0,0,0,0.06)";
  const inputBg     = isDark ? "rgba(255,255,255,0.05)" : "#F8FAFC";
  const rowHover    = isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)";

  const filtered = ALL_ALERTS.filter(a => {
    const typeLabel = t(a.typeKey).toLowerCase();
    const matchSearch = a.camera.toLowerCase().includes(search.toLowerCase()) || typeLabel.includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    const matchType = typeFilter === "all" || a.typeKey === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const counts = {
    all: ALL_ALERTS.length,
    new: ALL_ALERTS.filter(a => a.status === "new").length,
    reviewing: ALL_ALERTS.filter(a => a.status === "reviewing").length,
    resolved: ALL_ALERTS.filter(a => a.status === "resolved").length,
  };

  const statusColor = (s: string) => s === "new" ? "#EF4444" : s === "reviewing" ? "#F59E0B" : "#10B981";
  const statusBg    = (s: string) => s === "new" ? "rgba(239,68,68,0.1)" : s === "reviewing" ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)";
  const statusKey   = (s: string) => s === "new" ? "status.new" : s === "reviewing" ? "status.reviewing" : "status.resolved";

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-5 animate-bk-fade-up" dir={isRTL ? "rtl" : "ltr"}>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-xl" style={{ color: textPrimary }}>{t("alerts.title")}</h2>
            <p style={{ color: textMuted, fontSize: "0.8rem" }}>
              {ALL_ALERTS.length} {t("alerts.title").toLowerCase()} · {counts.new} {t("status.new").toLowerCase()}
            </p>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "all", labelKey: "alerts.all", count: counts.all },
            { key: "new", labelKey: "alerts.new", count: counts.new, color: "#EF4444" },
            { key: "reviewing", labelKey: "alerts.reviewing", count: counts.reviewing, color: "#F59E0B" },
            { key: "resolved", labelKey: "alerts.resolved", count: counts.resolved, color: "#10B981" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: statusFilter === tab.key ? (isDark ? "rgba(0,212,255,0.12)" : "rgba(59,130,246,0.1)") : inputBg,
                border: `1px solid ${statusFilter === tab.key ? accent + "60" : cardBorder}`,
                color: statusFilter === tab.key ? accent : textMuted,
              }}
            >
              {t(tab.labelKey)}
              <span className="px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ background: tab.color ? `${tab.color}20` : `${accent}20`, color: tab.color || accent }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2`} style={{ color: textMuted }} />
            <input
              className="w-full py-2.5 rounded-lg text-sm outline-none transition-all"
              style={{ background: inputBg, border: `1px solid ${cardBorder}`, color: textPrimary, paddingLeft: isRTL ? "1rem" : "2.25rem", paddingRight: isRTL ? "2.25rem" : "1rem" }}
              placeholder={t("alerts.search")}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            className="px-3 py-2.5 rounded-lg text-sm outline-none"
            style={{ background: inputBg, border: `1px solid ${cardBorder}`, color: textPrimary }}
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option value="all">{t("alerts.all")}</option>
            <option value="alert.loitering">{t("alert.loitering")}</option>
            <option value="alert.suspiciousPose">{t("alert.suspiciousPose")}</option>
            <option value="alert.unauthorizedAccess">{t("alert.unauthorizedAccess")}</option>
            <option value="alert.dwellTime">{t("alert.dwellTime")}</option>
          </select>
          <button
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all"
            style={{ background: inputBg, border: `1px solid ${cardBorder}`, color: textMuted }}
          >
            <SlidersHorizontal size={14} />
            <span>{t("alerts.filter")}</span>
          </button>
        </div>

        {/* Alert List */}
        <div className="rounded-xl overflow-hidden" style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)" }}>
          {/* Table Header */}
          <div className="hidden lg:grid px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 120px", color: textMuted, borderBottom: `1px solid ${divider}` }}>
            <span>{t("alerts.type")}</span>
            <span>{t("alerts.camera")}</span>
            <span>{t("alerts.score")}</span>
            <span>{t("alerts.dwell")}</span>
            <span>{t("alerts.status")}</span>
            <span>{t("alerts.actions")}</span>
          </div>

          {/* Rows */}
          <div className="divide-y" style={{ borderColor: divider }}>
            {filtered.length === 0 ? (
              <div className="py-16 text-center">
                <Bell size={32} className="mx-auto mb-3" style={{ color: textMuted, opacity: 0.4 }} />
                <p style={{ color: textMuted }}>{t("alerts.noAlerts")}</p>
              </div>
            ) : filtered.map((alert) => (
              <div
                key={alert.id}
                className="flex lg:grid items-center gap-4 px-5 py-4 transition-colors"
                style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 120px" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = rowHover}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
              >
                {/* Alert Details */}
                <Link href={`/alerts/${alert.id}`} className="flex items-center gap-3 cursor-pointer" style={{ textDecoration: "none" }}>
                  <div className="w-14 h-10 rounded-lg flex items-center justify-center flex-shrink-0 relative" style={{ background: isDark ? "rgba(0,212,255,0.05)" : "rgba(59,130,246,0.05)", border: `1px solid ${cardBorder}` }}>
                    <Camera size={16} style={{ color: textMuted }} />
                    <div className="absolute top-0.5 right-0.5 w-4 h-4 rounded flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
                      <Play size={8} style={{ color: accent }} />
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-sm" style={{ color: textPrimary }}>{t(alert.typeKey)}</div>
                    <div style={{ color: textMuted, fontSize: "0.72rem" }}>{alert.id} · {t(alert.zoneKey)}</div>
                    <div style={{ color: textMuted, fontSize: "0.7rem" }}>{alert.time}</div>
                  </div>
                </Link>
                {/* Camera */}
                <div className="hidden lg:block">
                  <span className="text-sm" style={{ color: textPrimary }}>{alert.camera}</span>
                  <div style={{ color: textMuted, fontSize: "0.7rem" }}>{alert.trackId}</div>
                </div>
                {/* Score */}
                <div className="hidden lg:block">
                  <ScoreBadge score={alert.score} t={t} />
                </div>
                {/* Dwell Time */}
                <div className="hidden lg:flex items-center gap-1.5">
                  <Clock size={12} style={{ color: textMuted }} />
                  <span style={{ color: textPrimary, fontSize: "0.8rem" }}>{alert.dwell}{t("common.sec")}</span>
                </div>
                {/* Status */}
                <div className="hidden lg:block">
                  <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ color: statusColor(alert.status), background: statusBg(alert.status) }}>
                    {t(statusKey(alert.status))}
                  </span>
                </div>
                {/* Actions */}
                <div className="hidden lg:flex items-center gap-2">
                  <Link href={`/alerts/${alert.id}`} title={t("cameras.viewFeed")} className="p-1.5 rounded-lg transition-all" style={{ background: `${accent}15`, color: accent, textDecoration: "none" }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.7"} onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}>
                    <Eye size={13} />
                  </Link>
                  <button
                    title={t("status.dismissed")}
                    className="p-1.5 rounded-lg transition-all"
                    style={{ background: "rgba(245,158,11,0.1)", color: "#F59E0B" }}
                    onClick={() => toast.success(`${t("alerts.id")} ${alert.id}`)}
                  >
                    <ThumbsDown size={13} />
                  </button>
                  <ChevronRight size={14} style={{ color: textMuted, transform: isRTL ? "rotate(180deg)" : "none" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <span style={{ color: textMuted, fontSize: "0.8rem" }}>{filtered.length} / {ALL_ALERTS.length}</span>
          <div className="flex gap-2">
            {[1, 2, 3].map(p => (
              <button key={p} className="w-8 h-8 rounded-lg text-sm font-medium transition-all" style={{
                background: p === 1 ? (isDark ? "rgba(0,212,255,0.12)" : "rgba(59,130,246,0.1)") : inputBg,
                border: `1px solid ${p === 1 ? accent + "60" : cardBorder}`,
                color: p === 1 ? accent : textMuted,
              }}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
