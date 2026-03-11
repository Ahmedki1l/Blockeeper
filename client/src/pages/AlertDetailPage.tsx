/**
 * BLOCKEEPER ALERT DETAIL PAGE
 * Design: Dark Navy + Neon Cyan (Dark) / Clean White + Blue (Light)
 * HLD Section 6.2.3 - Video player, metadata, timeline, false-positive, notes
 */
import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft, Play, Pause, Volume2, Maximize2, Camera,
  Clock, MapPin, Tag, Shield, CheckCircle, AlertTriangle,
  FileText, Share2, Download, ChevronRight, User, Zap, ThumbsDown
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

export default function AlertDetailPage({ params }: { params?: { id?: string } }) {
  const alertId = params?.id || "ALT-001";
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(35);
  const [activeTab, setActiveTab] = useState<"details" | "timeline" | "notes">("details");
  const [notes, setNotes] = useState("");
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
  const controlBg   = isDark ? "#0A0D1A" : "#F1F5F9";
  const rowHover    = isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)";

  const TIMELINE_EVENTS = [
    { time: "14:32:01", labelKey: "alertDetail.personEntered", type: "entry" },
    { time: "14:32:28", labelKey: "alertDetail.dwellExceeded", type: "warning" },
    { time: "14:32:45", labelKey: "alertDetail.alertTriggered", type: "critical" },
    { time: "14:33:10", labelKey: "alertDetail.subjectMoved", type: "info" },
    { time: "14:33:30", labelKey: "alertDetail.alertReviewed", type: "resolved" },
  ];

  const DETECTED_OBJECTS_KEYS = ["alertDetail.person", "alertDetail.backpack", "alertDetail.hoodie"];

  const detailItems = [
    { icon: Tag, labelKey: "alertDetail.incidentType", value: t("alert.loitering") },
    { icon: Camera, labelKey: "alertDetail.camera", value: "Entrance A (CAM-01)" },
    { icon: MapPin, labelKey: "alertDetail.zone", value: t("cameras.entryZone") },
    { icon: Clock, labelKey: "alertDetail.dwellTime", value: `45 ${t("alertDetail.seconds")}` },
    { icon: Zap, labelKey: "alertDetail.anomalyScore", value: `87 / 100 (${t("alertDetail.critical")})` },
    { icon: User, labelKey: "alertDetail.detectedObjects", value: DETECTED_OBJECTS_KEYS.map(k => t(k)).join(", ") },
    { icon: Shield, labelKey: "alertDetail.trackId", value: "TRK-2201" },
    { icon: FileText, labelKey: "alertDetail.trackId", value: "TRK-2201" },
  ];

  const tabLabels: Record<string, string> = {
    details: t("nav.dashboard"),
    timeline: t("alertDetail.timeline"),
    notes: t("alertDetail.notes"),
  };

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-5 animate-bk-fade-up" dir={isRTL ? "rtl" : "ltr"}>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <Link href="/alerts" className="flex items-center gap-1.5 text-sm transition-colors hover:opacity-80" style={{ color: textMuted, textDecoration: "none" }}>
            <ArrowLeft size={15} style={{ transform: isRTL ? "rotate(180deg)" : "none" }} />
            {t("alertDetail.back")}
          </Link>
          <ChevronRight size={13} style={{ color: textMuted, transform: isRTL ? "rotate(180deg)" : "none" }} />
          <span className="text-sm font-medium" style={{ color: accent }}>{alertId}</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="font-bold text-xl" style={{ color: textPrimary }}>{t("alert.loiteringDetected")}</h2>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.3)" }}>
                {t("alertDetail.critical")} · {t("alerts.score")} 87
              </span>
            </div>
            <p style={{ color: textMuted, fontSize: "0.8rem" }}>
              Entrance A · {t("cameras.entryZone")} · {t("alertDetail.trackId")}: TRK-2201 · 2026-03-02 14:32
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all"
              style={{ background: inputBg, border: `1px solid ${cardBorder}`, color: textMuted }}
              onClick={() => toast.success(t("alertDetail.share"))}
            >
              <Share2 size={14} /> {t("alertDetail.share")}
            </button>
            <button
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all"
              style={{ background: inputBg, border: `1px solid ${cardBorder}`, color: textMuted }}
              onClick={() => toast.success(t("alertDetail.download"))}
            >
              <Download size={14} /> {t("alertDetail.download")}
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg font-medium transition-all"
              style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#10B981" }}
              onClick={() => toast.success(t("alertDetail.resolve"))}
            >
              <CheckCircle size={14} /> {t("alertDetail.resolve")}
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Video Player - 2/3 */}
          <div className="lg:col-span-2 space-y-4">
            {/* Player */}
            <div className="rounded-xl overflow-hidden" style={{ background: "#000", border: `1px solid ${cardBorder}` }}>
              {/* Video Area */}
              <div className="relative" style={{ aspectRatio: "16/9", background: "linear-gradient(135deg, #0A0F1E 0%, #0D1526 100%)" }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Camera size={48} style={{ color: "#94A3B8", opacity: 0.3, margin: "0 auto 8px" }} />
                    <p style={{ color: "#94A3B8", fontSize: "0.8rem", opacity: 0.5 }}>Entrance A · CAM-01</p>
                  </div>
                </div>
                {/* Detection box overlay */}
                <div className="absolute" style={{ top: "30%", left: "35%", width: "22%", height: "45%", border: "2px solid #EF4444", borderRadius: "4px", boxShadow: "0 0 12px rgba(239,68,68,0.4)" }}>
                  <div className="absolute -top-5 left-0 px-1.5 py-0.5 rounded text-xs font-bold" style={{ background: "#EF4444", color: "#fff", fontSize: "0.65rem" }}>
                    {t("alertDetail.person")} 87%
                  </div>
                </div>
                {/* Live badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded" style={{ background: "rgba(0,0,0,0.7)" }}>
                  <div className="w-1.5 h-1.5 rounded-full animate-bk-pulse" style={{ background: "#EF4444" }} />
                  <span style={{ color: "#fff", fontSize: "0.7rem", fontWeight: 600 }}>RECORDED</span>
                </div>
                {/* Timestamp */}
                <div className="absolute top-3 right-3 px-2 py-1 rounded" style={{ background: "rgba(0,0,0,0.7)", color: "#fff", fontSize: "0.7rem", fontFamily: "monospace" }}>
                  14:32:45
                </div>
                {/* Play overlay */}
                {!playing && (
                  <button
                    className="absolute inset-0 flex items-center justify-center transition-opacity hover:opacity-80"
                    onClick={() => setPlaying(true)}
                  >
                    <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(0,212,255,0.15)", border: "2px solid rgba(0,212,255,0.4)", backdropFilter: "blur(4px)" }}>
                      <Play size={24} style={{ color: "#00D4FF", marginLeft: "3px" }} />
                    </div>
                  </button>
                )}
              </div>

              {/* Controls */}
              <div className="px-4 py-3" style={{ background: controlBg }}>
                <div className="mb-3">
                  <input
                    type="range" min={0} max={100} value={progress}
                    onChange={e => setProgress(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full cursor-pointer"
                    style={{ accentColor: accent }}
                  />
                  <div className="relative h-2 mt-1">
                    {TIMELINE_EVENTS.map((ev, i) => (
                      <div
                        key={i}
                        className="absolute w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-1/2 top-1/2"
                        style={{
                          left: `${(i / (TIMELINE_EVENTS.length - 1)) * 100}%`,
                          background: ev.type === "critical" ? "#EF4444" : ev.type === "alert" ? "#F97316" : ev.type === "warning" ? "#F59E0B" : accent,
                        }}
                        title={t(ev.labelKey)}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setPlaying(p => !p)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors" style={{ color: textPrimary }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = inputBg} onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                      {playing ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <Volume2 size={15} style={{ color: textMuted, cursor: "pointer" }} />
                    <span style={{ color: textMuted, fontSize: "0.75rem", fontFamily: "monospace" }}>
                      {Math.floor(progress * 0.6 / 10)}:{String(Math.floor(progress * 0.6 % 10 * 6)).padStart(2, "0")} / 0:36
                    </span>
                  </div>
                  <Maximize2 size={15} style={{ color: textMuted, cursor: "pointer" }} />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="rounded-xl overflow-hidden" style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div className="flex" style={{ borderBottom: `1px solid ${divider}` }}>
                {(["details", "timeline", "notes"] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="px-5 py-3 text-sm font-medium transition-colors"
                    style={{
                      color: activeTab === tab ? accent : textMuted,
                      borderBottom: activeTab === tab ? `2px solid ${accent}` : "2px solid transparent",
                    }}
                  >
                    {tab === "details" ? t("alertDetail.title") : tab === "timeline" ? t("alertDetail.timeline") : t("alertDetail.notes")}
                  </button>
                ))}
              </div>

              <div className="p-5">
                {activeTab === "details" && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {detailItems.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${accent}15` }}>
                          <item.icon size={13} style={{ color: accent }} />
                        </div>
                        <div>
                          <p style={{ color: textMuted, fontSize: "0.72rem" }}>{t(item.labelKey)}</p>
                          <p style={{ color: textPrimary, fontSize: "0.85rem", fontWeight: 500 }}>{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "timeline" && (
                  <div className="space-y-3">
                    {TIMELINE_EVENTS.map((ev, i) => {
                      const color = ev.type === "critical" ? "#EF4444" : ev.type === "alert" ? "#F97316" : ev.type === "warning" ? "#F59E0B" : ev.type === "resolved" ? "#10B981" : accent;
                      return (
                        <div key={i} className="flex items-start gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-2.5 h-2.5 rounded-full mt-1" style={{ background: color, boxShadow: `0 0 6px ${color}60` }} />
                            {i < TIMELINE_EVENTS.length - 1 && <div className="w-px flex-1 mt-1" style={{ background: divider, minHeight: "24px" }} />}
                          </div>
                          <div className="pb-3">
                            <p style={{ color: textPrimary, fontSize: "0.82rem", fontWeight: 500 }}>{t(ev.labelKey)}</p>
                            <p style={{ color: textMuted, fontSize: "0.72rem", fontFamily: "monospace" }}>{ev.time}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {activeTab === "notes" && (
                  <div className="space-y-3">
                    <textarea
                      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none transition-all"
                      style={{ background: inputBg, border: `1px solid ${cardBorder}`, color: textPrimary, fontFamily: "inherit" }}
                      rows={4}
                      placeholder={t("alertDetail.notesPlaceholder")}
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                    />
                    <button
                      className="px-4 py-2 text-sm rounded-lg font-medium transition-all"
                      style={{ background: `${accent}20`, border: `1px solid ${accent}40`, color: accent }}
                      onClick={() => toast.success(t("alertDetail.saveNotes"))}
                    >
                      {t("alertDetail.saveNotes")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - 1/3 */}
          <div className="space-y-4">
            {/* Actions */}
            <div className="rounded-xl p-4" style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)" }}>
              <h3 className="font-semibold mb-3" style={{ color: textPrimary, fontSize: "0.875rem" }}>{t("alerts.actions")}</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#10B981" }} onClick={() => toast.success(t("alertDetail.resolve"))}>
                  <CheckCircle size={15} /> {t("alertDetail.resolve")}
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all" style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)", color: "#F59E0B" }} onClick={() => toast.warning("Alert escalated")}>
                  <AlertTriangle size={15} /> {t("status.reviewing")}
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all" style={{ background: `${accent}10`, border: `1px solid ${accent}30`, color: accent }} onClick={() => toast.success("Report generated")}>
                  <FileText size={15} /> {t("alertDetail.saveNotes")}
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all" style={{ background: inputBg, border: `1px solid ${cardBorder}`, color: textMuted }} onClick={() => toast.success(t("alertDetail.download"))}>
                  <Download size={15} /> {t("alertDetail.download")}
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", color: "#F59E0B" }} onClick={() => toast.success(`${alertId} ${t("status.dismissed")}`)}>
                  <ThumbsDown size={15} /> {t("status.dismissed")}
                </button>
              </div>
            </div>

            {/* Detected Objects */}
            <div className="rounded-xl p-4" style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)" }}>
              <h3 className="font-semibold mb-3" style={{ color: textPrimary, fontSize: "0.875rem" }}>{t("alertDetail.detectedObjectsList")}</h3>
              <div className="flex flex-wrap gap-2">
                {DETECTED_OBJECTS_KEYS.map((key, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}30` }}>{t(key)}</span>
                ))}
              </div>
            </div>

            {/* Related Alerts */}
            <div className="rounded-xl p-4" style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)" }}>
              <h3 className="font-semibold mb-3" style={{ color: textPrimary, fontSize: "0.875rem" }}>{t("alerts.title")}</h3>
              <div className="space-y-2">
                {["ALT-005", "ALT-007"].map(id => (
                  <Link key={id} href={`/alerts/${id}`} className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors" style={{ border: `1px solid ${divider}`, textDecoration: "none" }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = rowHover} onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#F59E0B" }} />
                    <span style={{ color: textPrimary, fontSize: "0.8rem" }}>{id}</span>
                    <ChevronRight size={13} className="ml-auto" style={{ color: textMuted, transform: isRTL ? "rotate(180deg)" : "none" }} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="rounded-xl p-4" style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)" }}>
              <h3 className="font-semibold mb-3" style={{ color: textPrimary, fontSize: "0.875rem" }}>{t("alertDetail.anomalyScore")}</h3>
              <div className="space-y-2.5">
                {[
                  { labelKey: "alertDetail.dwellTime", value: 90 },
                  { labelKey: "alert.suspiciousPose", value: 82 },
                  { labelKey: "cameras.zoneType", value: 75 },
                  { labelKey: "analytics.detectionRate", value: 68 },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span style={{ color: textMuted, fontSize: "0.72rem" }}>{t(item.labelKey)}</span>
                      <span style={{ color: textPrimary, fontSize: "0.72rem", fontWeight: 600 }}>{item.value}</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: isDark ? "rgba(0,212,255,0.08)" : "rgba(0,0,0,0.06)" }}>
                      <div className="h-full rounded-full" style={{ width: `${item.value}%`, background: item.value >= 85 ? "#EF4444" : item.value >= 70 ? "#F97316" : "#F59E0B" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
