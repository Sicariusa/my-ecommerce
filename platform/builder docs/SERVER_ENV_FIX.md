# 🔧 Server Environment Variables Fix

## Problem
The server was crashing with:
```
Error: Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
```

## Root Cause
With ES modules (`"type": "module"`), import statements are **hoisted** and processed before any code runs, even `dotenv.config()`. This means:

1. `index.js` imports `authRoutes`
2. `authRoutes` imports `config/supabase.js`
3. `config/supabase.js` tries to read `process.env.NEXT_PUBLIC_SUPABASE_URL`
4. But `dotenv.config()` hasn't run yet!
5. Environment variables are `undefined`
6. Error is thrown

## Solution
Use Node.js `--import` flag to load a **preload script** before any other imports.

### Files Changed

**1. Created `platform/server/preload.js`:**
```javascript
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from platform directory
dotenv.config({ path: join(__dirname, "../.env") });

console.log("✅ Environment variables loaded");
console.log(`📍 SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Missing"}`);
console.log(`📍 SUPABASE_KEY: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? "Set" : "Missing"}`);
```

**2. Updated `platform/server/package.json`:**
```json
{
  "scripts": {
    "dev": "node --import ./preload.js index.js",
    "dev:watch": "nodemon --import ./preload.js index.js",
    "start": "node --import ./preload.js index.js",
    "db:seed": "node scripts/seed.js"
  }
}
```

**3. Cleaned up `platform/server/index.js`:**
- Removed `import dotenv from "dotenv"`
- Removed `dotenv.config({ path: "../.env" })`
- Environment is now loaded by preload script

## How It Works

### Execution Order:
1. ✅ `node --import ./preload.js index.js` starts
2. ✅ `preload.js` runs **first**
3. ✅ `dotenv.config()` loads `.env` variables
4. ✅ Console logs confirm variables are loaded
5. ✅ Then `index.js` is imported
6. ✅ `authRoutes` imports `config/supabase.js`
7. ✅ `process.env` variables are now available
8. ✅ Server starts successfully

## Testing

### Start the Server:
```bash
cd platform/server
npm run dev
```

### Expected Output:
```
✅ Environment variables loaded
📍 SUPABASE_URL: Set
📍 SUPABASE_KEY: Set
✅ Supabase client initialized successfully
🚀 Server running on http://localhost:5000
📊 Environment: development
```

### Using Nodemon (auto-restart):
```bash
npm run dev:watch
```

## Verification Checklist

✅ **Preload Script Created**
- [x] `platform/server/preload.js` exists
- [x] Loads from `../env` (platform directory)
- [x] Logs confirmation messages

✅ **Package.json Updated**
- [x] `dev` script uses `--import ./preload.js`
- [x] `start` script uses `--import ./preload.js`
- [x] `dev:watch` script for development with nodemon

✅ **Index.js Cleaned**
- [x] Removed dotenv import
- [x] Removed dotenv.config() call
- [x] Server relies on preload script

✅ **Environment Variables**
- [x] `NEXT_PUBLIC_SUPABASE_URL` in `.env`
- [x] `SUPABASE_SERVICE_ROLE_KEY` in `.env`
- [x] `PORT=5000` in `.env`
- [x] `CLIENT_URL=http://localhost:3000` in `.env`

## Alternative Solutions (Not Used)

### Option 1: CommonJS (Not ideal)
```javascript
// Would require converting entire project from ES modules
require('dotenv').config()
```

### Option 2: Dynamic Import (Not ideal)
```javascript
// Makes code async and complex
await import('./config/supabase.js')
```

### Option 3: NODE_OPTIONS (Works but less explicit)
```json
{
  "scripts": {
    "dev": "NODE_OPTIONS='--import ./preload.js' nodemon index.js"
  }
}
```

## Why --import Flag?

The `--import` flag is specifically designed for this use case:
- ✅ Runs before any ES module imports
- ✅ Perfect for loading environment variables
- ✅ Clean and explicit in package.json
- ✅ Works with both `node` and `nodemon`
- ✅ Supported in Node.js 18.19+

## Troubleshooting

### Issue: Still getting "Missing environment variables"
**Check:**
1. `platform/.env` file exists
2. Variables are spelled correctly
3. No quotes around variable values (unless needed)
4. Preload script is being run (check console output)

**Debug:**
```bash
cd platform/server
node --import ./preload.js -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)"
```

### Issue: preload.js not found
**Cause:** Running from wrong directory  
**Fix:** Always run from `platform/server` directory

### Issue: Nodemon not using preload
**Check:** Use `npm run dev:watch` instead of `nodemon index.js`

## Additional Notes

### For Production
The same approach works in production:
```bash
node --import ./preload.js index.js
```

### For Docker
```dockerfile
CMD ["node", "--import", "./preload.js", "index.js"]
```

### For PM2
```json
{
  "apps": [{
    "name": "server",
    "script": "index.js",
    "node_args": "--import ./preload.js"
  }]
}
```

---

**Status:** ✅ **FIXED**  
**Solution:** Preload script with `--import` flag  
**Test Command:** `npm run dev`  
**Expected:** Server starts on port 5000 without errors  
**Last Updated:** October 18, 2025
