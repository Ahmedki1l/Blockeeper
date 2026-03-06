/**
 * BLOCKEEPER CAMERAS PAGE
 * Design: Dark Navy + Neon Cyan (Dark) / Clean White + Blue (Light)
 * HLD Section 6.2.4 - Camera grid, status, RTSP, zone, edge device, add/edit/delete
 */
import { useState } from "react";
import { Camera, Wifi, WifiOff, Settings, Play, Maximize2, RotateCcw, Plus, Search, Trash2, Edit3, X, Server } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";

const CAMERAS = [
  { id: "CAM-01", name: "Entrance A", zone: "Entry Zone", type: "Entry/Exit", rtsp: "rtsp://192.168.1.101:554/stream", status: "online", fps: 5, res: "720p", alerts: 3, uptime: "99.2%", edge: "RPi-5-001" },
  { id: "CAM-02", name: "Aisle 1", zone: "Product Zone", type: "Product", rtsp: "rtsp://192.168.1.102:554/stream", status: "online", fps: 5, res: "720p", alerts: 0, uptime: "98.8%", edge: "RPi-5-001" },
  { id: "CAM-03", name: "Aisle 3", zone: "Product Zone", type: "Product", rtsp: "rtsp://192.168.1.103:554/stream", status: "online", fps: 5, res: "720p", alerts: 1, uptime: "99.5%", edge: "RPi-5-001" },
  { id: "CAM-04", name: "Storage Room", zone: "Restricted", type: "Restricted", rtsp: "rtsp://192.168.1.104:554/stream", status: "online", fps: 5, res: "720p", alerts: 2, uptime: "97.1%", edge: "RPi-5-002" },
  { id: "CAM-05", name: "Checkout", zone: "Checkout Zone", type: "Checkout", rtsp: "rtsp://192.168.1.105:554/stream", status: "online", fps: 5, res: "720p", alerts: 0, uptime: "99.9%", edge: "RPi-5-002" },
  { id: "CAM-06", name: "Parking Lot", zone: "Exterior", type: "Exterior", rtsp: "rtsp://192.168.1.106:554/stream", status: "online", fps: 5, res: "720p", alerts: 1, uptime: "96.4%", edge: "RPi-5-002" },
  { id: "CAM-07", name: "Entrance B", zone: "Entry Zone", type: "Entry/Exit", rtsp: "rtsp://192.168.1.107:554/stream", status: "offline", fps: 0, res: "—", alerts: 0, uptime: "—", edge: "RPi-5-001" },
  { id: "CAM-08", name: "Back Office", zone: "Restricted", type: "Restricted", rtsp: "rtsp://192.168.1.108:554/stream", status: "offline", fps: 0, res: "—", alerts: 0, uptime: "—", edge: "RPi-5-002" },
  { id: "CAM-09", name: "Break Room", zone: "Staff Area", type: "Staff", rtsp: "rtsp://192.168.1.109:554/stream", status: "online", fps: 5, res: "720p", alerts: 0, uptime: "100%", edge: "RPi-5-001" },
  { id: "CAM-10", name: "Loading Bay", zone: "Exterior", type: "Exterior", rtsp: "rtsp://192.168.1.110:554/stream", status: "online", fps: 5, res: "720p", alerts: 0, uptime: "98.3%", edge: "RPi-5-002" },
];

