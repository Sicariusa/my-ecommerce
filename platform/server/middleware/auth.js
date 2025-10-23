import { verifySupabaseToken } from "../config/supabase.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Middleware to verify Supabase JWT token
 */
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Access token required",
      });
    }

    // Verify Supabase JWT token
    const supabaseUser = await verifySupabaseToken(token);

    if (!supabaseUser) {
      return res.status(403).json({
        success: false,
        error: "Invalid or expired token",
      });
    }

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { supabaseUid: supabaseUser.id },
      include: { tenant: true },
    });

    if (!user || !user.active) {
      return res.status(403).json({
        success: false,
        error: "User not found or inactive",
      });
    }

    // Attach user info to request
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: user.tenantId,
      supabaseUid: user.supabaseUid,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(403).json({
      success: false,
      error: "Invalid or expired token",
    });
  }
};

/**
 * Middleware to check if user has required role
 */
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "Insufficient permissions",
      });
    }

    next();
  };
};
