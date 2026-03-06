/**
 * BLOCKEEPER MOBILE HOME
 * Design: Dark Navy + Neon Cyan (Dark) / Clean White + Blue (Light)
 * Sections: Status hero, quick stats, recent alerts, camera status
 */
import { Link } from "wouter";
import { Shield, AlertTriangle, Camera, Activity, ChevronRight, Clock } from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import { useTheme } from "@/contexts/ThemeContext";

const RECENT_ALERTS = [
  { id: "A-001", type: "Loitering Detected", camera: "Entrance A", time: "2 min ago", severity: "critical", score: 92 },
  { id: "A-002", type: "Suspicious Behavior", camera: "Storage Room", time: "18 min ago", severity: "high", score: 78 },
  { id: "A-003", type: "Unauthorized Access", camera: "Back Office", time: "1 hr ago", severity: "high", score: 81 },
  { id: "A-004", type: "Dwell Time Exceeded", camera: "Aisle 3", time: "2 hr ago", severity: "medium", score: 65 },
];

const SEVERITY_COLORS: Record<string, string> = {
  critical: "#EF4444", high: "#F97316", medium: "#F59E0B", low: "#10B981",
};

export default function MobileHomePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const bg        = isDark ? "#0A0F1E" : "#F1F5F9";
  const cardBg    = isDark ? "#0D1526" : "#FFFFFF";
  const cardBorder = isDark ? "rgba(0,212,255,0.08)" : "rgba(0,100,200,0.1)";
  const accent    = isDark ? "#00D4FF" : "#3B82F6";
  const textPrimary = isDark ? "#F1F5F9" : "#0F172A";
  const textMuted   = isDark ? "#94A3B8" : "#64748B";
  const heroBg    = isDark ? "linear-gradient(135deg, #0D1526 0%, #0A1020 100%)" : "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)";
  const heroBorder = isDark ? "rgba(0,212,255,0.15)" : "rgba(59,130,246,0.2)";

  return (
    <MobileLayout title="Dashboard">
      <div className="px-4 space-y-4 pt-2 pb-4" style={{ background: bg }}>

        {/* Security Status Hero */}
        <div className="rounded-2xl p-5 text-center relative overflow-hidden" style={{ background: heroBg, border: `1px solid ${heroBorder}` }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 0%, ${accent}10 0%, transparent 70%)` }} />
          <div className="relative">
            <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: "rgba(16,185,129,0.1)", border: "2px solid rgba(16,185,129,0.3)", boxShadow: "0 0 24px rgba(16,185,129,0.15)" }}>
              <Shield size={36} style={{ color: "#10B981" }} />
            </div>
            <div className="font-bold text-2xl mb-0.5" style={{ color: "#10B981", letterSpacing: "0.1em" }}>SECURE</div>
            <div style={{ color: textMuted, fontSize: "0.78rem" }}>All systems operational · 10 cameras active</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Active Alerts", value: "3", icon: AlertTriangle, color: "#EF4444", sub: "2 critical" },
            { label: "Cameras Online", value: "8/10", icon: Camera, color: accent, sub: "2 offline" },
            { label: "Today's Incidents", value: "14", icon: Activity, color: "#F59E0B", sub: "+3 vs yesterday" },
            { label: "Avg Response", value: "4.2m", icon: Clock, color: "#10B981", sub: "-12% faster" },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-4" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${s.color}15` }}>
                  <s.icon size={16} style={{ color: s.color }} />
                </div>
              </div>
              <div className="font-bold text-xl" style={{ color: textPrimary }}>{s.value}</div>
              <div style={{ color: textMuted, fontSize: "0.7rem" }}>{s.label}</div>
              <div style={{ color: s.color, fontSize: "0.68rem", marginTop: "2px" }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Recent Alerts */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-sm" style={{ color: textPrimary }}>Recent Alerts</span>
            <Link href="/mobile/alerts" className="flex items-center gap-1 text-xs" style={{ color: accent, textDecoration: "none" }}>View all <ChevronRight size={12} /></Link>
          </div>
          <div className="space-y-2">
            {RECENT_ALERTS.map(alert => (
              <Link key={alert.id} href={`/mobile/alerts`} className="flex items-center gap-3 p-3 rounded-xl transition-all" style={{ background: cardBg, border: `1px solid ${cardBorder}`, textDecoration: "none" }}>
                  <div className="w-2 h-10 rounded-full flex-shrink-0" style={{ background: SEVERITY_COLORS[alert.severity] }} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate" style={{ color: textPrimary }}>{alert.type}</div>
                    <div style={{ color: textMuted, fontSize: "0.72rem" }}>{alert.camera} · {alert.time}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-bold text-xs" style={{ color: SEVERITY_COLORS[alert.severity], fontFamily: "monospace" }}>{alert.score}%</span>
                    <ChevronRight size={13} style={{ color: textMuted }} />
                  </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Camera Status Strip */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-sm" style={{ color: textPrimary }}>Camera Status</span>
            <Link href="/mobile/cameras" className="flex items-center gap-1 text-xs" style={{ color: accent, textDecoration: "none" }}>Manage <ChevronRight size={12} /></Link>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {["Entrance A", "Aisle 1", "Storage", "Checkout", "Parking", "Back Office"].map((cam, i) => {
              const offline = i === 5;
              return (
                <div key={i} className="flex-shrink-0 rounded-xl p-3 text-center" style={{ background: cardBg, border: `1px solid ${offline ? "rgba(239,68,68,0.2)" : cardBorder}`, minWidth: "80px" }}>
                  <div className="w-8 h-8 rounded-lg mx-auto mb-1.5 flex items-center justify-center" style={{ background: offline ? "rgba(239,68,68,0.1)" : `${accent}12` }}>
                    <Camera size={14} style={{ color: offline ? "#EF4444" : accent }} />
                  </div>
                  <div style={{ color: textPrimary, fontSize: "0.65rem", fontWeight: 500, lineHeight: 1.2 }}>{cam}</div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: offline ? "#EF4444" : "#10B981" }} />
                    <span style={{ color: offline ? "#EF4444" : "#10B981", fontSize: "0.6rem" }}>{offline ? "Off" : "On"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </MobileLayout>
  );
}
