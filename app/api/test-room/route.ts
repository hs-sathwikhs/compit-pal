import { NextRequest, NextResponse } from 'next/server';
import { createRoom, getRoomByCode } from '@/lib/db';
import { generateRoomCode } from '@/utils';

export async function GET(request: NextRequest) {
  try {
    // Test room creation and retrieval
    const testRoomCode = generateRoomCode();
    console.log('Generated test room code:', testRoomCode);
    
    const testRoom = await createRoom({
      code: testRoomCode,
      name: 'Test Room',
      description: 'This is a test room',
      createdBy: 'testuser',
      participants: ['testuser'],
      maxParticipants: 10,
      hasAdmin: true,
      currentAdmin: 'testuser',
      isPublic: false,
      adminTransferRules: 'manual',
      challengeType: 'coding',
      duration: 7,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      scoringType: 'binary',
      dailyTarget: 1,
      requireProof: false,
      allowLateSubmissions: true,
      penalizeLateSubmissions: false,
      status: 'active',
      totalSubmissions: 0,
      averageCompletionRate: 0,
    });
    
    console.log('Test room created:', testRoom);
    console.log('Test room status:', testRoom.status);
    
    // Test retrieval
    const retrievedRoom = await getRoomByCode(testRoomCode);
    console.log('Retrieved room:', retrievedRoom);
    
    return NextResponse.json({
      success: true,
      data: {
        created: testRoom,
        retrieved: retrievedRoom,
        roomCode: testRoomCode
      }
    });
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 