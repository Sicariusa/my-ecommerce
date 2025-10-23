# 📚 LCNC E-commerce Platform - Development Guide

**Version:** 1.0.0  
**Last Updated:** October 2025

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Folder Structure](#folder-structure)
4. [Technology Stack](#technology-stack)
5. [Development Workflow](#development-workflow)
6. [Team Collaboration](#team-collaboration)
7. [Coding Standards](#coding-standards)
8. [Multi-Tenancy Implementation](#multi-tenancy-implementation)
9. [Authentication & Authorization](#authentication--authorization)
10. [API Design Patterns](#api-design-patterns)
11. [Frontend Best Practices](#frontend-best-practices)
12. [Database & Prisma](#database--prisma)
13. [v0.dev Integration Guide](#v0dev-integration-guide)
14. [Testing Strategy](#testing-strategy)
15. [Deployment & CI/CD](#deployment--cicd)
16. [Scaling Strategies](#scaling-strategies)
17. [Security Best Practices](#security-best-practices)
18. [Future Roadmap](#future-roadmap)

---

## 📊 Project Overview

LCNC E-commerce is a **low-code/no-code SaaS platform** that enables users to create and manage their own online stores with:

- 🏢 **Multi-tenant architecture** - Isolated stores per tenant
- 🎨 **Drag-and-drop page builder** - Custom storefront designs
- 🔐 **Secure authentication** - Supabase Authentication
- 💳 **Payment processing** - Stripe integration
- 🌐 **Subdomain routing** - Custom domains per store
- 📱 **Responsive design** - Mobile-first approach

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Client Layer                       │
│  ┌──────────────────────────────────────────────┐  │
│  │  Next.js 14 (App Router) + TypeScript        │  │
│  │  - SSR/SSG for performance                   │  │
│  │  - Client-side routing                       │  │
│  │  - API routes for serverless functions       │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                         ↕
┌─────────────────────────────────────────────────────┐
│                  API Layer (Express)                 │
│  ┌──────────────────────────────────────────────┐  │
│  │  Express.js REST API (Plain JavaScript)     │  │
│  │  - CORS & Security middleware                │  │
│  │  - JWT Authentication                        │  │
│  │  - Tenant isolation middleware               │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                         ↕
┌─────────────────────────────────────────────────────┐
│              Database Layer (Prisma ORM)             │
│  ┌──────────────────────────────────────────────┐  │
│  │  PostgreSQL + Prisma                         │  │
│  │  - Row-level multi-tenancy                   │  │
│  │  - Type-safe queries                         │  │
│  │  - Automated migrations                      │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Request Flow

1. **Client Request** → Next.js frontend
2. **Authentication** → Supabase verifies ID token
3. **API Call** → Axios/fetch to Express backend
4. **Tenant Middleware** → Extract & validate tenant
5. **Business Logic** → Route handlers process request
6. **Database Query** → Prisma ORM with tenant filter
7. **Response** → JSON back to client

---

## 📂 Folder Structure

### Root Structure

```
lcnc-ecommerce/
├── client/              # Next.js frontend (TypeScript)
├── server/              # Express backend (Plain JS)
├── auth/                # Authentication module
├── prisma/              # Database schema & migrations
├── package.json         # Workspace root config
├── .gitignore           # Git ignore rules
├── .prettierrc          # Code formatting config
├── README.md            # Quick start guide
└── PROJECT_GUIDE.md     # This comprehensive guide
```

### 📱 Client Folder (`client/`)

**Language:** TypeScript/TSX  
**Framework:** Next.js 14 (App Router)

```
client/
├── app/                    # Next.js app directory
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   ├── dashboard/          # Dashboard pages
│   ├── auth/               # Auth pages (signin, signup)
│   └── api/                # API routes
│       └── auth/           # Auth pages (signin/signup)
├── components/             # Reusable React components
│   ├── ui/                 # Base UI components (buttons, inputs)
│   └── features/           # Feature-specific components
├── lib/                    # Utility functions
│   ├── utils.ts            # Helper functions
│   └── auth.ts             # Auth utilities
├── types/                  # TypeScript types
│   ├── index.ts            # Shared types
│   └── index.ts            # Shared TypeScript types
├── styles/                 # Additional styles
├── public/                 # Static assets
├── package.json            # Client dependencies
├── tsconfig.json           # TypeScript config
├── next.config.js          # Next.js config
├── tailwind.config.ts      # Tailwind config
├── postcss.config.js       # PostCSS config
└── .eslintrc.json          # ESLint config
```

**Key Configuration Files:**

- **`tsconfig.json`** - TypeScript compiler options with path aliases
- **`next.config.js`** - Multi-tenant subdomain routing, API proxying
- **`tailwind.config.ts`** - Design system tokens, custom colors
- **`.eslintrc.json`** - Linting rules for code quality

### 🖥️ Server Folder (`server/`)

**Language:** Plain JavaScript (ES Modules)  
**Framework:** Express.js

```
server/
├── routes/                 # API route handlers
│   ├── auth.js             # Authentication endpoints
│   ├── tenants.js          # Tenant management
│   └── products.js         # Product CRUD
├── middleware/             # Express middleware
│   ├── auth.js             # JWT authentication
│   ├── tenant.js           # Tenant isolation
│   └── errorHandler.js     # Global error handling
├── services/               # Business logic (future)
├── utils/                  # Helper functions (future)
├── scripts/                # Database seeding, etc.
├── package.json            # Server dependencies
└── index.js                # Express app entry point
```

**Key Patterns:**

- **ES Modules** - Use `import/export` syntax
- **Async/Await** - Handle asynchronous operations
- **Middleware Chain** - Tenant → Auth → Business Logic
- **Error Handling** - Centralized error middleware

### 🗄️ Prisma Folder (`prisma/`)

```
prisma/
├── schema.prisma           # Database schema definition
└── migrations/             # Migration history (auto-generated)
```

**Models:**

- `Tenant` - Multi-tenant isolation
- `User` - User accounts with tenant relation
- `Product` - E-commerce products
- `Order` - Order management
- `OrderItem` - Order line items
- `Page` - Custom page builder data

### 🔐 Auth Folder (`auth/`)

```
auth/
└── package.json            # Auth module dependencies
```

Supabase configuration lives in `client/lib/supabase.ts` and `server/config/supabase.js`

---

## 🛠️ Technology Stack

### Frontend (client/)

| Technology       | Version | Purpose                      |
| ---------------- | ------- | ---------------------------- |
| **Next.js**      | 14.x    | React framework with SSR/SSG |
| **React**        | 18.x    | UI library                   |
| **TypeScript**   | 5.x     | Type safety                  |
| **Tailwind CSS** | 3.x     | Utility-first styling        |
| **Supabase**     | 2.x     | Authentication               |
| **Axios**        | 1.x     | HTTP client                  |
| **Lucide React** | -       | Icon library                 |

### Backend (server/)

| Technology   | Version | Purpose                       |
| ------------ | ------- | ----------------------------- |
| **Express**  | 4.x     | Web framework                 |
| **Prisma**   | 5.x     | ORM & database toolkit        |
| **Supabase** | 2.x     | JWT verification              |
| **Helmet**   | 7.x     | Security headers              |
| **CORS**     | 2.x     | Cross-origin resource sharing |

### Database

| Technology        | Version | Purpose                 |
| ----------------- | ------- | ----------------------- |
| **PostgreSQL**    | 14+     | Primary database        |
| **Prisma Client** | 5.x     | Type-safe query builder |

### DevOps (Future)

- **Docker** - Containerization
- **GitHub Actions** - CI/CD pipelines
- **Vercel/Railway** - Deployment platforms

---

## 🔄 Development Workflow

### Initial Setup

```bash
# 1. Clone repository
git clone <repository-url>
cd lcnc-ecommerce

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your values

# 4. Set up database
npm run db:migrate
npm run db:generate

# 5. Start development servers
npm run dev
```

**Expected Output:**
- Client: `http://localhost:3000`
- Server: `http://localhost:5000`

### Development Commands

```bash
# Run both client and server
npm run dev

# Run only client
npm run dev:client

# Run only server
npm run dev:server

# Database operations
npm run db:migrate       # Run migrations
npm run db:generate      # Generate Prisma client
npm run db:studio        # Open Prisma Studio

# Code quality
npm run lint             # Lint frontend code
npm run format           # Format all code with Prettier

# Build for production
npm run build
npm run start
```

### Environment Variables

Create a `.env` file in the root:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/lcnc_ecommerce"

# Supabase - Client
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJh...your-anon-key"

# Supabase - Server (⚠️ NEVER expose this publicly!)
SUPABASE_SERVICE_ROLE_KEY="eyJh...your-service-role-key"

# Server
PORT=5000
NODE_ENV=development
CLIENT_URL="http://localhost:3000"

# API URL
NEXT_PUBLIC_API_URL="http://localhost:5000"

# Stripe (optional, test mode)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

---

## 👥 Team Collaboration

### Git Workflow

**Branch Strategy:**

```
main                    # Production-ready code
  ├── develop           # Development branch
      ├── feature/*     # New features
      ├── fix/*         # Bug fixes
      └── refactor/*    # Code improvements
```

**Branch Naming Convention:**

```bash
feature/user-authentication
fix/product-image-upload
refactor/api-error-handling
```

### Commit Messages

Follow **Conventional Commits:**

```bash
feat: add user registration endpoint
fix: resolve product price calculation bug
docs: update API documentation
style: format code with prettier
refactor: simplify tenant middleware logic
test: add unit tests for auth service
chore: update dependencies
```

**Examples:**

```bash
git commit -m "feat(auth): implement JWT refresh token"
git commit -m "fix(products): prevent negative inventory"
git commit -m "docs: add API endpoint documentation"
```

### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/payment-integration
   ```

2. **Make Changes & Commit**
   ```bash
   git add .
   git commit -m "feat: integrate Stripe payment"
   ```

3. **Push to Remote**
   ```bash
   git push origin feature/payment-integration
   ```

4. **Open Pull Request**
   - Title: Clear, descriptive
   - Description: What, why, how
   - Link related issues
   - Request reviews

5. **Code Review**
   - At least 1 approval required
   - Address feedback
   - Ensure CI passes

6. **Merge**
   - Squash merge for clean history
   - Delete branch after merge

### Code Review Checklist

- [ ] Code follows style guidelines
- [ ] No console.log or debug code
- [ ] Error handling implemented
- [ ] TypeScript types properly defined
- [ ] Sensitive data not exposed
- [ ] Performance considerations addressed
- [ ] Documentation updated

---

## 📏 Coding Standards

### TypeScript (Client)

**File Naming:**
- Components: `PascalCase.tsx` (e.g., `ProductCard.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Types: `PascalCase.ts` or `index.ts`

**Code Style:**

```typescript
// ✅ Good: Explicit types, named exports
export interface Product {
  id: string;
  name: string;
  price: number;
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

// ✅ Good: Functional components with TypeScript
interface ProductCardProps {
  product: Product;
  onAddToCart: (id: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p>{formatPrice(product.price)}</p>
      <button onClick={() => onAddToCart(product.id)}>
        Add to Cart
      </button>
    </div>
  );
}
```

**Avoid:**

```typescript
// ❌ Bad: Implicit any, default export
export default function Card(props: any) {
  return <div>{props.title}</div>;
}
```

### JavaScript (Server)

**File Naming:**
- Routes: `camelCase.js` (e.g., `products.js`)
- Middleware: `camelCase.js` (e.g., `errorHandler.js`)

**Code Style:**

```javascript
// ✅ Good: ES modules, async/await, error handling
import express from "express";
import { AppError } from "../middleware/errorHandler.js";

const router = express.Router();

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

export default router;
```

### Tailwind CSS

**Prefer Utility Classes:**

```tsx
// ✅ Good: Utility-first
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
  <h2 className="text-xl font-semibold text-gray-900">Title</h2>
  <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
    Action
  </button>
</div>

// ✅ Good: Extract to component for reuse
function PrimaryButton({ children, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
    >
      {children}
    </button>
  );
}
```

### Linting & Formatting

**ESLint Configuration** (`.eslintrc.json`):

```json
{
  "extends": ["next/core-web-vitals", "next/typescript"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

**Prettier Configuration** (`.prettierrc`):

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

**Pre-commit Hook (Future):**

```bash
npm install --save-dev husky lint-staged

# package.json
{
  "lint-staged": {
    "*.{ts,tsx,js}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

---

## 🏢 Multi-Tenancy Implementation

### Database-Level Isolation

**Strategy:** Row-Level Security (RLS) with `tenantId` foreign key

**Prisma Schema Pattern:**

```prisma
model Tenant {
  id        String   @id @default(cuid())
  subdomain String   @unique
  users     User[]
  products  Product[]
}

model Product {
  id       String @id @default(cuid())
  name     String
  tenantId String
  tenant   Tenant @relation(fields: [tenantId], references: [id])
  
  @@index([tenantId])
}
```

**Always include `tenantId` in queries:**

```javascript
// ✅ Good: Tenant-scoped query
const products = await prisma.product.findMany({
  where: { tenantId: req.user.tenantId },
});

// ❌ Bad: Exposes all tenants' data
const products = await prisma.product.findMany();
```

### Tenant Identification

**Methods:**

1. **Subdomain-based** (Recommended for production)
   ```
   mystore.platform.com → tenantId = "mystore"
   ```

2. **Header-based** (Useful for development)
   ```
   X-Tenant-ID: tenant_123
   ```

**Middleware Implementation:**

```javascript
// server/middleware/tenant.js
export const tenantMiddleware = async (req, res, next) => {
  const host = req.get("host");
  const subdomain = host.split(".")[0];
  
  const tenant = await prisma.tenant.findUnique({
    where: { subdomain },
  });
  
  req.tenant = tenant;
  req.tenantId = tenant?.id;
  next();
};
```

**Next.js Rewrites** (`client/next.config.js`):

```javascript
async rewrites() {
  return [
    {
      source: '/:path*',
      has: [{ type: 'host', value: '(?<tenant>.*)\\.localhost:3000' }],
      destination: '/tenant/:tenant/:path*',
    },
  ];
}
```

### Tenant-Specific Customization

**Database Storage:**

```prisma
model Tenant {
  // ... other fields
  settings Json? // Store theme, branding, etc.
}
```

**Example Settings:**

```json
{
  "theme": {
    "primaryColor": "#4F46E5",
    "logo": "https://cdn.example.com/logo.png"
  },
  "domain": "mystore.com",
  "stripe": {
    "accountId": "acct_..."
  }
}
```

---

## 🔐 Authentication & Authorization

### Firebase Authentication Setup

**Client Configuration** (`client/lib/firebase.ts`):

```typescript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

**Server Configuration** (`server/config/firebase.js`):

```javascript
import admin from "firebase-admin";

const app = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

export const auth = admin.auth();
```

**Authentication Flow:**

1. User signs in with email/password on client
2. Firebase returns ID token
3. Client sends token to backend API
4. Backend verifies token using Firebase Admin SDK
5. User data stored in PostgreSQL with `firebaseUid`

### Protected Routes (Client)

```typescript
// Using the useAuth hook
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { user, userData, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/auth/signin" />;

  return <div>Welcome {userData?.name}</div>;
}
```

### Protected Routes (Server)

```javascript
import { authenticateToken } from "./middleware/auth.js";

router.get("/api/products", authenticateToken, async (req, res) => {
  // req.user contains authenticated user info
  const products = await prisma.product.findMany({
    where: { tenantId: req.user.tenantId },
  });
  res.json({ data: products });
});
```

### Authorization Middleware

```javascript
import { requireRole } from "./middleware/auth.js";

// Admin only route
router.delete(
  "/api/tenants/:id",
  authenticateToken,
  requireRole("ADMIN"),
  async (req, res) => {
    // Only admins can access this
  }
);
```

**Old callbacks for reference:**

```typescript
// This section has been replaced with Firebase
// callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.tenantId = user.tenantId;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.tenantId = token.tenantId;
      session.user.role = token.role;
      return session;
    },
  },
};
```

### Server-Side Authentication

**Express Middleware** (`server/middleware/auth.js`):

```javascript
export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    throw new AppError("No token provided", 401);
  }
  
  const decoded = jwt.verify(token, JWT_SECRET);
  req.user = decoded;
  next();
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError("Not authorized", 403);
    }
    next();
  };
};
```

**Usage:**

```javascript
router.get("/admin", authenticate, authorize("ADMIN"), async (req, res) => {
  // Only accessible to admins
});
```

### Client-Side Protection

**Protected Route** (Next.js):

```typescript
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/auth/signin");
  }
  
  return <div>Dashboard for {user.email}</div>;
}
```

---

## 🔌 API Design Patterns

### RESTful Conventions

| Method | Endpoint            | Description        |
| ------ | ------------------- | ------------------ |
| GET    | `/api/products`     | List all products  |
| GET    | `/api/products/:id` | Get single product |
| POST   | `/api/products`     | Create product     |
| PUT    | `/api/products/:id` | Update product     |
| DELETE | `/api/products/:id` | Delete product     |

### Response Format

**Success Response:**

```json
{
  "success": true,
  "data": {
    "id": "prod_123",
    "name": "Product Name",
    "price": 99.99
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "error": "Product not found",
  "statusCode": 404
}
```

### Error Handling

**Custom Error Class:**

```javascript
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}
```

**Global Error Middleware:**

```javascript
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    error: err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
```

### Validation

**Input Validation** (express-validator):

```javascript
import { body, validationResult } from "express-validator";

router.post(
  "/products",
  [
    body("name").trim().notEmpty(),
    body("price").isFloat({ min: 0 }),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError("Validation failed", 400);
    }
    // ... create product
  }
);
```

---

## 🎨 Frontend Best Practices

### Component Organization

```
components/
├── ui/                    # Reusable UI primitives
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Card.tsx
├── features/              # Feature-specific components
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── ProductList.tsx
│   │   └── ProductForm.tsx
│   └── auth/
│       ├── LoginForm.tsx
│       └── SignupForm.tsx
└── layout/                # Layout components
    ├── Header.tsx
    ├── Footer.tsx
    └── Sidebar.tsx
```

### State Management

**For Simple State:** React Context

```typescript
// contexts/CartContext.tsx
import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  
  const addItem = (product) => {
    setItems([...items, product]);
  };
  
  return (
    <CartContext.Provider value={{ items, addItem }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
```

**For Complex State:** Consider Zustand

```typescript
import { create } from "zustand";

interface CartStore {
  items: Product[];
  addItem: (product: Product) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: (product) => set((state) => ({ 
    items: [...state.items, product] 
  })),
}));
```

### Data Fetching

**Server Components** (Recommended):

```typescript
// app/products/page.tsx
async function getProducts() {
  const res = await fetch("http://localhost:5000/api/products", {
    cache: "no-store", // or "force-cache" for SSG
  });
  return res.json();
}

export default async function ProductsPage() {
  const { data: products } = await getProducts();
  
  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

**Client Components** (For interactivity):

```typescript
"use client";

import { useEffect, useState } from "react";

export function ProductList() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.data));
  }, []);
  
  return <div>{/* ... */}</div>;
}
```

### Performance Optimization

**Image Optimization:**

```tsx
import Image from "next/image";

<Image
  src="/product.jpg"
  alt="Product"
  width={300}
  height={300}
  priority={false}
  placeholder="blur"
/>
```

**Code Splitting:**

```tsx
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});
```

---

## 🗄️ Database & Prisma

### Migrations Workflow

```bash
# 1. Make changes to schema.prisma

# 2. Create migration
npx prisma migrate dev --name add_product_category

# 3. Generate Prisma Client
npx prisma generate

# 4. Apply to production
npx prisma migrate deploy
```

### Query Patterns

**Basic CRUD:**

```javascript
// Create
const product = await prisma.product.create({
  data: { name: "New Product", price: 99.99, tenantId },
});

// Read
const products = await prisma.product.findMany({
  where: { tenantId, active: true },
  include: { tenant: true },
  orderBy: { createdAt: "desc" },
});

// Update
const updated = await prisma.product.update({
  where: { id: productId },
  data: { price: 89.99 },
});

// Delete
await prisma.product.delete({
  where: { id: productId },
});
```

**Advanced Queries:**

```javascript
// Pagination
const products = await prisma.product.findMany({
  where: { tenantId },
  skip: (page - 1) * 20,
  take: 20,
});

// Aggregation
const stats = await prisma.order.aggregate({
  where: { tenantId },
  _sum: { totalAmount: true },
  _count: true,
});

// Transactions
await prisma.$transaction([
  prisma.product.update({ where: { id }, data: { inventory: { decrement: 1 } } }),
  prisma.order.create({ data: orderData }),
]);
```

### Seeding

**Create Seed Script** (`server/scripts/seed.js`):

```javascript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.create({
    data: {
      name: "Demo Store",
      subdomain: "demo",
    },
  });

  await prisma.product.createMany({
    data: [
      { name: "Product 1", price: 29.99, tenantId: tenant.id },
      { name: "Product 2", price: 49.99, tenantId: tenant.id },
    ],
  });
}

main()
  .then(() => console.log("Seeding complete"))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

**Run Seed:**

```bash
node server/scripts/seed.js
```

---

## 🔄 v0.dev Integration Guide

### Pre-Import: Baseline Client Structure

**Current Minimal Structure:**

```
client/
├── app/
│   ├── layout.tsx          # Root layout (KEEP)
│   ├── page.tsx            # Landing page (REPLACE with v0)
│   ├── globals.css         # Tailwind imports (KEEP, merge)
│   └── dashboard/          # SaaS dashboard (KEEP)
├── tailwind.config.ts      # KEEP, may need to merge
├── tsconfig.json           # KEEP, may need to merge
├── next.config.js          # KEEP, may need to merge
└── package.json            # KEEP, merge dependencies
```

### Step-by-Step Import Process

#### 1. Export from v0.dev

- Generate your component/page in v0.dev
- Click "Export" → "Download as Next.js project"
- Extract the ZIP to a temporary folder

#### 2. Analyze v0 Structure

```bash
v0-export/
├── app/
│   └── page.tsx           # Main component
├── components/            # UI components
├── lib/                   # Utilities
├── tailwind.config.ts
├── package.json
└── ...
```

#### 3. Merge Dependencies

**Compare `package.json` files:**

```bash
# v0's dependencies
{
  "dependencies": {
    "react": "^18.2.0",      # ✅ Same version
    "next": "^14.0.0",       # ✅ Compatible
    "framer-motion": "^10.0", # ➕ Add this
    "recharts": "^2.10.0"    # ➕ Add this
  }
}
```

**Merge into `client/package.json`:**

```bash
cd client
npm install framer-motion recharts
```

#### 4. Copy Components Safely

**Create v0-specific folder:**

```bash
client/
├── components/
│   ├── ui/              # Existing
│   └── v0/              # ➕ New: v0 components
│       ├── hero.tsx
│       ├── features.tsx
│       └── ...
```

**Copy v0 components:**

```bash
cp -r /path/to/v0-export/components/* client/components/v0/
```

#### 5. Merge Tailwind Config

**v0's `tailwind.config.ts`:**

```typescript
export default {
  theme: {
    extend: {
      colors: {
        brand: { /* custom colors */ },
      },
      animation: { /* custom animations */ },
    },
  },
};
```

**Merge into `client/tailwind.config.ts`:**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}", // Includes v0 components
  ],
  theme: {
    extend: {
      // Existing custom colors
      colors: {
        border: "hsl(var(--border))",
        // ... existing
        
        // ➕ v0 colors
        brand: {
          50: "#f0f9ff",
          // ...
        },
      },
      
      // ➕ v0 animations
      animation: {
        "fade-in": "fadeIn 0.5s ease-in",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

#### 6. Merge CSS Variables

**v0's `globals.css`:**

```css
@layer base {
  :root {
    --brand-primary: 220 90% 56%;
  }
}
```

**Add to `client/app/globals.css`:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Existing variables */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    
    /* ➕ v0 variables */
    --brand-primary: 220 90% 56%;
  }
}
```

#### 7. Integrate into Pages

**Replace landing page:**

```tsx
// client/app/page.tsx
import Hero from "@/components/v0/hero";
import Features from "@/components/v0/features";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      {/* SaaS-specific CTAs */}
      <section className="py-20">
        <a href="/dashboard">Go to Dashboard →</a>
      </section>
    </>
  );
}
```

**Or create new route:**

```tsx
// client/app/storefront/page.tsx
import V0Storefront from "@/components/v0/storefront";

export default function StorefrontPage() {
  return <V0Storefront />;
}
```

#### 8. Resolve Conflicts

**Common Issues:**

| Issue                | Solution                             |
| -------------------- | ------------------------------------ |
| Duplicate components | Rename v0 version (`ButtonV0.tsx`)   |
| TypeScript errors    | Add missing types to `types/`        |
| Version conflicts    | Use `npm install --legacy-peer-deps` |
| Missing imports      | Install missing packages             |

**Example Fix:**

```bash
# Error: Module 'class-variance-authority' not found
npm install class-variance-authority
```

#### 9. Test Integration

```bash
npm run dev
# Visit http://localhost:3000
```

**Checklist:**

- [ ] Styles render correctly
- [ ] No TypeScript errors
- [ ] Animations work
- [ ] Responsive design intact
- [ ] SaaS features still accessible

### Final Optimized Structure

```
client/
├── app/
│   ├── layout.tsx              # Root layout (unchanged)
│   ├── page.tsx                # Landing page (with v0 components)
│   ├── globals.css             # Merged styles
│   ├── dashboard/              # SaaS dashboard (unchanged)
│   ├── storefront/             # ➕ v0 storefront (optional)
│   └── api/                    # API routes (unchanged)
├── components/
│   ├── ui/                     # Base components (unchanged)
│   ├── v0/                     # ➕ v0 components
│   │   ├── hero.tsx
│   │   ├── features.tsx
│   │   └── product-grid.tsx
│   └── features/               # SaaS components (unchanged)
├── lib/
│   ├── utils.ts                # Existing (may add v0 utils)
│   └── v0-utils.ts             # ➕ v0-specific utilities
├── tailwind.config.ts          # Merged config
├── tsconfig.json               # Merged paths
└── package.json                # Merged dependencies
```

### Where to Put What

| Code Type               | Location                | Example             |
| ----------------------- | ----------------------- | ------------------- |
| **v0 UI Components**    | `components/v0/`        | Hero, product cards |
| **SaaS Dashboard**      | `app/dashboard/`        | Analytics, settings |
| **Multi-tenancy Logic** | `app/api/`, `lib/`      | Tenant routing      |
| **Auth Pages**          | `app/auth/`             | Login, signup       |
| **Page Builder Data**   | Database (`Page` model) | Custom pages        |

---

## 🧪 Testing Strategy

### Recommended Stack (Future Implementation)

| Type                  | Tool                  | Purpose                   |
| --------------------- | --------------------- | ------------------------- |
| **Unit Tests**        | Jest                  | Test utilities, functions |
| **Component Tests**   | React Testing Library | Test UI components        |
| **Integration Tests** | Jest + Supertest      | Test API endpoints        |
| **E2E Tests**         | Playwright            | Test user flows           |

### Setup Instructions

**1. Install Dependencies:**

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
npm install --save-dev @testing-library/user-event
npm install --save-dev supertest
npm install --save-dev @playwright/test
```

**2. Jest Config** (`jest.config.js`):

```javascript
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/client/$1",
  },
};
```

**3. Example Tests:**

**Component Test:**

```typescript
// __tests__/components/ProductCard.test.tsx
import { render, screen } from "@testing-library/react";
import ProductCard from "@/components/ProductCard";

test("renders product name", () => {
  const product = { id: "1", name: "Test Product", price: 99.99 };
  render(<ProductCard product={product} />);
  expect(screen.getByText("Test Product")).toBeInTheDocument();
});
```

**API Test:**

```javascript
// __tests__/api/products.test.js
import request from "supertest";
import app from "../../server/index.js";

describe("GET /api/products", () => {
  it("returns products for tenant", async () => {
    const res = await request(app)
      .get("/api/products")
      .set("X-Tenant-ID", "tenant_123");
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
```

**E2E Test:**

```typescript
// e2e/checkout.spec.ts
import { test, expect } from "@playwright/test";

test("complete checkout flow", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.click('text="Add to Cart"');
  await page.click('text="Checkout"');
  await page.fill('[name="email"]', "test@example.com");
  await page.click('text="Place Order"');
  await expect(page.locator("text=Order Confirmed")).toBeVisible();
});
```

**4. NPM Scripts:**

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:e2e": "playwright test",
    "test:coverage": "jest --coverage"
  }
}
```

---

## 🚀 Deployment & CI/CD

### Deployment Platforms

#### Option 1: Vercel (Frontend) + Railway (Backend)

**Frontend (Vercel):**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd client
vercel --prod
```

**Backend (Railway):**

1. Connect GitHub repo
2. Set environment variables
3. Deploy from `server/` directory

#### Option 2: Docker + VPS

**Dockerfile** (Backend):

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "index.js"]
```

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: lcnc_ecommerce
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: ${DATABASE_URL}
      NODE_ENV: production
    depends_on:
      - postgres

  frontend:
    build: ./client
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://backend:5000

volumes:
  postgres_data:
```

### GitHub Actions CI/CD

**.github/workflows/ci.yml:**

```yaml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Lint
        run: npm run lint
      
      - name: Type check
        run: npm run type-check --workspace=client
      
      - name: Run tests
        run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Production
        run: |
          # Deploy frontend to Vercel
          # Deploy backend to Railway
```

### Environment Variables

**Production `.env`:**

```bash
DATABASE_URL="postgresql://prod_user:prod_pass@db.railway.app/prod_db"
NEXTAUTH_URL="https://platform.com"
NEXTAUTH_SECRET="<strong-random-secret>"
STRIPE_SECRET_KEY="sk_live_..."
NODE_ENV="production"
```

**Security:**

- Never commit `.env` files
- Use platform secret managers
- Rotate secrets regularly

---

## 📈 Scaling Strategies

### Multi-Tenancy at Scale

**Current:** Row-level isolation with `tenantId`

**Future Options:**

1. **Database-per-Tenant** (High isolation)
   - Prisma supports multiple datasources
   - Good for enterprise clients

2. **Schema-per-Tenant** (PostgreSQL)
   - Use PostgreSQL schemas
   - Balance of isolation and management

3. **Hybrid Approach**
   - Row-level for small tenants
   - Database-per for enterprise

### API Scaling

**Horizontal Scaling:**

```
Load Balancer (Nginx)
   ├── Express Instance 1
   ├── Express Instance 2
   └── Express Instance 3
```

**Caching Layer:**

```javascript
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

// Cache product list
const cacheKey = `products:${tenantId}`;
let products = await redis.get(cacheKey);

if (!products) {
  products = await prisma.product.findMany({ where: { tenantId } });
  await redis.set(cacheKey, JSON.stringify(products), "EX", 3600);
}
```

**Database Optimization:**

```prisma
// Add indexes for performance
@@index([tenantId, active])
@@index([createdAt])
```

### Frontend Performance

**Static Generation:**

```typescript
// app/products/[id]/page.tsx
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ id: p.id }));
}
```

**CDN Deployment:**

- Vercel Edge Network
- Cloudflare CDN
- AWS CloudFront

---

## 🔒 Security Best Practices

### Input Validation

```javascript
// Always validate and sanitize input
import { body, validationResult } from "express-validator";

router.post(
  "/products",
  [
    body("name").trim().escape().notEmpty(),
    body("price").isFloat({ min: 0 }),
  ],
  handler
);
```

### SQL Injection Prevention

**Prisma protects by default:**

```javascript
// ✅ Safe: Parameterized query
await prisma.product.findMany({
  where: { name: { contains: userInput } },
});

// ❌ Never use raw SQL with user input
await prisma.$executeRawUnsafe(`SELECT * FROM products WHERE name = '${userInput}'`);
```

### XSS Prevention

```tsx
// React escapes by default
<div>{userInput}</div> // ✅ Safe

// Be careful with dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: sanitize(userInput) }} />
```

### CSRF Protection

```javascript
// Use CSRF tokens for state-changing operations
import csrf from "csurf";

app.use(csrf({ cookie: true }));

router.post("/checkout", (req, res) => {
  // Verify CSRF token
});
```

### Rate Limiting

```javascript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
});

