import { NextRequest, NextResponse } from 'next/server';
import { submitProgress, getRoomByCode, getProgressForUser } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { isSubmissionLate } from '@/utils';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    
    const {
      roomCode,
      completed,
      points,
      quantity,
      notes,
      proofDescription,
      date,
    } = body;

    // Validation
    if (!roomCode || completed === undefined) {
      return NextResponse.json(
        { success: false, error: 'Room code and completion status are required' },
        { status: 400 }
      );
    }

    // Get room
    const room = await getRoomByCode(roomCode);
    console.log('Room found for progress submission:', { roomCode, roomStatus: room?.status, room });
    
    if (!room) {
      return NextResponse.json(
        { success: false, error: 'Room not found' },
        { status: 404 }
      );
    }

    // Check if user is in room
    if (room.participants.indexOf(user.username) === -1) {
      return NextResponse.json(
        { success: false, error: 'You are not a participant in this room' },
        { status: 403 }
      );
    }

    // Check if room is active
    console.log('Checking room status:', room.status);
    if (room.status !== 'active') {
      console.log('Room is not active, status:', room.status);
      return NextResponse.json(
        { success: false, error: `Room is not active (status: ${room.status})` },
        { status: 400 }
      );
    }

    // Parse date
    const submissionDate = date ? new Date(date) : new Date();
    const targetDate = new Date(submissionDate);
    targetDate.setHours(23, 59, 59, 999); // End of day

    // Check if submission is late
    const isLate = isSubmissionLate(new Date(), targetDate);
    
    if (isLate && !room.allowLateSubmissions) {
      return NextResponse.json(
        { success: false, error: 'Late submissions are not allowed in this room' },
        { status: 400 }
      );
    }

    // Check if submission already exists for this date
    const existingProgress = await getProgressForUser(roomCode, user.username);
    const existingForDate = existingProgress.find(p => {
      const progressDate = new Date(p.date);
      const submissionDateOnly = new Date(submissionDate);
      return progressDate.toDateString() === submissionDateOnly.toDateString();
    });

    if (existingForDate) {
      return NextResponse.json(
        { success: false, error: 'Progress already submitted for this date' },
        { status: 400 }
      );
    }

    // Calculate points
    let finalPoints = 0;
    if (completed) {
      if (room.scoringType === 'binary') {
        finalPoints = 1;
      } else {
        finalPoints = points || quantity || room.dailyTarget;
      }
    }

    // Apply late submission penalty
    if (isLate && room.penalizeLateSubmissions) {
      finalPoints = Math.floor(finalPoints * 0.5); // 50% penalty
    }

    // Submit progress
    const progress = await submitProgress({
      roomCode,
      username: user.username,
      date: submissionDate,
      completed,
      points: finalPoints,
      quantity,
      notes: notes || '',
      proofDescription: proofDescription || '',
      isLateSubmission: isLate,
      editHistory: [],
    });

    return NextResponse.json({
      success: true,
      data: { progress },
      message: 'Progress submitted successfully',
    });
  } catch (error) {
    console.error('Progress submission error:', error);
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