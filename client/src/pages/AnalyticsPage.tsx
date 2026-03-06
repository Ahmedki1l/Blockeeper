/**
 * BLOCKEEPER ANALYTICS PAGE
 * Design: Dark Navy + Neon Cyan (Dark) / Clean White + Blue (Light)
 * HLD Section 6.2.5 - KPIs, Alerts by Hour, Weekly Trend, By Camera, By Type, False Positive Rate
 */
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, TrendingDown, BarChart2, Clock, Camera, Tag, ThumbsDown, Download } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";

const HOURLY = [
  { hour: "00", alerts: 1 }, { hour: "02", alerts: 0 }, { hour: "04", alerts: 0 },
  { hour: "06", alerts: 2 }, { hour: "08", alerts: 5 }, { hour: "10", alerts: 8 },
  { hour: "12", alerts: 12 }, { hour: "14", alerts: 9 }, { hour: "16", alerts: 14 },
  { hour: "18", alerts: 11 }, { hour: "20", alerts: 7 }, { hour: "22", alerts: 3 },
];

const BY_CAMERA = [
  { name: "Entrance A", alerts: 18 }, { name: "Storage Room", alerts: 14 },
  { name: "Parking Lot", alerts: 11 }, { name: "Aisle 3", alerts: 9 },
  { name: "Checkout", alerts: 6 }, { name: "Aisle 1", alerts: 4 },
];

const BY_TYPE = [
  { name: "Loitering", value: 38, color: "#EF4444" },
  { name: "Suspicious Pose", value: 28, color: "#F97316" },
  { name: "Unauthorized Access", value: 22, color: "#F59E0B" },
  { name: "Dwell Time", value: 12, color: "#00D4FF" },
];

const WEEKLY_TREND = [
  { day: "Mon", alerts: 18, resolved: 15, fp: 3 },
  { day: "Tue", alerts: 22, resolved: 20, fp: 2 },
  { day: "Wed", alerts: 15, resolved: 14, fp: 1 },
  { day: "Thu", alerts: 28, resolved: 24, fp: 4 },
  { day: "Fri", alerts: 31, resolved: 27, fp: 4 },
  { day: "Sat", alerts: 12, resolved: 11, fp: 1 },
  { day: "Sun", alerts: 8, resolved: 8, fp: 0 },
];

const FP_TREND = [
  { week: "W1", rate: 12 }, { week: "W2", rate: 9 }, { week: "W3", rate: 11 },
  { week: "W4", rate: 7 }, { week: "W5", rate: 6 }, { week: "W6", rate: 8 },
  { week: "W7", rate: 5 }, { week: "W8", rate: 4 },
];

