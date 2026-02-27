import { NextResponse } from 'next/server';
import { blogApi } from '@/lib/api/blog';

export async function GET() {
    try {
        const categories = await blogApi.getCategories();
        return NextResponse.json(categories);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
