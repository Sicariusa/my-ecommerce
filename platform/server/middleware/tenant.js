import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const tenantMiddleware = async (req, res, next) => {
    try {
        // Extract tenant from subdomain or custom header
        const host = req.get("host") || "";
        const tenantHeader = req.get("x-tenant-id");

        let subdomain = null;

        // Extract subdomain from host (e.g., "mystore.localhost:3000" -> "mystore")
        const parts = host.split(".");
        if (parts.length > 1 && parts[0] !== "www") {
            subdomain = parts[0].split(":")[0]; // Remove port if present
        }

        // Skip tenant lookup for auth routes or if no tenant identifier
        if (req.path.startsWith("/api/auth") || (!subdomain && !tenantHeader)) {
            return next();
        }

        // Look up tenant by subdomain or ID
        let tenant = null;
        if (subdomain) {
            tenant = await prisma.tenant.findUnique({
                where: { subdomain },
            });
        } else if (tenantHeader) {
            tenant = await prisma.tenant.findUnique({
                where: { id: tenantHeader },
            });
        }

        // Attach tenant to request
        req.tenant = tenant;
        req.tenantId = tenant?.id || null;

        next();
    } catch (error) {
        console.error("Tenant middleware error:", error);
        next();
    }
};

