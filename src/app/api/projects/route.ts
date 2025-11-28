// src/app/api/projects/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import type { Project } from './typeProject';

// Handler for GET requests to /api/projects
// Ambil semua project (bisa juga nanti difilter berdasarkan profile_id jika diperlukan)
export async function GET(): Promise<NextResponse> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json<Project[]>(data);
}

// Handler for POST requests to /api/projects
// Tambah project baru
export async function POST(request: Request): Promise<NextResponse> {
    const supabase = await createClient()
    try {
        const body: Omit<Project, 'id' | 'created_at'> = await request.json();

        if (!body.profile_id || !body.title) {
            return NextResponse.json({ error: 'Profile ID and Title are required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('projects')
            .insert([body])
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json<Project>(data);
    } catch {
        return NextResponse.json({ error: 'Invalid Request Body' }, { status: 400 });
    }
}

// Handler for PUT requests to /api/projects
// Update project berdasarkan ID
export async function PUT(request: Request): Promise<NextResponse> {
    const supabase = await createClient()
    try {
        const body: Partial<Project> = await request.json();
        
        if (!body.id) {
            return NextResponse.json({ error: 'Missing project ID' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('projects')
            .update({
                title: body.title,
                description: body.description,
                technologies: body.technologies,
                repo_url: body.repo_url,
                live_url: body.live_url,
                thumbnail_url: body.thumbnail_url,
                start_date: body.start_date,
                end_date: body.end_date,
            })
            .eq('id', body.id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json<Project>(data);
    } catch {
        return NextResponse.json({ error: 'Invalid Request Body' }, { status: 400 });
    }
}


// Handler for DELETE requests to /api/projects
// Hapus project berdasarkan ID
export async function DELETE(request: Request): Promise<NextResponse> {
    const supabase = await createClient()
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Missing project ID' }, { status: 400 });
        }

        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);
        
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ message: 'Project deleted successfully' });

    } catch {
        return NextResponse.json({ error: 'Invalid Request Body' }, { status: 400 });
    }
}