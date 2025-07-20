import { NextRequest, NextResponse } from 'next/server';
import { getPublicRooms } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const rooms = await getPublicRooms();

    return NextResponse.json({
      success: true,
      data: rooms,
    });
  } catch (error) {
    console.error('Error fetching public rooms:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 