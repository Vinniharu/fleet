"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login, user } = useAuth();

  useEffect(() => {
    // If user is already logged in, redirect based on role
    if (user) {
      if (user.role === "Admin") {
        router.push("/admin/dashboard");
      } else if (user.role === "Pilot") {
        router.push("/pilot/dashboard");
      } else if (user.role === "Data Engineer") {
        router.push("/data-engineer/dashboard");
      }
      else {
        router.push("/login");
      }
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate required fields
    if (!email || !password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      // Use the auth context login method
      await login(email, password);
      // Redirection is handled in the useEffect
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="w-full max-w-md relative z-10 bg-black rounded-2xl">
        <div className="bg-gray-900/70 backdrop-blur-xl border border-yellow-500/20 rounded-2xl shadow-2xl p-8 transition-all duration-300 hover:shadow-yellow-500/10">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Fleet Management System
            </h2>
            <p className="mt-2 text-sm text-yellow-500/80 font-light">
              Sign in to access your dashboard
            </p>
          </div>

          {error && (
            <div className="bg-red-900/30 backdrop-blur-sm border-l-4 border-red-500 text-red-300 px-4 py-3 rounded-md text-sm mb-6 shadow-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-yellow-500 mb-2 ml-1"
                >
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-1000"></div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="relative block w-full px-4 py-3.5 border border-yellow-500/20 bg-gray-950/50 placeholder-gray-400 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent transition-all duration-200"
                    placeholder="Enter Email"
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-yellow-500 mb-2 ml-1"
                >
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-1000"></div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none relative block w-full px-4 py-3.5 border border-yellow-500/20 bg-gray-950/50 placeholder-gray-400 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent transition-all duration-200"
                    placeholder="Enter Password"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-medium rounded-xl text-black bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 shadow-md"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>

          <div className="text-center mt-8 pt-6 border-t border-yellow-500/10">
            <p className="text-xs text-gray-400 font-light">
              Briech UAS Fleet Management System
            </p>
          </div>
        </div>
      </div>
  );
}
