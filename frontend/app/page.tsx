"use client";

import Link from "next/link";
import { MapPin, Star, Plus } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-4xl font-semibold text-neutral-900 mb-4">
          Find & Review Places That Matter
        </h1>
        <p className="text-neutral-600 max-w-xl mx-auto mb-8">
          Personalize reviews and ratings in categories that matter to you.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/Search"
            className="px-6 py-3 rounded-md bg-neutral-900 text-white hover:bg-neutral-800"
          >
            Search Places
          </Link>
          <Link
            href="/AddReview"
            className="px-6 py-3 rounded-md border border-neutral-300 bg-white hover:bg-neutral-100"
          >
            Add a Review
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-t border-neutral-200">
        <div className="max-w-5xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <MapPin className="h-8 w-8 mx-auto text-neutral-900 mb-3" />
            <h3 className="font-medium text-neutral-900 mb-1">Search</h3>
            <p className="text-sm text-neutral-600">
              Find places using relevance-based matching and personalized attribute preference weighting.
            </p>
          </div>

          <div className="text-center">
            <Star className="h-8 w-8 mx-auto text-neutral-900 mb-3" />
            <h3 className="font-medium text-neutral-900 mb-1">Review</h3>
            <p className="text-sm text-neutral-600">
              Rate locations across a variety of attributes to enhance nuance.
            </p>
          </div>

          <div className="text-center">
            <Plus className="h-8 w-8 mx-auto text-neutral-900 mb-3" />
            <h3 className="font-medium text-neutral-900 mb-1">Contribute</h3>
            <p className="text-sm text-neutral-600">
              Add missing places and custom review categories effortlessly.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
