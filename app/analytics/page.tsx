'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  TrendingUp, 
  Target, 
  Trophy, 
  Calendar, 
  BarChart3,
  Users,
  Award,
  Activity,
  Clock,
  Star,
  Zap
} from 'lucide-react';
import { Room, UserAnalytics } from '@/types';
import Logo from '../components/Logo';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AnalyticsPage() {
  const [user, setUser] = useState<any>(null);
  const [activeRooms, setActiveRooms] = useState<Room[]>([]);
  const [analytics, setAnalytics] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<string>('all');
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    loadAnalytics();
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
    } catch (error) {
      router.push('/');
    }
  };

  const loadAnalytics = async () => {
    try {
      const [activeResponse] = await Promise.all([
        fetch('/api/rooms/active')
      ]);

      if (activeResponse.ok) {
        const activeData = await activeResponse.json();
        setActiveRooms(activeData.data || []);
        
        // Calculate analytics
        const analyticsData = calculateAnalytics(activeData.data || []);
        setAnalytics(analyticsData);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAnalytics = (rooms: Room[]) => {
    const totalRooms = rooms.length;
    const activeChallenges = rooms.filter(r => r.status === 'active').length;
    const totalParticipants = rooms.reduce((sum, room) => sum + room.participants.length, 0);
    const averageCompletionRate = rooms.length > 0 
      ? rooms.reduce((sum, room) => sum + room.averageCompletionRate, 0) / rooms.length 
      : 0;

    return {
      totalRooms,
      activeChallenges,
      totalParticipants,
      averageCompletionRate,
      challengeTypes: rooms.reduce((acc, room) => {
        acc[room.challengeType] = (acc[room.challengeType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
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
      title: 'Total Rooms',
      value: analytics.totalRooms,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      change: '+12%'
    },
    {
      title: 'Active Challenges',
      value: analytics.activeChallenges,
      icon: Target,
      color: 'from-green-500 to-green-600',
      change: '+5%'
    },
    {
      title: 'Total Participants',
      value: analytics.totalParticipants,
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      change: '+8%'
    },
    {
      title: 'Avg. Completion',
      value: `${Math.round(analytics.averageCompletionRate)}%`,
      icon: TrendingUp,
      color: 'from-yellow-500 to-yellow-600',
      change: '+3%'
    }
  ];

  const challengeTypeStats = Object.entries(analytics.challengeTypes || {}).map(([type, count]) => ({
    type,
    count: count as number,
    icon: getChallengeIcon(type),
    color: getChallengeColor(type)
  }));

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
                Analytics Dashboard
              </h1>
              <p className="text-secondary-600 mt-2">
                Track your performance and challenge insights
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
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.change}
                    </p>
                  </div>
                  <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-xl`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Challenge Types Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card bg-white/90 backdrop-blur-sm shadow-xl"
          >
            <div className="p-6">
              <h3 className="text-xl font-bold text-secondary-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-primary-600" />
                Challenge Types
              </h3>
              <div className="space-y-4">
                {challengeTypeStats.map((stat, index) => (
                  <motion.div
                    key={stat.type}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`bg-gradient-to-r ${stat.color} p-2 rounded-lg`}>
                        <span className="text-lg">{String(stat.icon)}</span>
                      </div>
                      <span className="font-medium text-secondary-900 capitalize">
                        {stat.type}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-secondary-900">
                      {stat.count}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card bg-white/90 backdrop-blur-sm shadow-xl"
          >
            <div className="p-6">
              <h3 className="text-xl font-bold text-secondary-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-primary-600" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {activeRooms.slice(0, 5).map((room, index) => (
                  <motion.div
                    key={room.code}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg cursor-pointer hover:bg-secondary-100 transition-colors"
                    onClick={() => router.push(`/room/${room.code}`)}
                  >
                    <div className="bg-primary-100 p-2 rounded-lg">
                      <span className="text-lg">{getChallengeIcon(room.challengeType)}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-secondary-900">{room.name}</p>
                      <p className="text-sm text-secondary-600">
                        {room.participants.length} participants
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-secondary-900">
                        {Math.round(room.averageCompletionRate)}%
                      </p>
                      <p className="text-xs text-secondary-600">completion</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Performance Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-white/90 backdrop-blur-sm shadow-xl"
        >
          <div className="p-6">
            <h3 className="text-xl font-bold text-secondary-900 mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-primary-600" />
              Performance Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <Star className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-bold text-blue-900">Best Performing</h4>
                <p className="text-blue-700">Fitness Challenges</p>
                <p className="text-2xl font-bold text-blue-900">87%</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-bold text-green-900">Most Active</h4>
                <p className="text-green-700">Learning Rooms</p>
                <p className="text-2xl font-bold text-green-900">12</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-bold text-purple-900">Top Achievement</h4>
                <p className="text-purple-700">30-Day Streak</p>
                <p className="text-2xl font-bold text-purple-900">3x</p>
              </div>
            </div>
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

function getChallengeColor(type: string): string {
  const colors: Record<string, string> = {
    fitness: 'from-green-500 to-green-600',
    coding: 'from-blue-500 to-blue-600',
    learning: 'from-purple-500 to-purple-600',
    habits: 'from-yellow-500 to-yellow-600',
    creative: 'from-pink-500 to-pink-600',
    health: 'from-red-500 to-red-600',
    custom: 'from-gray-500 to-gray-600'
  };
  return colors[type] || 'from-gray-500 to-gray-600';
} 