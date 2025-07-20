import { NextRequest, NextResponse } from 'next/server';
import { createRoom } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { generateRoomCode as generateCode } from '@/utils';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    
    const {
      name,
      description,
      duration,
      challengeType,
      scoringType,
      dailyTarget,
      requireProof,
      allowLateSubmissions,
      penalizeLateSubmissions,
      hasAdmin,
      isPublic,
      maxParticipants,
      adminTransferRules,
    } = body;

    // Validation
    if (!name || !description || !duration || !challengeType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (duration < 1 || duration > 365) {
      return NextResponse.json(
        { success: false, error: 'Duration must be between 1 and 365 days' },
        { status: 400 }
      );
    }

    if (maxParticipants < 2 || maxParticipants > 100) {
      return NextResponse.json(
        { success: false, error: 'Max participants must be between 2 and 100' },
        { status: 400 }
      );
    }

    // Generate unique room code
    let roomCode: string;
    let attempts = 0;
    do {
      roomCode = generateCode();
      attempts++;
      if (attempts > 10) {
        return NextResponse.json(
          { success: false, error: 'Failed to generate unique room code' },
          { status: 500 }
        );
      }
    } while (await import('@/lib/db').then(({ getRoomByCode }) => getRoomByCode(roomCode)));

    // Calculate dates
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000);

    // Create room
    const room = await createRoom({
      code: roomCode,
      name,
      description,
      createdBy: user.username,
      participants: [user.username],
      maxParticipants,
      hasAdmin: isPublic ? true : hasAdmin, // Public rooms always have admin
      currentAdmin: isPublic || hasAdmin ? user.username : null,
      isPublic,
      adminTransferRules: adminTransferRules || 'manual',
      challengeType,
      duration,
      startDate,
      endDate,
      scoringType,
      dailyTarget,
      requireProof,
      allowLateSubmissions,
      penalizeLateSubmissions,
      status: 'active',
      totalSubmissions: 0,
      averageCompletionRate: 0,
    });

    console.log('Room created successfully:', { roomCode, roomId: room.id, status: room.status });

    return NextResponse.json({
      success: true,
      data: {
        room,
        roomCode,
      },
      message: 'Room created successfully',
    });
  } catch (error) {
    console.error('Room creation error:', error);
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