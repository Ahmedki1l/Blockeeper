/**
 * BLOCKEEPER SETTINGS PAGE
 * Design: Dark Navy + Neon Cyan (Dark) / Clean White + Blue (Light)
 * HLD Section 6.2.6 - Account, Notifications, Detection Thresholds, Clip Retention, Edge Device, Security
 */
import { useState } from "react";
import { User, Bell, Shield, Sliders, Server, Save, Eye, EyeOff, ChevronRight, Plus, Trash2 } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";

const SECTIONS = [
  { id: "account", label: "Account", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "detection", label: "Detection Settings", icon: Sliders },
  { id: "security", label: "Security", icon: Shield },
  { id: "system", label: "System & Device", icon: Server },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("account");
  const [showPassword, setShowPassword] = useState(false);
  const [notifs, setNotifs] = useState({ email: true, push: true, sms: false, critical: true, high: true, medium: false });
  const [thresholds, setThresholds] = useState({ loitering: 30, dwell: 45, score: 70, retention: 30 });
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const textPrimary = isDark ? "#F1F5F9" : "#0F172A";
  const textMuted   = isDark ? "#94A3B8" : "#64748B";
  const accent      = isDark ? "#00D4FF" : "#3B82F6";
  const cardBg      = isDark ? "rgba(255,255,255,0.03)" : "#FFFFFF";
  const cardBorder  = isDark ? "rgba(0,212,255,0.1)" : "rgba(0,100,200,0.1)";
  const divider     = isDark ? "rgba(0,212,255,0.06)" : "rgba(0,0,0,0.06)";
  const inputBg     = isDark ? "rgba(255,255,255,0.05)" : "#F8FAFC";
  const inputBorder = isDark ? "rgba(0,212,255,0.15)" : "rgba(0,100,200,0.15)";

  const cardStyle = { background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)" };
  const inputStyle = { background: inputBg, border: `1px solid ${inputBorder}`, color: textPrimary, borderRadius: "8px", padding: "10px 14px", width: "100%", outline: "none", fontSize: "0.875rem" };

  function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
    return (
      <button onClick={() => onChange(!checked)} className="relative w-10 h-5 rounded-full transition-colors flex-shrink-0" style={{ background: checked ? accent : isDark ? "rgba(0,212,255,0.15)" : "#E2E8F0", border: `1px solid ${checked ? accent : inputBorder}` }}>
        <div className="absolute top-0.5 w-4 h-4 rounded-full transition-transform" style={{ background: checked ? (isDark ? "#0A0F1E" : "#FFFFFF") : textMuted, transform: checked ? "translateX(20px)" : "translateX(2px)" }} />
      </button>
    );
  }

  function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
    return (
      <div className="flex items-center justify-between py-3.5" style={{ borderBottom: `1px solid ${divider}` }}>
        <div className="flex-1 mr-4">
          <p className="font-medium text-sm" style={{ color: textPrimary }}>{label}</p>
          {description && <p style={{ color: textMuted, fontSize: "0.75rem", marginTop: "2px" }}>{description}</p>}
        </div>
        {children}
      </div>
    );
  }

  function BtnPrimary({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
    return (
      <button onClick={onClick} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all" style={{ background: `${accent}20`, border: `1px solid ${accent}40`, color: accent }}>
        {children}
      </button>
    );
  }

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 animate-bk-fade-up">
        <div className="mb-5">
          <h2 className="font-bold text-xl" style={{ color: textPrimary }}>Settings</h2>
          <p style={{ color: textMuted, fontSize: "0.8rem" }}>Manage your account and system preferences</p>
        </div>

        <div className="flex gap-5 flex-col lg:flex-row">
          {/* Sidebar Nav */}
          <div className="lg:w-52 flex-shrink-0">
            <div className="rounded-xl p-2 space-y-0.5" style={cardStyle}>
              {SECTIONS.map(s => (
                <button key={s.id} onClick={() => setActiveSection(s.id)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left" style={{ background: activeSection === s.id ? `${accent}15` : "transparent", color: activeSection === s.id ? accent : textMuted, borderLeft: `2px solid ${activeSection === s.id ? accent : "transparent"}` }}>
                  <s.icon size={15} />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 rounded-xl p-5" style={cardStyle}>

            {/* Account */}
            {activeSection === "account" && (
              <div>
                <h3 className="font-semibold mb-5" style={{ color: textPrimary, fontSize: "1rem" }}>Account Settings</h3>
                <div className="flex items-center gap-4 mb-6 pb-5" style={{ borderBottom: `1px solid ${divider}` }}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl" style={{ background: `linear-gradient(135deg, ${accent}, #3B82F6)`, color: isDark ? "#0A0F1E" : "#FFFFFF" }}>AA</div>
                  <div>
                    <p className="font-semibold" style={{ color: textPrimary }}>Admin Account</p>
                    <p style={{ color: textMuted, fontSize: "0.8rem" }}>admin@blockeeper.io</p>
                    <button className="mt-1 text-xs" style={{ color: accent }}>Change avatar</button>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Full Name", placeholder: "Admin Account", type: "text" },
                    { label: "Email Address", placeholder: "admin@blockeeper.io", type: "email" },
                    { label: "Store Name", placeholder: "My Store", type: "text" },
                    { label: "Phone Number", placeholder: "+1 (555) 000-0000", type: "tel" },
                  ].map((f, i) => (
                    <div key={i}>
                      <label className="block mb-1.5" style={{ color: textMuted, fontSize: "0.8rem", fontWeight: 500 }}>{f.label}</label>
                      <input type={f.type} style={inputStyle} placeholder={f.placeholder} />
                    </div>
                  ))}
                  <div>
                    <label className="block mb-1.5" style={{ color: textMuted, fontSize: "0.8rem", fontWeight: 500 }}>New Password</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} style={{ ...inputStyle, paddingRight: "40px" }} placeholder="••••••••" />
                      <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: textMuted }} onClick={() => setShowPassword(s => !s)}>
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                  <BtnPrimary onClick={() => toast.success("Account saved")}><Save size={14} /> Save Changes</BtnPrimary>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeSection === "notifications" && (
              <div>
                <h3 className="font-semibold mb-5" style={{ color: textPrimary, fontSize: "1rem" }}>Notification Preferences</h3>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: textMuted }}>Channels</p>
                <SettingRow label="Email Notifications" description="Receive alerts via email">
                  <Toggle checked={notifs.email} onChange={v => setNotifs(n => ({ ...n, email: v }))} />
                </SettingRow>
                <SettingRow label="Push Notifications" description="Browser and mobile push alerts">
                  <Toggle checked={notifs.push} onChange={v => setNotifs(n => ({ ...n, push: v }))} />
                </SettingRow>
                <SettingRow label="SMS Alerts" description="Text message for critical events">
                  <Toggle checked={notifs.sms} onChange={v => setNotifs(n => ({ ...n, sms: v }))} />
                </SettingRow>
                <p className="text-xs font-semibold uppercase tracking-wider mt-5 mb-3" style={{ color: textMuted }}>Alert Severity</p>
                <SettingRow label="Critical Alerts" description="Score ≥ 85 — always notify">
                  <Toggle checked={notifs.critical} onChange={v => setNotifs(n => ({ ...n, critical: v }))} />
                </SettingRow>
                <SettingRow label="High Alerts" description="Score 70–84">
                  <Toggle checked={notifs.high} onChange={v => setNotifs(n => ({ ...n, high: v }))} />
                </SettingRow>
                <SettingRow label="Medium Alerts" description="Score 55–69">
                  <Toggle checked={notifs.medium} onChange={v => setNotifs(n => ({ ...n, medium: v }))} />
                </SettingRow>
                <div className="mt-5">
                  <BtnPrimary onClick={() => toast.success("Notification preferences saved")}><Save size={14} /> Save Preferences</BtnPrimary>
                </div>
              </div>
            )}

            {/* Detection Settings */}
            {activeSection === "detection" && (
              <div>
                <h3 className="font-semibold mb-5" style={{ color: textPrimary, fontSize: "1rem" }}>Detection Thresholds</h3>
                <div className="space-y-6">
                  {[
                    { label: "Loitering Duration Threshold", key: "loitering", min: 10, max: 120, unit: "sec", description: "Alert when a person stays in a zone longer than this duration" },
                    { label: "Dwell Time Threshold", key: "dwell", min: 10, max: 120, unit: "sec", description: "Maximum time before dwell alert is triggered" },
                    { label: "Minimum Anomaly Score", key: "score", min: 40, max: 95, unit: "/ 100", description: "Only generate alerts above this confidence score" },
                    { label: "Video Clip Retention", key: "retention", min: 7, max: 90, unit: "days", description: "How long to keep recorded alert clips in cloud storage" },
                  ].map((item) => (
                    <div key={item.key}>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-medium text-sm" style={{ color: textPrimary }}>{item.label}</label>
                        <span className="font-bold px-2 py-0.5 rounded" style={{ color: accent, background: `${accent}15`, fontSize: "0.8rem", fontFamily: "monospace" }}>
                          {thresholds[item.key as keyof typeof thresholds]} {item.unit}
                        </span>
                      </div>
                      <p style={{ color: textMuted, fontSize: "0.75rem", marginBottom: "8px" }}>{item.description}</p>
                      <input type="range" min={item.min} max={item.max} value={thresholds[item.key as keyof typeof thresholds]} onChange={e => setThresholds(t => ({ ...t, [item.key]: Number(e.target.value) }))} className="w-full h-2 rounded-full cursor-pointer" style={{ accentColor: accent }} />
                      <div className="flex justify-between mt-1">
                        <span style={{ color: textMuted, fontSize: "0.7rem" }}>{item.min} {item.unit}</span>
                        <span style={{ color: textMuted, fontSize: "0.7rem" }}>{item.max} {item.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5">
                  <BtnPrimary onClick={() => toast.success("Thresholds saved")}><Save size={14} /> Save Thresholds</BtnPrimary>
                </div>
              </div>
            )}

            {/* Security */}
            {activeSection === "security" && (
              <div>
                <h3 className="font-semibold mb-5" style={{ color: textPrimary, fontSize: "1rem" }}>Security Settings</h3>
                <SettingRow label="Two-Factor Authentication" description="Require 2FA for all logins">
                  <Toggle checked={true} onChange={() => toast.info("2FA settings updated")} />
                </SettingRow>
                <SettingRow label="Session Timeout" description="Auto-logout after inactivity">
                  <select style={{ ...inputStyle, width: "auto", padding: "6px 12px" }}>
                    <option>30 minutes</option>
                    <option>1 hour</option>
                    <option>4 hours</option>
                    <option>8 hours</option>
                  </select>
                </SettingRow>
                <SettingRow label="Audit Log" description="Track all user actions">
                  <Toggle checked={true} onChange={() => {}} />
                </SettingRow>
                <SettingRow label="IP Whitelist" description="Restrict access to specific IPs">
                  <button className="flex items-center gap-1 text-xs" style={{ color: accent }}>Configure <ChevronRight size={12} /></button>
                </SettingRow>
                <div className="mt-5 p-4 rounded-xl" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}>
                  <p className="font-semibold text-sm mb-1" style={{ color: "#EF4444" }}>Danger Zone</p>
                  <p style={{ color: textMuted, fontSize: "0.78rem", marginBottom: "12px" }}>These actions are irreversible. Proceed with caution.</p>
                  <button className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#EF4444" }} onClick={() => toast.error("Account deletion requires confirmation")}>
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {/* System & Device */}
            {activeSection === "system" && (
              <div>
                <h3 className="font-semibold mb-5" style={{ color: textPrimary, fontSize: "1rem" }}>System & Edge Devices</h3>
                {/* Registered Devices */}
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: textMuted }}>Registered Edge Devices</p>
                <div className="space-y-2 mb-5">
                  {[
                    { id: "RPi-5-001", name: "Main Store — Floor 1", cameras: 5, status: "online", ip: "192.168.1.10" },
                    { id: "RPi-5-002", name: "Main Store — Floor 2", cameras: 5, status: "online", ip: "192.168.1.11" },
                  ].map((dev, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg" style={{ background: inputBg, border: `1px solid ${inputBorder}` }}>
                      <div className="flex items-center gap-3">
                        <Server size={16} style={{ color: accent }} />
                        <div>
                          <p className="font-medium text-sm" style={{ color: textPrimary }}>{dev.name}</p>
                          <p style={{ color: textMuted, fontSize: "0.72rem", fontFamily: "monospace" }}>{dev.id} · {dev.ip} · {dev.cameras} cameras</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(16,185,129,0.1)", color: "#10B981" }}>{dev.status}</span>
                        <button style={{ color: "#EF4444" }} onClick={() => toast.error(`${dev.id} removed`)}><Trash2 size={13} /></button>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium mb-6 transition-all" style={{ background: `${accent}15`, border: `1px solid ${accent}30`, color: accent }} onClick={() => toast.info("Add device wizard coming soon")}>
                  <Plus size={14} /> Register New Edge Device
                </button>

                {/* System Info */}
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: textMuted }}>System Information</p>
                <div className="space-y-0 mb-5">
                  {[
                    { label: "AI Model", value: "YOLOv8n + Pose Estimation v2.1" },
                    { label: "Camera Protocol", value: "RTSP / ONVIF" },
                    { label: "Cloud Sync", value: "AWS IoT Core · us-east-1" },
                    { label: "App Version", value: "BlocKeeper v1.0.0" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5" style={{ borderBottom: `1px solid ${divider}` }}>
                      <span style={{ color: textMuted, fontSize: "0.82rem" }}>{item.label}</span>
                      <span style={{ color: textPrimary, fontSize: "0.82rem", fontWeight: 500, fontFamily: "monospace" }}>{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all" style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: textMuted }} onClick={() => toast.success("System is up to date")}>Check for Updates</button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444" }} onClick={() => toast.warning("Restarting edge device...")}>Restart Device</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
