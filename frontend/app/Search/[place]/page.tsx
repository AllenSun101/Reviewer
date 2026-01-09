"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { useParams } from "next/navigation";
import { ParamValue } from "next/dist/server/request/params";
import { Card, CardContent } from "@/components/ui/card";

function StarRating({ value }: { value: number }) {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => {
                const full = i <= Math.floor(value);
                const partial = i === Math.floor(value) + 1 && value % 1 !== 0;

                return (
                    <Star
                        key={i}
                        className={`h-5 w-5 transition ${
                            full
                            ? "fill-yellow-400 text-yellow-400"
                            : partial
                            ? "text-yellow-400"
                            : "text-neutral-300"
                        }`}
                        style={
                            partial
                            ? {
                                clipPath: `inset(0 ${100 - (value % 1) * 100}% 0 0)`,
                                fill: "currentColor",
                                }
                            : undefined
                        }
                    />
                );
            })}
        </div>
    );
}

export default function ReviewEntryPage() {
    const params = useParams();
    const placeId = params.place;
    const [placeInfo, setPlaceInfo] = useState<any>({});

    useEffect(() => {
        const saved = localStorage.getItem("searchResults");
        const savedInfo = JSON.parse(String(saved));
        const place = savedInfo.find((el: { [x: string]: { [x: string]: ParamValue; }; }) => el["_id"]["$oid"] === placeId);
        console.log(place);
        if (saved) {
            setPlaceInfo(place);
        }
    }, []);

    return (
        <div className="min-h-screen bg-neutral-50 px-6 py-8">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left: Reviews */}
                <div className="md:col-span-2">
                    <h1 className="text-2xl font-semibold text-neutral-900 mb-6">
                        {placeInfo["name"]}
                    </h1>

                    <div className="space-y-5 mb-12">
                        <div className="flex gap-2">
                            <StarRating
                                value={placeInfo["rating"] || 0}
                            />
                            <p>{placeInfo["rating"] == -1 ? "N/A" : placeInfo["rating"]}</p>
                        </div>
                        <p>Category breakdown of ratings</p>
                    </div>

                    <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Reviews</h2>
                    {placeInfo["reviews"] && placeInfo["reviews"].map((review: any, idx: any) => (
                        <Card key={idx} className="mb-3">
                            <CardContent className="px-5">
                                <p className="text-sm text-neutral-700">{review}</p>
                            </CardContent>
                        </Card>
                    ))}
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
