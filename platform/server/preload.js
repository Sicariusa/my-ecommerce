// preload.js - Load environment variables before anything else
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
