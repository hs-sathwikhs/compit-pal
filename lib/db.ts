import { Redis } from '@upstash/redis';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Room, Progress, Session } from '@/types';

// Initialize Upstash Redis client
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// User management
export async function createUser(userData: Omit<User, 'id' | 'joinDate' | 'lastLogin'>): Promise<User> {
  const id = `user:${userData.username}`;
  const hashedPassword = await bcrypt.hash(userData.password, 12);
  
  const user: User = {
    ...userData,
    id,
    password: hashedPassword,
    joinDate: new Date(),
    lastLogin: new Date(),
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
  };
  
  await redis.set(id, user);
  await redis.sadd('users', userData.username);
  
  return user;
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const id = `user:${username}`;
  const user = await redis.get<User>(id);
  return user;
}

export async function updateUser(username: string, updates: Partial<User>): Promise<void> {
  const id = `user:${username}`;
  const user = await redis.get<User>(id);
  if (!user) throw new Error('User not found');
  
  const updatedUser = { ...user, ...updates };
  await redis.set(id, updatedUser);
}

export async function deleteUser(username: string): Promise<void> {
  const id = `user:${username}`;
  await redis.del(id);
  await redis.srem('users', username);
}

// Room management
export async function createRoom(roomData: Omit<Room, 'id' | 'createdAt' | 'lastActivity'>): Promise<Room> {
  const id = `room:${roomData.code}`;
  
  const room: Room = {
    ...roomData,
    id,
    createdAt: new Date(),
    lastActivity: new Date(),
    totalSubmissions: 0,
    averageCompletionRate: 0,
  };
  
  console.log('Creating room with ID:', id);
  console.log('Room data:', room);
  
  await redis.set(id, room);
  await redis.set(`room_code:${roomData.code}`, roomData.code);
  await redis.sadd('rooms', roomData.code);
  
  // Add creator to participants
  await redis.sadd(`room_participants:${roomData.code}`, roomData.createdBy);
  
  // Update user's active rooms
  await redis.sadd(`user_rooms:${roomData.createdBy}`, roomData.code);
  
  console.log('Room created successfully in database');
  
  return room;
}

export async function getRoomByCode(code: string): Promise<Room | null> {
  const id = `room:${code}`;
  console.log('Looking for room with ID:', id);
  const room = await redis.get<Room>(id);
  console.log('Room found:', room ? 'Yes' : 'No');
  return room;
}

export async function updateRoom(code: string, updates: Partial<Room>): Promise<void> {
  const id = `room:${code}`;
  const room = await redis.get<Room>(id);
  if (!room) throw new Error('Room not found');
  
  const updatedRoom = { ...room, ...updates, lastActivity: new Date() };
  await redis.set(id, updatedRoom);
}

export async function deleteRoom(code: string): Promise<void> {
  const id = `room:${code}`;
  const room = await redis.get<Room>(id);
  if (!room) return;
  
  // Remove all participants from their active rooms
  for (const participant of room.participants) {
    await redis.srem(`user_rooms:${participant}`, code);
  }
  
  // Delete room data
  await redis.del(id);
  await redis.del(`room_code:${code}`);
  await redis.srem('rooms', code);
  await redis.del(`room_participants:${code}`);
  await redis.del(`room_progress:${code}`);
}

export async function addParticipantToRoom(roomCode: string, username: string): Promise<void> {
  const room = await getRoomByCode(roomCode);
  if (!room) throw new Error('Room not found');
  
  if (room.participants.includes(username)) {
    throw new Error('User already in room');
  }
  
  if (room.participants.length >= room.maxParticipants) {
    throw new Error('Room is full');
  }
  
  // Add to room participants
  await redis.sadd(`room_participants:${roomCode}`, username);
  
  // Update room data
  const updatedParticipants = [...room.participants, username];
  await updateRoom(roomCode, { participants: updatedParticipants });
  
  // Add to user's active rooms
  await redis.sadd(`user_rooms:${username}`, roomCode);
}

export async function removeParticipantFromRoom(roomCode: string, username: string): Promise<void> {
  const room = await getRoomByCode(roomCode);
  if (!room) throw new Error('Room not found');
  
  // Remove from room participants
  await redis.srem(`room_participants:${roomCode}`, username);
  
  // Update room data
  const updatedParticipants = room.participants.filter(p => p !== username);
  await updateRoom(roomCode, { participants: updatedParticipants });
  
  // Remove from user's active rooms
  await redis.srem(`user_rooms:${username}`, roomCode);
  
  // Handle admin succession if needed
  if (room.hasAdmin && room.currentAdmin === username) {
    await handleAdminSuccession(roomCode, room);
  }
}

