import { NextRequest, NextResponse } from 'next/server';
import { getRoomByCode, updateRoom } from '@/lib/db';
import { Redis } from '@upstash/redis';

export async function GET(request: NextRequest) {
  try {
    // Initialize Redis client
    const redis = new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    });
    
    // Get all room codes
    const roomCodes = await redis.smembers('rooms');
    console.log('Found room codes:', roomCodes);
    
    const results = [];
    
    for (const code of roomCodes) {
      const room = await getRoomByCode(code);
      if (room) {
        console.log(`Room ${code} status:`, room.status);
        
        // Fix status if it's 'pending'
        if (room.status === 'pending') {
          await updateRoom(code, { status: 'active' });
          results.push({ code, oldStatus: 'pending', newStatus: 'active', fixed: true });
        } else {
          results.push({ code, status: room.status, fixed: false });
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      data: {
        totalRooms: roomCodes.length,
        results
      }
    });
  } catch (error) {
    console.error('Error fixing room statuses:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 