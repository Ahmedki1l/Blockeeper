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
import { toast } from "sonner";

const ALL_ALERTS = [
  { id: "ALT-001", camera: "Entrance A", score: 87, type: "Loitering", time: "2026-03-02 14:32", status: "new", zone: "Entry Zone", dwell: 45, trackId: "TRK-2201" },
  { id: "ALT-002", camera: "Aisle 3", score: 73, type: "Suspicious Pose", time: "2026-03-02 14:26", status: "reviewing", zone: "Product Zone", dwell: 28, trackId: "TRK-2198" },
  { id: "ALT-003", camera: "Storage Room", score: 91, type: "Unauthorized Access", time: "2026-03-02 14:19", status: "new", zone: "Restricted", dwell: 62, trackId: "TRK-2195" },
  { id: "ALT-004", camera: "Checkout", score: 62, type: "Dwell Time", time: "2026-03-02 14:12", status: "resolved", zone: "Checkout Zone", dwell: 35, trackId: "TRK-2190" },
  { id: "ALT-005", camera: "Parking Lot", score: 78, type: "Loitering", time: "2026-03-02 14:03", status: "reviewing", zone: "Exterior", dwell: 52, trackId: "TRK-2187" },
  { id: "ALT-006", camera: "Entrance B", score: 55, type: "Suspicious Pose", time: "2026-03-02 13:49", status: "resolved", zone: "Entry Zone", dwell: 22, trackId: "TRK-2183" },
  { id: "ALT-007", camera: "Aisle 1", score: 80, type: "Loitering", time: "2026-03-02 13:30", status: "new", zone: "Product Zone", dwell: 48, trackId: "TRK-2178" },
  { id: "ALT-008", camera: "Back Office", score: 95, type: "Unauthorized Access", time: "2026-03-02 12:55", status: "reviewing", zone: "Restricted", dwell: 75, trackId: "TRK-2170" },
];

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 85 ? "#EF4444" : score >= 70 ? "#F97316" : score >= 55 ? "#F59E0B" : "#10B981";
  const bg = score >= 85 ? "rgba(239,68,68,0.1)" : score >= 70 ? "rgba(249,115,22,0.1)" : score >= 55 ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)";
  const label = score >= 85 ? "Critical" : score >= 70 ? "High" : score >= 55 ? "Medium" : "Low";
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-bold text-sm" style={{ color }}>{score}</span>
      <span className="px-1.5 py-0.5 rounded text-xs font-medium" style={{ color, background: bg }}>{label}</span>
    </div>
  );
}

export default function AlertsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const { theme } = useTheme();
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
    const matchSearch = a.camera.toLowerCase().includes(search.toLowerCase()) || a.type.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    const matchType = typeFilter === "all" || a.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const counts = {
    all: ALL_ALERTS.length,
    new: ALL_ALERTS.filter(a => a.status === "new").length,
    reviewing: ALL_ALERTS.filter(a => a.status === "reviewing").length,
    resolved: ALL_ALERTS.filter(a => a.status === "resolved").length,
  };

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-5 animate-bk-fade-up">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-xl" style={{ color: textPrimary }}>Alert Management</h2>
            <p style={{ color: textMuted, fontSize: "0.8rem" }}>{ALL_ALERTS.length} total alerts · {counts.new} require attention</p>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "all", label: "All Alerts", count: counts.all },
            { key: "new", label: "New", count: counts.new, color: "#EF4444" },
            { key: "reviewing", label: "Reviewing", count: counts.reviewing, color: "#F59E0B" },
            { key: "resolved", label: "Resolved", count: counts.resolved, color: "#10B981" },
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
              {tab.label}
              <span className="px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ background: tab.color ? `${tab.color}20` : `${accent}20`, color: tab.color || accent }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: textMuted }} />
            <input
              className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none transition-all"
              style={{ background: inputBg, border: `1px solid ${cardBorder}`, color: textPrimary }}
              placeholder="Search by camera, type, or ID..."
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
            <option value="all">All Types</option>
            <option value="Loitering">Loitering</option>
            <option value="Suspicious Pose">Suspicious Pose</option>
            <option value="Unauthorized Access">Unauthorized Access</option>
            <option value="Dwell Time">Dwell Time</option>
          </select>
          <button
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all"
            style={{ background: inputBg, border: `1px solid ${cardBorder}`, color: textMuted }}
          >
            <SlidersHorizontal size={14} />
            <span>More Filters</span>
          </button>
        </div>

        {/* Alert List */}
        <div className="rounded-xl overflow-hidden" style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)" }}>
          {/* Table Header */}
          <div className="hidden lg:grid px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 120px", color: textMuted, borderBottom: `1px solid ${divider}` }}>
            <span>Alert Details</span>
            <span>Camera</span>
            <span>Score</span>
            <span>Dwell Time</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {/* Rows */}
          <div className="divide-y" style={{ borderColor: divider }}>
            {filtered.length === 0 ? (
              <div className="py-16 text-center">
                <Bell size={32} className="mx-auto mb-3" style={{ color: textMuted, opacity: 0.4 }} />
                <p style={{ color: textMuted }}>No alerts match your filters</p>
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
                      <div className="font-medium text-sm" style={{ color: textPrimary }}>{alert.type}</div>
                      <div style={{ color: textMuted, fontSize: "0.72rem" }}>{alert.id} · {alert.zone}</div>
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
                  <ScoreBadge score={alert.score} />
                </div>
                {/* Dwell Time */}
                <div className="hidden lg:flex items-center gap-1.5">
                  <Clock size={12} style={{ color: textMuted }} />
                  <span style={{ color: textPrimary, fontSize: "0.8rem" }}>{alert.dwell}s</span>
                </div>
                {/* Status */}
                <div className="hidden lg:block">
                  <span className="px-2 py-1 rounded-full text-xs font-medium" style={{
                    color: alert.status === "new" ? "#EF4444" : alert.status === "reviewing" ? "#F59E0B" : "#10B981",
                    background: alert.status === "new" ? "rgba(239,68,68,0.1)" : alert.status === "reviewing" ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)",
                  }}>
                    {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                  </span>
                </div>
                {/* Actions */}
                <div className="hidden lg:flex items-center gap-2">
                  <Link href={`/alerts/${alert.id}`} title="Review" className="p-1.5 rounded-lg transition-all" style={{ background: `${accent}15`, color: accent, textDecoration: "none" }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.7"} onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}>
                    <Eye size={13} />
                  </Link>
                  <button
                    title="Mark as False Positive"
                    className="p-1.5 rounded-lg transition-all"
                    style={{ background: "rgba(245,158,11,0.1)", color: "#F59E0B" }}
                    onClick={() => toast.success(`Alert ${alert.id} marked as false positive`)}
                  >
                    <ThumbsDown size={13} />
                  </button>
                  <ChevronRight size={14} style={{ color: textMuted }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <span style={{ color: textMuted, fontSize: "0.8rem" }}>Showing {filtered.length} of {ALL_ALERTS.length} alerts</span>
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
