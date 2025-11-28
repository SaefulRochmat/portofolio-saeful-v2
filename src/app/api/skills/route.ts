// src/app/api/skills/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import type { Skill } from '@/app/api/skills/typeSkill';

// GET /api/skills - Get all skills or filter by profile_id
export async function GET(request: Request): Promise<NextResponse> {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const profileId = searchParams.get('profile_id');

        let query = supabase
            .from('skills')
            .select('*')
            .order('created_at', { ascending: false });

        if (profileId) {
            query = query.eq('profile_id', profileId);
        }

        const { data, error } = await query;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json<Skill[]>(data || []);
    } catch (err) {
        return NextResponse.json(
            { error: 'Internal server error' }, 
            { status: 500 }
        );
    }
}

// POST /api/skills - Create new skill
export async function POST(request: Request): Promise<NextResponse> {
    try {
        const supabase = await createClient();
        const body = await request.json();

        // Validation
        if (!body.profile_id || !body.name) {
            return NextResponse.json(
                { error: 'profile_id and name are required' }, 
                { status: 400 }
            );
        }

        // Validate level if provided
        if (body.level && !['beginner', 'intermediate', 'expert'].includes(body.level)) {
            return NextResponse.json(
                { error: 'Invalid level. Must be: beginner, intermediate, or expert' }, 
                { status: 400 }
            );
        }

        // ✅ PENTING: Jangan kirim field kosong ke database
        const insertData: any = {
            profile_id: body.profile_id,
            name: body.name
        };

        // Only add optional fields if they have valid values
        if (body.level && body.level.trim() !== '') {
            insertData.level = body.level;
        }
        if (body.category && body.category.trim() !== '') {
            insertData.category = body.category;
        }
        if (body.icon_url && body.icon_url.trim() !== '') {
            insertData.icon_url = body.icon_url;
        }

        const { data, error } = await supabase
            .from('skills')
            .insert([insertData])
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ 
                error: error.message,
                details: error.details,
                hint: error.hint 
            }, { status: 400 });
        }

        return NextResponse.json<Skill>(data, { status: 201 });
    } catch (err) {
        console.error('API error:', err);
        return NextResponse.json(
            { error: 'Invalid JSON body or internal error' }, 
            { status: 400 }
        );
    }
}

// PUT /api/skills - Update skill (ID via query params)
export async function PUT(request: Request): Promise<NextResponse> {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Skill ID is required in query params' }, 
                { status: 400 }
            );
        }

        const body = await request.json();

        // Validate level if provided
        if (body.level && !['beginner', 'intermediate', 'expert'].includes(body.level)) {
            return NextResponse.json(
                { error: 'Invalid level. Must be: beginner, intermediate, or expert' }, 
                { status: 400 }
            );
        }

        // Build update object dynamically
        const updateData: any = {};
        
        if (body.name !== undefined && body.name.trim() !== '') {
            updateData.name = body.name;
        }
        if (body.level !== undefined) {
            // Allow removing level by setting to null
            updateData.level = body.level.trim() === '' ? null : body.level;
        }
        if (body.category !== undefined) {
            updateData.category = body.category.trim() === '' ? null : body.category;
        }
        if (body.icon_url !== undefined) {
            updateData.icon_url = body.icon_url.trim() === '' ? null : body.icon_url;
        }

        const { data, error } = await supabase
            .from('skills')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ 
                error: error.message,
                details: error.details 
            }, { status: 400 });
        }

        if (!data) {
            return NextResponse.json(
                { error: 'Skill not found' }, 
                { status: 404 }
            );
        }

        return NextResponse.json<Skill>(data);
    } catch (err) {
        console.error('API error:', err);
        return NextResponse.json(
            { error: 'Invalid JSON body or internal error' }, 
            { status: 400 }
        );
    }
}

// DELETE /api/skills - Delete skill (ID via query params)
export async function DELETE(request: Request): Promise<NextResponse> {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Skill ID is required in query params' }, 
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from('skills')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ 
            message: 'Skill deleted successfully',
            id 
        });
    } catch (err) {
        console.error('API error:', err);
        return NextResponse.json(
            { error: 'Internal server error' }, 
            { status: 500 }
        );
    }
}