"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Link from "next/link";

export default function ReviewSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newCategories, setNewCategories] = useState("");


  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/GetAddSearchResults', {
          params: {
            place: query,
          }
      })
      console.log(response.data);
      setResults(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  async function AddPlace(e: React.FormEvent){
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/AddPlace', {
        name: newName,
        address: newAddress,
        categories: newCategories,
      })
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
    <div className="min-h-screen bg-neutral-50 px-4">
      <div className="w-full max-w-2xl mx-auto pt-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-neutral-900">
            Add Review for Place
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
            Add Place
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
              <Link href={`/AddReview/${item["_id"]["$oid"]}`}>
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
              <h2 className="text-sm font-medium text-neutral-900">Add New Place</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                ✕
              </button>
            </div>

            <div className="flex px-4 pt-4 pb-2 gap-4 justify-center">
              <label>Name</label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter name of place"
              />
            </div>

            <div className="flex px-4 py-2 space-y-2 gap-4 justify-center">
              <label>Address</label>
              <Input
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="Enter address of place"
              />
            </div>

            <div className="flex px-4 pt-2 pb-4 space-y-2 gap-4 justify-center">
              <label>Categories</label>
              <Input
                value={newCategories}
                onChange={(e) => setNewCategories(e.target.value)}
                placeholder="Enter categories of place"
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
                onClick={(e) => {
                  setShowModal(false);
                  setNewName("");
                  setNewAddress("");
                  setNewCategories("");
                  AddPlace(e);
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
