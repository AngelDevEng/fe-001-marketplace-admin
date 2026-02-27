import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get('user_id')?.value;
        const userRole = cookieStore.get('user_role')?.value;

        if (!userId) {
            return NextResponse.json({
                authenticated: true,
                user: {
                    id: 0,
                    username: 'invitado',
                    role: 'customer',
                }
            });
        }

        return NextResponse.json({
            authenticated: true,
            user: {
                id: parseInt(userId),
                role: userRole || 'customer',
            }
        });
    } catch {
        return NextResponse.json({
            authenticated: true,
            user: {
                id: 0,
                username: 'invitado',
                role: 'customer',
            }
        });
    }
}