export default function CamerasPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState<typeof CAMERAS[0] | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const textPrimary = isDark ? "#F1F5F9" : "#0F172A";
  const textMuted   = isDark ? "#94A3B8" : "#64748B";
  const accent      = isDark ? "#00D4FF" : "#3B82F6";
  const cardBg      = isDark ? "rgba(255,255,255,0.03)" : "#FFFFFF";
  const cardBorder  = isDark ? "rgba(0,212,255,0.1)" : "rgba(0,100,200,0.1)";
  const divider     = isDark ? "rgba(0,212,255,0.06)" : "rgba(0,0,0,0.06)";
  const inputBg     = isDark ? "rgba(255,255,255,0.05)" : "#F8FAFC";

  const filtered = CAMERAS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.zone.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase())
  );

  const online = CAMERAS.filter(c => c.status === "online").length;

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-5 animate-bk-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="font-bold text-xl" style={{ color: textPrimary }}>Camera Management</h2>
            <p style={{ color: textMuted, fontSize: "0.8rem" }}>{online}/{CAMERAS.length} cameras online · Edge device: RPi-5-001, RPi-5-002</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all" style={{ background: inputBg, border: `1px solid ${cardBorder}`, color: textMuted }} onClick={() => toast.success("Cameras refreshed")}>
              <RotateCcw size={14} /> Refresh
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg font-medium transition-all" style={{ background: `${accent}20`, border: `1px solid ${accent}40`, color: accent }} onClick={() => toast.info("Add camera feature coming soon")}>
              <Plus size={14} /> Add Camera
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Online", value: online, color: "#10B981" },
            { label: "Offline", value: CAMERAS.length - online, color: "#EF4444" },
            { label: "Active Alerts", value: CAMERAS.reduce((s, c) => s + c.alerts, 0), color: "#F59E0B" },
            { label: "Avg Uptime", value: "98.6%", color: accent },
          ].map((s, i) => (
            <div key={i} className="px-4 py-3 rounded-xl flex items-center gap-3" style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div className="w-2 h-8 rounded-full" style={{ background: s.color }} />
              <div>
                <div className="font-bold text-lg" style={{ color: textPrimary }}>{s.value}</div>
                <div style={{ color: textMuted, fontSize: "0.72rem" }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search & View Toggle */}
        <div className="flex gap-3 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: textMuted }} />
            <input className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none transition-all" style={{ background: inputBg, border: `1px solid ${cardBorder}`, color: textPrimary }} placeholder="Search cameras..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex rounded-lg overflow-hidden" style={{ border: `1px solid ${cardBorder}` }}>
            {(["grid", "list"] as const).map(v => (
              <button key={v} onClick={() => setView(v)} className="px-3 py-2 text-xs font-medium capitalize transition-colors" style={{ background: view === v ? `${accent}20` : "transparent", color: view === v ? accent : textMuted }}>
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Camera Grid */}
        {view === "grid" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(cam => (
              <div
                key={cam.id}
                className="rounded-xl overflow-hidden cursor-pointer transition-all"
                style={{ background: cardBg, border: `1px solid ${selected === cam.id ? accent + "60" : cardBorder}`, boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)" }}
                onClick={() => setSelected(cam.id === selected ? null : cam.id)}
              >
                {/* Feed Thumbnail */}
                <div className="relative" style={{ aspectRatio: "16/9", background: cam.status === "online" ? "linear-gradient(135deg, #0A0F1E 0%, #0D1526 100%)" : "#0A0D1A" }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {cam.status === "online" ? (
                      <Camera size={28} style={{ color: "#94A3B8", opacity: 0.2 }} />
                    ) : (
                      <WifiOff size={28} style={{ color: "#EF4444", opacity: 0.3 }} />
                    )}
                  </div>
                  <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded" style={{ background: "rgba(0,0,0,0.7)" }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: cam.status === "online" ? "#10B981" : "#EF4444" }} />
                    <span style={{ color: "#fff", fontSize: "0.65rem", fontWeight: 600 }}>{cam.status.toUpperCase()}</span>
                  </div>
                  {cam.alerts > 0 && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "#EF4444", color: "#fff" }}>
                      {cam.alerts}
                    </div>
                  )}
                  {cam.status === "online" && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${accent}30`, border: `1px solid ${accent}60` }}>
                        <Play size={16} style={{ color: accent, marginLeft: "2px" }} />
                      </div>
                    </div>
                  )}
                  <button className="absolute bottom-2 right-2 w-6 h-6 rounded flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity" style={{ background: "rgba(0,0,0,0.6)" }}>
                    <Maximize2 size={11} style={{ color: "#fff" }} />
                  </button>
                </div>
                {/* Info */}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm" style={{ color: textPrimary }}>{cam.name}</span>
                    <span style={{ color: textMuted, fontSize: "0.7rem", fontFamily: "monospace" }}>{cam.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: textMuted, fontSize: "0.72rem" }}>{cam.zone}</span>
                    <div className="flex items-center gap-1.5">
                      {cam.status === "online" && <span style={{ color: textMuted, fontSize: "0.7rem" }}>{cam.fps} FPS</span>}
                      <button className="w-6 h-6 rounded flex items-center justify-center transition-colors" style={{ color: textMuted }} onClick={e => { e.stopPropagation(); setShowDetail(cam); }}>
                        <Settings size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden" style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div className="hidden lg:grid px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 100px", color: textMuted, borderBottom: `1px solid ${divider}` }}>
              <span>Camera</span><span>Zone</span><span>Status</span><span>Resolution</span><span>Uptime</span><span>Actions</span>
            </div>
            <div className="divide-y" style={{ borderColor: divider }}>
              {filtered.map(cam => (
                <div key={cam.id} className="flex lg:grid items-center gap-4 px-5 py-3.5 transition-colors" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 100px" }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)"} onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${accent}15` }}>
                      <Camera size={15} style={{ color: accent }} />
                    </div>
                    <div>
                      <div className="font-medium text-sm" style={{ color: textPrimary }}>{cam.name}</div>
                      <div style={{ color: textMuted, fontSize: "0.7rem", fontFamily: "monospace" }}>{cam.id} · {cam.edge}</div>
                    </div>
                  </div>
                  <span className="hidden lg:block text-sm" style={{ color: textMuted }}>{cam.zone}</span>
                  <div className="hidden lg:flex items-center gap-1.5">
                    {cam.status === "online" ? <Wifi size={13} style={{ color: "#10B981" }} /> : <WifiOff size={13} style={{ color: "#EF4444" }} />}
                    <span className="text-xs font-medium" style={{ color: cam.status === "online" ? "#10B981" : "#EF4444" }}>{cam.status}</span>
                  </div>
                  <span className="hidden lg:block text-sm" style={{ color: textPrimary }}>{cam.res}</span>
                  <span className="hidden lg:block text-sm" style={{ color: textMuted }}>{cam.uptime}</span>
                  <div className="hidden lg:flex items-center gap-2">
                    {cam.alerts > 0 && <span className="px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444" }}>{cam.alerts}</span>}
                    <button className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors" style={{ color: textMuted }} onClick={() => setShowDetail(cam)}>
                      <Edit3 size={12} />
                    </button>
                    <button className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors" style={{ color: "#EF4444" }} onClick={() => toast.error(`${cam.name} removed`)}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Camera Detail Modal */}
        {showDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
            <div className="w-full max-w-lg rounded-2xl p-6 space-y-4" style={{ background: isDark ? "#0D1526" : "#FFFFFF", border: `1px solid ${cardBorder}`, boxShadow: `0 20px 60px rgba(0,0,0,0.5)` }}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg" style={{ color: textPrimary }}>{showDetail.name} — Settings</h3>
                <button onClick={() => setShowDetail(null)} style={{ color: textMuted }}><X size={18} /></button>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Camera ID", value: showDetail.id },
                  { label: "Zone Type", value: showDetail.type },
                  { label: "RTSP URL", value: showDetail.rtsp },
                  { label: "Edge Device", value: showDetail.edge },
                  { label: "Resolution", value: showDetail.res },
                  { label: "Frame Rate", value: `${showDetail.fps} FPS` },
                  { label: "Uptime", value: showDetail.uptime },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: `1px solid ${divider}` }}>
                    <span style={{ color: textMuted, fontSize: "0.82rem" }}>{item.label}</span>
                    <span style={{ color: textPrimary, fontSize: "0.82rem", fontWeight: 500, fontFamily: item.label === "RTSP URL" || item.label === "Camera ID" ? "monospace" : "inherit", maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all" style={{ background: `${accent}15`, border: `1px solid ${accent}30`, color: accent }} onClick={() => { toast.success("Settings saved"); setShowDetail(null); }}>
                  <Edit3 size={14} /> Save Changes
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#EF4444" }} onClick={() => { toast.error(`${showDetail.name} removed`); setShowDetail(null); }}>
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
