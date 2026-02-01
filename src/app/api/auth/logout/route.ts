import { NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth/session';

export async function POST() {
  try {
    await destroySession();

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await destroySession();
    
    return NextResponse.redirect(
      new URL('/', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.redirect(
      new URL('/?error=logout_failed', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
    );
  }
}