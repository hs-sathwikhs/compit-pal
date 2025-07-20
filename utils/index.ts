import { format, addDays, differenceInDays, isToday, isYesterday } from 'date-fns';

// Generate unique 6-character room codes
export function generateRoomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Date utilities
export function formatDate(date: Date): string {
  return format(date, 'MMM dd, yyyy');
}

export function formatTime(date: Date): string {
  return format(date, 'HH:mm');
}

export function formatDateTime(date: Date): string {
  return format(date, 'MMM dd, yyyy HH:mm');
}

export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInDays = differenceInDays(now, date);
  
  if (diffInDays === 0) {
    return 'Today';
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else {
    const months = Math.floor(diffInDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
}

export function isSubmissionLate(submissionDate: Date, targetDate: Date): boolean {
  return submissionDate > targetDate;
}

// Validation utilities
export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username) {
    return { valid: false, error: 'Username is required' };
  }
  if (username.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' };
  }
  if (username.length > 20) {
    return { valid: false, error: 'Username must be less than 20 characters' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, error: 'Username can only contain letters, numbers, and underscores' };
  }
  return { valid: true };
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password) {
    return { valid: false, error: 'Password is required' };
  }
  if (password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters' };
  }
  if (password.length > 50) {
    return { valid: false, error: 'Password must be less than 50 characters' };
  }
  return { valid: true };
}

export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email) {
    return { valid: true }; // Email is optional
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }
  return { valid: true };
}

// Challenge utilities
export function calculateStreak(progressEntries: any[]): { current: number; longest: number } {
  if (!progressEntries.length) return { current: 0, longest: 0 };
  
  const sortedEntries = progressEntries
    .filter(entry => entry.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  if (!sortedEntries.length) return { current: 0, longest: 0 };
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let lastDate = new Date(sortedEntries[0].date);
  
  for (const entry of sortedEntries) {
    const entryDate = new Date(entry.date);
    const dayDiff = differenceInDays(lastDate, entryDate);
    
    if (dayDiff === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else if (dayDiff === 0) {
      // Same day, continue streak
    } else {
      tempStreak = 1;
    }
    
    lastDate = entryDate;
  }
  
  // Check if current streak is ongoing (most recent entry is today or yesterday)
  const mostRecent = new Date(sortedEntries[0].date);
  if (isToday(mostRecent) || isYesterday(mostRecent)) {
    currentStreak = tempStreak;
  }
  
  return { current: currentStreak, longest: longestStreak };
}

export function calculateCompletionRate(progressEntries: any[], totalDays: number): number {
  if (totalDays === 0) return 0;
  const completedDays = progressEntries.filter(entry => entry.completed).length;
  return Math.round((completedDays / totalDays) * 100);
}

// Analytics utilities
export function calculateRank(users: any[], currentUser: string): number {
  const sortedUsers = users.sort((a, b) => b.totalPoints - a.totalPoints);
  const userIndex = sortedUsers.findIndex(user => user.username === currentUser);
  return userIndex + 1;
}

export function getRankChange(currentRank: number, previousRank: number): number {
  if (previousRank === 0) return 0;
  return previousRank - currentRank; // Positive means moved up, negative means moved down
}

// UI utilities
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Color utilities for charts and UI
export function getColorForRank(rank: number): string {
  if (rank === 1) return '#FFD700'; // Gold
  if (rank === 2) return '#C0C0C0'; // Silver
  if (rank === 3) return '#CD7F32'; // Bronze
  return '#6B7280'; // Gray
}

export function getColorForCompletionRate(rate: number): string {
  if (rate >= 90) return '#22C55E'; // Green
  if (rate >= 70) return '#F59E0B'; // Yellow
  if (rate >= 50) return '#F97316'; // Orange
  return '#EF4444'; // Red
}

// Challenge type configurations
export const CHALLENGE_TYPES = {
  coding: {
    name: 'Coding',
    description: 'DSA problems, algorithm practice, project commits',
    icon: '💻',
    defaultTarget: 1,
    unit: 'problems',
    scoringOptions: 'binary' as const,
  },
  fitness: {
    name: 'Fitness',
    description: 'Daily workouts, steps, gym sessions, sports',
    icon: '🏃‍♂️',
    defaultTarget: 30,
    unit: 'minutes',
    scoringOptions: 'points' as const,
  },
  learning: {
    name: 'Learning',
    description: 'Pages read, courses completed, videos watched, study hours',
    icon: '📚',
    defaultTarget: 10,
    unit: 'pages',
    scoringOptions: 'points' as const,
  },
  habits: {
    name: 'Habits',
    description: 'Meditation, water intake, early wake-up, journaling',
    icon: '✨',
    defaultTarget: 1,
    unit: 'times',
    scoringOptions: 'binary' as const,
  },
  creative: {
    name: 'Creative',
    description: 'Daily writing, drawing, music practice, photography',
    icon: '🎨',
    defaultTarget: 1,
    unit: 'pieces',
    scoringOptions: 'binary' as const,
  },
  health: {
    name: 'Health',
    description: 'Sleep tracking, meal planning, medication adherence',
    icon: '🏥',
    defaultTarget: 8,
    unit: 'hours',
    scoringOptions: 'points' as const,
  },
  custom: {
    name: 'Custom',
    description: 'User-defined challenges with flexible parameters',
    icon: '🎯',
    defaultTarget: 1,
    unit: 'units',
    scoringOptions: 'binary' as const,
  },
};

// Duration options for room creation
export const DURATION_OPTIONS = [
  { value: 7, label: '7 days' },
  { value: 14, label: '14 days' },
  { value: 30, label: '30 days' },
  { value: 50, label: '50 days' },
  { value: 100, label: '100 days' },
  { value: 0, label: 'Custom' },
];

// Admin transfer rules
export const ADMIN_TRANSFER_RULES = [
  { value: 'manual', label: 'Manual Selection' },
  { value: 'activity', label: 'Most Active Participant' },
  { value: 'voting', label: 'Participant Voting' },
]; 