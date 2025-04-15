"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-12 h-12 rounded-full border-4 border-t-transparent border-yellow-500 animate-spin"></div>
    </div>
  );
}
