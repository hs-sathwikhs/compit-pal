import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByUsername } from '@/lib/db';
import { validateUsername, validatePassword, validateEmail } from '@/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, confirmPassword, email } = body;

    // Validation
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      return NextResponse.json(
        { success: false, error: usernameValidation.error },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { success: false, error: passwordValidation.error },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return NextResponse.json(
        { success: false, error: emailValidation.error },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Username already exists' },
        { status: 409 }
      );
    }

    // Create user
    const user = await createUser({
      username,
      password,
      email,
      totalChallenges: 0,
      completedChallenges: 0,
      totalStreak: 0,
      longestStreak: 0,
      activeRooms: [],
      settings: {
        emailNotifications: true,
        reminderTime: '20:00',
        timezone: 'UTC',
      },
    });

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      data: userWithoutPassword,
      message: 'User created successfully',
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 