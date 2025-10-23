export interface User {
    id: string;
    email: string;
    name: string | null;
    tenantId: string;
    role: "ADMIN" | "USER";
    createdAt: Date;
    updatedAt: Date;
}

export interface Tenant {
    id: string;
    name: string;
    subdomain: string;
    customDomain: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
    tenantId: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

