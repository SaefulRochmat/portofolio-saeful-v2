"use client"

import { useState } from "react"

export default function useUpdateDataProfile() {
    const [loading, setLoading] = useState<boolean>(false);

    const updateProfile = async (
        id: string,
        name: string,
        headline?: string,
        bio?: string,
        email?: string,
        phone?: string,
        location?: string,
        profile_image?: string,
        social_links?: Record<string, string>,// { github: "...", linkedin: "..." }
        created_at?: string,
        updated_at?: string,
    ) => {
        try {
            setLoading(true);
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    id,
                    name,
                    headline,
                    bio,
                    email,
                    phone,
                    location,
                    profile_image,
                    social_links,
                    created_at,
                    updated_at,
                }),
            });
            const data = await res.json();
            return data;
        } catch (err) {
            console.error("Error Updateing: ", err);
        } finally {
            setLoading(false);
        }
    };
    return {updateProfile, loading};
}