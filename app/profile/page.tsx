'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Edit,
  Save,
  X,
  Trophy,
  Target,
  Calendar,
  TrendingUp,
  LogOut
} from 'lucide-react';
import { Room } from '@/types';
import Logo from '../components/Logo';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [activeRooms, setActiveRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    email: '',
    reminderTime: '20:00',
    timezone: 'UTC',
    emailNotifications: true
  });
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    loadData();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        router.push('/');
        return;
      }
      const data = await response.json();
      setUser(data.data);
      setEditData({
        email: data.data.email || '',
        reminderTime: data.data.settings?.reminderTime || '20:00',
        timezone: data.data.settings?.timezone || 'UTC',
        emailNotifications: data.data.settings?.emailNotifications || true
      });
    } catch (error) {
      router.push('/');
    }
  };

  const loadData = async () => {
    try {
      const [activeResponse] = await Promise.all([
        fetch('/api/rooms/active')
      ]);

      if (activeResponse.ok) {
        const activeData = await activeResponse.json();
        setActiveRooms(activeData.data || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      });

      if (response.ok) {
        setIsEditing(false);
        // Refresh user data
        checkAuth();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Challenges',
      value: user?.totalChallenges || 0,
      icon: Target,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Completed',
      value: user?.completedChallenges || 0,
      icon: Trophy,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Current Streak',
      value: user?.totalStreak || 0,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Active Rooms',
      value: activeRooms.length,
      icon: Calendar,
      color: 'from-yellow-500 to-yellow-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-secondary-600 hover:text-secondary-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 font-display">
                Profile
              </h1>
              <p className="text-secondary-600 mt-2">
                Manage your account and preferences
              </p>
            </div>
            <Logo />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                  </div>
                  <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-xl`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card bg-white/90 backdrop-blur-sm shadow-xl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-secondary-900 flex items-center">
                  <User className="w-5 h-5 mr-2 text-primary-600" />
                  Profile Information
                </h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center text-primary-600 hover:text-primary-800"
                >
                  {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={user?.username || ''}
                    disabled
                    className="form-input bg-secondary-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    disabled={!isEditing}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Join Date
                  </label>
                  <input
                    type="text"
                    value={user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : ''}
                    disabled
                    className="form-input bg-secondary-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Last Login
                  </label>
                  <input
                    type="text"
                    value={user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : ''}
                    disabled
                    className="form-input bg-secondary-50"
                  />
                </div>

                {isEditing && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={handleSaveProfile}
                    className="btn btn-primary w-full"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Settings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card bg-white/90 backdrop-blur-sm shadow-xl"
          >
            <div className="p-6">
              <h3 className="text-xl font-bold text-secondary-900 mb-6 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-primary-600" />
                Settings
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Reminder Time
                  </label>
                  <select
                    value={editData.reminderTime}
                    onChange={(e) => setEditData({ ...editData, reminderTime: e.target.value })}
                    className="form-input"
                  >
                    <option value="06:00">6:00 AM</option>
                    <option value="08:00">8:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="18:00">6:00 PM</option>
                    <option value="20:00">8:00 PM</option>
                    <option value="22:00">10:00 PM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={editData.timezone}
                    onChange={(e) => setEditData({ ...editData, timezone: e.target.value })}
                    className="form-input"
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Time</option>
                    <option value="PST">Pacific Time</option>
                    <option value="CET">Central European Time</option>
                    <option value="IST">Indian Standard Time</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-secondary-700">
                      Email Notifications
                    </label>
                    <p className="text-xs text-secondary-600">
                      Receive daily reminders and updates
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editData.emailNotifications}
                      onChange={(e) => setEditData({ ...editData, emailNotifications: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="pt-4 border-t border-secondary-200">
                  <button
                    onClick={handleLogout}
                    className="btn btn-secondary w-full"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Active Rooms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-white/90 backdrop-blur-sm shadow-xl mt-8"
        >
          <div className="p-6">
            <h3 className="text-xl font-bold text-secondary-900 mb-6 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary-600" />
              Active Rooms
            </h3>

            {activeRooms.length === 0 ? (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                <p className="text-secondary-600">No active rooms yet</p>
                <button
                  onClick={() => router.push('/rooms/create')}
                  className="btn btn-primary mt-4"
                >
                  Create Your First Room
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeRooms.map((room, index) => (
                  <motion.div
                    key={room.code}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-secondary-50 rounded-lg cursor-pointer hover:bg-secondary-100 transition-colors"
                    onClick={() => router.push(`/room/${room.code}`)}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="bg-primary-100 p-2 rounded-lg">
                        <span className="text-lg">{getChallengeIcon(room.challengeType)}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-secondary-900">{room.name}</h4>
                        <p className="text-sm text-secondary-600 capitalize">{room.challengeType}</p>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary-600">{room.participants.length} participants</span>
                      <span className="text-primary-600 font-medium">
                        {Math.round(room.averageCompletionRate)}% completion
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function getChallengeIcon(type: string): string {
  const icons: Record<string, string> = {
    fitness: '💪',
    coding: '💻',
    learning: '📚',
    habits: '⭐',
    creative: '🎨',
    health: '🏥',
    custom: '🎯'
  };
  return icons[type] || '🎯';
} 