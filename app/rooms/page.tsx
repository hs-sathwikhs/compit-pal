'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Users, Calendar, Trophy, Lock, Globe } from 'lucide-react';
import { Room } from '@/types';

export default function RoomsPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const response = await fetch('/api/rooms/active');
      if (response.ok) {
        const data = await response.json();
        setRooms(data.rooms || []);
      }
    } catch (error) {
      console.error('Error loading rooms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 font-display">
            My Rooms
          </h1>
          <p className="text-secondary-600 mt-2">
            Manage your challenge rooms and track progress
          </p>
        </div>

        {/* Search and Create */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
          </div>
          <button
            onClick={() => router.push('/rooms/create')}
            className="btn btn-primary flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Room
          </button>
        </div>

        {/* Rooms Grid */}
        {filteredRooms.length === 0 ? (
          <div className="card text-center py-12">
            <Users className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              No rooms found
            </h3>
            <p className="text-secondary-600 mb-6">
              {searchTerm ? 'No rooms match your search.' : 'You haven\'t joined any rooms yet.'}
            </p>
            <button
              onClick={() => router.push('/rooms/create')}
              className="btn btn-primary"
            >
              Create Your First Room
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <div key={room.code} className="card hover:shadow-lg transition-shadow">
                {/* Room Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-secondary-900 mb-1">
                      {room.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {room.isPublic ? (
                        <Globe className="w-4 h-4 text-secondary-400" />
                      ) : (
                        <Lock className="w-4 h-4 text-secondary-400" />
                      )}
                      <span className="text-sm text-secondary-600">
                        {room.participants.length} participants
                      </span>
                    </div>
                  </div>
                  <span className={`badge ${
                    room.status === 'active' ? 'badge-success' : 'badge-warning'
                  }`}>
                    {room.status}
                  </span>
                </div>

                {/* Room Description */}
                <p className="text-sm text-secondary-600 mb-4 line-clamp-2">
                  {room.description}
                </p>

                {/* Room Stats */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-secondary-600">
                      <Trophy className="w-4 h-4 mr-2" />
                      {room.challengeType}
                    </div>
                    <div className="flex items-center text-secondary-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {room.duration} days
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary-600">
                      Completion: {Math.round(room.averageCompletionRate)}%
                    </span>
                    <span className="text-secondary-600">
                      {room.totalSubmissions} submissions
                    </span>
                  </div>
                </div>

                {/* Room Code */}
                <div className="bg-secondary-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-600">Room Code:</span>
                    <code className="text-sm font-mono bg-white px-2 py-1 rounded border">
                      {room.code}
                    </code>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => router.push(`/room/${room.code}`)}
                    className="btn btn-primary flex-1"
                  >
                    View Room
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(room.code);
                      // You could add a toast notification here
                    }}
                    className="btn btn-outline"
                    title="Copy room code"
                  >
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 