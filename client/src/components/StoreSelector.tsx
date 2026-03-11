import { useState, useRef, useEffect } from "react";
import { Building2, ChevronDown, CheckCircle2, AlertCircle, Wrench, Globe, MapPin } from "lucide-react";
import { useStore } from "@/contexts/StoreContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ALL_STORES_ID, Store } from "@/data/stores";

const STATUS_COLORS = (status: Store["status"], isDark: boolean) => ({
  active:      isDark ? "#10B981" : "#059669",
  inactive:    isDark ? "#94A3B8" : "#64748B",
  maintenance: isDark ? "#F59E0B" : "#D97706",
}[status]);

const STATUS_ICONS: Record<Store["status"], React.ElementType> = {
  active: CheckCircle2,
  inactive: AlertCircle,
  maintenance: Wrench,
};

export function StoreSelector() {
  const { stores, selectedStoreId, selectedStore, setSelectedStoreId } = useStore();
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const accent      = isDark ? "#00D4FF" : "#3B82F6";
  const triggerBg   = isDark ? "rgba(0,212,255,0.06)" : "rgba(59,130,246,0.06)";
  const triggerBorder = isDark ? "rgba(0,212,255,0.2)" : "rgba(59,130,246,0.25)";
  const triggerHover  = isDark ? "rgba(0,212,255,0.1)"  : "rgba(59,130,246,0.1)";
  const dropdownBg  = isDark ? "#0d1829" : "#FFFFFF";
  const dropdownBorder = isDark ? "rgba(0,212,255,0.18)" : "rgba(59,130,246,0.2)";
  const dropdownShadow = isDark
    ? "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,212,255,0.05)"
    : "0 12px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(59,130,246,0.08)";
  const itemHover   = isDark ? "rgba(255,255,255,0.04)" : "rgba(59,130,246,0.05)";
  const itemActive  = isDark ? "rgba(0,212,255,0.1)"    : "rgba(59,130,246,0.1)";
  const dividerColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";
  const textPrimary = isDark ? "#F1F5F9" : "#0F172A";
  const textMuted   = isDark ? "#94A3B8" : "#64748B";
  const iconBg      = isDark ? "rgba(0,212,255,0.12)" : "rgba(59,130,246,0.1)";
  const storeIconBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";

  const displayName = selectedStore ? selectedStore.name : (t("store.allStores") || "All Stores");
  const displayCity = selectedStore
    ? `${selectedStore.city}, ${selectedStore.country}`
    : `${stores.length} ${t("store.storesCount") || "stores"}`;

  return (
    <div ref={ref} className="relative w-full" dir={isRTL ? "rtl" : "ltr"}>

      {/* Label */}
      <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5 px-1"
        style={{ color: textMuted }}>
        {t("store.currentStore") || "Current Store"}
      </p>

      {/* Trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-200"
        style={{
          background: triggerBg,
          border: `1.5px solid ${open ? accent : triggerBorder}`,
          boxShadow: open ? `0 0 0 3px ${isDark ? "rgba(0,212,255,0.08)" : "rgba(59,130,246,0.1)"}` : "none",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = triggerHover; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = triggerBg; }}
      >
        {/* Icon */}
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: iconBg }}>
          {selectedStore
            ? <Building2 size={15} style={{ color: accent }} />
            : <Globe size={15} style={{ color: accent }} />
          }
        </div>

        {/* Text */}
        <div className={`flex-1 min-w-0 text-${isRTL ? "right" : "left"}`}>
          <p className="text-xs font-semibold truncate leading-tight" style={{ color: textPrimary }}>
            {displayName}
          </p>
          <p className="text-[10px] truncate leading-tight mt-0.5" style={{ color: textMuted }}>
            {displayCity}
          </p>
        </div>

        {/* Chevron */}
        <ChevronDown
          size={14}
          style={{ color: textMuted, flexShrink: 0, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute z-50 mt-1.5 w-full rounded-xl overflow-hidden"
          style={{
            background: dropdownBg,
            border: `1px solid ${dropdownBorder}`,
            boxShadow: dropdownShadow,
            left: 0,
            right: 0,
          }}
        >
          {/* "All Stores" option */}
          <button
            onClick={() => { setSelectedStoreId(ALL_STORES_ID); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 transition-colors"
            style={{ background: selectedStoreId === ALL_STORES_ID ? itemActive : "transparent" }}
            onMouseEnter={e => { if (selectedStoreId !== ALL_STORES_ID) (e.currentTarget as HTMLElement).style.background = itemHover; }}
            onMouseLeave={e => { if (selectedStoreId !== ALL_STORES_ID) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: iconBg }}>
              <Globe size={13} style={{ color: accent }} />
            </div>
            <div className={`flex-1 min-w-0 text-${isRTL ? "right" : "left"}`}>
              <p className="text-xs font-semibold" style={{ color: textPrimary }}>
                {t("store.allStores") || "All Stores"}
              </p>
              <p className="text-[10px]" style={{ color: textMuted }}>
                {stores.length} {t("store.storesCount") || "stores"}
              </p>
            </div>
            {selectedStoreId === ALL_STORES_ID && (
              <CheckCircle2 size={13} style={{ color: accent, flexShrink: 0 }} />
            )}
          </button>

          <div className="mx-3 h-px" style={{ background: dividerColor }} />

          {/* Individual stores */}
          <div className="max-h-60 overflow-y-auto">
            {stores.map((store) => {
              const StatusIcon = STATUS_ICONS[store.status];
              const statusColor = STATUS_COLORS(store.status, isDark);
              const isSelected = selectedStoreId === store.id;
              return (
                <button
                  key={store.id}
                  onClick={() => { setSelectedStoreId(store.id); setOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 transition-colors"
                  style={{ background: isSelected ? itemActive : "transparent" }}
                  onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = itemHover; }}
                  onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  {/* Store icon */}
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: isSelected ? iconBg : storeIconBg }}>
                    <Building2 size={13} style={{ color: isSelected ? accent : textMuted }} />
                  </div>

                  {/* Store info */}
                  <div className={`flex-1 min-w-0 text-${isRTL ? "right" : "left"}`}>
                    <p className="text-xs font-semibold truncate" style={{ color: textPrimary }}>
                      {store.name}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <StatusIcon size={9} style={{ color: statusColor, flexShrink: 0 }} />
                      <p className="text-[10px] truncate" style={{ color: textMuted }}>
                        <MapPin size={8} style={{ display: "inline", marginRight: "2px" }} />
                        {store.city} · {store.onlineCameras}/{store.totalCameras} cams
                      </p>
                    </div>
                  </div>

                  {/* Selected check */}
                  {isSelected && (
                    <CheckCircle2 size={13} style={{ color: accent, flexShrink: 0 }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