async function handleAdminSuccession(roomCode: string, room: Room): Promise<void> {
  const remainingParticipants = room.participants.filter(p => p !== room.currentAdmin);
  
  if (remainingParticipants.length === 0) {
    // No participants left, archive room
    await updateRoom(roomCode, { status: 'archived', currentAdmin: null });
    return;
  }
  
  let newAdmin: string;
  
  switch (room.adminTransferRules) {
    case 'activity':
      // Find most active participant
      const participantActivity = await Promise.all(
        remainingParticipants.map(async (username) => {
          const progress = await getProgressForUser(roomCode, username);
          return { username, submissions: progress.length };
        })
      );
      participantActivity.sort((a, b) => b.submissions - a.submissions);
      newAdmin = participantActivity[0].username;
      break;
      
    case 'voting':
      // For now, use longest participating member
      // In a real implementation, you'd implement voting logic
      newAdmin = remainingParticipants[0];
      break;
      
    case 'manual':
    default:
      // Use longest participating member as fallback
      newAdmin = remainingParticipants[0];
      break;
  }
  
  await updateRoom(roomCode, { currentAdmin: newAdmin });
}

// Progress management
export async function submitProgress(progressData: Omit<Progress, 'id' | 'submissionTime'>): Promise<Progress> {
  const id = `progress:${progressData.roomCode}:${progressData.username}:${progressData.date.toISOString().split('T')[0]}`;
  
  const progress: Progress = {
    ...progressData,
    id,
    submissionTime: new Date(),
    editHistory: [],
  };
  
  await redis.set(id, progress);
  await redis.sadd(`room_progress:${progressData.roomCode}`, id);
  await redis.sadd(`user_progress:${progressData.username}`, id);
  
  // Update room analytics
  await updateRoomAnalytics(progressData.roomCode);
  
  return progress;
}

export async function getProgressForUser(roomCode: string, username: string): Promise<Progress[]> {
  const progressIds = await redis.smembers(`room_progress:${roomCode}`);
  const progressEntries: Progress[] = [];
  
  for (const progressId of progressIds) {
    const progress = await redis.get<Progress>(progressId);
    if (progress && progress.username === username) {
      progressEntries.push(progress);
    }
  }
  
  return progressEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getProgressForRoom(roomCode: string): Promise<Progress[]> {
  const progressIds = await redis.smembers(`room_progress:${roomCode}`);
  const progressEntries: Progress[] = [];
  
  for (const progressId of progressIds) {
    const progress = await redis.get<Progress>(progressId);
    if (progress) {
      progressEntries.push(progress);
    }
  }
  
  return progressEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function updateProgress(progressId: string, updates: Partial<Progress>): Promise<void> {
  const progress = await redis.get<Progress>(progressId);
  if (!progress) throw new Error('Progress not found');
  
  const updatedProgress = {
    ...progress,
    ...updates,
    editHistory: [
      ...progress.editHistory,
      { timestamp: new Date(), changes: updates }
    ]
  };
  
  await redis.set(progressId, updatedProgress);
}

// Session management
export async function createSession(username: string, deviceInfo: string): Promise<Session> {
  const sessionId = `session:${Math.random().toString(36).substring(2)}`;
  const session: Session = {
    sessionId,
    username,
    deviceInfo,
    createdAt: new Date(),
    lastAccessed: new Date(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  };
  
  await redis.set(sessionId, session);
  await redis.sadd(`user_sessions:${username}`, sessionId);
  
  return session;
}

export async function getSession(sessionId: string): Promise<Session | null> {
  const session = await redis.get<Session>(sessionId);
  if (!session || session.expiresAt < new Date()) {
    return null;
  }
  
  // Update last accessed
  session.lastAccessed = new Date();
  await redis.set(sessionId, session);
  
  return session;
}

export async function deleteSession(sessionId: string): Promise<void> {
  const session = await redis.get<Session>(sessionId);
  if (session) {
    await redis.srem(`user_sessions:${session.username}`, sessionId);
  }
  await redis.del(sessionId);
}

export async function deleteAllUserSessions(username: string): Promise<void> {
  const sessionIds = await redis.smembers(`user_sessions:${username}`);
  for (const sessionId of sessionIds) {
    await redis.del(sessionId);
  }
  await redis.del(`user_sessions:${username}`);
}

// Authentication utilities
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(username: string): string {
  return jwt.sign({ username }, JWT_SECRET, { expiresIn: '30d' });
}

export function verifyToken(token: string): { username: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { username: string };
  } catch {
    return null;
  }
}

// Analytics and utility functions
async function updateRoomAnalytics(roomCode: string): Promise<void> {
  const progress = await getProgressForRoom(roomCode);
  const room = await getRoomByCode(roomCode);
  if (!room) return;
  
  const totalSubmissions = progress.length;
  const completedSubmissions = progress.filter(p => p.completed).length;
  const averageCompletionRate = totalSubmissions > 0 ? (completedSubmissions / totalSubmissions) * 100 : 0;
  
  await updateRoom(roomCode, { totalSubmissions, averageCompletionRate });
}

export async function getPublicRooms(): Promise<Room[]> {
  const roomCodes = await redis.smembers('rooms');
  const rooms: Room[] = [];
  
  for (const code of roomCodes) {
    const room = await getRoomByCode(code);
    if (room && room.isPublic && room.status === 'active') {
      rooms.push(room);
    }
  }
  
  return rooms.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getUserActiveRooms(username: string): Promise<Room[]> {
  const roomCodes = await redis.smembers(`user_rooms:${username}`);
  const rooms: Room[] = [];
  
  for (const code of roomCodes) {
    const room = await getRoomByCode(code);
    if (room && room.status === 'active') {
      rooms.push(room);
    }
  }
  
  return rooms.sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
} 