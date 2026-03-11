/**
 * CameraFeedWidget
 * Shows a live camera feed thumbnail on the dashboard.
 * A mini camera-picker button row lets the user switch between
 * cameras belonging to the currently selected store.
 */
import { useState, useEffect } from "react";
import { Camera as CameraIcon, Wifi, WifiOff, Wrench, ChevronLeft, ChevronRight, Maximize2, Radio } from "lucide-react";
import { useStore } from "@/contexts/StoreContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getCamerasByStore, Camera } from "@/data/stores";
import { ALL_STORES_ID } from "@/data/stores";
import { CAMERAS } from "@/data/stores";

const STATUS_BADGE: Record<Camera["status"], { label: string; labelAr: string; color: string; icon: React.ElementType }> = {
  online:      { label: "LIVE",        labelAr: "مباشر",     color: "#10B981", icon: Radio },
  offline:     { label: "OFFLINE",     labelAr: "غير متصل",  color: "#EF4444", icon: WifiOff },
  maintenance: { label: "MAINTENANCE", labelAr: "صيانة",     color: "#F59E0B", icon: Wrench },
};

export function CameraFeedWidget() {
  const { selectedStoreId } = useStore();
  const { t, isRTL, lang } = useLanguage();

  // Cameras available for the current store selection
  const availableCameras: Camera[] =
    selectedStoreId === ALL_STORES_ID
      ? CAMERAS
      : getCamerasByStore(selectedStoreId);

  const [activeCameraId, setActiveCameraId] = useState<string>(
    availableCameras[0]?.id ?? ""
  );

  // When store changes, reset to first camera of new store
  useEffect(() => {
    const cams =
      selectedStoreId === ALL_STORES_ID ? CAMERAS : getCamerasByStore(selectedStoreId);
    if (cams.length > 0) setActiveCameraId(cams[0].id);
  }, [selectedStoreId]);

  const activeCamera = availableCameras.find((c) => c.id === activeCameraId) ?? availableCameras[0];

  if (!activeCamera) {
    return (
      <div className="rounded-2xl flex items-center justify-center h-48"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="text-center">
          <CameraIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-xs opacity-40">{t("cameras.noCameras") || "No cameras available"}</p>
        </div>
      </div>
    );
  }

  const badge = STATUS_BADGE[activeCamera.status];
  const BadgeIcon = badge.icon;
  const badgeLabel = lang === "ar" ? badge.labelAr : badge.label;

  // Scroll camera picker left/right
  const currentIdx = availableCameras.findIndex((c) => c.id === activeCameraId);
  const canPrev = currentIdx > 0;
  const canNext = currentIdx < availableCameras.length - 1;

  return (
    <div className="rounded-2xl overflow-hidden flex flex-col"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,212,255,0.12)" }}>

      {/* ── Feed Area ─────────────────────────────────────────────────── */}
      <div className="relative w-full" style={{ aspectRatio: "16/9", background: "#050a14" }}>
        {/* Thumbnail / Feed */}
        <img
          key={activeCamera.id}
          src={activeCamera.thumbnailUrl}
          alt={activeCamera.name}
          className="w-full h-full object-cover"
          style={{ opacity: activeCamera.status === "online" ? 1 : 0.45 }}
        />

        {/* Scan-line overlay for "live" feel */}
        {activeCamera.status === "online" && (
          <div className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
            }}
          />
        )}

        {/* Status badge (top-left) */}
        <div className={`absolute top-2 ${isRTL ? "right-2" : "left-2"} flex items-center gap-1 px-2 py-0.5 rounded-full`}
          style={{ background: "rgba(0,0,0,0.65)", border: `1px solid ${badge.color}33`, backdropFilter: "blur(4px)" }}>
          <BadgeIcon className="w-2.5 h-2.5" style={{ color: badge.color }} />
          <span className="text-[10px] font-bold tracking-wider" style={{ color: badge.color }}>{badgeLabel}</span>
        </div>

        {/* Camera name + zone (bottom-left) */}
        <div className={`absolute bottom-0 ${isRTL ? "right-0" : "left-0"} right-0 px-3 py-2`}
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)" }}>
          <p className="text-xs font-semibold text-white">{activeCamera.name}</p>
          <p className="text-[10px] text-slate-300">{activeCamera.zone} · {activeCamera.resolution} · {activeCamera.fps}fps</p>
        </div>

        {/* Expand icon (top-right) */}
        <button className={`absolute top-2 ${isRTL ? "left-2" : "right-2"} p-1.5 rounded-lg transition-colors hover:bg-white/20`}
          style={{ background: "rgba(0,0,0,0.5)" }}
          title={t("cameras.fullscreen") || "Fullscreen"}>
          <Maximize2 className="w-3 h-3 text-white" />
        </button>
      </div>

      {/* ── Camera Picker ─────────────────────────────────────────────── */}
      <div className="px-3 py-2.5 flex items-center gap-2"
        style={{ borderTop: "1px solid rgba(0,212,255,0.08)" }}>

        {/* Prev arrow */}
        <button
          onClick={() => canPrev && setActiveCameraId(availableCameras[currentIdx - 1].id)}
          disabled={!canPrev}
          className="p-1 rounded-lg transition-colors disabled:opacity-30 hover:bg-white/10 flex-shrink-0"
        >
          {isRTL ? <ChevronRight className="w-3.5 h-3.5 text-slate-400" /> : <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />}
        </button>

        {/* Camera pill buttons */}
        <div className="flex-1 flex items-center gap-1.5 overflow-x-auto pb-0.5 bk-scrollbar" style={{ scrollbarWidth: "none" }}>
          {availableCameras.map((cam) => {
            const isActive = cam.id === activeCameraId;
            const statusColor = cam.status === "online" ? "#10B981" : cam.status === "offline" ? "#EF4444" : "#F59E0B";
            return (
              <button
                key={cam.id}
                onClick={() => setActiveCameraId(cam.id)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap flex-shrink-0 transition-all"
                style={{
                  background: isActive ? "rgba(0,212,255,0.15)" : "rgba(255,255,255,0.05)",
                  border: isActive ? "1px solid rgba(0,212,255,0.4)" : "1px solid rgba(255,255,255,0.08)",
                  color: isActive ? "#00D4FF" : "#94A3B8",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: statusColor }} />
                {cam.id}
              </button>
            );
          })}
        </div>

        {/* Next arrow */}
        <button
          onClick={() => canNext && setActiveCameraId(availableCameras[currentIdx + 1].id)}
          disabled={!canNext}
          className="p-1 rounded-lg transition-colors disabled:opacity-30 hover:bg-white/10 flex-shrink-0"
        >
          {isRTL ? <ChevronLeft className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
        </button>
      </div>

      {/* Camera count label */}
      <div className="px-3 pb-2 flex items-center justify-between">
        <span className="text-[10px] text-slate-500">
          {currentIdx + 1} / {availableCameras.length} {t("nav.cameras") || "Cameras"}
        </span>
        <span className="text-[10px] text-slate-500">
          {availableCameras.filter(c => c.status === "online").length} {t("cameras.online") || "online"}
        </span>
      </div>
    </div>
  );
}
