// ─── Multi-Store Data Model ───────────────────────────────────────────────────
// Each store has its own cameras. Cameras belong to exactly one store.
// Replace with real API calls when connecting to a backend.

export interface Camera {
  id: string;
  name: string;
  storeId: string;
  zone: string;
  status: "online" | "offline" | "maintenance";
  resolution: string;
  fps: number;
  /** Placeholder thumbnail URL — replace with real MJPEG/HLS feed */
  feedUrl: string;
  /** Static snapshot for the thumbnail preview */
  thumbnailUrl: string;
  alertsToday: number;
}

export interface Store {
  id: string;
  name: string;
  location: string;
  city: string;
  country: string;
  timezone: string;
  totalCameras: number;
  onlineCameras: number;
  alertsToday: number;
  status: "active" | "inactive" | "maintenance";
}

// ─── Stores ──────────────────────────────────────────────────────────────────

export const STORES: Store[] = [
  {
    id: "store-001",
    name: "Downtown Flagship",
    location: "123 Main Street",
    city: "Cairo",
    country: "Egypt",
    timezone: "Africa/Cairo",
    totalCameras: 10,
    onlineCameras: 8,
    alertsToday: 5,
    status: "active",
  },
  {
    id: "store-002",
    name: "Mall of Arabia Branch",
    location: "Mall of Arabia, Level 2",
    city: "Jeddah",
    country: "Saudi Arabia",
    timezone: "Asia/Riyadh",
    totalCameras: 8,
    onlineCameras: 8,
    alertsToday: 2,
    status: "active",
  },
  {
    id: "store-003",
    name: "Dubai Marina Outlet",
    location: "Marina Walk, Shop 14",
    city: "Dubai",
    country: "UAE",
    timezone: "Asia/Dubai",
    totalCameras: 6,
    onlineCameras: 5,
    alertsToday: 1,
    status: "active",
  },
  {
    id: "store-004",
    name: "Alexandria Corniche",
    location: "Corniche Road, Block 7",
    city: "Alexandria",
    country: "Egypt",
    timezone: "Africa/Cairo",
    totalCameras: 4,
    onlineCameras: 3,
    alertsToday: 0,
    status: "maintenance",
  },
];

// ─── Cameras (per store) ──────────────────────────────────────────────────────