const PERIODS = ["Today", "7 Days", "30 Days"];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState(1);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const textPrimary = isDark ? "#F1F5F9" : "#0F172A";
  const textMuted   = isDark ? "#94A3B8" : "#64748B";
  const accent      = isDark ? "#00D4FF" : "#3B82F6";
  const cardBg      = isDark ? "rgba(255,255,255,0.03)" : "#FFFFFF";
  const cardBorder  = isDark ? "rgba(0,212,255,0.1)" : "rgba(0,100,200,0.1)";
  const gridStroke  = isDark ? "rgba(0,212,255,0.06)" : "rgba(0,0,0,0.06)";
  const inputBg     = isDark ? "rgba(255,255,255,0.05)" : "#F8FAFC";

  const tooltipStyle = {
    contentStyle: { background: isDark ? "#0D1526" : "#FFFFFF", border: `1px solid ${cardBorder}`, borderRadius: "8px", color: textPrimary, fontSize: "0.75rem" },
    labelStyle: { color: textMuted },
    cursor: { fill: isDark ? "rgba(0,212,255,0.05)" : "rgba(59,130,246,0.05)" },
  };

  const cardStyle = { background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)" };

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-6 animate-bk-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="font-bold text-xl" style={{ color: textPrimary }}>Analytics & Insights</h2>
            <p style={{ color: textMuted, fontSize: "0.8rem" }}>Last 7 days · Updated in real-time</p>
          </div>
          <div className="flex items-center gap-2">
            {PERIODS.map((p, i) => (
              <button key={p} onClick={() => setPeriod(i)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={{
                background: period === i ? `${accent}20` : inputBg,
                border: `1px solid ${period === i ? accent + "60" : cardBorder}`,
                color: period === i ? accent : textMuted,
              }}>
                {p}
              </button>
            ))}
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ background: inputBg, border: `1px solid ${cardBorder}`, color: textMuted }} onClick={() => toast.success("Report exported")}>
              <Download size={12} /> Export
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Alerts", value: "134", change: "+18%", up: true, icon: BarChart2, color: "#EF4444" },
            { label: "Avg Response Time", value: "4.2 min", change: "-12%", up: false, icon: Clock, color: "#10B981" },
            { label: "Most Active Camera", value: "Entrance A", change: "18 alerts", up: true, icon: Camera, color: accent },
            { label: "False Positive Rate", value: "6.7%", change: "-3.1%", up: false, icon: ThumbsDown, color: "#F59E0B" },
          ].map((kpi, i) => (
            <div key={i} className="rounded-xl p-4" style={cardStyle}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${kpi.color}15`, border: `1px solid ${kpi.color}30` }}>
                  <kpi.icon size={17} style={{ color: kpi.color }} />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium" style={{ color: kpi.up ? "#EF4444" : "#10B981" }}>
                  {kpi.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {kpi.change}
                </div>
              </div>
              <div className="font-bold text-xl mb-0.5" style={{ color: textPrimary }}>{kpi.value}</div>
              <div style={{ color: textMuted, fontSize: "0.75rem" }}>{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Alerts by Hour */}
          <div className="rounded-xl p-5" style={cardStyle}>
            <div className="flex items-center gap-2 mb-5">
              <Clock size={15} style={{ color: accent }} />
              <span className="font-semibold" style={{ color: textPrimary, fontSize: "0.875rem" }}>Alerts by Hour (Today)</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={HOURLY} barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="hour" tick={{ fill: textMuted, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}:00`} />
                <YAxis tick={{ fill: textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="alerts" fill={accent} radius={[4, 4, 0, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly Trend */}
          <div className="rounded-xl p-5" style={cardStyle}>
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={15} style={{ color: accent }} />
              <span className="font-semibold" style={{ color: textPrimary, fontSize: "0.875rem" }}>Weekly Alert Trend</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={WEEKLY_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="day" tick={{ fill: textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: "0.75rem", color: textMuted }} />
                <Line type="monotone" dataKey="alerts" stroke="#EF4444" strokeWidth={2} dot={{ fill: "#EF4444", r: 3 }} name="Alerts" />
                <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} dot={{ fill: "#10B981", r: 3 }} name="Resolved" strokeDasharray="4 2" />
                <Line type="monotone" dataKey="fp" stroke="#F59E0B" strokeWidth={1.5} dot={{ fill: "#F59E0B", r: 2 }} name="False Positives" strokeDasharray="2 2" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Alerts by Camera */}
          <div className="lg:col-span-2 rounded-xl p-5" style={cardStyle}>
            <div className="flex items-center gap-2 mb-5">
              <Camera size={15} style={{ color: accent }} />
              <span className="font-semibold" style={{ color: textPrimary, fontSize: "0.875rem" }}>Alerts by Camera</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={BY_CAMERA} layout="vertical" barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} horizontal={false} />
                <XAxis type="number" tick={{ fill: textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: textMuted, fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="alerts" fill="#3B82F6" radius={[0, 4, 4, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Alerts by Type */}
          <div className="rounded-xl p-5" style={cardStyle}>
            <div className="flex items-center gap-2 mb-5">
              <Tag size={15} style={{ color: accent }} />
              <span className="font-semibold" style={{ color: textPrimary, fontSize: "0.875rem" }}>By Incident Type</span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={BY_TYPE} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {BY_TYPE.map((entry, i) => <Cell key={i} fill={entry.color} opacity={0.85} />)}
                </Pie>
                <Tooltip contentStyle={{ background: isDark ? "#0D1526" : "#FFFFFF", border: `1px solid ${cardBorder}`, borderRadius: "8px", color: textPrimary, fontSize: "0.75rem" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {BY_TYPE.map((t, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: t.color }} />
                    <span style={{ color: textMuted, fontSize: "0.72rem" }}>{t.name}</span>
                  </div>
                  <span style={{ color: textPrimary, fontSize: "0.72rem", fontWeight: 600 }}>{t.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* False Positive Rate Trend */}
        <div className="rounded-xl p-5" style={cardStyle}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <ThumbsDown size={15} style={{ color: "#F59E0B" }} />
              <span className="font-semibold" style={{ color: textPrimary, fontSize: "0.875rem" }}>False Positive Rate Trend (8 Weeks)</span>
            </div>
            <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: "rgba(16,185,129,0.1)", color: "#10B981" }}>↓ Improving</span>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={FP_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis dataKey="week" tick={{ fill: textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: textMuted, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip {...tooltipStyle} formatter={(v) => [`${v}%`, "False Positive Rate"]} />
              <Line type="monotone" dataKey="rate" stroke="#F59E0B" strokeWidth={2.5} dot={{ fill: "#F59E0B", r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppLayout>
  );
}
