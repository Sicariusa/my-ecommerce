# 📁 Complete Repository Structure

## Visual Tree

```
lcnc-ecommerce/
│
├── 📱 client/                          # Next.js Frontend (TypeScript/TSX)
│   │
│   ├── 📂 app/                         # Next.js App Router
│   │   ├── layout.tsx                  # Root layout with metadata
│   │   ├── page.tsx                    # Landing page (ready for v0)
│   │   ├── globals.css                 # Tailwind imports + CSS variables
│   │   │
│   │   ├── dashboard/                  # SaaS Dashboard
│   │   │   └── page.tsx                # Dashboard with stats cards
│   │   │
│   │   ├── auth/                       # Authentication Pages
│   │   │   └── signin/
│   │   │       └── page.tsx            # Sign-in form
│   │   │
│   │   └── api/                        # API Routes (Serverless)
│   │       └── auth/
│   │           └── [...nextauth]/
│   │               └── route.ts        # NextAuth configuration
│   │
│   ├── 📂 components/                  # React Components
│   │   ├── ui/                         # Base UI components (future)
│   │   ├── v0/                         # v0.dev imports (future)
│   │   └── features/                   # Feature components (future)
│   │
│   ├── 📂 lib/                         # Utilities
│   │   ├── utils.ts                    # Helper functions (cn, formatters)
│   │   └── auth.ts                     # Auth utilities (getCurrentUser)
│   │
│   ├── 📂 types/                       # TypeScript Types
│   │   ├── index.ts                    # Shared types (User, Product, etc.)
│   │   └── next-auth.d.ts              # NextAuth type extensions
│   │
│   ├── 📂 styles/                      # Additional styles (future)
│   │
│   ├── 📂 public/                      # Static assets (future)
│   │
│   ├── 📄 package.json                 # Client dependencies
│   ├── 📄 tsconfig.json                # TypeScript config + path aliases
│   ├── 📄 next.config.js               # Next.js + subdomain routing
│   ├── 📄 tailwind.config.ts           # Tailwind design system
│   ├── 📄 postcss.config.js            # PostCSS config
│   └── 📄 .eslintrc.json               # ESLint rules
│
├── 🖥️ server/                          # Express Backend (Plain JavaScript)
│   │
│   ├── 📂 routes/                      # API Route Handlers
│   │   ├── auth.js                     # Register, login endpoints
│   │   ├── tenants.js                  # Tenant CRUD operations
│   │   └── products.js                 # Product CRUD operations
│   │
│   ├── 📂 middleware/                  # Express Middleware
│   │   ├── auth.js                     # JWT authentication
│   │   ├── tenant.js                   # Multi-tenant isolation
│   │   └── errorHandler.js             # Global error handling + AppError
│   │
│   ├── 📂 services/                    # Business logic (future)
│   │
│   ├── 📂 utils/                       # Helper functions (future)
│   │
│   ├── 📂 scripts/                     # Database seeding, etc. (future)
│   │
│   ├── 📄 package.json                 # Server dependencies
│   └── 📄 index.js                     # Express app entry point
│
├── 🗄️ prisma/                          # Database Schema
│   ├── schema.prisma                   # Prisma schema (PostgreSQL)
│   │   ├── Tenant                      # Multi-tenant model
│   │   ├── User                        # Users with roles
│   │   ├── Product                     # E-commerce products
│   │   ├── Order                       # Order management
│   │   ├── OrderItem                   # Order line items
│   │   └── Page                        # Page builder data
│   │
│   └── migrations/                     # Migration history (auto-generated)
│
├── 🔐 auth/                            # Authentication Module
│   └── 📄 package.json                 # Auth dependencies
│
├── 📄 package.json                     # Root workspace config
├── 📄 .gitignore                       # Git ignore rules
├── 📄 .prettierrc                      # Code formatting config
├── 📄 README.md                        # Quick start guide
├── 📄 PROJECT_GUIDE.md                 # Comprehensive dev guide
├── 📄 SETUP_COMPLETE.md                # Setup summary
└── 📄 STRUCTURE.md                     # This file
```

---

## 📂 Folder Roles & Responsibilities

### 📱 client/ - Next.js Frontend