export const CAMERAS: Camera[] = [
  // ── Downtown Flagship (store-001) ──────────────────────────────────────────
  {
    id: "CAM-001",
    storeId: "store-001",
    name: "Main Entrance",
    zone: "Entry Zone",
    status: "online",
    resolution: "4K",
    fps: 30,
    feedUrl: "https://placehold.co/1280x720/1a1a2e/4ade80?text=CAM-001+LIVE",
    thumbnailUrl: "https://placehold.co/640x360/1a1a2e/4ade80?text=Main+Entrance",
    alertsToday: 2,
  },
  {
    id: "CAM-002",
    storeId: "store-001",
    name: "Checkout Area",
    zone: "Checkout Zone",
    status: "online",
    resolution: "1080p",
    fps: 25,
    feedUrl: "https://placehold.co/1280x720/1a1a2e/4ade80?text=CAM-002+LIVE",
    thumbnailUrl: "https://placehold.co/640x360/1a1a2e/4ade80?text=Checkout+Area",
    alertsToday: 1,
  },
  {
    id: "CAM-003",
    storeId: "store-001",
    name: "Electronics Section",
    zone: "Product Zone",
    status: "online",
    resolution: "4K",
    fps: 30,
    feedUrl: "https://placehold.co/1280x720/1a1a2e/4ade80?text=CAM-003+LIVE",
    thumbnailUrl: "https://placehold.co/640x360/1a1a2e/4ade80?text=Electronics",
    alertsToday: 3,
  },
  {
    id: "CAM-004",
    storeId: "store-001",
    name: "Back Storage",
    zone: "Restricted Zone",
    status: "offline",
    resolution: "1080p",
    fps: 15,
    feedUrl: "https://placehold.co/1280x720/1a1a2e/ef4444?text=OFFLINE",
    thumbnailUrl: "https://placehold.co/640x360/1a1a2e/ef4444?text=Back+Storage+OFFLINE",
    alertsToday: 0,
  },
  {
    id: "CAM-005",
    storeId: "store-001",
    name: "Parking Lot",
    zone: "Exterior",
    status: "online",
    resolution: "4K",
    fps: 30,
    feedUrl: "https://placehold.co/1280x720/1a1a2e/4ade80?text=CAM-005+LIVE",
    thumbnailUrl: "https://placehold.co/640x360/1a1a2e/4ade80?text=Parking+Lot",
    alertsToday: 0,
  },

  // ── Mall of Arabia (store-002) ─────────────────────────────────────────────
  {
    id: "CAM-006",
    storeId: "store-002",
    name: "Mall Entrance",
    zone: "Entry Zone",
    status: "online",
    resolution: "4K",
    fps: 30,
    feedUrl: "https://placehold.co/1280x720/0f172a/60a5fa?text=CAM-006+LIVE",
    thumbnailUrl: "https://placehold.co/640x360/0f172a/60a5fa?text=Mall+Entrance",
    alertsToday: 1,
  },
  {
    id: "CAM-007",
    storeId: "store-002",
    name: "Fitting Rooms",
    zone: "Fitting Zone",
    status: "online",
    resolution: "1080p",
    fps: 25,
    feedUrl: "https://placehold.co/1280x720/0f172a/60a5fa?text=CAM-007+LIVE",
    thumbnailUrl: "https://placehold.co/640x360/0f172a/60a5fa?text=Fitting+Rooms",
    alertsToday: 1,
  },
  {
    id: "CAM-008",
    storeId: "store-002",
    name: "Cash Counter",
    zone: "Checkout Zone",
    status: "online",
    resolution: "4K",
    fps: 30,
    feedUrl: "https://placehold.co/1280x720/0f172a/60a5fa?text=CAM-008+LIVE",
    thumbnailUrl: "https://placehold.co/640x360/0f172a/60a5fa?text=Cash+Counter",
    alertsToday: 0,
  },

  // ── Dubai Marina (store-003) ───────────────────────────────────────────────
  {
    id: "CAM-009",
    storeId: "store-003",
    name: "Shop Front",
    zone: "Entry Zone",
    status: "online",
    resolution: "4K",
    fps: 30,
    feedUrl: "https://placehold.co/1280x720/0a0a1a/a78bfa?text=CAM-009+LIVE",
    thumbnailUrl: "https://placehold.co/640x360/0a0a1a/a78bfa?text=Shop+Front",
    alertsToday: 1,
  },
  {
    id: "CAM-010",
    storeId: "store-003",
    name: "Stockroom",
    zone: "Restricted Zone",
    status: "offline",
    resolution: "1080p",
    fps: 15,
    feedUrl: "https://placehold.co/1280x720/0a0a1a/ef4444?text=OFFLINE",
    thumbnailUrl: "https://placehold.co/640x360/0a0a1a/ef4444?text=Stockroom+OFFLINE",
    alertsToday: 0,
  },

  // ── Alexandria Corniche (store-004) ───────────────────────────────────────
  {
    id: "CAM-011",
    storeId: "store-004",
    name: "Street Entrance",
    zone: "Entry Zone",
    status: "maintenance",
    resolution: "1080p",
    fps: 25,
    feedUrl: "https://placehold.co/1280x720/1a1a1a/f59e0b?text=MAINTENANCE",
    thumbnailUrl: "https://placehold.co/640x360/1a1a1a/f59e0b?text=Street+Entrance",
    alertsToday: 0,
  },
  {
    id: "CAM-012",
    storeId: "store-004",
    name: "Main Floor",
    zone: "Product Zone",
    status: "online",
    resolution: "1080p",
    fps: 25,
    feedUrl: "https://placehold.co/1280x720/1a1a1a/4ade80?text=CAM-012+LIVE",
    thumbnailUrl: "https://placehold.co/640x360/1a1a1a/4ade80?text=Main+Floor",
    alertsToday: 0,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getCamerasByStore(storeId: string): Camera[] {
  return CAMERAS.filter((c) => c.storeId === storeId);
}

export function getStoreById(storeId: string): Store | undefined {
  return STORES.find((s) => s.id === storeId);
}

export function getCameraById(cameraId: string): Camera | undefined {
  return CAMERAS.find((c) => c.id === cameraId);
}

export const ALL_STORES_ID = "all";
