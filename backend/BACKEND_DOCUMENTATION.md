# Backend Documentation - Website S1-TI

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Setup & Installation](#setup--installation)
4. [Environment Configuration](#environment-configuration)
5. [Project Structure](#project-structure)
6. [Database Models](#database-models)
7. [API Routes](#api-routes)
8. [Services](#services)
9. [Middleware](#middleware)
10. [Authentication & Security](#authentication--security)
11. [Caching Strategy](#caching-strategy)
12. [File Upload Handling](#file-upload-handling)
13. [Logging & Monitoring](#logging--monitoring)
14. [Testing](#testing)
15. [Deployment](#deployment)
16. [Development Workflow](#development-workflow)
17. [Troubleshooting](#troubleshooting)

---

## Project Overview

**Backend Website S1-TI** adalah REST API yang dibangun menggunakan Node.js, Express, dan TypeScript. Aplikasi ini menyediakan layanan untuk:

- **User Management**: Autentikasi dan manajemen pengguna dengan dukungan Google OAuth
- **Content Management**: Mengelola pengumuman, berita, highlights, dan informasi akademis
- **Search & RAG**: Fitur pencarian dengan Retrieval-Augmented Generation (RAG) menggunakan embeddings
- **Dashboard Analytics**: Analitik dan statistik untuk administrator
- **Upload Management**: Penanganan upload file dengan validasi dan image processing

**Tech Stack:**

- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (cloud - MongoDB Atlas)
- **Cache**: Redis (cloud - Upstash)
- **Authentication**: JWT + Google OAuth 2.0
- **File Processing**: Multer + Sharp
- **Logging**: Winston
- **API Documentation**: Swagger/OpenAPI
- **Load Testing**: K6

**Version**: 1.0.0  
**Author**: josse  
**License**: MIT

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                 Express.js Application                       │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Middleware Layer                                      │   │
│  │ - Security (Helmet, CORS, Sanitization)             │   │
│  │ - Authentication (JWT, Passport)                     │   │
│  │ - Validation & Rate Limiting                         │   │
│  │ - Logging (Morgan + Winston)                         │   │
│  └──────────────────────────────────────────────────────┘   │
│                     │                                         │
│  ┌──────────────────▼──────────────────────────────────┐   │
│  │ API Routes (v1)                                      │   │
│  │ - /api/v1/auth      (Authentication)                │   │
│  │ - /api/v1/users     (User Management)               │   │
│  │ - /api/v1/lecturers (Lecturer Data)                 │   │
│  │ - /api/v1/announcements (Pengumuman)                │   │
│  │ - /api/v1/highlight (Highlights)                    │   │
│  │ - /api/v1/history   (User History)                  │   │
│  │ - /api/v1/dashboard (Analytics)                     │   │
│  │ - /api/v1/chat      (RAG & Search)                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                     │                                         │
│  ┌──────────────────▼──────────────────────────────────┐   │
│  │ Service Layer                                        │   │
│  │ - embeddingService                                   │   │
│  │ - embeddingInsertService                            │   │
│  │ - ragService                                         │   │
│  │ - modelService                                       │   │
│  └──────────────────────────────────────────────────────┘   │
│                     │                                         │
└─────────────┬───────┼───────────────────────────────┬────────┘
              │       │                               │
              ▼       ▼                               ▼
        ┌─────────┐ ┌──────────┐         ┌──────────────────┐
        │ MongoDB │ │  Redis   │         │ External APIs    │
        │ (Atlas) │ │(Upstash) │         │ - HuggingFace    │
        └─────────┘ └──────────┘         │ - Google OAuth   │
                                          └──────────────────┘
```

### Request Flow

1. **Request masuk** ke Express application
2. **Middleware chain** dieksekusi secara berurutan:
   - Security middleware (Helmet, CORS, Sanitization)
   - Logging (Morgan)
   - Body parsing
   - Cookie parsing
3. **Route handler** menemukan endpoint yang sesuai
4. **Authorization** divalidasi (JWT middleware jika diperlukan)
5. **Business logic** dijalankan melalui service layer
6. **Database query** dijalankan (dengan caching jika tersedia)
7. **Response** dikirim kembali ke client

---

## Setup & Installation

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm atau yarn
- MongoDB Atlas account (free tier: https://www.mongodb.com/cloud/atlas)
- Upstash Redis account (free tier: https://upstash.com/)
- Google OAuth credentials (jika menggunakan Google login)
- HuggingFace API key (untuk embedding features)

### Installation Steps

```bash
# 1. Clone repository
git clone <repository-url>
cd backend

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env

# 4. Configure environment variables (lihat section berikutnya)
# Edit .env dengan kredensial cloud services Anda

# 5. Build TypeScript
npm run build

# 6. Jalankan development server
npm run dev

# 7. Server akan berjalan di http://localhost:5000
```

### Package Scripts

```json
{
  "start": "node ./dist/server.js", // Production start
  "build": "tsc", // Compile TypeScript
  "dev": "nodemon --exec ts-node ./src/server.ts", // Development
  "test": "jest --watchAll --verbose", // Run tests
  "lint": "eslint .", // Check code quality
  "lint:fix": "eslint . --fix" // Auto-fix lint issues
}
```

---

## Environment Configuration

### .env File Variables

```env
# Application
API_VERSION=v1
NODE_ENV=development                    # development, production, test
PORT=5000
LOG_LEVEL=info                         # debug, info, warn, error

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database_name
MONGODB_NAME=website_s1ti

# Redis Cache
REDIS_HOST=default-host.upstash.io     # atau localhost untuk development
REDIS_PORT=6379
REDIS_PASSWORD=password_jika_ada
REDIS_URL=redis://default:password@host:port  # Alternative format
TTL=900                                 # Cache TTL in seconds (15 minutes)

# JWT Authentication
JWT_SECRET=your-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars

# Security & CORS
FRONTEND_ORIGIN=http://localhost:3000
FRONTEND_URL=http://localhost:3000

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760                 # 10MB in bytes

# Bcrypt
SALT_BCRYPT=10

# HuggingFace Embeddings
HF_API_KEY=hf_your_api_key
HF_BASE_URL=https://router.huggingface.co
HF_MODEL_NAME=Qwen/Qwen3-Embedding-8B
EMBEDDING_BASE_URL=http://localhost:8001  # Local embedding service
EMBEDDING_DIMENSION=384

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback
```

### Environment Profiles

**Development (.env.development)**

```env
NODE_ENV=development
PORT=5000
LOG_LEVEL=debug
MONGODB_URI=mongodb+srv://user:pass@local-cluster...
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

**Production (.env.production)**

```env
NODE_ENV=production
PORT=5000
LOG_LEVEL=info
MONGODB_URI=mongodb+srv://user:pass@production-cluster...
REDIS_URL=redis://default:pass@prod-host:port
JWT_SECRET=strong-secret-with-high-entropy
```

---

## Project Structure

```
backend/
├── src/
│   ├── app.ts                          # Express app configuration
│   ├── server.ts                       # Entry point & server startup
│   │
│   ├── api/
│   │   └── v1/                         # API v1 routes
│   │       ├── index.ts                # Router aggregation
│   │       ├── auth/                   # Authentication routes
│   │       │   ├── auth.routes.ts
│   │       │   └── auth.controller.ts
│   │       ├── users/                  # User management
│   │       ├── lecturers/              # Lecturer data
│   │       ├── announcements/          # Pengumuman (announcements)
│   │       ├── highlight/              # Highlights/featured items
│   │       ├── history/                # User activity history
│   │       ├── dashboard/              # Admin dashboard
│   │       └── partner/                # Partner/collaboration data
│   │
│   ├── config/
│   │   ├── env.ts                      # Environment validation (Zod)
│   │   ├── database.ts                 # MongoDB connection
│   │   ├── redis.ts                    # Redis connection
│   │   ├── cors.ts                     # CORS configuration
│   │   ├── google-oauth.ts             # Google OAuth setup
│   │   └── swagger.ts                  # Swagger/OpenAPI config
│   │
│   ├── model/
│   │   ├── userModel.ts                # User schema & interface
│   │   ├── lecturerModel.ts            # Lecturer schema
│   │   ├── announcementModel.ts        # Announcement schema
│   │   ├── highlightModel.ts           # Highlight schema
│   │   ├── historyModels.ts            # History schema
│   │   ├── partnersModel.ts            # Partners schema
│   │   ├── embeddingModel.ts           # Embedding model
│   │   └── SystemSettingModel.ts       # System settings
│   │
│   ├── routes/
│   │   ├── embeddingRoutes.ts          # Embedding management routes
│   │   └── ragRoutes.ts                # RAG/chat routes
│   │
│   ├── service/
│   │   ├── embeddingService.ts         # Embedding operations
│   │   ├── embeddingInsertService.ts   # Batch embedding insertion
│   │   ├── ragService.ts               # RAG & search logic
│   │   └── modelService.ts             # Model-related services
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts          # JWT & session verification
│   │   ├── error.middleware.ts         # Global error handler
│   │   ├── rateLimiter.middleware.ts   # Rate limiting
│   │   ├── uploads.middleware.ts       # File upload handling
│   │   └── validate.middleware.ts      # Request validation
│   │
│   ├── types/
│   │   └── express.d.ts                # TypeScript Express extensions
│   │
│   ├── utils/
│   │   ├── ApiError.ts                 # Custom error class
│   │   ├── ApiResponse.ts              # Standard response wrapper
│   │   ├── asyncHandler.ts             # Try-catch wrapper
│   │   ├── bcrypt.ts                   # Password hashing utilities
│   │   ├── cacheManager.ts             # Redis cache manager
│   │   ├── history.ts                  # History tracking utilities
│   │   ├── index.ts                    # Utility exports
│   │   ├── jwt.ts                      # JWT operations
│   │   ├── logger.ts                   # Winston logger setup
│   │   ├── pagination.ts               # Pagination helpers
│   │   ├── passport.ts                 # Passport strategies
│   │   └── slugify.ts                  # URL slug generator
│   │
│   ├── constants/                      # Application constants
│   ├── subscribers/                    # Event subscribers
│   └── jobs/
│       └── scheduler.ts                # Cron job scheduler
│
├── tests/
│   └── k6/                             # K6 load testing
│       ├── api-routes-test.js
│       ├── auth-test.js
│       ├── config.js
│       ├── endurance-test.js
│       ├── load-test.js
│       ├── smoke-test.js
│       ├── spike-test.js
│       ├── stress-test.js
│       └── README.md
│
├── uploads/                            # File uploads directory
│   ├── carousels/
│   ├── highlights/
│   ├── lecturers/
│   └── news/
│
├── Dockerfile                          # Docker container definition
├── package.json                        # Dependencies & scripts
├── tsconfig.json                       # TypeScript configuration
└── .env.example                        # Environment template
```

---

## Database Models

### 1. User Model (`userModel.ts`)

**Purpose**: Menyimpan informasi pengguna dan autentikasi

```typescript
interface IUser extends Document {
  username: string; // Unique username
  fullname: string; // Full name
  email: string; // Unique email
  password: string; // Hashed password (bcrypt)
  photo: string; // Profile photo URL
  role: string; // user, lecturer, admin
  authProvider: string; // local, google
  isActive: boolean; // Account status
  googleId: string; // Google OAuth ID (if Google auth)
  isEmailVerified: boolean; // Email verification status
  lastLogin: Date; // Last login timestamp

  // Methods
  comparePassword(password: string): Promise<boolean>;
}
```

**Indexes**:

- `username` (unique)
- `email` (unique)
- `googleId`

---

### 2. Announcement Model (`announcementModel.ts`)

**Purpose**: Mengelola pengumuman dan berita penting

**Fields**:

- `title`: Judul pengumuman
- `content`: Isi konten
- `category`: Kategori (news, event, urgent)
- `priority`: Tingkat prioritas
- `author`: Reference ke User model
- `publishedAt`: Waktu publikasi
- `expiresAt`: Waktu expired (opsional)
- `images`: Array of image URLs
- `tags`: Kategori/tag untuk search
- `isActive`: Status publikasi

---

### 3. Lecturer Model (`lecturerModel.ts`)

**Purpose**: Data dosen dan akademisi

**Fields**:

- `name`: Nama dosen
- `email`: Email dosen
- `phone`: No telepon
- `photo`: Foto profil
- `department`: Departemen/jurusan
- `position`: Posisi (Dosen, Asisten Dosen, dll)
- `specialization`: Bidang keahlian
- `office`: Lokasi kantor
- `officeHours`: Jam kerja
- `publications`: Publikasi ilmiah (array)

---

### 4. Highlight Model (`highlightModel.ts`)

**Purpose**: Featured items / showcase content

**Fields**:

- `title`: Judul highlight
- `description`: Deskripsi
- `image`: Image URL
- `link`: Link ke konten terkait
- `type`: Tipe highlight (achievement, featured-news, etc)
- `order`: Urutan tampilan
- `isActive`: Status aktif
- `startDate`, `endDate`: Range waktu tampil

---

### 5. History Model (`historyModels.ts`)

**Purpose**: Tracking aktivitas pengguna

**Fields**:

- `userId`: Reference ke User
- `action`: Tipe action (view, search, download, etc)
- `resource`: Resource yang diakses (lecturer, announcement, etc)
- `resourceId`: ID dari resource
- `metadata`: Additional metadata
- `timestamp`: Waktu action
- `ipAddress`: IP pengguna

---

### 6. Partner Model (`partnersModel.ts`)

**Purpose**: Data mitra dan kerjasama

**Fields**:

- `name`: Nama mitra
- `logo`: Logo URL
- `description`: Deskripsi kerjasama
- `website`: Website mitra
- `contactPerson`: Nama kontak
- `email`: Email kontak
- `category`: Kategori kerjasama
- `startDate`: Tanggal mulai
- `isActive`: Status kerjasama

---

### 7. Embedding Model (`embeddingModel.ts`)

**Purpose**: Menyimpan vector embeddings untuk RAG/search

**Fields**:

- `contentId`: Reference ke content (announcement, etc)
- `contentType`: Tipe konten (announcement, lecturer, etc)
- `content`: Text content yang di-embed
- `embedding`: Vector array (384-dimensional)
- `metadata`: Additional metadata
- `createdAt`: Waktu creation
- `updatedAt`: Waktu update

**Index**: Compound index pada `contentId` + `contentType`

---

### 8. SystemSetting Model (`SystemSettingModel.ts`)

**Purpose**: Global system configuration

**Fields**:

- `key`: Setting key (unique)
- `value`: Setting value (polymorphic)
- `description`: Deskripsi setting
- `type`: Tipe value (string, number, boolean, json)
- `updatedAt`: Waktu last update
- `updatedBy`: User yang melakukan update

---

## API Routes

### Base URL: `http://localhost:5000/api/v1`

### 1. Authentication Routes (`/auth`)

#### Register

```http
POST /auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123",
  "fullname": "John Doe"
}

Response 201:
{
  "success": true,
  "data": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com"
  },
  "message": "User registered successfully"
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response 200:
{
  "success": true,
  "data": {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
    "user": { /* user data */ }
  }
}
```

#### Google OAuth

```http
GET /auth/google
// Redirects to Google login

GET /auth/google/callback?code=...&state=...
// Callback URL after Google auth
```

#### Refresh Token

```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh_token"
}

Response 200:
{
  "success": true,
  "data": {
    "accessToken": "new_jwt_token"
  }
}
```

#### Logout

```http
POST /auth/logout
Authorization: Bearer {accessToken}

Response 200:
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 2. User Routes (`/user`)

#### Get Current User

```http
GET /user/profile
Authorization: Bearer {accessToken}

Response 200:
{
  "success": true,
  "data": { /* user object */ }
}
```

#### Update Profile

```http
PUT /user/profile
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "fullname": "John Updated",
  "phone": "081234567890"
}
```

#### Upload Avatar

```http
POST /user/avatar
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

Form Data:
- file: (binary image)

Response 200:
{
  "success": true,
  "data": {
    "photoUrl": "/uploads/avatars/filename.jpg"
  }
}
```

#### Change Password

```http
POST /user/change-password
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123"
}
```

#### Get User History

```http
GET /user/history?page=1&limit=20
Authorization: Bearer {accessToken}

Response 200:
{
  "success": true,
  "data": {
    "items": [ /* history items */ ],
    "pagination": { /* pagination info */ }
  }
}
```

---

### 3. Lecturer Routes (`/lecturers`)

#### List All Lecturers

```http
GET /lecturers?page=1&limit=10&department=IT
Authorization: Optional

Response 200:
{
  "success": true,
  "data": {
    "items": [ /* lecturer objects */ ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

#### Get Lecturer Detail

```http
GET /lecturers/{id}

Response 200:
{
  "success": true,
  "data": { /* lecturer object */ }
}
```

#### Create Lecturer (Admin)

```http
POST /lecturers
Authorization: Bearer {accessToken}
Content-Type: application/json
X-Role: admin

{
  "name": "Dr. Ahmad Wijaya",
  "email": "ahmad@univ.edu",
  "department": "Information Technology",
  "specialization": "Machine Learning"
}
```

#### Update Lecturer (Admin)

```http
PUT /lecturers/{id}
Authorization: Bearer {accessToken}
Content-Type: application/json
X-Role: admin
```

#### Delete Lecturer (Admin)

```http
DELETE /lecturers/{id}
Authorization: Bearer {accessToken}
X-Role: admin
```

#### Search Lecturers

```http
GET /lecturers/search?q=Ahmad&department=IT
```

---

### 4. Announcement Routes (`/announcements`)

#### List Announcements

```http
GET /announcements?page=1&category=news&sort=-publishedAt

Response 200:
{
  "success": true,
  "data": {
    "items": [ /* announcement objects */ ],
    "pagination": { /* pagination */ }
  }
}
```

#### Get Announcement Detail

```http
GET /announcements/{id}
```

#### Create Announcement (Admin)

```http
POST /announcements
Authorization: Bearer {accessToken}
Content-Type: application/json
X-Role: admin

{
  "title": "Pengumuman Penting",
  "content": "Konten pengumuman...",
  "category": "urgent",
  "priority": "high"
}
```

#### Update Announcement (Admin)

```http
PUT /announcements/{id}
Authorization: Bearer {accessToken}
X-Role: admin
```

#### Delete Announcement (Admin)

```http
DELETE /announcements/{id}
Authorization: Bearer {accessToken}
X-Role: admin
```

#### Upload Announcement Image

```http
POST /announcements/{id}/images
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data
X-Role: admin

Form Data:
- file: (binary image)
```

---

### 5. Highlight Routes (`/highlight`)

#### List Highlights

```http
GET /highlight?limit=10&sort=order

Response 200:
{
  "success": true,
  "data": {
    "items": [ /* highlight objects */ ]
  }
}
```

#### Create Highlight (Admin)

```http
POST /highlight
Authorization: Bearer {accessToken}
X-Role: admin

{
  "title": "Achievement Title",
  "description": "Description...",
  "image": "image_url",
  "type": "achievement",
  "order": 1
}
```

#### Reorder Highlights (Admin)

```http
PUT /highlight/reorder
Authorization: Bearer {accessToken}
X-Role: admin
Content-Type: application/json

{
  "items": [
    { "id": "id1", "order": 1 },
    { "id": "id2", "order": 2 }
  ]
}
```

---

### 6. Dashboard Routes (`/dashboard`) - Admin Only

#### Dashboard Statistics

```http
GET /dashboard/stats
Authorization: Bearer {accessToken}
X-Role: admin

Response 200:
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "activeUsers": 45,
    "totalAnnouncements": 25,
    "totalLecturers": 30,
    "monthlyVisits": 1250
  }
}
```

#### User Activity Analytics

```http
GET /dashboard/analytics?startDate=2024-01-01&endDate=2024-01-31

Response 200:
{
  "success": true,
  "data": {
    "dailyVisits": [ /* array of daily stats */ ],
    "topPages": [ /* most visited pages */ ],
    "topSearches": [ /* top search queries */ ]
  }
}
```

---

### 7. History Routes (`/history`)

#### Get User History

```http
GET /history?type=view&limit=20&page=1
Authorization: Bearer {accessToken}

Response 200:
{
  "success": true,
  "data": {
    "items": [ /* history items */ ],
    "pagination": { /* pagination */ }
  }
}
```

#### Get Specific Resource History

```http
GET /history/lecturer/{lecturerId}
// Get history of specific lecturer views
```

---

### 8. RAG/Chat Routes (`/chat`)

#### Search Query

```http
POST /chat/search
Content-Type: application/json

{
  "query": "Who is the computer science lecturer?",
  "limit": 5
}

Response 200:
{
  "success": true,
  "data": {
    "results": [
      {
        "content": "...",
        "score": 0.85,
        "source": "lecturer",
        "metadata": {}
      }
    ]
  }
}
```

#### RAG Generation

```http
POST /chat/generate
Content-Type: application/json

{
  "query": "Tell me about the IT department",
  "context": [ /* previous context */ ]
}

Response 200:
{
  "success": true,
  "data": {
    "response": "Generated answer...",
    "sources": [ /* references */ ]
  }
}
```

---

### 9. Partner Routes (`/partner`)

#### List Partners

```http
GET /partner?category=technology&page=1

Response 200:
{
  "success": true,
  "data": {
    "items": [ /* partner objects */ ]
  }
}
```

#### Create Partner (Admin)

```http
POST /partner
Authorization: Bearer {accessToken}
X-Role: admin
Content-Type: application/json

{
  "name": "Tech Company ABC",
  "logo": "logo_url",
  "category": "technology"
}
```

---

## Services

### Service Layer Architecture

Services mengandung business logic dan berinteraksi dengan database serta external APIs.

### 1. Embedding Service (`embeddingService.ts`)

**Purpose**: Mengelola vector embeddings untuk RAG

**Main Methods**:

```typescript
class EmbeddingService {
  // Generate embeddings untuk text content
  async generateEmbeddings(text: string): Promise<number[]>;

  // Search embeddings menggunakan similarity
  async searchSimilar(
    embedding: number[],
    limit: number,
    threshold: number,
  ): Promise<Document[]>;

  // Bulk create embeddings
  async createBulkEmbeddings(items: EmbeddingItem[]): Promise<void>;

  // Delete embeddings
  async deleteEmbeddings(resourceId: string): Promise<void>;

  // Update embeddings
  async updateEmbeddings(resourceId: string, newContent: string): Promise<void>;
}
```

**Integration Points**:

- HuggingFace API (untuk generate embeddings)
- Embedding Model (MongoDB)
- Redis Cache (untuk caching hasil search)

---

### 2. Embedding Insert Service (`embeddingInsertService.ts`)

**Purpose**: Batch processing untuk insert embeddings

**Main Methods**:

```typescript
class EmbeddingInsertService {
  // Queue item untuk batch processing
  async queueEmbedding(item: EmbeddingItem): Promise<void>;

  // Process batch dari queue
  async processBatch(): Promise<ProcessResult>;

  // Process semua pending items
  async processAll(): Promise<void>;

  // Get queue status
  async getQueueStatus(): Promise<QueueStatus>;
}
```

**Features**:

- Batching untuk efficiency
- Retry logic untuk failed items
- Progress tracking
- Error logging

---

### 3. RAG Service (`ragService.ts`)

**Purpose**: Retrieval-Augmented Generation untuk intelligent search dan Q&A

**Main Methods**:

```typescript
class RAGService {
  // Retrieve relevant documents
  async retrieve(query: string, limit: number): Promise<RetrievedDocument[]>;

  // Generate answer berdasarkan query dan context
  async generate(
    query: string,
    context: RetrievedDocument[],
  ): Promise<GeneratedResponse>;

  // Combined search and generate
  async searchAndGenerate(query: string): Promise<RAGResponse>;

  // Hybrid search (keyword + semantic)
  async hybridSearch(query: string): Promise<SearchResults>;
}
```

**Process Flow**:

1. **Retrieve**: Cari documents yang relevan menggunakan embeddings
2. **Rank**: Rank documents berdasarkan relevance score
3. **Generate**: Gunakan top documents sebagai context untuk generate jawaban

---

### 4. Model Service (`modelService.ts`)

**Purpose**: Mengelola model data (create, read, update, delete)

**Main Methods**:

```typescript
class ModelService {
  // CRUD operations untuk berbagai models
  async create(model: string, data: any): Promise<any>;
  async findById(model: string, id: string): Promise<any>;
  async findAll(model: string, filter?: any): Promise<any[]>;
  async update(model: string, id: string, data: any): Promise<any>;
  async delete(model: string, id: string): Promise<void>;

  // Bulk operations
  async createMany(model: string, data: any[]): Promise<any[]>;
  async updateMany(model: string, filter: any, data: any): Promise<void>;
  async deleteMany(model: string, filter: any): Promise<void>;
}
```

---

## Middleware

### Middleware Execution Order

```
┌─ Request
│
├─ Security Middleware
│  ├─ Helmet (security headers)
│  ├─ CORS (cross-origin)
│  ├─ Mongo Sanitize (prevent NoSQL injection)
│  └─ Compression (gzip)
│
├─ Body Parsing
│  ├─ JSON parser
│  ├─ URL-encoded parser
│  └─ Cookie parser
│
├─ Logging
│  └─ Morgan (HTTP request logging)
│
├─ Static Files
│  └─ Uploads directory
│
├─ Route Handlers
│  ├─ Authentication Middleware
│  ├─ Validation Middleware
│  ├─ Rate Limiter
│  └─ Business Logic
│
├─ Multer Error Handler
│
└─ Global Error Handler
   └─ Response
```

### 1. Authentication Middleware (`auth.middleware.ts`)

**Purpose**: Validasi JWT tokens dan session management

```typescript
// Verify JWT token
verifyToken(req, res, next);

// Verify refresh token
verifyRefreshToken(req, res, next);

// Check user role
requireRole(...roles)(req, res, next);

// Optional authentication
optionalAuth(req, res, next);
```

**Usage**:

```typescript
router.get("/profile", verifyToken, getProfile);
router.post("/admin", verifyToken, requireRole("admin"), adminAction);
```

---

### 2. Error Middleware (`error.middleware.ts`)

**Purpose**: Global error handling dan response formatting

**Features**:

- Catch unhandled errors
- Format error responses
- Log errors dengan Winston
- Return appropriate HTTP status codes

**Error Types**:

- Validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Server errors (500)

---

### 3. Rate Limiter Middleware (`rateLimiter.middleware.ts`)

**Purpose**: Protect API dari abuse dan DDoS

```typescript
// Global rate limiter
globalLimiter: 100 requests per 15 minutes per IP

// Stricter limiters untuk sensitive endpoints
authLimiter: 5 login attempts per 15 minutes
uploadLimiter: 10 uploads per hour per user
```

---

### 4. Upload Middleware (`uploads.middleware.ts`)

**Purpose**: Menangani file uploads dengan validasi

**Features**:

- File type validation
- File size checking
- Image processing (resize, optimize)
- Automatic directory creation
- Error handling untuk invalid files

```typescript
// Single file upload
uploadSingle("field-name");

// Multiple files upload
uploadMultiple("field-name", maxCount);

// Custom validation
validateUploadedFile(file);
```

---

### 5. Validation Middleware (`validate.middleware.ts`)

**Purpose**: Validate request body, params, dan query

**Using Zod schemas**:

```typescript
validateBody(schema)(req, res, next);
validateParams(schema)(req, res, next);
validateQuery(schema)(req, res, next);

// Example usage:
const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

router.post("/users", validateBody(createUserSchema), createUser);
```

---

## Authentication & Security

### JWT Authentication Flow

```
┌─────────────────────────────────────────────────┐
│ 1. Login Request                                 │
│    email + password ──→                         │
└──────────┬──────────────────────────────────────┘
           │
┌──────────▼──────────────────────────────────────┐
│ 2. Verify Credentials                           │
│    ├─ Find user by email                        │
│    ├─ Compare password (bcrypt)                 │
│    └─ Check if user is active                   │
└──────────┬──────────────────────────────────────┘
           │
┌──────────▼──────────────────────────────────────┐
│ 3. Generate Tokens                              │
│    ├─ accessToken (15 min expiry)              │
│    └─ refreshToken (7 days expiry)             │
└──────────┬──────────────────────────────────────┘
           │
┌──────────▼──────────────────────────────────────┐
│ 4. Return Tokens                                │
│    ← accessToken + refreshToken                │
└─────────────────────────────────────────────────┘

Usage:
┌─────────────────────────────────────────────────┐
│ Subsequent Requests                             │
│ Authorization: Bearer {accessToken} ──→        │
└──────────┬──────────────────────────────────────┘
           │
┌──────────▼──────────────────────────────────────┐
│ Verify Token                                    │
│ ├─ Decode JWT                                  │
│ ├─ Verify signature                            │
│ ├─ Check expiry                                │
│ └─ Extract user info                           │
└──────────┬──────────────────────────────────────┘
           │
┌──────────▼──────────────────────────────────────┐
│ If Token Expired:                               │
│ POST /auth/refresh ──→ Get new accessToken    │
└─────────────────────────────────────────────────┘
```

### Password Security

**Hashing Algorithm**: bcrypt

- **Salt rounds**: 10 (configurable via SALT_BCRYPT env)
- **One-way hashing**: Passwords cannot be reversed
- **Slow by design**: Protects against brute force attacks

```typescript
// Password hashing on registration
const hashedPassword = await hashingPassword(plainPassword);

// Password comparison on login
const isMatch = await comparePassword(plainPassword, hashedPassword);
```

### Google OAuth 2.0

**Setup**:

1. Create OAuth credentials di Google Cloud Console
2. Set redirect URI: `http://localhost:5000/api/v1/auth/google/callback`
3. Configure env variables: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

**Flow**:

```
1. User clicks "Login with Google"
2. → Redirects to: /api/v1/auth/google
3. → Google login page
4. → User authorizes
5. → Google redirects to callback with code
6. → Server exchanges code untuk access token
7. → Get user profile dari Google
8. → Create/update user di database
9. → Issue JWT tokens
10. → Redirect to frontend dengan tokens
```

### CORS Configuration

```typescript
// cors.ts
const corsOptions = {
  origin: [
    "http://localhost:3000", // Frontend development
    "https://yourdomain.com", // Production domain
  ],
  credentials: true, // Allow cookies
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 3600, // Preflight cache 1 hour
};
```

---

## Caching Strategy

### Redis Caching Architecture

```
┌─ Request comes in
│
├─ Check Redis cache
│  ├─ Hit → Return cached data (fast)
│  └─ Miss → Query database
│
├─ Process data
│
├─ Store in Redis
│  ├─ Set TTL (default 15 minutes)
│  └─ With version/tag
│
└─ Return to client
```

### Cache Manager (`cacheManager.ts`)

```typescript
class CacheManager {
  // Get from cache or fetch from source
  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number,
  ): Promise<T>;

  // Set cache value
  async set<T>(key: string, value: T, ttl?: number): Promise<void>;

  // Get cache value
  async get<T>(key: string): Promise<T | null>;

  // Delete cache
  async delete(key: string): Promise<void>;

  // Delete by pattern
  async deletePattern(pattern: string): Promise<void>;

  // Clear all cache
  async clear(): Promise<void>;

  // Get cache stats
  async getStats(): Promise<CacheStats>;
}
```

### Cache Keys Convention

```
lecturer:{id}              // Single lecturer
lecturers:list             // Lecturers list
lecturers:list:{page}      // Paginated list
announcement:{id}          // Single announcement
announcements:list         // Announcements list
user:{id}:profile          // User profile
search:{query}:{page}      // Search results
embedding:similar:{limit}  // Similarity search
```

### Cache Invalidation

**Automatic invalidation** ketika data berubah:

```typescript
// On create
await new Lecturer(data).save();
await cacheManager.deletePattern("lecturers:*");

// On update
await Lecturer.findByIdAndUpdate(id, data);
await cacheManager.delete(`lecturer:${id}`);
await cacheManager.deletePattern("lecturers:*");

// On delete
await Lecturer.findByIdAndDelete(id);
await cacheManager.delete(`lecturer:${id}`);
await cacheManager.deletePattern("lecturers:*");
```

### Cache TTL Configuration

```env
# Default TTL in seconds (15 minutes)
TTL=900

# Custom TTL per cache type
CACHE_TTL_LECTURER=3600        # 1 hour
CACHE_TTL_ANNOUNCEMENT=1800    # 30 minutes
CACHE_TTL_SEARCH=600           # 10 minutes
CACHE_TTL_EMBEDDING=7200       # 2 hours
```

---

## File Upload Handling

### Upload Configuration

```typescript
// uploads.middleware.ts
const uploadConfig = {
  destination: "./uploads",
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ApiError("Invalid file type", 400));
    }
  },
};
```

### Image Processing dengan Sharp

```typescript
// Automatic image optimization on upload
const processImage = async (filePath: string) => {
  await sharp(filePath)
    .resize(1200, 1200, { fit: "inside" })
    .webp({ quality: 80 })
    .toFile(`${filePath}.webp`);
};
```

### Upload Directory Structure

```
uploads/
├── avatars/              # User profile photos
│   └── user_id_*.jpg
├── carousels/           # Homepage carousel images
│   └── carousel_id_*.jpg
├── highlights/          # Highlight/featured items
│   └── highlight_id_*.jpg
├── lecturers/           # Lecturer photos
│   └── lecturer_id_*.jpg
├── news/                # News/announcement images
│   └── announcement_id_*.jpg
└── temp/                # Temporary upload files
    └── *.tmp
```

### Upload Endpoints

```http
# Upload user avatar
POST /user/avatar
Authorization: Bearer {token}
Content-Type: multipart/form-data
Form: file=<binary>

# Upload announcement image
POST /announcements/{id}/images
Authorization: Bearer {token}
X-Role: admin
Content-Type: multipart/form-data
Form: file=<binary>

# Upload lecturer photo
POST /lecturers/{id}/photo
Authorization: Bearer {token}
X-Role: admin
Content-Type: multipart/form-data
Form: file=<binary>
```

---

## Logging & Monitoring

### Winston Logger Setup

**Logger Configuration** (`utils/logger.ts`):

```typescript
const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: "logs/application-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxDays: "14d",
    }),
  ],
});
```

### Log Levels

```
error   - Error messages (unhandled exceptions, database errors)
warn    - Warning messages (deprecated features, unusual patterns)
info    - Informational (server start, important events)
http    - HTTP requests (Morgan middleware)
debug   - Debug information (detailed execution trace)
```

### Log Format

```json
{
  "level": "info",
  "message": "User logged in successfully",
  "timestamp": "2024-01-20T10:30:45.123Z",
  "userId": "user_123",
  "endpoint": "POST /api/v1/auth/login",
  "duration": "125ms",
  "ipAddress": "192.168.1.100"
}
```

### Log Files

```
logs/
├── application-2024-01-20.log
├── application-2024-01-21.log
├── error-2024-01-20.log
└── error-2024-01-21.log

// Retention: 14 days, max 20MB per file
```

### Morgan HTTP Logging

```typescript
// Custom Morgan format
:remote-addr :method :url :status :res[content-length] - :response-time ms
// Example: 127.0.0.1 GET /api/v1/lecturers 200 1234 - 45ms
```

---

## Testing

### K6 Load Testing

Located di `tests/k6/`, K6 digunakan untuk performance dan load testing.

**Test Types**:

1. **Smoke Test** (`smoke-test.js`)
   - Quick sanity check
   - Basic happy path testing
   - Usage: `npm run smoke-test`

2. **Load Test** (`load-test.js`)
   - Simulate normal user load
   - Measure response times
   - Monitor resource usage

3. **Stress Test** (`stress-test.js`)
   - Gradually increase load
   - Find breaking points
   - Identify bottlenecks

4. **Spike Test** (`spike-test.js`)
   - Sudden traffic increase
   - Check system resilience
   - Test auto-scaling

5. **Endurance Test** (`endurance-test.js`)
   - Long duration test (hours/days)
   - Memory leak detection
   - Stability monitoring

### Running Tests

```bash
# Install k6 (jika belum)
# Windows: choco install k6
# macOS: brew install k6
# Linux: apt-get install k6

# Run specific test
k6 run tests/k6/smoke-test.js

# Run with config
k6 run tests/k6/load-test.js --vus 50 --duration 5m

# Run all tests
./tests/k6/run-tests.sh     # Linux/macOS
./tests/k6/run-tests.bat    # Windows
```

### Test Configuration (`config.js`)

```javascript
export const BASE_URL = "http://localhost:5000/api/v1";
export const VUS = 10; // Virtual users
export const DURATION = "5m"; // Test duration
export const RAMP_UP = "1m"; // Ramp-up time
export const THRESHOLD = {
  http_req_duration: ["p(95)<500"], // 95th percentile < 500ms
  http_req_failed: ["rate<0.1"], // Failure rate < 10%
};
```

---

## Deployment

### Docker Deployment

#### Build Docker Image

```bash
# Build image
docker build -t website-s1ti-backend:latest .

# Run container
docker run -d \
  --name backend \
  -p 5000:5000 \
  --env-file .env \
  website-s1ti-backend:latest
```

#### Docker Compose

```yaml
# docker-compose.yml
version: "3.8"

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - REDIS_URL=${REDIS_URL}
    volumes:
      - ./backend/uploads:/app/uploads
    depends_on:
      - mongodb
      - redis
    networks:
      - app-network

  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    networks:
      - app-network

  redis:
    image: redis:latest
    ports:
      - "6379:6379"
    networks:
      - app-network

volumes:
  mongo-data:

networks:
  app-network:
    driver: bridge
```

### Production Deployment Checklist

- [ ] All environment variables configured
- [ ] Database backups enabled
- [ ] Redis persistence enabled
- [ ] SSL/TLS certificates installed
- [ ] CORS configured for production domain
- [ ] Rate limiting enabled
- [ ] Logging to persistent storage
- [ ] Error monitoring setup (Sentry, etc.)
- [ ] Database indexes created
- [ ] Cache invalidation strategy tested
- [ ] File upload directory permissions set
- [ ] Cron jobs scheduled
- [ ] Health check endpoint monitored

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
LOG_LEVEL=warn

MONGODB_URI=mongodb+srv://prod-user:strong-password@prod-cluster...
MONGODB_NAME=website_s1ti_prod

REDIS_URL=redis://default:strong-password@prod-redis-host:6379

JWT_SECRET=very-long-random-secret-with-high-entropy-min-32-chars
JWT_REFRESH_SECRET=another-very-long-random-secret-min-32-chars

FRONTEND_ORIGIN=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com

GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxx
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/v1/auth/google/callback

HF_API_KEY=hf_xxxx
EMBEDDING_BASE_URL=https://embedding-service.yourdomain.com

SALT_BCRYPT=12
```

---

## Development Workflow

### Getting Started

```bash
# 1. Clone dan setup
git clone <repo>
cd backend
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env dengan local development values

# 3. Start development server
npm run dev

# 4. Check health
curl http://localhost:5000/health
```

### Development Best Practices

#### 1. Code Style

```bash
# Lint code
npm run lint

# Auto-fix lint issues
npm run lint:fix
```

#### 2. Type Safety

- Gunakan TypeScript strict mode
- Define interfaces untuk semua data structures
- Avoid `any` type, use specific types
- Enable strict null checks

#### 3. Error Handling

```typescript
// Use ApiError class untuk consistency
throw new ApiError("User not found", 404);

// Wrap async functions dengan asyncHandler
router.get(
  "/users/:id",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new ApiError("Not found", 404);
    res.json(new ApiResponse(user, "User found"));
  }),
);
```

#### 4. Database Queries

```typescript
// Use lean() untuk read-only queries (better performance)
const users = await User.find().lean();

// Create indexes untuk frequently queried fields
userSchema.index({ email: 1 });
userSchema.index({ username: 1, role: 1 });

// Use select() untuk exclude sensitive fields
User.findById(id).select("-password");
```

#### 5. Validation

```typescript
// Use Zod schemas untuk input validation
const userSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Min 8 characters"),
  age: z.number().min(13).max(120),
});

// Validate in middleware
router.post("/users", validateBody(userSchema), createUserController);
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push dan create pull request
git push origin feature/your-feature-name
```

### Debugging

#### Debug dengan VS Code

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "program": "${workspaceFolder}/src/server.ts",
      "preLaunchTask": "tsc: build",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"]
    }
  ]
}
```

#### Console Logging

```typescript
// Use logger untuk production code
logger.info("User created", { userId: user._id });
logger.error("Database error", { error: err.message });

// Use console untuk development debugging only
console.log("DEBUG:", user);
```

---

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Failed

**Symptom**: `MongooseError: connect ECONNREFUSED`

**Solutions**:

```bash
# Check if MongoDB is running
mongosh "mongodb+srv://..."

# Verify credentials
echo $MONGODB_URI

# Check network/firewall
# - Ensure IP whitelist includes your IP
# - MongoDB Atlas: Add 0.0.0.0/0 for development

# Verify connection string format
# Correct: mongodb+srv://user:pass@cluster.mongodb.net/dbname
# Wrong: mongodb://user:pass@cluster.mongodb.net:27017/dbname
```

#### 2. Redis Connection Failed

**Symptom**: `ECONNREFUSED 127.0.0.1:6379`

**Solutions**:

```bash
# Check if Redis is running
redis-cli ping

# For Upstash, use URL format
REDIS_URL=redis://default:password@host:port

# Test connection
redis-cli -u "$REDIS_URL" ping
```

#### 3. JWT Token Invalid

**Symptom**: `JsonWebTokenError: invalid token`

**Solutions**:

```bash
# Regenerate secrets
echo $(openssl rand -base64 32)

# Verify token format
# Should be: "Bearer <token>"

# Check token expiry
# JWT_EXPIRES_IN=15m (access token)
# JWT_REFRESH_EXPIRES_IN=7d (refresh token)
```

#### 4. CORS Error

**Symptom**: `Access to XMLHttpRequest blocked by CORS policy`

**Solutions**:

```bash
# Check CORS configuration
# corsOptions.origin harus include frontend URL

# Verify headers
# Authorization, Content-Type harus di allowedHeaders

# Check credentials mode
# fetch(..., { credentials: 'include' })
```

#### 5. File Upload Failed

**Symptom**: `413 Payload Too Large` atau file tidak ter-upload

**Solutions**:

```bash
# Increase size limit
// app.ts
app.use(express.json({ limit: '50mb' }));

# Check upload directory permissions
chmod 755 uploads/

# Verify file types allowed
// uploads.middleware.ts allowedMimes array

# Check disk space
df -h
```

#### 6. Rate Limit Exceeded

**Symptom**: `429 Too Many Requests`

**Solutions**:

```bash
# Check rate limit configuration
// rateLimiter.middleware.ts

# Increase limit untuk development
windowMs: 60 * 60 * 1000,  // 1 hour
max: 1000                   // 1000 requests

# Use Redis rate limiter store untuk distributed systems
store: new RedisStore({...})
```

#### 7. High Memory Usage

**Symptom**: Server slowing down atau crashing

**Solutions**:

```bash
# Enable memory profiling
node --inspect dist/server.js

# Use lean() untuk queries
User.find().lean()

# Limit cache size
// cacheManager.ts
const CACHE_MAX_SIZE = 1000;

# Monitor with pm2
pm2 start dist/server.js
pm2 monit
```

### Performance Optimization

#### Database

```typescript
// ✓ Good
User.find({ role: "admin" }).lean().limit(10);

// ✗ Bad
User.find({ role: "admin" }).limit(10); // Loads full docs
```

#### Caching

```typescript
// ✓ Good
const data = await cacheManager.getOrSet(
  'key',
  () => db.query(...),
  3600
);

// ✗ Bad
const data = await db.query(...);  // No caching
```

#### API Response

```typescript
// ✓ Good
res.json(new ApiResponse(data, "Success")); // Standard format

// ✗ Bad
res.json(data); // Inconsistent format
```

---

## Additional Resources

### Documentation Links

- [Express.js Docs](https://expressjs.com/)
- [MongoDB Mongoose](https://mongoosejs.com/)
- [Redis Documentation](https://redis.io/docs/)
- [JWT.io](https://jwt.io/)
- [Zod Validation](https://zod.dev/)
- [K6 Load Testing](https://k6.io/docs/)

### Key Files Reference

- Server config: [backend/src/server.ts](backend/src/server.ts)
- App config: [backend/src/app.ts](backend/src/app.ts)
- Environment: [backend/src/config/env.ts](backend/src/config/env.ts)
- Database: [backend/src/config/database.ts](backend/src/config/database.ts)
- Redis: [backend/src/config/redis.ts](backend/src/config/redis.ts)

### Support & Contact

- Report issues via GitHub Issues
- For urgent matters, contact: josse@example.com
- Check existing documentation first

---

**Last Updated**: January 20, 2024  
**Version**: 1.0.0  
**Status**: Complete Documentation
