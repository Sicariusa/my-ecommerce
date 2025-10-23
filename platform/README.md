# 🚀 LCNC E-commerce Platform

A modern low-code/no-code e-commerce platform with multi-tenancy support, built with Next.js, Express, and Prisma.

## 📁 Project Structure

```
lcnc-ecommerce/
├── client/          # Next.js frontend (TypeScript/TSX)
├── server/          # Express backend (Plain JavaScript)
├── auth/            # Authentication module (Supabase)
├── prisma/          # Database schema and migrations
├── package.json     # Root workspace configuration
└── PROJECT_GUIDE.md # Comprehensive development guide
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- PostgreSQL database
- npm >= 9.0.0
- Supabase project (for authentication)

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase credentials and database URL
   ```

   **Supabase Setup:**
   - Create a Supabase project at https://supabase.com
   - Get your project URL and anon key from Settings > API
   - Get your service role key (keep this secret!)
   - Enable Email/Password authentication in Authentication settings

3. **Set up database:**
   ```bash
   npm run db:migrate
   npm run db:generate
   ```

4. **Run development servers:**
   ```bash
   npm run dev
   ```

   This starts:
   - Client: http://localhost:3000
   - Server: http://localhost:5000

## 📚 Available Scripts

- `npm run dev` - Run both client and server in development mode
- `npm run dev:client` - Run only the Next.js client
- `npm run dev:server` - Run only the Express server
- `npm run build` - Build for production
- `npm run db:migrate` - Run Prisma migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run lint` - Lint the codebase
- `npm run format` - Format code with Prettier

## 🏗️ Tech Stack

### Frontend (client/)
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui
- **State Management:** React Context/Zustand
- **Authentication:** Supabase Auth

### Backend (server/)
- **Framework:** Express.js
- **Language:** Plain JavaScript
- **Database ORM:** Prisma
- **Authentication:** Supabase (JWT verification)

### Database
- **Primary:** PostgreSQL
- **ORM:** Prisma
- **Multi-tenancy:** Row-level isolation

## 📖 Documentation

See [PROJECT_GUIDE.md](./PROJECT_GUIDE.md) for detailed development guidelines, architecture decisions, and best practices.

## 🔑 Key Features

- 🏢 Multi-tenant architecture
- 🎨 Drag-and-drop page builder ready
- 🔐 Secure authentication system
- 💳 Stripe integration for payments
- 🌐 Subdomain routing support
- 📱 Responsive design
- 🚀 Optimized for v0.dev imports
