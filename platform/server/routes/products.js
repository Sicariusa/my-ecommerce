import express from "express";
import { PrismaClient } from "@prisma/client";
import { body, validationResult } from "express-validator";
import { authenticateToken } from "../middleware/auth.js";
import { AppError } from "../middleware/errorHandler.js";

const router = express.Router();
const prisma = new PrismaClient();

// Get all products for tenant
router.get("/", async (req, res, next) => {
    try {
        const tenantId = req.tenantId || req.query.tenantId;

        if (!tenantId) {
            throw new AppError("Tenant ID required", 400);
        }

        const products = await prisma.product.findMany({
            where: {
                tenantId,
                active: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.json({
            success: true,
            data: products,
        });
    } catch (error) {
        next(error);
    }
});

// Get single product
router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            throw new AppError("Product not found", 404);
        }

        // Verify tenant access
        if (req.tenantId && product.tenantId !== req.tenantId) {
            throw new AppError("Access denied", 403);
        }

        res.json({
            success: true,
            data: product,
        });
    } catch (error) {
        next(error);
    }
});

// Create product
router.post(
    "/",
    authenticateToken,
    [
        body("name").trim().notEmpty(),
        body("price").isFloat({ min: 0 }),
        body("description").optional().trim(),
        body("imageUrl").optional().isURL(),
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new AppError("Validation failed", 400);
            }

            const { name, description, price, imageUrl } = req.body;
            const tenantId = req.user.tenantId;

            const product = await prisma.product.create({
                data: {
                    name,
                    description,
                    price: parseFloat(price),
                    imageUrl,
                    tenantId,
                },
            });

            res.status(201).json({
                success: true,
                data: product,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Update product
router.put("/:id", authenticateToken, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, price, imageUrl, active } = req.body;

        // Verify ownership
        const existing = await prisma.product.findUnique({
            where: { id },
        });

        if (!existing) {
            throw new AppError("Product not found", 404);
        }

        if (existing.tenantId !== req.user.tenantId) {
            throw new AppError("Access denied", 403);
        }

        const product = await prisma.product.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(description !== undefined && { description }),
                ...(price && { price: parseFloat(price) }),
                ...(imageUrl !== undefined && { imageUrl }),
                ...(active !== undefined && { active }),
            },
        });

        res.json({
            success: true,
            data: product,
        });
    } catch (error) {
        next(error);
    }
});

// Delete product
router.delete("/:id", authenticateToken, async (req, res, next) => {
    try {
        const { id } = req.params;

        // Verify ownership
        const existing = await prisma.product.findUnique({
            where: { id },
        });

        if (!existing) {
            throw new AppError("Product not found", 404);
        }

        if (existing.tenantId !== req.user.tenantId) {
            throw new AppError("Access denied", 403);
        }

        await prisma.product.delete({
            where: { id },
        });

        res.json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        next(error);
    }
});

export default router;

