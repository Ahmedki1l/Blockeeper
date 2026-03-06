# BlocKeeper — Backend Specification

**Version:** 1.0  
**Date:** March 6, 2026  
**Derived from:** HLD-COMPLETE.md v2.0  
**Status:** Ready for Implementation

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Database Schema](#4-database-schema)
5. [Authentication & Authorization](#5-authentication--authorization)
6. [API Endpoints](#6-api-endpoints)
7. [Edge Device Communication](#7-edge-device-communication)
8. [Real-Time (WebSocket)](#8-real-time-websocket)
9. [Storage Service (Cloudflare R2)](#9-storage-service-cloudflare-r2)
10. [Notification Service](#10-notification-service)
11. [Background Jobs](#11-background-jobs)
12. [Analytics Engine](#12-analytics-engine)
13. [Error Handling](#13-error-handling)
14. [Deployment](#14-deployment)
15. [Environment Variables](#15-environment-variables)

---

## 1. Architecture Overview

```
┌───────────────────────────────────────────────────────┐
│              CLOUD PLATFORM                           │
│                                                       │
│  ┌──────────┐  ┌───────────┐  ┌────────────────────┐ │
│  │ Frontend │  │Mobile App │  │  Cloudflare CDN    │ │
│  │ (Vercel) │  │ (RN)      │  │  + WAF             │ │
│  └────┬─────┘  └────┬──────┘  └────────────────────┘ │
│       │              │                                │
│       └──────┬───────┘                                │
│              ▼                                        │
│  ┌─────────────────────────────────────────────────┐  │
│  │          NestJS Backend API (Hetzner VPS)       │  │
│  │                                                 │  │
│  │  Auth · Users · Cameras · Alerts · Analytics    │  │
│  │  Edge · Notifications · Storage · Settings      │  │
│  └───┬──────────┬──────────┬─────────────────────┘  │
│      │          │          │                         │
│  ┌───▼───┐  ┌───▼───┐  ┌──▼──────────┐             │
│  │ PG 15 │  │ Redis │  │Cloudflare R2│             │
│  │(Supa) │  │ Cache │  │  Storage    │             │
│  └───────┘  └───────┘  └─────────────┘             │
│                                                       │
│  ┌─────────────────────────────────────────────────┐  │
│  │       Edge Devices (Raspberry Pi 5 + Coral)     │  │
│  │              ▲ HTTPS (alerts only)              │  │
│  └─────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────┘
```

**Key Principles:**
- **Edge-first**: AI processing stays on-device, only alerts hit the cloud
- **Privacy-first**: Raw video never leaves the site; only clips of flagged incidents are uploaded
- **Cost-optimized**: Signed URLs serve media directly from R2 — no proxying
- **Multi-tenant**: Row-level security on every query via `userId`

---

## 2. Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Language | TypeScript | 5.2+ | Type-safe backend |
| Framework | NestJS | 10 | Modular enterprise framework |
| Runtime | Node.js | 20 LTS | JavaScript runtime |
| Database | PostgreSQL | 15 | Primary relational database |
| ORM | Prisma | 5.6+ | Type-safe database client |
| Cache | Redis | 7.2 | Session cache, job queues |
| Queue | Bull | 4.11 | Background job processing |
| Real-time | Socket.IO | 4.6 | WebSocket for live updates |
| Auth | Passport + JWT | Latest | Token-based authentication |
| Validation | class-validator | Latest | DTO validation |
| Logging | Winston | 3.11 | Structured logging |
| Testing | Jest | 29.7 | Unit + integration tests |
| API Docs | Swagger/OpenAPI | 7.1 | Auto-generated API docs |
| Email | SendGrid | Latest | Transactional emails |
| Push | Firebase FCM | Latest | Mobile push notifications |
| Storage | Cloudflare R2 | — | S3-compatible object store |

---

## 3. Project Structure

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/                    # Authentication & JWT
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   └── local.strategy.ts
│   │   │   └── dto/
│   │   │       ├── login.dto.ts
│   │   │       └── register.dto.ts
│   │   │
│   │   ├── users/                   # User management
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.module.ts
│   │   │   └── dto/
│   │   │       └── update-user.dto.ts
│   │   │
│   │   ├── cameras/                 # Camera CRUD
│   │   │   ├── cameras.controller.ts
│   │   │   ├── cameras.service.ts
│   │   │   ├── cameras.module.ts
│   │   │   └── dto/
│   │   │       ├── create-camera.dto.ts
│   │   │       └── update-camera.dto.ts
│   │   │
│   │   ├── alerts/                  # Alert lifecycle
│   │   │   ├── alerts.controller.ts
│   │   │   ├── alerts.service.ts
│   │   │   ├── alerts.module.ts
│   │   │   ├── alerts.gateway.ts    # WebSocket
│   │   │   └── dto/
│   │   │       ├── create-alert.dto.ts
│   │   │       └── update-alert.dto.ts
│   │   │
│   │   ├── edge/                    # Edge device registration
│   │   │   ├── edge.controller.ts
│   │   │   ├── edge.service.ts
│   │   │   └── edge.module.ts
│   │   │
│   │   ├── notifications/           # Email + push
│   │   │   ├── notifications.service.ts
│   │   │   ├── notifications.module.ts
│   │   │   └── providers/
│   │   │       ├── email.provider.ts
│   │   │       ├── push.provider.ts
│   │   │       └── sms.provider.ts
│   │   │
│   │   ├── analytics/               # Dashboards & trends
│   │   │   ├── analytics.controller.ts
│   │   │   ├── analytics.service.ts
│   │   │   └── analytics.module.ts
│   │   │
│   │   └── storage/                 # Cloudflare R2 signed URLs
│   │       ├── storage.service.ts
│   │       └── storage.module.ts
│   │
│   ├── common/                      # Shared utilities
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts        # Bearer token guard
│   │   │   └── device-auth.guard.ts     # X-Device-Token guard
│   │   ├── decorators/
│   │   │   ├── user.decorator.ts        # @CurrentUser()
│   │   │   └── device.decorator.ts      # @CurrentDevice()
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts # Global error handler
│   │   └── interceptors/
│   │       └── logging.interceptor.ts   # Request logging
│   │
│   ├── prisma/
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   │
│   ├── config/
│   │   ├── configuration.ts
│   │   └── validation.ts
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── test/
├── Dockerfile
├── docker-compose.yml
└── package.json
```

---

## 4. Database Schema

### 4.1 Entity-Relationship Diagram

```mermaid
erDiagram
    USERS ||--o| SETTINGS : has
    USERS ||--o{ EDGE_DEVICES : owns
    USERS ||--o{ CAMERAS : owns
    USERS ||--o{ ALERTS : receives
    USERS ||--o{ ALERT_STATS : has

    EDGE_DEVICES ||--o{ CAMERAS : connects
    CAMERAS ||--o{ ALERTS : generates
    CAMERAS ||--o{ ALERT_STATS : tracked_in
```

### 4.2 Prisma Models

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─────────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────────
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  passwordHash  String   @map("password_hash")
  businessName  String   @map("business_name")
  plan          String   @default("basic")    // basic | pro | enterprise
  status        String   @default("active")   // active | suspended | deleted
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  settings      Settings?
  edgeDevices   EdgeDevice[]
  cameras       Camera[]
  alerts        Alert[]
  alertStats    AlertStat[]

  @@map("users")
}

// ─────────────────────────────────────────────────
// SETTINGS (per-user configuration)
// ─────────────────────────────────────────────────
model Settings {
  id                    String   @id @default(uuid())
  userId                String   @unique @map("user_id")
  anomalyThreshold      Float    @default(60) @map("anomaly_threshold")
  notificationEmail     Boolean  @default(true) @map("notification_email")
  notificationPush      Boolean  @default(true) @map("notification_push")
  notificationSound     Boolean  @default(true) @map("notification_sound")
  clipRetentionDays     Int      @default(7) @map("clip_retention_days")
  config                Json     @default("{}")
  createdAt             DateTime @default(now()) @map("created_at")
  updatedAt             DateTime @updatedAt @map("updated_at")

  user                  User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("settings")
}

// ─────────────────────────────────────────────────
// EDGE DEVICES (Raspberry Pi 5 + Coral TPU)
// ─────────────────────────────────────────────────
model EdgeDevice {
  id                String    @id @default(uuid())
  userId            String    @map("user_id")
  deviceId          String    @unique @map("device_id")
  deviceTokenHash   String?   @map("device_token_hash")
  hardwareModel     String?   @map("hardware_model")   // "rpi5_8gb"
  serialNumber      String?   @map("serial_number")
  firmwareVersion   String?   @map("firmware_version")
  status            String    @default("offline")       // online | offline | error
  lastHeartbeat     DateTime? @map("last_heartbeat")
  createdAt         DateTime  @default(now()) @map("created_at")
  updatedAt         DateTime  @updatedAt @map("updated_at")

  user              User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  cameras           Camera[]

  @@map("edge_devices")
}

// ─────────────────────────────────────────────────
// CAMERAS
// ─────────────────────────────────────────────────
model Camera {
  id            String   @id @default(uuid())
  userId        String   @map("user_id")
  edgeDeviceId  String   @map("edge_device_id")
  name          String                            // "Entrance A", "Aisle 3"
  rtspUrl       String   @map("rtsp_url")         // rtsp://192.168.1.x:554/stream
  location      String?                           // "Ground Floor", "Storage Room"
  zoneType      String?  @map("zone_type")        // entry | product | checkout | restricted
  status        String   @default("active")       // active | inactive | error
  config        Json     @default("{}")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  user          User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  edgeDevice    EdgeDevice @relation(fields: [edgeDeviceId], references: [id], onDelete: Cascade)
  alerts        Alert[]
  alertStats    AlertStat[]

  @@map("cameras")
}

// ─────────────────────────────────────────────────
// ALERTS (core entity — generated by edge devices)
// ─────────────────────────────────────────────────
model Alert {
  id            String    @id @default(uuid())
  userId        String    @map("user_id")
  cameraId      String    @map("camera_id")
  timestamp     DateTime
  anomalyScore  Float     @map("anomaly_score")     // 0–100
  detectionType String?   @map("detection_type")     // loitering | concealment | posture | zone_violation
  trackId       String?   @map("track_id")           // ByteTrack person ID
  dwellTime     Int?      @map("dwell_time")         // seconds
  zone          String?                              // zone name where detection occurred
  videoPath     String?   @map("video_path")         // R2 key: alerts/{userId}/{cameraId}/{alertId}.mp4
  thumbnailPath String?   @map("thumbnail_path")     // R2 key: alerts/{userId}/{cameraId}/{alertId}.jpg
  status        String    @default("pending")        // pending | uploaded | reviewed | resolved | false_positive
  reviewedAt    DateTime? @map("reviewed_at")
  reviewedBy    String?   @map("reviewed_by")
  notes         String?
  metadata      Json      @default("{}")             // bbox, pose keypoints, etc.
  createdAt     DateTime  @default(now()) @map("created_at")

  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  camera        Camera   @relation(fields: [cameraId], references: [id], onDelete: Cascade)

  @@index([userId, timestamp(sort: Desc)])
  @@index([cameraId, timestamp(sort: Desc)])
  @@index([status])
  @@map("alerts")
}

// ─────────────────────────────────────────────────
// ALERT STATS (pre-aggregated for analytics)
// ─────────────────────────────────────────────────
model AlertStat {
  id                  String   @id @default(uuid())
  userId              String   @map("user_id")
  cameraId            String?  @map("camera_id")
  date                DateTime @db.Date
  hour                Int?                           // 0–23, null = daily aggregate
  alertCount          Int      @default(0) @map("alert_count")
  avgAnomalyScore     Float?   @map("avg_anomaly_score")
  falsePositiveCount  Int      @default(0) @map("false_positive_count")
  createdAt           DateTime @default(now()) @map("created_at")

  user                User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  camera              Camera?  @relation(fields: [cameraId], references: [id], onDelete: Cascade)

  @@unique([userId, cameraId, date, hour])
  @@index([userId, date(sort: Desc)])
  @@map("alert_stats")
}
```

### 4.3 Critical Indexes

| Index | Columns | Purpose |
|-------|---------|---------|
| `alerts_user_ts` | `(user_id, timestamp DESC)` | Fast per-user alert queries |
| `alerts_camera_ts` | `(camera_id, timestamp DESC)` | Fast per-camera alert queries |
| `alerts_status` | `(status)` | Filter by review status |
| `alert_stats_user_date` | `(user_id, date DESC)` | Analytics dashboard queries |

---

## 5. Authentication & Authorization

### 5.1 User Authentication (JWT)

```
Client → POST /auth/login { email, password }
  ↓
Backend verifies credentials (bcrypt compare, 12 rounds)
  ↓
Backend generates JWT tokens:
  • Access token:  24h expiry, payload: { sub: userId, role }
  • Refresh token: 7d expiry, payload: { sub: userId }
  ↓
Client stores tokens (localStorage / AsyncStorage)
  ↓
Client sends on every request: Authorization: Bearer {accessToken}
  ↓
JwtAuthGuard verifies token → extracts userId → attaches to request
  ↓
Service queries scoped by userId (row-level security)
```

**Token DTOs:**

```typescript
// register.dto.ts
class RegisterDto {
  @IsEmail()
  email: string;

  @IsString() @MinLength(8)
  password: string;

  @IsString() @MinLength(2)
  businessName: string;
}

// login.dto.ts
class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
```

**Response shape:**

```json
{
  "user": {
    "id": "uuid",
    "email": "store@example.com",
    "businessName": "SuperMart",
    "plan": "basic",
    "status": "active",
    "createdAt": "2026-01-15T00:00:00Z"
  },
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "eyJhbGciOi..."
}
```

### 5.2 Edge Device Authentication (Long-Lived Token)

```
Edge → POST /edge/register { serialNumber, hardwareModel }
  ↓ (requires user JWT — device is registered under user account)
Backend generates device token (SHA-256, 1-year expiry)
  ↓
Backend stores hash of token in EdgeDevice.deviceTokenHash
  ↓
Edge stores token in /config/device.env on local storage
  ↓
Edge sends on every request: X-Device-Token: {token}
  ↓
DeviceAuthGuard verifies token hash → attaches device + userId to request
```

### 5.3 Guards

| Guard | Header | Scope |
|-------|--------|-------|
| `JwtAuthGuard` | `Authorization: Bearer {jwt}` | All dashboard/mobile API routes |
| `DeviceAuthGuard` | `X-Device-Token: {token}` | Edge device routes (`/edge/*`, `POST /alerts`) |

---

## 6. API Endpoints

**Base URL:** `https://api.blockeeper.com/v1`

### 6.1 Authentication

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/auth/register` | Public | Create account |
| `POST` | `/auth/login` | Public | Get JWT tokens |
| `POST` | `/auth/refresh` | Refresh token | Refresh access token |
| `POST` | `/auth/logout` | JWT | Invalidate refresh token |
| `POST` | `/auth/forgot-password` | Public | Send reset email |
| `POST` | `/auth/reset-password` | Reset token | Set new password |

### 6.2 Users

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/users/me` | JWT | Get current user profile |
| `PATCH` | `/users/me` | JWT | Update profile |
| `DELETE` | `/users/me` | JWT | Delete account + all data |
| `POST` | `/users/fcm-token` | JWT | Register FCM push token |

### 6.3 Edge Devices

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/edge/register` | JWT | Register new edge device |
| `POST` | `/edge/heartbeat` | Device | Periodic health report |
| `GET` | `/edge/config` | Device | Fetch latest config |
| `POST` | `/edge/logs` | Device | Upload diagnostic logs |

**Heartbeat payload:**

```json
{
  "cpuUsage": 45.2,
  "memoryUsage": 62.1,
  "diskUsage": 34.8,
  "temperature": 52.3,
  "cameraCount": 8,
  "camerasOnline": 7,
  "uptime": 864000,
  "firmwareVersion": "1.2.0"
}
```

### 6.4 Cameras

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/cameras` | JWT | List all user cameras |
| `POST` | `/cameras` | JWT | Add camera to edge device |
| `GET` | `/cameras/:id` | JWT | Get camera details |
| `PATCH` | `/cameras/:id` | JWT | Update camera config |
| `DELETE` | `/cameras/:id` | JWT | Remove camera |

**Create camera DTO:**

```typescript
class CreateCameraDto {
  @IsString()
  edgeDeviceId: string;

  @IsString() @MinLength(1)
  name: string;

  @IsUrl()
  rtspUrl: string;

  @IsOptional() @IsString()
  location?: string;

  @IsOptional() @IsIn(['entry', 'product', 'checkout', 'restricted'])
  zoneType?: string;
}
```

### 6.5 Alerts

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/alerts` | Device | Edge creates alert |
| `POST` | `/alerts/:id/confirm` | Device | Confirm clip upload |
| `GET` | `/alerts` | JWT | List alerts (paginated) |
| `GET` | `/alerts/:id` | JWT | Get alert detail + signed URLs |
| `PATCH` | `/alerts/:id` | JWT | Update status/notes |
| `DELETE` | `/alerts/:id` | JWT | Delete alert + R2 objects |
| `POST` | `/alerts/:id/review` | JWT | Mark as reviewed |
| `POST` | `/alerts/:id/false-positive` | JWT | Mark as false positive |

**Create alert (from edge):**

```typescript
class CreateAlertDto {
  @IsString()
  cameraId: string;

  @IsNumber()
  timestamp: number;       // Unix epoch seconds

  @IsNumber() @Min(0) @Max(100)
  anomalyScore: number;

  @IsOptional() @IsString()
  trackId?: string;

  @IsOptional() @IsNumber()
  dwellTime?: number;      // seconds

  @IsOptional() @IsObject()
  metadata?: {
    bbox: [number, number, number, number];   // [x, y, w, h]
    pose?: number[][];                        // keypoint coordinates
    zone?: string;
  };
}
```

**Response (create alert):**

```json
{
  "alertId": "uuid",
  "uploadUrls": {
    "video": "https://r2.blockeeper.com/alerts/.../alert.mp4?X-Amz-Signature=...",
    "thumbnail": "https://r2.blockeeper.com/alerts/.../alert.jpg?X-Amz-Signature=..."
  }
}
```

**Alert query parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | int | 1 | Page number |
| `limit` | int | 20 | Items per page (max 100) |
| `status` | string | — | Filter: pending, uploaded, reviewed, resolved, false_positive |
| `cameraId` | string | — | Filter by camera |
| `startDate` | ISO 8601 | — | Date range start |
| `endDate` | ISO 8601 | — | Date range end |
| `minScore` | number | — | Minimum anomaly score |
| `sortBy` | string | timestamp | Sort field: timestamp, anomalyScore |
| `order` | string | desc | Sort direction: asc, desc |

### 6.6 Analytics

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/analytics/dashboard` | JWT | Summary stats (today, week, month) |
| `GET` | `/analytics/alerts-by-hour` | JWT | Hourly alert distribution |
| `GET` | `/analytics/alerts-by-camera` | JWT | Per-camera alert counts |
| `GET` | `/analytics/alerts-by-type` | JWT | Detection type breakdown |
| `GET` | `/analytics/trends` | JWT | Multi-day trend data |

**Dashboard response:**

```json
{
  "today": {
    "alertCount": 12,
    "avgAnomalyScore": 72.3,
    "camerasOnline": 8,
    "camerasTotal": 10,
    "falsePositiveRate": 0.15
  },
  "week": {
    "alertCount": 84,
    "avgAnomalyScore": 68.1,
    "trend": "+12%"
  },
  "month": {
    "alertCount": 312,
    "avgAnomalyScore": 65.7,
    "trend": "-5%"
  }
}
```

### 6.7 Settings

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/settings` | JWT | Get user settings |
| `PATCH` | `/settings` | JWT | Update settings |

**Settings DTO:**

```typescript
class UpdateSettingsDto {
  @IsOptional() @IsNumber() @Min(0) @Max(100)
  anomalyThreshold?: number;

  @IsOptional() @IsBoolean()
  notificationEmail?: boolean;

  @IsOptional() @IsBoolean()
  notificationPush?: boolean;

  @IsOptional() @IsBoolean()
  notificationSound?: boolean;

  @IsOptional() @IsInt() @Min(1) @Max(90)
  clipRetentionDays?: number;
}
```

---

## 7. Edge Device Communication

### 7.1 Alert Upload Flow

```
Edge AI pipeline detects anomaly (score > threshold)
  ↓
Edge extracts 10-second clip (-5s to +5s) from frame buffer
  ↓
Edge encodes clip to H.264 MP4 + generates JPEG thumbnail
  ↓
POST /alerts  →  Backend creates DB record, returns signed R2 upload URLs
  ↓
Edge PUTs video clip to signed R2 URL (direct upload, no proxy)
  ↓
Edge PUTs thumbnail to signed R2 URL
  ↓
POST /alerts/:id/confirm  →  Backend marks alert as "uploaded"
  ↓
Backend triggers:
  • WebSocket broadcast to dashboard
  • Push notification to mobile
  • Email notification (if enabled)
  • Background job for stats aggregation
```

### 7.2 Heartbeat Protocol

Edge devices send a heartbeat every **60 seconds** via `POST /edge/heartbeat`. If no heartbeat is received for **5 minutes**, the device status is set to `offline` and an alert is optionally sent.

### 7.3 Config Sync

Edge devices poll `GET /edge/config` every **10 minutes** to pick up remote configuration changes (anomaly threshold, camera additions/removals, firmware update signals).

### 7.4 Retry Policy

Failed uploads retry **3 times** with exponential backoff (1s, 4s, 16s). After 3 failures, the alert is logged locally and retried on the next heartbeat cycle.

---

## 8. Real-Time (WebSocket)

### 8.1 Gateway

```typescript
@WebSocketGateway({ cors: { origin: '*' } })
export class AlertsGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('subscribe')
  handleSubscribe(@ConnectedSocket() client: Socket) {
    const token = client.handshake.auth.token;
    const { sub: userId } = this.jwtService.verify(token);
    client.join(`user:${userId}`);
    return { status: 'subscribed' };
  }

  broadcastNewAlert(userId: string, alert: Alert) {
    this.server.to(`user:${userId}`).emit('new-alert', alert);
  }

  broadcastCameraStatus(userId: string, cameraId: string, status: string) {
    this.server.to(`user:${userId}`).emit('camera-status', { cameraId, status });
  }

  broadcastDeviceStatus(userId: string, deviceId: string, status: string) {
    this.server.to(`user:${userId}`).emit('device-status', { deviceId, status });
  }
}
```

### 8.2 Events

| Event | Direction | Payload | Trigger |
|-------|-----------|---------|---------|
| `subscribe` | Client → Server | `{ token }` | Client connects |
| `new-alert` | Server → Client | `Alert` object | Edge uploads alert |
| `camera-status` | Server → Client | `{ cameraId, status }` | Camera goes online/offline |
| `device-status` | Server → Client | `{ deviceId, status }` | Device heartbeat change |
| `alert-updated` | Server → Client | `{ alertId, status }` | Alert reviewed/resolved |

---

## 9. Storage Service (Cloudflare R2)

### 9.1 Bucket Structure

```
shopguard-alerts/
  alerts/
    {userId}/
      {cameraId}/
        {alertId}.mp4          # 10-second H.264 clip
        {alertId}.jpg          # Thumbnail frame
  logs/
    {deviceId}/
      {date}/
        diagnostics.json       # Edge device logs
```

### 9.2 Signed URL Patterns

```typescript
@Injectable()
export class StorageService {
  private s3: S3Client;

  async getSignedUploadUrl(key: string, contentType: string): Promise<string> {
    return getSignedUrl(this.s3, new PutObjectCommand({
      Bucket: 'shopguard-alerts',
      Key: key,
      ContentType: contentType,
    }), { expiresIn: 3600 }); // 1 hour
  }

  async getSignedDownloadUrl(key: string): Promise<string> {
    return getSignedUrl(this.s3, new GetObjectCommand({
      Bucket: 'shopguard-alerts',
      Key: key,
    }), { expiresIn: 3600 }); // 1 hour
  }

  async deleteObject(key: string): Promise<void> {
    await this.s3.send(new DeleteObjectCommand({
      Bucket: 'shopguard-alerts',
      Key: key,
    }));
  }
}
```

### 9.3 Retention Policy

A daily Bull job scans alerts older than `clipRetentionDays` (default 7) per user and:
1. Deletes the R2 objects (video + thumbnail)
2. Nulls `videoPath` / `thumbnailPath` on the alert record
3. Keeps the alert metadata for historical analytics

---

## 10. Notification Service

### 10.1 Channels

| Channel | Provider | Trigger |
|---------|----------|---------|
| Email | SendGrid | New alert, device offline, weekly report |
| Push | Firebase FCM | New alert (real-time), device offline |
| SMS | Twilio (future) | Critical alerts only |

### 10.2 Alert Notification Flow

```typescript
async sendAlertNotification(alert: Alert & { camera: Camera }) {
  const user = await this.prisma.user.findUnique({
    where: { id: alert.userId },
    include: { settings: true },
  });

  if (user.settings?.notificationEmail) {
    await this.email.send({
      to: user.email,
      subject: `⚠️ Alert: Suspicious Activity Detected`,
      template: 'alert',
      data: {
        cameraName: alert.camera.name,
        anomalyScore: alert.anomalyScore,
        timestamp: alert.timestamp,
        alertUrl: `https://app.blockeeper.com/alerts/${alert.id}`,
      },
    });
  }

  if (user.settings?.notificationPush) {
    await this.push.send({
      userId: user.id,
      title: 'Suspicious Activity Detected',
      body: `${alert.camera.name} — Score: ${alert.anomalyScore}`,
      data: { alertId: alert.id, cameraId: alert.cameraId },
    });
  }
}
```

### 10.3 FCM Token Management

Mobile clients register their FCM token via `POST /users/fcm-token`. Tokens are stored per-device and refreshed on app launch. Stale tokens are cleaned up on FCM delivery failure.

---

## 11. Background Jobs

### 11.1 Bull Queues

| Queue | Job | Schedule | Description |
|-------|-----|----------|-------------|
| `alerts` | `process-alert` | On demand | Post-upload: notify, aggregate stats, broadcast WS |
| `retention` | `cleanup-expired` | Daily 3 AM | Delete R2 clips past retention period |
| `analytics` | `aggregate-stats` | Hourly | Roll up alert counts into `alert_stats` |
| `devices` | `check-offline` | Every 5 min | Mark devices with stale heartbeats as offline |
| `reports` | `weekly-summary` | Monday 8 AM | Email weekly security summary to users |

### 11.2 Alert Processing Job

```typescript
@Processor('alerts')
export class AlertProcessor {
  @Process('process-alert')
  async handleAlert(job: Job<{ alertId: string; userId: string }>) {
    const { alertId, userId } = job.data;

    // 1. Fetch full alert with camera info
    const alert = await this.prisma.alert.findUnique({
      where: { id: alertId },
      include: { camera: true },
    });

    // 2. Send notifications
    await this.notifications.sendAlertNotification(alert);

    // 3. Broadcast to WebSocket clients
    this.alertGateway.broadcastNewAlert(userId, alert);

    // 4. Update hourly stats
    await this.analytics.incrementHourlyStat(userId, alert.cameraId, alert.timestamp);
  }
}
```

---

## 12. Analytics Engine

### 12.1 Pre-Aggregation Strategy

Raw alerts are aggregated into the `alert_stats` table for fast dashboard queries. Aggregation runs:
- **Hourly**: Counts and averages for each camera per hour
- **Daily**: Rolled-up daily totals (hour = null)

### 12.2 Dashboard Query Pattern

```sql
-- Today's summary
SELECT
  COUNT(*) as alert_count,
  AVG(anomaly_score) as avg_score,
  COUNT(*) FILTER (WHERE status = 'false_positive') as false_positives
FROM alerts
WHERE user_id = $1
  AND timestamp >= CURRENT_DATE;

-- Per-camera breakdown (from pre-aggregated stats)
SELECT
  camera_id,
  SUM(alert_count) as total_alerts,
  AVG(avg_anomaly_score) as avg_score
FROM alert_stats
WHERE user_id = $1
  AND date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY camera_id
ORDER BY total_alerts DESC;
```

---

## 13. Error Handling

### 13.1 Global Exception Filter

```typescript
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : 500;

    const message = exception instanceof HttpException
      ? exception.message
      : 'Internal server error';

    logger.error('Unhandled exception', {
      status,
      message,
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
```

### 13.2 Standard Error Codes

| Code | Meaning |
|------|---------|
| 400 | Validation error (bad DTO) |
| 401 | Missing or invalid auth token |
| 403 | Insufficient permissions |
| 404 | Resource not found |
| 409 | Conflict (duplicate email, etc.) |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

### 13.3 Logging

Structured JSON logging via Winston:

```json
{
  "level": "info",
  "message": "Alert created",
  "alertId": "abc-123",
  "userId": "user-456",
  "cameraId": "cam-789",
  "anomalyScore": 87,
  "timestamp": "2026-03-06T10:30:00Z"
}
```

---

## 14. Deployment

### 14.1 Docker Compose (Hetzner VPS)

```yaml
version: '3.8'

services:
  api:
    build: ./backend
    image: blockeeper/api:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - JWT_SECRET=${JWT_SECRET}
      - R2_ENDPOINT=${R2_ENDPOINT}
      - R2_ACCESS_KEY=${R2_ACCESS_KEY}
      - R2_SECRET_KEY=${R2_SECRET_KEY}
      - SENDGRID_API_KEY=${SENDGRID_API_KEY}
      - FCM_PROJECT_ID=${FCM_PROJECT_ID}
    restart: unless-stopped
    depends_on:
      - redis

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - /etc/letsencrypt:/etc/nginx/ssl:ro
    depends_on:
      - api
    restart: unless-stopped

volumes:
  redis-data:
```

### 14.2 CI/CD (GitHub Actions)

```yaml
name: Deploy Backend
on:
  push:
    branches: [main]
    paths: ['backend/**']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Hetzner
        run: |
          ssh deploy@${{ secrets.SERVER_IP }} \
            'cd /opt/blockeeper && git pull && docker compose up -d --build api'
```

### 14.3 Infrastructure Cost

| Service | Monthly Cost | Notes |
|---------|-------------|-------|
| Hetzner CX31 | €8.50 | 4 vCPU, 8GB RAM |
| Supabase Free | $0 | Up to 500MB, 50K requests/mo |
| Cloudflare R2 | ~$0.50 | 10GB storage, 1M operations |
| Cloudflare CDN | $0 | Free plan |
| SendGrid | $0 | 100 emails/day free |
| **Total** | **~€9/mo** | Scales to 100+ clients |

---

## 15. Environment Variables

```env
# ─── Core ───
NODE_ENV=production
PORT=3000
JWT_SECRET=your-256-bit-secret

# ─── Database ───
DATABASE_URL=postgresql://user:pass@host:5432/blockeeper

# ─── Redis ───
REDIS_URL=redis://localhost:6379

# ─── Cloudflare R2 Storage ───
R2_ENDPOINT=https://account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY=your-r2-access-key
R2_SECRET_KEY=your-r2-secret-key
R2_BUCKET=shopguard-alerts

# ─── Email (SendGrid) ───
SENDGRID_API_KEY=SG.xxx
SENDGRID_FROM=alerts@blockeeper.com

# ─── Push Notifications (Firebase) ───
FCM_PROJECT_ID=blockeeper-prod
GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccountKey.json

# ─── Monitoring (optional) ───
SENTRY_DSN=https://xxx@sentry.io/xxx
```

---

**Document Version:** 1.0  
**Last Updated:** March 6, 2026  
**Owner:** Ahmed Alaa — JAMTech
