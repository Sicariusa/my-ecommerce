# 🔄 Firebase to Supabase Migration Complete!

Your LCNC e-commerce platform has been successfully migrated from Firebase to Supabase.

---

## ✅ What Changed

### 1. **Dependencies Updated**

#### Client (`client/package.json`)
- ❌ Removed: `firebase`, `@next-auth/prisma-adapter`, `next-auth`, `bcryptjs`
- ✅ Added: `@supabase/supabase-js`, `@supabase/auth-helpers-nextjs`, `@supabase/auth-helpers-react`

#### Server (`server/package.json`)
- ❌ Removed: `firebase-admin`, `jsonwebtoken`, `bcryptjs`
- ✅ Added: `@supabase/supabase-js`

### 2. **Configuration Files**

#### Removed:
- ❌ `client/lib/firebase.ts`
- ❌ `server/config/firebase.js`

#### Added:
- ✅ `client/lib/supabase.ts` - Supabase client configuration
- ✅ `server/config/supabase.js` - Supabase server configuration with JWT verification

### 3. **Authentication System**

#### Client-Side (`client/lib/auth.ts`)
- Now uses Supabase Auth methods:
  - `supabase.auth.signUp()`
  - `supabase.auth.signInWithPassword()`
  - `supabase.auth.signOut()`
  - `supabase.auth.getUser()`
  - `supabase.auth.onAuthStateChange()`

#### Server-Side (`server/middleware/auth.js`)
- Now uses `verifySupabaseToken()` for JWT verification
- Tokens are verified using Supabase's `getUser()` method with service role key

### 4. **Database Schema** (`prisma/schema.prisma`)
- Changed `firebaseUid` → `supabaseUid` in User model
- Updated indexes accordingly

### 5. **Authentication Pages**
- Updated `client/app/auth/signin/page.tsx`
- Updated `client/app/auth/signup/page.tsx`
- Now use Supabase auth functions

---

## 🚀 Getting Started with Supabase

### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Set your project name and database password
4. Wait for project to be ready (~2 minutes)

### Step 2: Get Your Credentials

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJh...`)
   - **service_role key** (starts with `eyJh...`) ⚠️ Keep this secret!

### Step 3: Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates if needed

### Step 4: Set Environment Variables

Create/update `.env` in your project root:

```bash
# Database (you can use Supabase's PostgreSQL or your own)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Supabase - Client
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...your-anon-key

# Supabase - Server (⚠️ NEVER expose this publicly!)
SUPABASE_SERVICE_ROLE_KEY=eyJh...your-service-role-key

# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# API URL
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Step 5: Install Dependencies

```bash
npm install
```

### Step 6: Set Up Database

```bash
# Run Prisma migrations
npm run db:migrate

# Generate Prisma client
npm run db:generate
```

### Step 7: Start Development

```bash
npm run dev
```

---

## 🔑 Key Differences: Firebase vs Supabase

| Feature                 | Firebase           | Supabase                    |
| ----------------------- | ------------------ | --------------------------- |
| **User Storage**        | Firebase Auth      | Supabase Auth + PostgreSQL  |
| **ID Field**            | `firebaseUid`      | `supabaseUid`               |
| **Client Auth**         | `firebase/auth`    | `@supabase/supabase-js`     |
| **Server Verification** | Firebase Admin SDK | Supabase JWT + service role |
| **Session Management**  | Firebase tokens    | Supabase JWT tokens         |
| **Database**            | Separate           | Integrated PostgreSQL       |

---

## 📋 Authentication Flow

### Sign Up Flow

1. **Client:** User fills signup form
2. **Client:** `signUpWithEmail()` calls `supabase.auth.signUp()`
3. **Supabase:** Creates user in Supabase Auth
4. **Client:** Gets session with access token
5. **Client:** Calls `/api/auth/register` with token
6. **Server:** Verifies token with Supabase
7. **Server:** Creates user record in PostgreSQL with `supabaseUid`
8. **Client:** Redirects to dashboard

### Sign In Flow

