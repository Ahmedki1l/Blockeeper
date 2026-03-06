/**
 * BLOCKEEPER MOBILE ANALYTICS
 * Design: Dark Navy + Neon Cyan (Dark) / Clean White + Blue (Light)
 */
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import { useTheme } from "@/contexts/ThemeContext";

const HOURLY = [
  { hour: "08", v: 5 }, { hour: "10", v: 8 }, { hour: "12", v: 12 },
  { hour: "14", v: 9 }, { hour: "16", v: 14 }, { hour: "18", v: 11 },
  { hour: "20", v: 7 }, { hour: "22", v: 3 },
];

const WEEKLY = [
  { day: "Mon", v: 18 }, { day: "Tue", v: 22 }, { day: "Wed", v: 15 },
  { day: "Thu", v: 28 }, { day: "Fri", v: 31 }, { day: "Sat", v: 12 }, { day: "Sun", v: 8 },
];

const FALSE_POSITIVE = [
  { day: "Mon", fp: 3 }, { day: "Tue", fp: 5 }, { day: "Wed", fp: 2 },
  { day: "Thu", fp: 4 }, { day: "Fri", fp: 6 }, { day: "Sat", fp: 1 }, { day: "Sun", fp: 2 },
];

export default function MobileAnalyticsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const accent      = isDark ? "#00D4FF" : "#3B82F6";
  const cardBg      = isDark ? "#0D1526" : "#FFFFFF";
  const cardBorder  = isDark ? "rgba(0,212,255,0.08)" : "rgba(0,100,200,0.1)";
  const bg          = isDark ? "#0A0F1E" : "#F1F5F9";
  const textPrimary = isDark ? "#F1F5F9" : "#0F172A";
  const textMuted   = isDark ? "#94A3B8" : "#64748B";
  const gridColor   = isDark ? "rgba(0,212,255,0.06)" : "rgba(0,0,0,0.06)";

  const TOOLTIP_STYLE = {
    contentStyle: { background: isDark ? "#0D1526" : "#FFFFFF", border: `1px solid ${isDark ? "rgba(0,212,255,0.2)" : "rgba(0,100,200,0.15)"}`, borderRadius: "8px", color: textPrimary, fontSize: "0.72rem" },
    labelStyle: { color: textMuted },
  };

  return (
    <MobileLayout title="Analytics">
      <div className="px-4 space-y-4 pt-2 pb-4" style={{ background: bg }}>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Total Alerts", value: "134", change: "+18%", up: true, color: "#EF4444" },
            { label: "Avg Response", value: "4.2m", change: "-12%", up: false, color: "#10B981" },
            { label: "Resolved", value: "121", change: "90.3%", up: true, color: accent },
            { label: "False Positive", value: "13", change: "9.7%", up: false, color: "#F59E0B" },
          ].map((k, i) => (
            <div key={i} className="rounded-xl p-3.5" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
              <div className="flex items-center justify-between mb-2">
                <div className="w-1.5 h-6 rounded-full" style={{ background: k.color }} />
                <div className="flex items-center gap-0.5 text-xs" style={{ color: k.up ? "#10B981" : "#EF4444" }}>
                  {k.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {k.change}
                </div>
              </div>
              <div className="font-bold text-lg" style={{ color: textPrimary }}>{k.value}</div>
              <div style={{ color: textMuted, fontSize: "0.7rem" }}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* Alerts by Hour */}
        <div className="rounded-xl p-4" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
          <div className="font-semibold text-sm mb-4" style={{ color: textPrimary }}>Alerts by Hour (Today)</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={HOURLY} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="hour" tick={{ fill: textMuted, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}h`} />
              <YAxis tick={{ fill: textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="v" fill={accent} radius={[4, 4, 0, 0]} opacity={0.85} name="Alerts" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Trend */}
        <div className="rounded-xl p-4" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
          <div className="font-semibold text-sm mb-4" style={{ color: textPrimary }}>Weekly Trend</div>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={WEEKLY}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="day" tick={{ fill: textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Line type="monotone" dataKey="v" stroke="#3B82F6" strokeWidth={2} dot={{ fill: "#3B82F6", r: 3 }} name="Alerts" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* False Positive Rate */}
        <div className="rounded-xl p-4" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
          <div className="font-semibold text-sm mb-4" style={{ color: textPrimary }}>False Positive Rate (Weekly)</div>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={FALSE_POSITIVE} barSize={12}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="day" tick={{ fill: textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="fp" fill="#F59E0B" radius={[4, 4, 0, 0]} opacity={0.85} name="False Positives" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Incident Types */}
        <div className="rounded-xl p-4" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
          <div className="font-semibold text-sm mb-4" style={{ color: textPrimary }}>Top Incident Types</div>
          <div className="space-y-3">
            {[
              { type: "Loitering", pct: 38, color: "#EF4444" },
              { type: "Suspicious Pose", pct: 28, color: "#F97316" },
              { type: "Unauthorized Access", pct: 22, color: "#F59E0B" },
              { type: "Dwell Time", pct: 12, color: accent },
            ].map((t, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span style={{ color: textMuted, fontSize: "0.78rem" }}>{t.type}</span>
                  <span style={{ color: textPrimary, fontSize: "0.78rem", fontWeight: 600 }}>{t.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: isDark ? "rgba(0,212,255,0.08)" : "#E2E8F0" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${t.pct}%`, background: t.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </MobileLayout>
  );
}
