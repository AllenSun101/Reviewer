"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ReviewSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newEntry, setNewEntry] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setResults(data.results || []);
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
            Review Search
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
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search reviews…"
              className="pl-9 bg-white border-neutral-200 focus-visible:ring-neutral-900"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="text-sm px-4 py-2 rounded-md border border-neutral-300 bg-white hover:bg-neutral-100 transition whitespace-nowrap"
          >
            Add Entry
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
              <CardContent className="p-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-sm font-medium text-neutral-900">
                      {item.title}
                    </h2>
                    <p className="text-sm text-neutral-600 mt-1">
                      {item.snippet}
                    </p>
                  </div>
                  {item.score !== undefined && (
                    <span className="text-xs text-neutral-500">
                      {(item.score * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
        {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg w-full max-w-md shadow-lg">
            <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
              <h2 className="text-sm font-medium text-neutral-900">Add New Entry</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4">
              <Input
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                placeholder="Describe the review or item you want to add…"
              />
            </div>

            <div className="p-4 border-t border-neutral-200 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="text-sm px-4 py-2 rounded-md border border-neutral-300 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log("Submit new entry:", newEntry);
                  setShowModal(false);
                  setNewEntry("");
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
