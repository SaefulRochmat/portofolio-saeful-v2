import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";
import type { Profile } from "./typeProfile";


// Handler for GET requests to /api/profile
export async function GET(): Promise<NextResponse> {
    const { data, error } = await createClient()
    .from("profile")
    .select("*")
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
    
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json<Profile>(data);
}


// Handler for PUT requests to /api/profile
export async function PUT(request: Request): Promise<NextResponse> {
    try {
        const body: Partial<Profile> = await request.json();

        if (!body.id) {
            return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 });
        }

        const { data, error } = await createClient()
        .from('profile')
        .update({
            name: body.name,
            headline: body.headline,
            bio: body.bio,
            email: body.email,
            phone: body.phone,
            location: body.location,
            profile_image: body.profile_image,
            social_links: body.social_links,
            created_at: body.created_at,
            updated_at: body.updated_at,
        })
        .eq('id', body.id)
        .select()
        .single()

        if (error) {
            console.error('❌ Error fetch Supabase:', error.message)
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        console.log('✅ Data berhasil diambil:', data)
        return NextResponse.json<Profile>(data);
        
    } catch (error) {   
        return NextResponse.json({ error: 'Invalid Request Body' }, { status: 400 });
    }
}

