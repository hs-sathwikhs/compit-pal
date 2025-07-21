'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Users, 
  Search, 
  Trophy, 
  Calendar, 
  TrendingUp,
  Settings,
  LogOut,
  User,
  Bell,
  Sparkles,
  Target,
  BarChart3,
  Copy,
  Check
} from 'lucide-react';
import { Room } from '@/types';
import Logo from '../components/Logo';
import LoadingSpinner from '../components/LoadingSpinner';

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [activeRooms, setActiveRooms] = useState<Room[]>([]);
  const [publicRooms, setPublicRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
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
    } catch (error) {
      router.push('/');
    }
  };

  const loadData = async () => {
    try {
      const [activeResponse, publicResponse] = await Promise.all([
        fetch('/api/rooms/active'),
        fetch('/api/rooms/public')
      ]);

      if (activeResponse.ok) {
        const activeData = await activeResponse.json();
        setActiveRooms(activeData.data || []);
      }

      if (publicResponse.ok) {
        const publicData = await publicResponse.json();
        setPublicRooms(publicData.data || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        toast.success('Logged out successfully');
        router.push('/');
      }
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) {
      toast.error('Please enter a room code');
      return;
    }

    try {
      const response = await fetch('/api/rooms/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode: roomCode.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Successfully joined room!');
        setShowJoinModal(false);
        setRoomCode('');
        loadData(); // Refresh rooms
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Error joining room');
    }
  };

  const copyRoomCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('Room code copied!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4"
          />
          <p className="text-secondary-600 font-medium">Loading Compit Pal...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-secondary-200 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />
            
            <div className="flex items-center space-x-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/analytics')}
                className="p-2 text-secondary-400 hover:text-secondary-600 transition-colors"
                title="Analytics"
              >
                <BarChart3 className="w-5 h-5" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/public-rooms')}
                className="p-2 text-secondary-400 hover:text-secondary-600 transition-colors"
                title="Public Rooms"
              >
                <Users className="w-5 h-5" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-secondary-400 hover:text-secondary-600 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
              </motion.button>
              <div className="relative group">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2 text-secondary-700 hover:text-secondary-900 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">{user?.username}</span>
                </motion.button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-secondary-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <button
                      onClick={() => router.push('/profile')}
                      className="w-full px-4 py-2 text-left text-secondary-700 hover:bg-secondary-50 flex items-center"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </button>
                    <button
                      onClick={() => router.push('/analytics')}
                      className="w-full px-4 py-2 text-left text-secondary-700 hover:bg-secondary-50 flex items-center"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analytics
                    </button>
                    <button
                      onClick={() => router.push('/public-rooms')}
                      className="w-full px-4 py-2 text-left text-secondary-700 hover:bg-secondary-50 flex items-center"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Public Rooms
                    </button>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Primary Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold text-secondary-900 mb-4 font-display"
          >
            Ready to compete?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-secondary-600 mb-8 font-display"
          >
            Create a new challenge room or join an existing one
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/rooms/create')}
              className="btn btn-primary text-lg px-8 py-4 flex items-center justify-center space-x-2 font-display shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-6 h-6" />
              <span>Create Room</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowJoinModal(true)}
              className="btn btn-accent text-lg px-8 py-4 flex items-center justify-center space-x-2 font-display shadow-lg hover:shadow-xl transition-all"
            >
              <Users className="w-6 h-6" />
              <span>Join Room</span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Active Rooms */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-3xl font-bold text-secondary-900 font-display flex items-center">
              <Sparkles className="w-8 h-8 text-primary-600 mr-3" />
              My Active Rooms
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/rooms')}
              className="text-primary-600 hover:text-primary-700 font-medium font-display transition-colors"
            >
              View All
            </motion.button>
          </div>
          
          {activeRooms.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card text-center py-16 bg-gradient-to-br from-secondary-50 to-secondary-100 border-secondary-200"
            >
              <Users className="w-16 h-16 text-secondary-400 mx-auto mb-6" />
              <h4 className="text-2xl font-bold text-secondary-900 mb-3">No active rooms</h4>
              <p className="text-secondary-600 mb-6 text-lg">
                Create or join a room to get started with your challenges
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/rooms/create')}
                className="btn btn-primary text-lg px-6 py-3"
              >
                Create Your First Room
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeRooms.slice(0, 6).map((room, index) => (
                <motion.div
                  key={room.code}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="card hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-secondary-50 border-secondary-200 hover:border-primary-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-secondary-900 mb-2">{room.name}</h4>
                      <div className="flex items-center space-x-2 text-sm text-secondary-600">
                        <Users className="w-4 h-4" />
                        <span>{room.participants.length} participants</span>
                      </div>
                    </div>
                    <motion.span 
                      whileHover={{ scale: 1.1 }}
                      className={`badge ${
                        room.status === 'active' ? 'badge-success' : 'badge-warning'
                      }`}
                    >
                      {room.status}
                    </motion.span>
                  </div>
                  
                  <p className="text-sm text-secondary-600 mb-4 line-clamp-2">
                    {room.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-primary-500" />
                      <span className="text-sm text-secondary-600 font-medium">
                        {room.challengeType}
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => copyRoomCode(room.code)}
                      className="text-xs bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full hover:bg-secondary-200 transition-colors font-mono"
                    >
                      {copiedCode === room.code ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        room.code
                      )}
                    </motion.button>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push(`/room/${room.code}`)}
                    className="btn btn-primary w-full"
                  >
                    View Room
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Public Rooms */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-3xl font-bold text-secondary-900 font-display flex items-center">
              <Search className="w-8 h-8 text-accent-600 mr-3" />
              Discover Public Rooms
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/public-rooms')}
              className="text-accent-600 hover:text-accent-700 font-medium font-display transition-colors"
            >
              Browse All
            </motion.button>
          </div>
          
          {publicRooms.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card text-center py-16 bg-gradient-to-br from-accent-50 to-accent-100 border-accent-200"
            >
              <Search className="w-16 h-16 text-accent-400 mx-auto mb-6" />
              <h4 className="text-2xl font-bold text-secondary-900 mb-3">No public rooms available</h4>
              <p className="text-secondary-600 text-lg">
                Check back later for new public challenges
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicRooms.slice(0, 3).map((room, index) => (
                <motion.div
                  key={room.code}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="card hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-accent-50 border-accent-200 hover:border-accent-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-secondary-900 mb-2">{room.name}</h4>
                      <div className="flex items-center space-x-2 text-sm text-secondary-600">
                        <Users className="w-4 h-4" />
                        <span>{room.participants.length}/{room.maxParticipants} participants</span>
                      </div>
                    </div>
                    <motion.span 
                      whileHover={{ scale: 1.1 }}
                      className="badge badge-accent"
                    >
                      Public
                    </motion.span>
                  </div>
                  
                  <p className="text-sm text-secondary-600 mb-4 line-clamp-2">
                    {room.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-secondary-400" />
                      <span className="text-sm text-secondary-600">
                        {room.duration} days
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-success-500" />
                      <span className="text-sm text-secondary-600">
                        {Math.round(room.averageCompletionRate)}% completion
                      </span>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push(`/room/${room.code}`)}
                    className="btn btn-outline w-full"
                  >
                    View Details
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Join Room Modal */}
      <AnimatePresence>
        {showJoinModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center">
                <Users className="w-6 h-6 mr-3 text-primary-600" />
                Join a Room
              </h3>
              
              <div className="mb-6">
                <label htmlFor="roomCode" className="form-label font-medium">
                  Room Code
                </label>
                <input
                  type="text"
                  id="roomCode"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  className="form-input text-center text-xl font-mono text-secondary-900 border-2 focus:border-primary-500"
                  placeholder="Enter room code"
                  maxLength={6}
                  autoFocus
                />
              </div>
              
              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowJoinModal(false)}
                  className="btn btn-outline flex-1"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleJoinRoom}
                  className="btn btn-primary flex-1"
                >
                  Join Room
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 