app.use("/api/", limiter);
```

---

## 🗺️ Future Roadmap

### Phase 1: MVP (Current)

- [x] Multi-tenant architecture
- [x] Basic CRUD operations
- [x] Authentication
- [x] Responsive UI

### Phase 2: Page Builder (Next 2-3 months)

- [ ] Integrate GrapesJS or Craft.js
- [ ] Visual drag-and-drop editor
- [ ] Save/load page configurations
- [ ] Template library

**Implementation Plan:**

```typescript
// components/page-builder/Editor.tsx
import grapesjs from "grapesjs";

export function PageBuilder() {
  useEffect(() => {
    const editor = grapesjs.init({
      container: "#gjs",
      storageManager: {
        type: "remote",
        autosave: true,
        urlStore: "/api/pages/save",
        urlLoad: "/api/pages/:id",
      },
    });
  }, []);
  
  return <div id="gjs"></div>;
}
```

### Phase 3: Stripe Integration (1 month)

- [ ] Product checkout flow
- [ ] Subscription billing
- [ ] Webhook handlers
- [ ] Payment dashboard

**Stripe Setup:**

```typescript
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create checkout session
const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  line_items: [{ price: "price_123", quantity: 1 }],
  mode: "payment",
  success_url: "https://example.com/success",
  cancel_url: "https://example.com/cancel",
});
```

### Phase 4: Advanced Features (3-6 months)

- [ ] Inventory management
- [ ] Order fulfillment tracking
- [ ] Email notifications (SendGrid/Resend)
- [ ] Analytics dashboard
- [ ] Multi-language support (i18n)
- [ ] Dark mode

### Phase 5: Enterprise Features (6-12 months)

- [ ] Advanced permissions (RBAC)
- [ ] Audit logs
- [ ] Custom domain SSL
- [ ] White-label options
- [ ] API for third-party integrations
- [ ] Webhooks for events

---

## 📞 Support & Resources

### Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Express Docs](https://expressjs.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Community

- GitHub Discussions: [Repository URL]
- Discord: [Server Invite]
- Email: dev@platform.com

### Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

---

## 📄 License

MIT License - See LICENSE file for details

---

**Last Updated:** October 2025  
**Maintainers:** Development Team  
**Version:** 1.0.0

---


