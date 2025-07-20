'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Plus, 
  Users, 
  Calendar, 
  Target, 
  BarChart3, 
  Trophy, 
  CheckCircle, 
  XCircle,
  User,
  Copy,
  Check,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Room, Progress } from '@/types';

export default function RoomPage({ params }: { params: { code: string } }) {
  const { code: roomCode } = params;
  const [room, setRoom] = useState<Room | null>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'leaderboard' | 'progress' | 'participants'>('overview');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const router = useRouter();

  const [submitData, setSubmitData] = useState({
    completed: false,
    points: 0,
    quantity: 0,
    notes: '',
    proofDescription: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadRoomData();
  }, [roomCode]);

  const loadRoomData = async () => {
    try {
      console.log('Loading room data for code:', roomCode);
      
      const [roomResponse, leaderboardResponse, progressResponse] = await Promise.all([
        fetch(`/api/rooms/${roomCode}`),
        fetch(`/api/rooms/${roomCode}/leaderboard`),
        fetch(`/api/progress/${roomCode}`)
      ]);

      console.log('Room response status:', roomResponse.status);
      
      if (roomResponse.ok) {
        const roomData = await roomResponse.json();
        console.log('Room data received:', roomData);
        setRoom(roomData.data);
      } else {
        const errorData = await roomResponse.json();
        console.error('Room not found error:', errorData);
      }

      if (leaderboardResponse.ok) {
        const leaderboardData = await leaderboardResponse.json();
        setLeaderboard(leaderboardData.data || []);
      }

      if (progressResponse.ok) {
        const progressData = await progressResponse.json();
        setProgress(progressData.data || []);
      }
    } catch (error) {
      console.error('Error loading room data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/progress/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...submitData,
          roomCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowSubmitModal(false);
        setSubmitData({
          completed: false,
          points: 0,
          quantity: 0,
          notes: '',
          proofDescription: '',
          date: new Date().toISOString().split('T')[0],
        });
        loadRoomData(); // Refresh data
      } else {
        alert(data.error || 'Failed to submit progress');
      }
    } catch (error) {
      console.error('Error submitting progress:', error);
      alert('Failed to submit progress');
    }
  };

  const copyRoomCode = async () => {
    if (room) {
      await navigator.clipboard.writeText(room.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
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
          <p className="text-secondary-600 font-medium">Loading room...</p>
        </motion.div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <XCircle className="w-20 h-20 text-secondary-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-secondary-900 mb-3">Room Not Found</h2>
          <p className="text-secondary-600 mb-6">The room you're looking for doesn't exist.</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/home')} 
            className="btn btn-primary"
          >
            Go Home
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'participants', label: 'Participants', icon: Users },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'progress', label: 'Progress', icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <motion.button
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="flex items-center text-secondary-600 hover:text-secondary-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </motion.button>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl font-bold text-secondary-900 font-display mb-3"
              >
                {room.name}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-secondary-600"
              >
                {room.description}
              </motion.p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSubmitModal(true)}
              className="btn btn-primary flex items-center ml-6 shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              Submit Progress
            </motion.button>
          </div>
        </motion.div>

        {/* Room Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <motion.div 
            whileHover={{ y: -5, scale: 1.02 }}
            className="card text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:border-blue-300 transition-all"
          >
            <Users className="w-10 h-10 text-blue-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-blue-900">{room.participants.length}</div>
            <div className="text-sm text-blue-700 font-medium">Participants</div>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5, scale: 1.02 }}
            className="card text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:border-green-300 transition-all"
          >
            <Calendar className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-green-900">{room.duration}</div>
            <div className="text-sm text-green-700 font-medium">Days</div>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5, scale: 1.02 }}
            className="card text-center bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:border-orange-300 transition-all"
          >
            <Target className="w-10 h-10 text-orange-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-orange-900">{room.dailyTarget}</div>
            <div className="text-sm text-orange-700 font-medium">Daily Target</div>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5, scale: 1.02 }}
            className="card text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:border-purple-300 transition-all"
          >
            <BarChart3 className="w-10 h-10 text-purple-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-purple-900">{Math.round(room.averageCompletionRate)}%</div>
            <div className="text-sm text-purple-700 font-medium">Completion Rate</div>
          </motion.div>
        </motion.div>

        {/* Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex space-x-2 bg-white/80 backdrop-blur-sm p-2 rounded-2xl shadow-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                      : 'text-secondary-600 hover:text-secondary-800 hover:bg-white/50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="card bg-white/90 backdrop-blur-sm shadow-xl"
          >
            {activeTab === 'overview' && (
              <div className="space-y-8 p-6">
                <h2 className="text-2xl font-bold text-secondary-900">Room Overview</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-semibold text-secondary-900 flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-primary-600" />
                      Challenge Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-secondary-50 rounded-lg">
                        <span className="text-secondary-600 font-medium">Type:</span>
                        <span className="font-semibold text-secondary-900">{room.challengeType}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-secondary-50 rounded-lg">
                        <span className="text-secondary-600 font-medium">Scoring:</span>
                        <span className="font-semibold text-secondary-900 capitalize">{room.scoringType}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-secondary-50 rounded-lg">
                        <span className="text-secondary-600 font-medium">Proof Required:</span>
                        <span className={`font-semibold ${room.requireProof ? 'text-green-600' : 'text-secondary-600'}`}>
                          {room.requireProof ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-secondary-50 rounded-lg">
                        <span className="text-secondary-600 font-medium">Late Submissions:</span>
                        <span className={`font-semibold ${room.allowLateSubmissions ? 'text-green-600' : 'text-red-600'}`}>
                          {room.allowLateSubmissions ? 'Allowed' : 'Not Allowed'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-semibold text-secondary-900 flex items-center">
                      <Copy className="w-5 h-5 mr-2 text-primary-600" />
                      Room Code
                    </h3>
                    <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-primary-700 font-medium">Share this code:</span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={copyRoomCode}
                          className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-primary-200 hover:border-primary-300 transition-colors"
                        >
                          <code className="text-lg font-mono text-primary-900 font-bold">
                            {room.code}
                          </code>
                          {copiedCode ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-primary-600" />
                          )}
                        </motion.button>
                      </div>
                      {copiedCode && (
                        <motion.p 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-green-600 mt-2 text-center"
                        >
                          Code copied to clipboard!
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            )}

            {activeTab === 'participants' && (
              <div className="p-6">
                <h2 className="text-2xl font-bold text-secondary-900 mb-6">Participants</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {room.participants.map((participant, index) => (
                    <motion.div
                      key={participant}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-xl p-4 border border-secondary-200 hover:border-secondary-300 transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                          {participant.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-secondary-900">{participant}</div>
                          <div className="text-sm text-secondary-600">
                            {participant === room.createdBy ? 'Creator' : 'Participant'}
                          </div>
                        </div>
                        {participant === room.currentAdmin && (
                          <Star className="w-5 h-5 text-yellow-500" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'leaderboard' && (
              <div className="p-6">
                <h2 className="text-2xl font-bold text-secondary-900 mb-6">Leaderboard</h2>
                
                {leaderboard.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <Trophy className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
                    <p className="text-secondary-600 text-lg">No leaderboard data available yet.</p>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {leaderboard.map((user, index) => (
                      <motion.div
                        key={user.username}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ x: 10, scale: 1.02 }}
                        className="flex items-center justify-between p-6 bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-xl border border-secondary-200 hover:border-secondary-300 transition-all"
                      >
                        <div className="flex items-center">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mr-4 ${
                            index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' :
                            index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' :
                            index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                            'bg-gradient-to-br from-primary-500 to-primary-600 text-white'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-bold text-lg text-secondary-900">{user.username}</div>
                            <div className="text-sm text-secondary-600">
                              {user.completionRate}% completion rate
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-2xl text-secondary-900">{user.totalPoints} pts</div>
                          <div className="text-sm text-secondary-600">
                            {user.currentStreak} day streak
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'progress' && (
              <div className="p-6">
                <h2 className="text-2xl font-bold text-secondary-900 mb-6">Recent Progress</h2>
                
                {progress.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <CheckCircle className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
                    <p className="text-secondary-600 text-lg">No progress submissions yet.</p>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {progress.slice(0, 10).map((entry, index) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -2, scale: 1.01 }}
                        className="flex items-center justify-between p-6 bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-xl border border-secondary-200 hover:border-secondary-300 transition-all"
                      >
                        <div className="flex-1">
                          <div className="font-bold text-lg text-secondary-900">{entry.username}</div>
                          <div className="text-sm text-secondary-600">
                            {new Date(entry.date).toLocaleDateString()}
                          </div>
                          {entry.notes && (
                            <div className="text-sm text-secondary-600 mt-2 italic">"{entry.notes}"</div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className={`font-bold text-xl ${entry.completed ? 'text-green-600' : 'text-red-600'}`}>
                            {entry.completed ? '✓ Completed' : '✗ Incomplete'}
                          </div>
                          <div className="text-lg font-semibold text-secondary-900">{entry.points} pts</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Submit Progress Modal */}
      <AnimatePresence>
        {showSubmitModal && (
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
              <h3 className="text-2xl font-bold text-secondary-900 mb-6">
                Submit Progress
              </h3>
              
              <form onSubmit={handleSubmitProgress} className="space-y-6">
                <div>
                  <label className="form-label font-medium">Date</label>
                  <input
                    type="date"
                    value={submitData.date}
                    onChange={(e) => setSubmitData({ ...submitData, date: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-secondary-50 rounded-lg">
                  <input
                    type="checkbox"
                    checked={submitData.completed}
                    onChange={(e) => setSubmitData({ ...submitData, completed: e.target.checked })}
                    className="w-5 h-5 text-primary-600"
                  />
                  <span className="text-secondary-700 font-medium">Completed today's challenge</span>
                </div>
                
                {room.scoringType === 'points' && (
                  <div>
                    <label className="form-label font-medium">Points Earned</label>
                    <input
                      type="number"
                      value={submitData.points}
                      onChange={(e) => setSubmitData({ ...submitData, points: parseInt(e.target.value) || 0 })}
                      className="form-input"
                      min="0"
                    />
                  </div>
                )}
                
                <div>
                  <label className="form-label font-medium">Notes (Optional)</label>
                  <textarea
                    value={submitData.notes}
                    onChange={(e) => setSubmitData({ ...submitData, notes: e.target.value })}
                    className="form-input"
                    rows={3}
                    placeholder="How did it go today?"
                  />
                </div>
                
                {room.requireProof && (
                  <div>
                    <label className="form-label font-medium">Proof Description</label>
                    <textarea
                      value={submitData.proofDescription}
                      onChange={(e) => setSubmitData({ ...submitData, proofDescription: e.target.value })}
                      className="form-input"
                      rows={3}
                      placeholder="Describe your proof of completion"
                      required
                    />
                  </div>
                )}
                
                <div className="flex space-x-4 pt-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSubmitModal(false)}
                    className="btn btn-outline flex-1"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-primary flex-1"
                  >
                    Submit
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 