import {  NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import type { Skill } from './typeSkill';

// GET /api/skills
export async function GET(): Promise<NextResponse> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json<Skill[]>(data);
}

// POST /api/skills
export async function POST(request: Request): Promise<NextResponse> {
    const supabase = createClient()
    try {
        const body: Omit<Skill, 'id' | 'created_at'> = await request.json();

        if (!body.profile_id || !body.name) {
            return NextResponse.json({ error: 'profile_id and name are required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('skills')
            .insert([body])
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json<Skill>(data);
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
}

// PUT /api/skills
export async function PUT(request: Request): Promise<NextResponse> {
    const supabase = createClient()
    try {
        const body: Partial<Skill> = await request.json();

        if (!body.id) {
            return NextResponse.json({ error: 'Missing skill ID' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('skills')
            .update({
                name: body.name,
                level: body.level,
                category: body.category,
                icon_url: body.icon_url,
            })
            .eq('id', body.id)
            .select()
            .single();
        
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json<Skill>(data);
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
}

// DELETE /api/skills
export async function DELETE(request: Request): Promise<NextResponse> {
    const supabase = createClient()
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Missing skill ID' }, { status: 400 });
        }

        const { error } = await supabase
            .from('skills')
            .delete()
            .eq('id', id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ message: 'Skill deleted successfully' });
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
}