import { NextRequest } from 'next/server';
import { getSession, verifyToken, getUserByUsername } from '@/lib/db';
import { User } from '@/types';

export async function getCurrentUser(request: NextRequest): Promise<User | null> {
  try {
    // Try to get session from cookie
    const sessionId = request.cookies.get('sessionId')?.value;
    if (sessionId) {
      const session = await getSession(sessionId);
      if (session) {
        const user = await getUserByUsername(session.username);
        return user;
      }
    }

    // Try to get user from JWT token
    const token = request.cookies.get('token')?.value;
    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        const user = await getUserByUsername(payload.username);
        return user;
      }
    }

    return null;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

export async function requireAuth(request: NextRequest): Promise<User> {
  const user = await getCurrentUser(request);
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

export function getAuthHeaders(user: User) {
  return {
    'X-User-Id': user.id,
    'X-Username': user.username,
  };
} 