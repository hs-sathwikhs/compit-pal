import { NextRequest, NextResponse } from 'next/server';
import { getUserByUsername, verifyPassword, createSession, generateToken } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Validation
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Get user
    const user = await getUserByUsername(username);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Create session
    const deviceInfo = request.headers.get('user-agent') || 'Unknown';
    const session = await createSession(username, deviceInfo);

    // Generate JWT token
    const token = generateToken(username);

    // Update last login
    user.lastLogin = new Date();
    await import('@/lib/db').then(({ updateUser }) => updateUser(username, { lastLogin: new Date() }));

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    const response = NextResponse.json({
      success: true,
      data: {
        user: userWithoutPassword,
        session: session,
      },
      message: 'Login successful',
    });

    // Set session cookie
    response.cookies.set('sessionId', session.sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    // Set JWT token cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 