**Purpose:** User-facing application, admin dashboard, authentication UI

**Language:** TypeScript/TSX  
**Framework:** Next.js 14 (App Router)  
**Styling:** Tailwind CSS

**Key Files:**
- `app/layout.tsx` - Root layout with fonts, metadata
- `app/page.tsx` - Landing page (replace with v0 components)
- `app/globals.css` - Tailwind imports + CSS custom properties
- `app/dashboard/page.tsx` - SaaS dashboard
- `app/auth/signin/page.tsx` - Authentication UI
- `app/api/auth/[...nextauth]/route.ts` - NextAuth config
- `lib/utils.ts` - Helper functions (cn, formatters)
- `types/index.ts` - Shared TypeScript types

**Configuration:**
- `tsconfig.json` - Path aliases (`@/*`)
- `next.config.js` - Subdomain routing for multi-tenancy
- `tailwind.config.ts` - Design system tokens
- `.eslintrc.json` - Linting rules

---

### 🖥️ server/ - Express Backend

**Purpose:** Business logic, API endpoints, data validation

**Language:** Plain JavaScript (ES Modules)  
**Framework:** Express.js  
**ORM:** Prisma

**Key Files:**
- `index.js` - Express app setup, middleware chain
- `routes/auth.js` - Register, login endpoints
- `routes/tenants.js` - Tenant management
- `routes/products.js` - Product CRUD
- `middleware/auth.js` - JWT authentication
- `middleware/tenant.js` - Multi-tenant isolation
- `middleware/errorHandler.js` - Error handling

**Architecture Pattern:**
```
Request → Tenant Middleware → Auth Middleware → Route Handler → Response
```

---

### 🗄️ prisma/ - Database Schema

**Purpose:** Database structure, migrations, ORM

**ORM:** Prisma  
**Database:** PostgreSQL

**Models:**
- `Tenant` - Multi-tenant isolation
- `User` - User accounts with tenant relation
- `Product` - E-commerce products
- `Order` - Order management
- `OrderItem` - Order line items
- `Page` - Page builder JSON storage

**Key Commands:**
- `npx prisma migrate dev` - Create migration
- `npx prisma generate` - Generate client
- `npx prisma studio` - Visual database editor

---

### 🔐 auth/ - Authentication Module

**Purpose:** Centralized authentication configuration

**Provider:** NextAuth.js  
**Strategy:** JWT with credentials provider

**Integration:**
- NextAuth config: `client/app/api/auth/[...nextauth]/route.ts`
- Auth helpers: `client/lib/auth.ts`
- Type extensions: `client/types/next-auth.d.ts`

---

## 🔄 Data Flow

### 1. User Authentication Flow

```
┌──────────────┐
│   Browser    │
│              │
│ Sign In Form │
└──────┬───────┘
       │ POST /api/auth/signin
       ▼
┌──────────────────────────┐
│   NextAuth.js            │
│                          │
│ 1. Validate credentials  │
│ 2. Query Prisma          │
│ 3. Compare bcrypt hash   │
│ 4. Generate JWT          │
└──────┬───────────────────┘
       │ Set session cookie
       ▼
┌──────────────┐
│   Browser    │
│              │
│ → /dashboard │
└──────────────┘
```

### 2. Multi-Tenant Request Flow

```
┌──────────────────────────────────┐
│   Request                         │
│   Host: mystore.localhost:3000   │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│   Next.js Rewrites                │
│                                   │
│   Extract subdomain: "mystore"   │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│   Express Tenant Middleware       │
│                                   │
│   1. Extract "mystore"            │
│   2. Query: Tenant.findUnique()   │
│   3. Attach to req.tenantId       │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│   Route Handler                   │
│                                   │
│   Query with tenantId filter     │
└──────────────────────────────────┘
```

### 3. API Request Flow (Protected)

```
┌──────────────────────────────────┐
│   Client                          │
│   Authorization: Bearer <token>  │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│   Auth Middleware                 │
│                                   │
│   1. Extract JWT from header     │
│   2. Verify signature             │
│   3. Decode payload               │
│   4. Attach to req.user           │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│   Route Handler                   │
│                                   │
│   Access req.user.tenantId       │
│   Query Prisma with filter       │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│   Response                        │
│   { success: true, data: {...} } │
└──────────────────────────────────┘
```

