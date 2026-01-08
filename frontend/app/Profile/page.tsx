"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";

export default function ProfilePage() {

    const [profileInfo, setProfileInfo] = useState<any>({});
    const userId = "695eccdda75f2529c32302af";

    useEffect(() => {
        const fetchProfile = async () => {
        try {
            const response = await axios.get('http://localhost:5000/GetUserProfile', {
                params: {
                    id: userId,
                }
            })
            setProfileInfo(response.data);
            console.log(response.data);
        } catch (err) {
            console.error("Failed to fetch profile info:", err);
        }
        };
        fetchProfile();
    }, []);

    const user = {
        name: "John Doe",
        username: "@johndoe",
        email: "lol",
        bio: "Food enthusiast • Coffee lover • Exploring new places",
    };

    const reviews = [
        {
        id: 1,
        place: "Blue Bottle Coffee",
        rating: 4,
        comment: "Great coffee and clean atmosphere. A bit pricey but worth it.",
        },
        {
        id: 2,
        place: "Central Park",
        rating: 5,
        comment: "Perfect place to relax and walk around. Always a good time.",
        },
    ];

    return (
        <div className="min-h-screen bg-neutral-50 px-6 py-10">
            <div className="mx-auto max-w-3xl space-y-8">
                {/* Profile Header */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-6">
                            <div className="h-20 w-20 rounded-full bg-neutral-300 flex items-center justify-center text-xl font-semibold">
                                Pfp
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold">{profileInfo["name"]}</h1>
                                <p className="text-sm text-neutral-500">{user.username}</p>
                                <p className="text-sm text-neutral-700">{profileInfo["email"]}</p>
                                <p className="mt-2 text-sm text-neutral-700">{user.bio}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Reviews Section */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">My Reviews</h2>

                    {profileInfo["reviews"] && profileInfo["reviews"].map((review: any, idx: any) => (
                        <Card key={idx}>
                            <CardContent className="px-5 space-y-3">
                                <div className="items-center justify-between">
                                    <h3 className="font-medium">{review["place_name"]}</h3>
                                    <p className="">{review["place_address"]}</p>
                                </div>
                                {Object.entries(review["ratings"]).map(([keyword, stars]) => (
                                    <p className="text-sm text-neutral-500 ml-2">
                                        {keyword}: <span className="text-yellow-600">{"★".repeat(Number(stars))}{"☆".repeat(5 - Number(stars))}</span>
                                    </p>
                                ))}
                            <p className="text-sm text-neutral-700">{review["general_comments"]}</p>
                        </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