1. **Client:** User fills signin form
2. **Client:** `signInWithEmail()` calls `supabase.auth.signInWithPassword()`
3. **Supabase:** Verifies credentials
4. **Client:** Receives session with access token
5. **Client:** Token stored in browser (via Supabase helpers)
6. **Client:** Redirects to dashboard

### Protected API Requests

1. **Client:** Sends request with `Authorization: Bearer <access_token>`
2. **Server:** `authenticateToken` middleware extracts token
3. **Server:** Calls `verifySupabaseToken(token)` 
4. **Supabase:** Validates JWT and returns user
5. **Server:** Queries PostgreSQL for user by `supabaseUid`
6. **Server:** Attaches user to `req.user`
7. **Route Handler:** Processes request with user context

---

## 🔐 Security Best Practices

### ✅ DO:
- ✅ Store `SUPABASE_SERVICE_ROLE_KEY` only on server
- ✅ Use environment variables for all credentials
- ✅ Enable Row Level Security (RLS) in Supabase if using Supabase database
- ✅ Verify tokens on every protected route
- ✅ Keep Supabase library updated

### ❌ DON'T:
- ❌ Never expose service role key in client code
- ❌ Never commit `.env` files to Git
- ❌ Don't skip token verification
- ❌ Don't use anon key for admin operations

---

## 🧪 Testing Authentication

### Test Sign Up

```bash
curl -X POST http://localhost:5000/api/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Store",
    "subdomain": "teststore"
  }'

# Use the tenant ID returned above
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "tenantId": "clxxx..."
  }'
```

### Test Sign In

```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## 🐛 Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution:**
- Check `.env` file has all required variables
- Restart development server after adding variables
- Verify no typos in variable names

### Issue: "Invalid or expired token"

**Solution:**
- Check service role key is correct
- Ensure token is sent in Authorization header
- Verify Supabase project is active

### Issue: "User not found or inactive"

**Solution:**
- Ensure user was created in PostgreSQL after Supabase signup
- Check `supabaseUid` matches between Supabase and PostgreSQL
- Run database migration if schema was updated

### Issue: "CORS error"

**Solution:**
- Check `CLIENT_URL` in server `.env`
- Verify CORS middleware in `server/index.js`
- Ensure credentials are enabled

---

## 📚 Additional Resources

### Supabase Documentation
- **Auth:** https://supabase.com/docs/guides/auth
- **JavaScript Client:** https://supabase.com/docs/reference/javascript
- **Row Level Security:** https://supabase.com/docs/guides/auth/row-level-security

### Your Project Files
- Client config: `client/lib/supabase.ts`
- Server config: `server/config/supabase.js`
- Auth functions: `client/lib/auth.ts`
- Auth hook: `client/hooks/useAuth.ts`
- Auth middleware: `server/middleware/auth.js`
- Auth routes: `server/routes/auth.js`

---

## ✨ Migration Benefits

### Why Supabase?

1. **🔗 Integrated PostgreSQL** - No separate database setup
2. **🚀 Instant API** - Auto-generated REST & GraphQL APIs
3. **🔐 Built-in Auth** - Email, OAuth, magic links, phone auth
4. **📊 Real-time** - WebSocket subscriptions out of the box
5. **💾 Storage** - File storage integrated
6. **🆓 Generous Free Tier** - Great for development
7. **🛡️ Row Level Security** - Database-level security policies
8. **📈 Scalable** - Scales with your application

---

## 🎉 You're All Set!

Your LCNC e-commerce platform now uses Supabase for authentication. All the benefits of Firebase, plus:
- Integrated PostgreSQL database
- Better TypeScript support
- Open source
- More flexible pricing

### Next Steps:

1. **Install dependencies:** `npm install`
2. **Set up Supabase project** and get credentials
3. **Update .env file** with Supabase credentials
4. **Run database migrations:** `npm run db:migrate`
5. **Start development:** `npm run dev`

Happy building! 🚀

---

**Migration Date:** October 2025  
**Version:** 2.0.0 (Supabase)