---

## 📦 Dependencies Overview

### Client Dependencies

```json
{
  "dependencies": {
    "next": "^14.1.0",                    // React framework
    "react": "^18.2.0",                   // UI library
    "react-dom": "^18.2.0",               // React DOM
    "next-auth": "^4.24.5",               // Authentication
    "@prisma/client": "^5.8.0",           // Database ORM
    "@next-auth/prisma-adapter": "^1.0.7", // NextAuth Prisma integration
    "bcryptjs": "^2.4.3",                 // Password hashing
    "axios": "^1.6.5",                    // HTTP client
    "clsx": "^2.1.0",                     // Conditional classes
    "tailwind-merge": "^2.2.0",           // Merge Tailwind classes
    "lucide-react": "^0.309.0"            // Icon library
  },
  "devDependencies": {
    "@types/node": "^20.11.5",
    "@types/react": "^18.2.48",
    "@types/react-dom": "^18.2.18",
    "@types/bcryptjs": "^2.4.6",
    "typescript": "^5.3.3",               // Type safety
    "tailwindcss": "^3.4.1",              // CSS framework
    "postcss": "^8.4.33",                 // CSS processing
    "autoprefixer": "^10.4.17",           // CSS vendor prefixes
    "eslint": "^8.56.0",                  // Linting
    "eslint-config-next": "^14.1.0"       // Next.js ESLint config
  }
}
```

### Server Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.2",                 // Web framework
    "cors": "^2.8.5",                     // CORS middleware
    "dotenv": "^16.3.1",                  // Environment variables
    "@prisma/client": "^5.8.0",           // Database ORM
    "jsonwebtoken": "^9.0.2",             // JWT tokens
    "bcryptjs": "^2.4.3",                 // Password hashing
    "express-validator": "^7.0.1",        // Input validation
    "morgan": "^1.10.0",                  // Request logging
    "helmet": "^7.1.0"                    // Security headers
  },
  "devDependencies": {
    "nodemon": "^3.0.2"                   // Auto-reload
  }
}
```

### Root Dependencies

```json
{
  "devDependencies": {
    "@prisma/client": "^5.8.0",
    "concurrently": "^8.2.2",             // Run scripts concurrently
    "prettier": "^3.1.1",                 // Code formatting
    "prisma": "^5.8.0"                    // Prisma CLI
  }
}
```

---

## 🔑 Environment Variables

### Required Variables

```bash
# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/lcnc_ecommerce?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<generate-with-openssl>"

# Server
PORT=5000
NODE_ENV=development
CLIENT_URL="http://localhost:3000"
```

### Optional Variables

```bash
# Supabase (Alternative to NextAuth)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-key"

# Stripe (Payments)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Platform
PLATFORM_DOMAIN="localhost:3000"
```

---

## 🧩 Integration Points

### Client ↔ Server Communication

**Method 1: Direct Fetch (Server Components)**

```typescript
// app/products/page.tsx
async function getProducts() {
  const res = await fetch('http://localhost:5000/api/products', {
    headers: { 'X-Tenant-ID': tenantId }
  });
  return res.json();
}

export default async function ProductsPage() {
  const { data } = await getProducts();
  return <ProductList products={data} />;
}
```

**Method 2: Client-Side Fetch**

```typescript
"use client";

import { useEffect, useState } from "react";

export function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data.data));
  }, []);

  return <div>{/* ... */}</div>;
}
```

**Method 3: Next.js API Route Proxy**

```typescript
// app/api/products/route.ts
export async function GET(req: Request) {
  const res = await fetch('http://localhost:5000/api/products');
  const data = await res.json();
  return Response.json(data);
}
```

### Prisma ↔ Database

**Connection String Format:**

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
```

**Example:**

```
postgresql://postgres:password@localhost:5432/lcnc_ecommerce?schema=public
```

**Prisma Client Usage:**

```javascript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Query with tenant isolation
const products = await prisma.product.findMany({
  where: { tenantId: req.tenantId },
  include: { tenant: true }
});
```

---

## 🔧 Configuration Files Explained

### next.config.js

**Purpose:** Next.js configuration, multi-tenant routing

