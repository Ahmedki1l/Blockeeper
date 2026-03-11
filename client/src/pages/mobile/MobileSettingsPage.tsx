/**
 * BLOCKEEPER MOBILE SETTINGS
 * Design: Dark Navy + Neon Cyan (Dark) / Clean White + Blue (Light)
 * Theme toggle is wired to the global ThemeContext
 */
import { useState } from "react";
import { User, Bell, Shield, Fingerprint, ChevronRight, LogOut, Moon, Globe, Wifi, Sun } from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function MobileSettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { t, isRTL } = useLanguage();
  const isDark = theme === "dark";
  const [, setLocation] = useLocation();

  const [biometric, setBiometric] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [criticalOnly, setCriticalOnly] = useState(false);

  const accent      = isDark ? "#00D4FF" : "#3B82F6";
  const cardBg      = isDark ? "#0D1526" : "#FFFFFF";
  const cardBorder  = isDark ? "rgba(0,212,255,0.08)" : "rgba(0,100,200,0.1)";
  const divider     = isDark ? "rgba(0,212,255,0.06)" : "rgba(0,100,200,0.08)";
  const bg          = isDark ? "#0A0F1E" : "#F1F5F9";
  const textPrimary = isDark ? "#F1F5F9" : "#0F172A";
  const textMuted   = isDark ? "#94A3B8" : "#64748B";

  function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
    return (
      <button onClick={() => onChange(!checked)} className="relative w-10 h-5 rounded-full transition-colors" style={{ background: checked ? accent : `${accent}20`, border: `1px solid ${checked ? accent : `${accent}30`}` }}>
        <div className="absolute top-0.5 w-4 h-4 rounded-full transition-transform" style={{ background: checked ? (isDark ? "#0A0F1E" : "#FFFFFF") : textMuted, transform: checked ? "translateX(20px)" : "translateX(2px)" }} />
      </button>
    );
  }

  return (
    <MobileLayout title={t("settings.title")}>
      <div className="px-4 space-y-4 pt-2 pb-4" style={{ background: bg }}>

        {/* Profile Card */}
        <div className="rounded-2xl p-4 flex items-center gap-4" style={{ background: isDark ? "linear-gradient(135deg, #0D1526, #0A1020)" : "linear-gradient(135deg, #EFF6FF, #DBEAFE)", border: `1px solid ${isDark ? "rgba(0,212,255,0.15)" : "rgba(59,130,246,0.2)"}` }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0" style={{ background: `linear-gradient(135deg, ${accent}, #3B82F6)`, color: isDark ? "#0A0F1E" : "#FFFFFF" }}>AA</div>
          <div className="flex-1">
            <div className="font-bold" style={{ color: textPrimary }}>Admin Account</div>
            <div style={{ color: textMuted, fontSize: "0.78rem" }}>admin@blockeeper.io</div>
            <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#10B981" }} />
              <span style={{ color: "#10B981", fontSize: "0.65rem", fontWeight: 600 }}>Active</span>
            </div>
          </div>
          <ChevronRight size={16} style={{ color: textMuted }} />
        </div>

        {/* Biometric Login */}
        <div className="rounded-2xl p-4" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}>
              <Fingerprint size={18} style={{ color: accent }} />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm" style={{ color: textPrimary }}>Biometric Login</div>
              <div style={{ color: textMuted, fontSize: "0.72rem" }}>Use Face ID or Fingerprint</div>
            </div>
            <Toggle checked={biometric} onChange={setBiometric} />
          </div>
          {biometric && (
            <div className="flex items-center justify-center py-4 rounded-xl" style={{ background: `${accent}06`, border: `1px dashed ${accent}20` }}>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ background: `${accent}10`, border: `2px solid ${accent}25`, boxShadow: `0 0 20px ${accent}15` }}>
                  <Fingerprint size={30} style={{ color: accent }} />
                </div>
                <div style={{ color: textMuted, fontSize: "0.75rem" }}>Touch to authenticate</div>
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="rounded-2xl overflow-hidden" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
          <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: `1px solid ${divider}` }}>
            <Bell size={15} style={{ color: accent }} />
            <span className="font-semibold text-sm" style={{ color: textPrimary }}>Notifications</span>
          </div>
          {[
            { label: "Push Notifications", sub: "Real-time alerts on device", checked: pushNotifs, onChange: setPushNotifs },
            { label: "Email Alerts", sub: "Daily digest summary", checked: emailNotifs, onChange: setEmailNotifs },
            { label: "Critical Only", sub: "Only high-severity alerts", checked: criticalOnly, onChange: setCriticalOnly },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3" style={{ borderBottom: i < 2 ? `1px solid ${divider}` : "none" }}>
              <div>
                <div className="font-medium text-sm" style={{ color: textPrimary }}>{item.label}</div>
                <div style={{ color: textMuted, fontSize: "0.7rem" }}>{item.sub}</div>
              </div>
              <Toggle checked={item.checked} onChange={item.onChange} />
            </div>
          ))}
        </div>

        {/* Appearance */}
        <div className="rounded-2xl overflow-hidden" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
          <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: `1px solid ${divider}` }}>
            {isDark ? <Moon size={15} style={{ color: accent }} /> : <Sun size={15} style={{ color: accent }} />}
            <span className="font-semibold text-sm" style={{ color: textPrimary }}>Appearance</span>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <div className="font-medium text-sm" style={{ color: textPrimary }}>Dark Mode</div>
              <div style={{ color: textMuted, fontSize: "0.7rem" }}>{isDark ? "Dark theme active" : "Light theme active"}</div>
            </div>
            <Toggle checked={isDark} onChange={() => toggleTheme && toggleTheme()} />
          </div>
        </div>

        {/* Security & Connectivity */}
        <div className="rounded-2xl overflow-hidden" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
          <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: `1px solid ${divider}` }}>
            <Shield size={15} style={{ color: accent }} />
            <span className="font-semibold text-sm" style={{ color: textPrimary }}>Security & Connectivity</span>
          </div>
          {[
            { icon: Globe, label: "Language", sub: "English" },
            { icon: Wifi, label: "Edge Device", sub: "RPi-5-001 · Connected" },
            { icon: Shield, label: "Change Password", sub: "Last changed 30 days ago" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: i < 2 ? `1px solid ${divider}` : "none" }} onClick={() => toast.info(`${item.label} settings`)}>
              <item.icon size={15} style={{ color: textMuted }} />
              <div className="flex-1">
                <div className="font-medium text-sm" style={{ color: textPrimary }}>{item.label}</div>
                <div style={{ color: textMuted, fontSize: "0.7rem" }}>{item.sub}</div>
              </div>
              <ChevronRight size={14} style={{ color: textMuted }} />
            </div>
          ))}
        </div>

        {/* System Info */}
        <div className="rounded-2xl p-4" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
          <div className="font-semibold text-sm mb-3" style={{ color: textPrimary }}>System Info</div>
          {[
            { label: "App Version", value: "v1.0.0" },
            { label: "AI Model", value: "YOLOv8n v2.1" },
            { label: "Edge Device", value: "RPi-5-001" },
            { label: "Last Sync", value: "Just now" },
          ].map((item, i) => (
            <div key={i} className="flex justify-between py-1.5">
              <span style={{ color: textMuted, fontSize: "0.78rem" }}>{item.label}</span>
              <span style={{ color: textPrimary, fontSize: "0.78rem", fontFamily: "monospace" }}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Logout */}
        <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444" }} onClick={() => { toast.success("Signed out"); setLocation("/login"); }}>
          <LogOut size={16} /> Sign Out
        </button>

      </div>
    </MobileLayout>
  );
}
