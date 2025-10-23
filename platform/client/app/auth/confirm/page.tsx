"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

export default function ConfirmPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const confirmEmail = async () => {
            const token = searchParams.get("token");
            const type = searchParams.get("type");

            if (!token || type !== "signup") {
                setStatus("error");
                setMessage("Invalid confirmation link");
                return;
            }

            try {
                const { error } = await supabase.auth.verifyOtp({
                    token_hash: token,
                    type: "email",
                });

                if (error) {
                    setStatus("error");
                    setMessage(error.message);
                } else {
                    setStatus("success");
                    setMessage("Email confirmed successfully! Redirecting to dashboard...");

                    // Redirect to dashboard after 2 seconds
                    setTimeout(() => {
                        router.push("/dashboard");
                    }, 2000);
                }
            } catch (err: any) {
                setStatus("error");
                setMessage("Failed to confirm email. Please try again.");
            }
        };

        confirmEmail();
    }, [searchParams, router]);

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="flex items-center justify-center bg-gray-50 py-20">
                <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-sm">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Email Confirmation
                        </h2>

                        {status === "loading" && (
                            <div className="space-y-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                                <p className="text-gray-600">Confirming your email...</p>
                            </div>
                        )}

                        {status === "success" && (
                            <div className="space-y-4">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <p className="text-green-800">{message}</p>
                            </div>
                        )}

                        {status === "error" && (
                            <div className="space-y-4">
                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <p className="text-red-800">{message}</p>
                                <button
                                    onClick={() => router.push("/auth/signin")}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Back to Sign In
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
