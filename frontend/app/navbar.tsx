"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-neutral-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Left: Brand */}
        <Link href="/" className="flex items-center gap-2 text-neutral-900">
          <MapPin className="h-5 w-5" />
          <span className="font-semibold text-sm">Reviewer</span>
        </Link>

        {/* Center: Links */}
        <div className="flex items-center gap-4">
          <Link href="/Search" className="hover:text-neutral-900 transition">
            Search
          </Link>
          <Link href="/AddReview" className="hover:text-neutral-900 transition">
            Add Review
          </Link>
        </div>

      </div>
    </nav>
  );
}
