"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page after a short delay
    const redirectTimer = setTimeout(() => {
      router.push("/login");
    }, 2000);

    return () => clearTimeout(redirectTimer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="w-16 h-16 rounded-full border-4 border-t-transparent border-yellow-500 animate-spin mb-6"></div>
      <h1 className="text-2xl font-bold text-yellow-500 mb-2">Page Not Found</h1>
      <p className="text-gray-400">Redirecting to login page...</p>
    </div>
  );
}
