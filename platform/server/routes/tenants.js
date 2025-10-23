import express from "express";
import { PrismaClient } from "@prisma/client";
import { body, validationResult } from "express-validator";
import { authenticateToken, requireRole } from "../middleware/auth.js";
import { AppError } from "../middleware/errorHandler.js";

const router = express.Router();
const prisma = new PrismaClient();

// Get all tenants (admin only)
router.get("/", authenticateToken, requireRole("ADMIN"), async (req, res, next) => {
    try {
        const tenants = await prisma.tenant.findMany({
            include: {
                _count: {
                    select: { users: true, products: true },
                },
            },
        });

        res.json({
            success: true,
            data: tenants,
        });
    } catch (error) {
        next(error);
    }
});

// Create tenant
router.post(
    "/",
    [
        body("name").trim().notEmpty(),
        body("subdomain").trim().notEmpty().isLowercase().isAlphanumeric(),
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new AppError("Validation failed", 400);
            }

            const { name, subdomain, customDomain } = req.body;

            // Check if subdomain exists
            const existing = await prisma.tenant.findUnique({
                where: { subdomain },
            });

            if (existing) {
                throw new AppError("Subdomain already taken", 409);
            }

            const tenant = await prisma.tenant.create({
                data: {
                    name,
                    subdomain,
                    customDomain,
                },
            });

            res.status(201).json({
                success: true,
                data: tenant,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Get tenant by subdomain
router.get("/:subdomain", async (req, res, next) => {
    try {
        const { subdomain } = req.params;

        const tenant = await prisma.tenant.findUnique({
            where: { subdomain },
        });

        if (!tenant) {
            throw new AppError("Tenant not found", 404);
        }

        res.json({
            success: true,
            data: tenant,
        });
    } catch (error) {
        next(error);
    }
});

export default router;