```javascript
module.exports = {
  reactStrictMode: true,           // Enable React strict mode
  swcMinify: true,                 // Use SWC for minification
  
  // Multi-tenant subdomain routing
  async rewrites() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: '(?<tenant>.*)\\.localhost:3000' }],
        destination: '/tenant/:tenant/:path*',
      },
    ];
  },
};
```

### tailwind.config.ts

**Purpose:** Tailwind CSS design system

```typescript
export default {
  content: [
    "./app/**/*.{ts,tsx}",           // Scan app directory
    "./components/**/*.{ts,tsx}",    // Scan components
  ],
  theme: {
    extend: {
      colors: {                       // Custom color tokens
        border: "hsl(var(--border))",
        primary: "hsl(var(--primary))",
        // ...
      },
    },
  },
};
```

### tsconfig.json

**Purpose:** TypeScript compiler configuration

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "esnext"],
    "jsx": "preserve",               // Next.js handles JSX
    "module": "esnext",
    "moduleResolution": "bundler",
    "paths": {                       // Path aliases
      "@/*": ["./*"],
      "@/components/*": ["./components/*"]
    }
  }
}
```

### schema.prisma

**Purpose:** Database schema definition

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Tenant {
  id        String   @id @default(cuid())
  subdomain String   @unique
  // ...
}
```

---

## 📋 Common Tasks

### Add a New API Endpoint

1. **Create route file:** `server/routes/myroute.js`

```javascript
import express from "express";
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    // Your logic
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
});

export default router;
```

2. **Register in `server/index.js`:**

```javascript
import myRoutes from "./routes/myroute.js";
app.use("/api/myroute", myRoutes);
```

### Add a New Database Model

1. **Edit `prisma/schema.prisma`:**

```prisma
model MyModel {
  id       String @id @default(cuid())
  name     String
  tenantId String
  tenant   Tenant @relation(fields: [tenantId], references: [id])
  
  @@index([tenantId])
}
```

2. **Run migration:**

```bash
npx prisma migrate dev --name add_my_model
npx prisma generate
```

### Add a New Frontend Page

1. **Create file:** `client/app/mypage/page.tsx`

```typescript
export default function MyPage() {
  return <div>My Page</div>;
}
```

2. **Access:** `http://localhost:3000/mypage`

### Add a Protected Route

```typescript
// app/protected/page.tsx
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/auth/signin");
  }
  
  return <div>Protected content for {user.email}</div>;
}
```

---

## 🎨 v0.dev Import Zones

### Safe to Replace

These files can be fully replaced with v0.dev exports:

- ✅ `app/page.tsx` - Landing page
- ✅ `app/products/page.tsx` - Product listing (if created)
- ✅ Any new marketing pages

### Keep and Merge

These files should be preserved and configs merged:

- 🔄 `tailwind.config.ts` - Merge color/animation configs
- 🔄 `app/globals.css` - Merge CSS variables
- 🔄 `package.json` - Merge dependencies
- 🔄 `tsconfig.json` - Merge path aliases

### Never Replace

These files contain SaaS-specific logic:

- ❌ `app/layout.tsx` - Root layout
- ❌ `app/dashboard/` - Dashboard pages
- ❌ `app/api/auth/` - Authentication config
- ❌ `lib/auth.ts` - Auth utilities
- ❌ `next.config.js` - Multi-tenant routing

---

## 🚀 Quick Start Commands

```bash
# 1. Install all dependencies
npm install

# 2. Set up environment variables
# Create .env file with DATABASE_URL, NEXTAUTH_SECRET, etc.

# 3. Set up database
npm run db:migrate
npm run db:generate

# 4. Start development
npm run dev
```

**Visit:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000/health
- Prisma Studio: `npm run db:studio`

---

## 📝 File Count Summary

```
Total Files Created: 30+

client/          13 files
  ├── app/        6 files
  ├── lib/        2 files
  ├── types/      2 files
  └── configs     5 files

server/          9 files
  ├── routes/     3 files
  ├── middleware/ 3 files
  └── configs     2 files

prisma/          1 file
auth/            1 file
root/            6 files
```

---

**Last Updated:** October 2025  
**Status:** ✅ Complete and ready for development

