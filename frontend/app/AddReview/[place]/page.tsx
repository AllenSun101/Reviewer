"use client";

import { useState, useEffect } from "react";
import { Star, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";

const DEFAULT_CATEGORIES = [
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
  const params = useParams();
  const placeId = params.place;
  const router = useRouter();

  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [customCategory, setCustomCategory] = useState("");
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [generalComments, setGeneralComments] = useState("");
  const [placeInfo, setPlaceInfo] = useState<any>({});

  const userId = "695eccdda75f2529c32302af";

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get('http://localhost:5000/GetPlaceDetails', {
          params: {
            id: placeId,
          }
        })
        setPlaceInfo(response.data);
      } catch (err) {
        console.error("Failed to fetch place info:", err);
      }
    };
    fetchPlaces();
  }, []);

  const addCustomCategory = () => {
    if (!customCategory.trim()) return;
    setCategories([...categories, customCategory]);
    setCustomCategory("");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/AddReview', {
        userId: userId,
        placeId: placeId,
        ratings: ratings,
        generalComments: generalComments,
      })
      if(response.data.status === "success"){
        router.push(`/AddReview`);
      }
    } catch (err) {
      console.error(err);
    }
  }

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

            {/* General comments */}
            <div className="pt-4">
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                General comments
              </label>
              <textarea
                rows={5}
                placeholder="General comments..."
                value={generalComments}
                onChange={(e) => setGeneralComments(e.target.value)}
                className="w-full resize-none rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            {/* Submit */}
            <div className="pt-6">
              <button
                onClick={(e) => handleSubmit(e)}
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
            {placeInfo ? placeInfo["name"] : ""}
          </h2>
          <p className="text-sm text-neutral-600 mb-3">
            Insert description here, aggregated from reviews and context
          </p>

          <div className="text-xs text-neutral-500 space-y-1">
            <p>📍 {placeInfo ? placeInfo["address"] : ""}</p>
            <p>🕒 Open Hours</p>
            <p>☕ Category: {placeInfo ? placeInfo["categories"] : ""}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
