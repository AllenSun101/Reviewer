"use client";

import { useState } from "react";
import { Star, Plus } from "lucide-react";

const DEFAULT_CATEGORIES = [
  "Cleanliness",
  "Location",
  "Value",
  "Atmosphere",
  "Service",
];

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          onClick={() => onChange(i)}
          className={`h-5 w-5 cursor-pointer transition ${
            i <= value ? "fill-yellow-400 text-yellow-400" : "text-neutral-300"
          }`}
        />
      ))}
    </div>
  );
}

export default function ReviewEntryPage() {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [customCategory, setCustomCategory] = useState("");
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  const addCustomCategory = () => {
    if (!customCategory.trim()) return;
    setCategories([...categories, customCategory]);
    setCustomCategory("");
  };

  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Review form */}
        <div className="md:col-span-2">
          <h1 className="text-2xl font-semibold text-neutral-900 mb-6">
            Rate this place
          </h1>

          <div className="space-y-5">
            {categories.map((cat) => (
              <div key={cat} className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-800">
                  {cat}
                </span>
                <StarRating
                  value={ratings[cat] || 0}
                  onChange={(v) => setRatings({ ...ratings, [cat]: v })}
                />
              </div>
            ))}

            {/* Add custom category */}
            <div className="flex items-center gap-2 pt-4">
              <input
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Add custom category"
                className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
              <button
                onClick={addCustomCategory}
                className="p-2 rounded-md border border-neutral-300 hover:bg-neutral-100"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Submit */}
            <div className="pt-6">
              <button
                onClick={() => console.log("Submit review:", ratings)}
                className="px-6 py-2 rounded-md bg-neutral-900 text-white hover:bg-neutral-800"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>

        {/* Right: Place info */}
        <div className="bg-white border border-neutral-200 rounded-lg p-5 h-fit">
          <h2 className="text-sm font-semibold text-neutral-900 mb-2">
            The Local Coffee House
          </h2>
          <p className="text-sm text-neutral-600 mb-3">
            Coffee shop near Texas A&M campus, popular for studying and group meetups.
          </p>

          <div className="text-xs text-neutral-500 space-y-1">
            <p>📍 College Station, TX</p>
            <p>🕒 Open 7am - 10pm</p>
            <p>☕ Category: Café</p>
          </div>
        </div>
      </div>
    </div>
  );
}
