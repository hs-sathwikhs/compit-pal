import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getRoomByCode, addParticipantToRoom } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const { roomCode } = await request.json();

    if (!roomCode) {
      return NextResponse.json(
        { success: false, error: 'Room code is required' },
        { status: 400 }
      );
    }

    // Get room by code (case-sensitive)
    const room = await getRoomByCode(roomCode);
    if (!room) {
      return NextResponse.json(
        { success: false, error: 'Room not found' },
        { status: 404 }
      );
    }

    // Check if room is full
    if (room.participants.length >= room.maxParticipants) {
      return NextResponse.json(
        { success: false, error: 'Room is full' },
        { status: 400 }
      );
    }

    // Check if user is already in the room
    if (room.participants.includes(user.username)) {
      return NextResponse.json(
        { success: false, error: 'You are already a member of this room' },
        { status: 400 }
      );
    }

    // Add user to room
    await addParticipantToRoom(roomCode, user.username);

    return NextResponse.json({
      success: true,
      message: 'Successfully joined room',
      data: { roomCode: roomCode },
    });
  } catch (error) {
    console.error('Error joining room:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 