"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Link from "next/link";

export default function ReviewSearchPage() {
  const [query, setQuery] = useState("");
  const [preferenceWeights, setPreferenceWeights] = useState<{ key: string; weight: number }[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("searchResults");
    if (saved) {
      setResults(JSON.parse(saved));
      setQuery(String(localStorage.getItem("query")));
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/GetRatingSearchResults', {
        place: query,
        preference_weights: preferenceWeights,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      
      console.log(response.data);
      setResults(response.data || []);
      localStorage.setItem("searchResults", JSON.stringify(response.data));
      localStorage.setItem("query", query);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-neutral-50 px-4">
        <div className="w-full max-w-2xl mx-auto pt-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold text-neutral-900">
              Search Ratings for Places
            </h1>
          </div>

          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 mb-6"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 h-4 w-4" />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value); 
                  localStorage.removeItem("searchResults");
                  localStorage.removeItem("query");
                }}
                placeholder="Search reviews…"
                className="pl-9 bg-white border-neutral-200 focus-visible:ring-neutral-900"
              />
            </div>
            <button
                type="button"
                onClick={() => setShowModal(true)}
                className="text-sm px-4 py-2 rounded-md border border-neutral-300 bg-white hover:bg-neutral-100 transition whitespace-nowrap"
            >
              Adjust Preferences
            </button>
          </form>

          <div className="space-y-4">
            {loading && (
              <p className="text-sm text-neutral-500 text-center">Searching…</p>
            )}

            {!loading && results.length === 0 && query && (
              <p className="text-sm text-neutral-500 text-center">
                No results found
              </p>
            )}

            {results.map((item, idx) => (
              <Card key={idx} className="border-neutral-200">
                <Link href={`/Search/${item["_id"]["$oid"]}`}>
                  <CardContent className="px-4">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h2 className="text-sm font-medium text-neutral-900">
                          {item["name"]}
                        </h2>
                        <p className="text-sm text-neutral-600 mt-1">
                          {item["address"]}
                        </p>
                        <p className="text-sm text-neutral-600 mt-1">
                          {item["categories"]}
                        </p>
                        <p className="text-sm text-neutral-600 mt-1">
                          Rating: {item["rating"] == -1 ? "N/A" : item["rating"]}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg w-full max-w-md shadow-lg">
            <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
              <h2 className="text-sm font-medium text-neutral-900">
                Adjust Preferences
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4">
              {preferenceWeights.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      value={item.key}
                      onChange={(e) => {
                        const updated = [...preferenceWeights];
                        updated[index].key = e.target.value;
                        setPreferenceWeights(updated);
                      }}
                      placeholder="Attribute (e.g. ambiance)"
                      className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm"
                    />

                    <button
                      onClick={() =>
                        setPreferenceWeights(
                          preferenceWeights.filter((_, i) => i !== index)
                        )
                      }
                      className="text-sm px-2 py-1 border rounded-md hover:bg-neutral-100"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={1}
                      max={100}
                      value={item.weight}
                      onChange={(e) => {
                        const updated = [...preferenceWeights];
                        updated[index].weight = Number(e.target.value);
                        setPreferenceWeights(updated);
                      }}
                      className="flex-1"
                    />
                    <span className="text-sm text-neutral-600 w-10 text-right">
                      {item.weight}
                    </span>
                  </div>
                </div>
              ))}

              <button
                onClick={() =>
                  setPreferenceWeights([
                    ...preferenceWeights,
                    { key: "", weight: 50 },
                  ])
                }
                className="text-sm px-3 py-2 rounded-md border border-neutral-300 hover:bg-neutral-100"
              >
                + Add attribute
              </button>
            </div>

            <div className="p-4 border-t border-neutral-200 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="text-sm px-4 py-2 rounded-md border border-neutral-300 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  handleSearch(e);
                  setShowModal(false);
                }}
                className="text-sm px-4 py-2 rounded-md bg-neutral-900 text-white hover:bg-neutral-800"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
