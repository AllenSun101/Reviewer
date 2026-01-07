"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // TODO: replace with real auth call
    console.log("Login:", { email, password });

    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white border border-neutral-200 rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-2">
          Welcome back
        </h1>
        <p className="text-sm text-neutral-600 mb-6">
          Sign in to continue reviewing places.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md bg-neutral-900 text-white text-sm hover:bg-neutral-800 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-neutral-500">
          Don't have an account?{" "}
          <Link href="/signup" className="text-neutral-900 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
