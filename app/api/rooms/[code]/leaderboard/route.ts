import { NextRequest, NextResponse } from 'next/server';
import { getRoomByCode, getProgressForRoom } from '@/lib/db';
import { UserAnalytics } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const room = await getRoomByCode(params.code);
    
    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    const progress = await getProgressForRoom(params.code);
    
    // Calculate leaderboard
    const userStats = new Map<string, {
      username: string;
      totalPoints: number;
      completedDays: number;
      totalDays: number;
      currentStreak: number;
      longestStreak: number;
    }>();

    // Initialize user stats
    room.participants.forEach(username => {
      userStats.set(username, {
        username,
        totalPoints: 0,
        completedDays: 0,
        totalDays: 0,
        currentStreak: 0,
        longestStreak: 0,
      });
    });

    // Calculate stats from progress
    progress.forEach(entry => {
      const stats = userStats.get(entry.username);
      if (stats) {
        stats.totalPoints += entry.points;
        stats.totalDays++;
        if (entry.completed) {
          stats.completedDays++;
        }
      }
    });

    // Convert to leaderboard format
    const leaderboard: UserAnalytics[] = Array.from(userStats.values())
      .map(stats => ({
        username: stats.username,
        totalPoints: stats.totalPoints,
        completionRate: stats.totalDays > 0 ? Math.round((stats.completedDays / stats.totalDays) * 100) : 0,
        currentStreak: stats.currentStreak,
        longestStreak: stats.longestStreak,
        totalSubmissions: stats.totalDays,
        rank: 0,
        rankChange: 0,
      }))
      .sort((a, b) => b.totalPoints - a.totalPoints || b.completionRate - a.completionRate)
      .map((user, index) => ({
        ...user,
        rank: index + 1,
      }));

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
} 