/**
 * BLOCKEEPER MOBILE ALERTS
 * Design: Dark Navy + Neon Cyan (Dark) / Clean White + Blue (Light)
 */
import { useState } from "react";
import { Link } from "wouter";
import { Search, AlertTriangle, Clock, CheckCircle, XCircle } from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";

const ALERTS = [
  { id: "A-001", type: "Loitering Detected", camera: "Entrance A", time: "2 min ago", severity: "critical", score: 92, status: "active" },
  { id: "A-002", type: "Suspicious Behavior", camera: "Storage Room", time: "18 min ago", severity: "high", score: 78, status: "active" },
  { id: "A-003", type: "Unauthorized Access", camera: "Back Office", time: "1 hr ago", severity: "high", score: 81, status: "active" },
  { id: "A-004", type: "Dwell Time Exceeded", camera: "Aisle 3", time: "2 hr ago", severity: "medium", score: 65, status: "resolved" },
  { id: "A-005", type: "Loitering Detected", camera: "Parking Lot", time: "3 hr ago", severity: "medium", score: 68, status: "resolved" },
  { id: "A-006", type: "Suspicious Pose", camera: "Entrance A", time: "5 hr ago", severity: "high", score: 76, status: "resolved" },
  { id: "A-007", type: "Unauthorized Access", camera: "Storage Room", time: "Yesterday", severity: "critical", score: 89, status: "resolved" },
  { id: "A-008", type: "Dwell Time Exceeded", camera: "Aisle 1", time: "Yesterday", severity: "low", score: 58, status: "dismissed" },
];

const SEVERITY_COLORS: Record<string, string> = { critical: "#EF4444", high: "#F97316", medium: "#F59E0B", low: "#10B981" };
const STATUS_COLORS: Record<string, string> = { active: "#EF4444", resolved: "#10B981", dismissed: "#94A3B8" };

export default function MobileAlertsPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const accent      = isDark ? "#00D4FF" : "#3B82F6";
  const cardBg      = isDark ? "#0D1526" : "#FFFFFF";
  const cardBorder  = isDark ? "rgba(0,212,255,0.08)" : "rgba(0,100,200,0.1)";
  const inputBg     = isDark ? "#0D1526" : "#F8FAFC";
  const inputBorder = isDark ? "rgba(0,212,255,0.12)" : "rgba(0,100,200,0.15)";
  const textPrimary = isDark ? "#F1F5F9" : "#0F172A";
  const textMuted   = isDark ? "#94A3B8" : "#64748B";
  const bg          = isDark ? "#0A0F1E" : "#F1F5F9";

  const filtered = ALERTS.filter(a => {
    if (filter !== "all" && a.status !== filter && a.severity !== filter) return false;
    if (search && !a.type.toLowerCase().includes(search.toLowerCase()) && !a.camera.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <MobileLayout title="Alerts">
      <div className="px-4 space-y-3 pt-2 pb-4" style={{ background: bg }}>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: textMuted }} />
          <input className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm" style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: textPrimary, outline: "none" }} placeholder="Search alerts..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {["all", "active", "resolved", "critical", "high", "medium"].map(f => (
            <button key={f} onClick={() => setFilter(f)} className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all" style={{ background: filter === f ? `${accent}20` : `${accent}06`, border: `1px solid ${filter === f ? `${accent}50` : `${accent}15`}`, color: filter === f ? accent : textMuted }}>
              {f}
            </button>
          ))}
        </div>

        {/* Count */}
        <div style={{ color: textMuted, fontSize: "0.75rem" }}>{filtered.length} alerts found</div>

        {/* Alert List */}
        <div className="space-y-2">
          {filtered.map(alert => (
            <div key={alert.id} className="rounded-xl transition-all" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
              <Link href={`/mobile/alerts`} className="flex items-center gap-3 p-3.5" style={{ textDecoration: "none" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${SEVERITY_COLORS[alert.severity]}15`, border: `1px solid ${SEVERITY_COLORS[alert.severity]}30` }}>
                    <AlertTriangle size={17} style={{ color: SEVERITY_COLORS[alert.severity] }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate" style={{ color: textPrimary }}>{alert.type}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span style={{ color: textMuted, fontSize: "0.7rem" }}>{alert.camera}</span>
                      <span style={{ color: textMuted, fontSize: "0.7rem" }}>·</span>
                      <Clock size={10} style={{ color: textMuted }} />
                      <span style={{ color: textMuted, fontSize: "0.7rem" }}>{alert.time}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="font-bold text-xs" style={{ color: SEVERITY_COLORS[alert.severity], fontFamily: "monospace" }}>{alert.score}%</span>
                    <span className="px-1.5 py-0.5 rounded-full text-xs font-medium capitalize" style={{ background: `${STATUS_COLORS[alert.status]}15`, color: STATUS_COLORS[alert.status], fontSize: "0.62rem" }}>{alert.status}</span>
                  </div>
              </Link>
              {/* Quick Actions for active alerts */}
              {alert.status === "active" && (
                <div className="flex border-t" style={{ borderColor: cardBorder }}>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-all" style={{ color: "#10B981", borderRight: `1px solid ${cardBorder}` }} onClick={() => toast.success(`Alert ${alert.id} resolved`)}>
                    <CheckCircle size={13} /> Resolve
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-all" style={{ color: textMuted }} onClick={() => toast.info(`Alert ${alert.id} marked as false positive`)}>
                    <XCircle size={13} /> False Positive
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}
