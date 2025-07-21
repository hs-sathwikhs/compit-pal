import { NextRequest, NextResponse } from 'next/server';
import { getProgressForRoom } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { roomCode: string } }
) {
  try {
    const progress = await getProgressForRoom(params.roomCode);
    
    return NextResponse.json({ 
      success: true,
      data: progress,
      message: 'Progress fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
} 