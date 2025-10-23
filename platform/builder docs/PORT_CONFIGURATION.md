# 🔧 Port Configuration Update

## Summary of Changes

Updated the application to use explicit port configurations with the main `.env` file.

---

## Port Assignments

| Service | Port | URL |
|---------|------|-----|
| **Client (Next.js)** | 3000 | http://localhost:3000 |
| **Server (Express)** | 5000 | http://localhost:5000 |
| **Builder** | 3000 | http://localhost:3000/builder |

---

## Environment File Configuration

### Primary: `.env` (Active)
```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Client (Next.js)
NEXT_PUBLIC_PORT=3000

# API URL
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Secondary: `.env.local` (Not in use)
- Contains same configuration
- Can be used with `npm run dev:local` if needed
- Primary development uses `.env`

---

## Updated Scripts

### Client (`platform/client/package.json`)
```json
{
  "scripts": {
    "dev": "dotenv -e ../.env next dev -p 3000",     // ✅ Uses .env, port 3000
    "dev:local": "dotenv -e ../.env.local next dev -p 3000",
    "build": "dotenv -e ../.env next build",
    "start": "next start"
  }
}
```

### Server (`platform/server/package.json`)
```json
{
  "scripts": {
    "dev": "nodemon index.js",    // ✅ Uses .env (via dotenv.config)
    "start": "node index.js"
  }
}
```

### Server Configuration (`platform/server/index.js`)
```javascript
import dotenv from "dotenv";

// Loads from ../env (platform/.env)
dotenv.config({ path: "../.env" });

const PORT = process.env.PORT || 5000;  // Uses PORT from .env

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

---

## How to Start Development

### Option 1: Start Both Services Separately

**Terminal 1 - Client:**
```bash
cd platform/client
npm run dev
# Runs on http://localhost:3000
```

**Terminal 2 - Server:**
```bash
cd platform/server
npm run dev
# Runs on http://localhost:5000
```

### Option 2: Use Concurrent (If configured)
```bash
# From platform root
npm run dev  # Starts both client and server
```

---

## Verification Checklist

✅ **Client Configuration**
- [x] Uses `../.env` file via `dotenv-cli`
- [x] Runs on port 3000 (`-p 3000` flag)
- [x] API URL points to `http://localhost:5000`

✅ **Server Configuration**
- [x] Uses `../.env` file via `dotenv.config()`
- [x] Reads PORT from environment (defaults to 5000)
- [x] CORS configured for `http://localhost:3000`

✅ **Environment Variables**
- [x] `PORT=5000` for server
- [x] `CLIENT_URL=http://localhost:3000` for CORS
- [x] `NEXT_PUBLIC_API_URL=http://localhost:5000` for client API calls

---

## Testing the Configuration

### 1. Test Client
```bash
cd platform/client
npm run dev
```
**Expected Output:**
```
▲ Next.js 15.x.x
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000

✓ Ready in 2.5s
```

### 2. Test Server
```bash
cd platform/server
npm run dev
```
**Expected Output:**
```
🚀 Server running on http://localhost:5000
📊 Environment: development
```

### 3. Test API Communication
Open http://localhost:3000/builder and verify:
- Builder loads correctly
- Save button calls `http://localhost:5000/api/projects`
- No CORS errors in console

---

## Common Issues & Solutions

### Issue: Client runs on port 5000
**Cause:** Next.js picked up server PORT variable  
**Solution:** We added `-p 3000` flag to override  
**Verification:** Check terminal output shows port 3000

### Issue: Server uses wrong .env file
**Cause:** dotenv loading from wrong path  
**Solution:** Updated to `dotenv.config({ path: "../.env" })`  
**Verification:** Server logs show correct environment values

### Issue: CORS errors
**Cause:** CLIENT_URL mismatch  
**Solution:** Ensure `CLIENT_URL=http://localhost:3000` in `.env`  
**Verification:** Check browser console for CORS errors

### Issue: API calls fail from client
**Cause:** Wrong API URL  
**Solution:** Verify `NEXT_PUBLIC_API_URL=http://localhost:5000`  
**Verification:** Check Network tab in DevTools

---

## Files Modified

1. **`platform/.env`**
   - Added `NEXT_PUBLIC_PORT=3000`
   - Confirmed all port values

2. **`platform/client/package.json`**
   - Updated `dev` script to include `-p 3000`
   - Updated `dev:local` script to include `-p 3000`

3. **No changes needed:**
   - `platform/server/index.js` (already correct)
   - `platform/server/package.json` (already correct)

---

## Environment Variable Reference

### Server Variables
```env
PORT=5000                    # Server port
NODE_ENV=development         # Environment mode
CLIENT_URL=http://localhost:3000  # For CORS
DATABASE_URL=postgresql://...     # Database connection
SUPABASE_SERVICE_ROLE_KEY=...    # Supabase admin key
```

### Client Variables (Must start with NEXT_PUBLIC_)
```env
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_PORT=3000  # Optional, overridden by -p flag
```

---

## Quick Reference

### URLs
- **Client:** http://localhost:3000
- **Builder:** http://localhost:3000/builder
- **Server API:** http://localhost:5000
- **Server Health:** http://localhost:5000/health

### Commands
```bash
# Start client on port 3000
cd platform/client && npm run dev

# Start server on port 5000
cd platform/server && npm run dev

# Check which process is using a port
# Windows:
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Kill a process by PID
taskkill /PID <PID> /F
```

---

## Next Steps

1. ✅ **Configuration Complete** - Ports are properly assigned
2. ✅ **Using .env** - Both client and server read from `platform/.env`
3. 🚀 **Ready to Run** - Start both services and test

### Test the Builder:
```bash
# Terminal 1
cd platform/client
npm run dev

# Terminal 2
cd platform/server
npm run dev

# Browser
Navigate to http://localhost:3000/builder
```

---

**Configuration Status:** ✅ **COMPLETE**  
**Client Port:** 3000  
**Server Port:** 5000  
**Environment File:** `.env` (primary)  
**Last Updated:** October 18, 2025
