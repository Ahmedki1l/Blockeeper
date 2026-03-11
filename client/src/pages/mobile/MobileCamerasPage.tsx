/**
 * BLOCKEEPER MOBILE CAMERAS
 * Design: Dark Navy + Neon Cyan (Dark) / Clean White + Blue (Light)
 */
import { Camera, Wifi, WifiOff, Settings, AlertTriangle } from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

const CAMERAS = [
  { id: "CAM-01", name: "Entrance A", zone: "Entry Zone", status: "online", alerts: 3 },
  { id: "CAM-02", name: "Aisle 1", zone: "Product Zone", status: "online", alerts: 0 },
  { id: "CAM-03", name: "Aisle 3", zone: "Product Zone", status: "online", alerts: 1 },
  { id: "CAM-04", name: "Storage Room", zone: "Restricted", status: "online", alerts: 2 },
  { id: "CAM-05", name: "Checkout", zone: "Checkout Zone", status: "online", alerts: 0 },
  { id: "CAM-06", name: "Parking Lot", zone: "Exterior", status: "online", alerts: 1 },
  { id: "CAM-07", name: "Entrance B", zone: "Entry Zone", status: "offline", alerts: 0 },
  { id: "CAM-08", name: "Back Office", zone: "Restricted", status: "offline", alerts: 0 },
  { id: "CAM-09", name: "Break Room", zone: "Staff Area", status: "online", alerts: 0 },
  { id: "CAM-10", name: "Loading Bay", zone: "Exterior", status: "online", alerts: 0 },
];

export default function MobileCamerasPage() {
  const online = CAMERAS.filter(c => c.status === "online").length;
  const { theme } = useTheme();
  const { t, isRTL } = useLanguage();
  const isDark = theme === "dark";

  const accent      = isDark ? "#00D4FF" : "#3B82F6";
  const cardBg      = isDark ? "#0D1526" : "#FFFFFF";
  const bg          = isDark ? "#0A0F1E" : "#F1F5F9";
  const textPrimary = isDark ? "#F1F5F9" : "#0F172A";
  const textMuted   = isDark ? "#94A3B8" : "#64748B";
  const feedBg      = isDark ? "linear-gradient(135deg, #0A0F1E, #0D1526)" : "linear-gradient(135deg, #E2E8F0, #F1F5F9)";
  const feedBgOff   = isDark ? "#080C14" : "#E2E8F0";

  return (
    <MobileLayout title={t("cameras.title")}>
      <div className="px-4 space-y-4 pt-2 pb-4" style={{ background: bg }} dir={isRTL ? "rtl" : "ltr"}>

        {/* Status Bar */}
        <div className="flex gap-3">
          <div className="flex-1 rounded-xl p-3 text-center" style={{ background: cardBg, border: "1px solid rgba(16,185,129,0.2)" }}>
            <div className="font-bold text-lg" style={{ color: "#10B981" }}>{online}</div>
            <div style={{ color: textMuted, fontSize: "0.7rem" }}>{t("status.online")}</div>
          </div>
          <div className="flex-1 rounded-xl p-3 text-center" style={{ background: cardBg, border: "1px solid rgba(239,68,68,0.2)" }}>
            <div className="font-bold text-lg" style={{ color: "#EF4444" }}>{CAMERAS.length - online}</div>
            <div style={{ color: textMuted, fontSize: "0.7rem" }}>{t("status.offline")}</div>
          </div>
          <div className="flex-1 rounded-xl p-3 text-center" style={{ background: cardBg, border: `1px solid ${accent}25` }}>
            <div className="font-bold text-lg" style={{ color: accent }}>{CAMERAS.length}</div>
            <div style={{ color: textMuted, fontSize: "0.7rem" }}>{t("cameras.total")}</div>
          </div>
        </div>

        {/* Camera List */}
        <div className="space-y-2">
          {CAMERAS.map(cam => (
            <div key={cam.id} className="rounded-xl overflow-hidden" style={{ background: cardBg, border: `1px solid ${cam.status === "offline" ? "rgba(239,68,68,0.15)" : `${accent}12`}` }}>
              {/* Feed Preview */}
              <div className="relative" style={{ aspectRatio: "16/7", background: cam.status === "online" ? feedBg : feedBgOff }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera size={24} style={{ color: cam.status === "online" ? textMuted : "#EF4444", opacity: 0.25 }} />
                </div>
                <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded" style={{ background: "rgba(0,0,0,0.65)" }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: cam.status === "online" ? "#10B981" : "#EF4444" }} />
                  <span style={{ color: "#fff", fontSize: "0.6rem", fontWeight: 600 }}>{cam.id}</span>
                </div>
                {cam.alerts > 0 && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded" style={{ background: "rgba(239,68,68,0.85)" }}>
                    <AlertTriangle size={9} style={{ color: "#fff" }} />
                    <span style={{ color: "#fff", fontSize: "0.6rem", fontWeight: 600 }}>{cam.alerts}</span>
                  </div>
                )}
                {cam.status === "offline" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span style={{ color: "#EF4444", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em" }}>{t("status.offline").toUpperCase()}</span>
                  </div>
                )}
              </div>
              {/* Info Row */}
              <div className="flex items-center justify-between px-3 py-2.5">
                <div>
                  <div className="font-medium text-sm" style={{ color: textPrimary }}>{cam.name}</div>
                  <div style={{ color: textMuted, fontSize: "0.7rem" }}>{cam.zone}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {cam.status === "online" ? <Wifi size={13} style={{ color: "#10B981" }} /> : <WifiOff size={13} style={{ color: "#EF4444" }} />}
                    <span style={{ color: cam.status === "online" ? "#10B981" : "#EF4444", fontSize: "0.7rem", fontWeight: 500 }}>{cam.status === "online" ? t("status.online") : t("status.offline")}</span>
                  </div>
                  <button className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${accent}10` }} onClick={() => toast.info(`${cam.name} settings`)}>
                    <Settings size={13} style={{ color: textMuted }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}
