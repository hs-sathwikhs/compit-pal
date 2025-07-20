// User-related types
export interface User {
  id: string;
  username: string;
  password: string; // hashed
  email?: string;
  joinDate: Date;
  lastLogin: Date;
  
  // Statistics
  totalChallenges: number;
  completedChallenges: number;
  totalStreak: number;
  longestStreak: number;
  
  // Current activity
  activeRooms: string[];
  
  // Preferences
  settings: {
    emailNotifications: boolean;
    reminderTime: string;
    timezone: string;
  };
}

// Room-related types
export interface Room {
  id: string;
  code: string; // unique 6-char
  name: string;
  description: string;
  createdBy: string; // username
  createdAt: Date;
  
  // Participants
  participants: string[]; // usernames
  maxParticipants: number;
  
  // Admin system
  hasAdmin: boolean;
  currentAdmin: string | null;
  isPublic: boolean;
  adminTransferRules: 'manual' | 'activity' | 'voting';
  
  // Challenge configuration
  challengeType: string;
  duration: number;
  startDate: Date;
  endDate: Date;
  
  // Challenge settings
  scoringType: 'binary' | 'points';
  dailyTarget: number;
  requireProof: boolean;
  allowLateSubmissions: boolean;
  penalizeLateSubmissions: boolean;
  
  // State
  status: 'pending' | 'active' | 'completed' | 'archived';
  
  // Analytics cache
  totalSubmissions: number;
  averageCompletionRate: number;
  lastActivity: Date;
}

// Progress tracking types
export interface Progress {
  id: string;
  roomCode: string;
  username: string;
  date: Date;
  
  // Completion data
  completed: boolean;
  points: number;
  quantity?: number;
  notes: string;
  proofDescription: string;
  
  // Metadata
  submissionTime: Date;
  isLateSubmission: boolean;
  editHistory: Array<{
    editTime: Date;
    previousValue: any;
  }>;
}

// Session management types
export interface Session {
  sessionId: string;
  username: string;
  createdAt: Date;
  lastAccessed: Date;
  expiresAt: Date;
  deviceInfo: string;
}

// Challenge types
export type ChallengeType = 
  | 'coding' 
  | 'fitness' 
  | 'learning' 
  | 'habits' 
  | 'creative' 
  | 'health' 
  | 'custom';

export interface ChallengeConfig {
  type: ChallengeType;
  name: string;
  description: string;
  icon: string;
  defaultTarget: number;
  unit: string;
  scoringOptions: 'binary' | 'points';
}

// Analytics types
export interface UserAnalytics {
  username: string;
  totalPoints: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  totalSubmissions: number;
  rank: number;
  rankChange: number;
}

export interface RoomAnalytics {
  totalParticipants: number;
  averageCompletionRate: number;
  totalSubmissions: number;
  mostActiveMember: string;
  averagePoints: number;
  challengeHealth: 'excellent' | 'good' | 'fair' | 'poor';
}

// Achievement types
export interface Achievement {
  id: string;
  type: 'streak' | 'consistency' | 'competition' | 'special';
  name: string;
  description: string;
  icon: string;
  criteria: {
    streak?: number;
    completionRate?: number;
    rank?: number;
    points?: number;
  };
  unlocked: boolean;
  unlockedAt?: Date;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form types
export interface LoginForm {
  username: string;
  password: string;
}

export interface SignupForm {
  username: string;
  password: string;
  confirmPassword: string;
  email?: string;
}

export interface RoomCreationForm {
  name: string;
  description: string;
  duration: number;
  challengeType: ChallengeType;
  scoringType: 'binary' | 'points';
  dailyTarget: number;
  requireProof: boolean;
  allowLateSubmissions: boolean;
  penalizeLateSubmissions: boolean;
  hasAdmin: boolean;
  isPublic: boolean;
  maxParticipants: number;
  adminTransferRules: 'manual' | 'activity' | 'voting';
}

export interface ProgressSubmissionForm {
  completed: boolean;
  points: number;
  quantity?: number;
  notes: string;
  proofDescription: string;
  date: string;
}

// UI Component types
export interface TabItem {
  id: string;
  label: string;
  icon: string;
  component: any; // React.ComponentType<any>;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  points: number;
  completionRate: number;
  currentStreak: number;
  rankChange: number;
  isCurrentUser: boolean;
}

// Notification types
export interface Notification {
  id: string;
  type: 'achievement' | 'reminder' | 'update' | 'social';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
} 