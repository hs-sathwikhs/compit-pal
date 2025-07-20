import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { deleteSession } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    
    if (user) {
      // Get session ID from cookie
      const sessionId = request.cookies.get('sessionId')?.value;
      if (sessionId) {
        await deleteSession(sessionId);
      }
    }

    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    // Clear session cookie
    response.cookies.set('sessionId', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 