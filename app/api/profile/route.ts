// app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth'; // Your main auth object
import { getPool } from '@/lib/db';
import { hash } from 'bcryptjs'; // For hashing passwords

// GET handler to fetch the current user's profile
export async function GET(req: NextRequest) {
    const session = await (auth as any).getSession(req);
    if (!session?.userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const pool = getPool();
        const result = await pool.query('SELECT id, name, email, image FROM "user" WHERE id = $1', [session.userId]);

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Failed to fetch user profile:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}

// PUT handler to update the user's profile
export async function PUT(req: NextRequest) {
    const session = await (auth as any).getSession(req);
    if (!session?.userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, password, image } = await req.json();

    if (!name) {
        return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    try {
        const pool = getPool();
        
        // If a new password is provided, hash it
        if (password) {
            const hashedPassword = await hash(password, 12);
            // Update both user name and account password
            await pool.query('BEGIN');
            await pool.query(
                'UPDATE "user" SET name = $1, image = $2, "updatedAt" = NOW() WHERE id = $3',
                [name, image, session.userId]
            );
            await pool.query(
                'UPDATE "account" SET password = $1, "updatedAt" = NOW() WHERE "userId" = $2 AND "providerId" = \'credentials\'',
                [hashedPassword, session.userId]
            );
            await pool.query('COMMIT');
        } else {
            // Update only user name and image
            await pool.query(
                'UPDATE "user" SET name = $1, image = $2, "updatedAt" = NOW() WHERE id = $3',
                [name, image, session.userId]
            );
        }

        return NextResponse.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Failed to update user profile:', error);
        await getPool().query('ROLLBACK');
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}

// DELETE handler for account deletion
export async function DELETE(req: NextRequest) {
    const session = await (auth as any).getSession(req);
    if (!session?.userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const pool = getPool();
        // The 'on delete cascade' in your schema will handle related sessions and accounts
        await pool.query('DELETE FROM "user" WHERE id = $1', [session.userId]);
        
        return NextResponse.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Failed to delete account:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}
