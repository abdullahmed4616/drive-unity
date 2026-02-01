import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';

export async function GET() {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Get session error:', error);
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 401 }
    );
  }
}