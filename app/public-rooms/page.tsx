'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Users, Calendar, Trophy, TrendingUp, Eye } from 'lucide-react';
import { Room } from '@/types';

export default function PublicRoomsPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    loadPublicRooms();
  }, []);

  const loadPublicRooms = async () => {
    try {
      const response = await fetch('/api/rooms/public');
      if (response.ok) {
        const data = await response.json();
        setRooms(data.rooms || []);
      }
    } catch (error) {
      console.error('Error loading public rooms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const challengeTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'coding', label: 'Coding' },
    { value: 'learning', label: 'Learning' },
    { value: 'habits', label: 'Habits' },
    { value: 'creative', label: 'Creative' },
    { value: 'health', label: 'Health' },
    { value: 'custom', label: 'Custom' },
  ];

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || room.challengeType === filterType;
    return matchesSearch && matchesType;
  });

  const handleJoinRoom = async (roomCode: string) => {
    try {
      const response = await fetch('/api/rooms/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomCode }),
      });

      if (response.ok) {
        router.push(`/room/${roomCode}`);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to join room');
      }
    } catch (error) {
      console.error('Error joining room:', error);
      alert('Failed to join room');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading public rooms...</p>
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
            Discover Public Rooms
          </h1>
          <p className="text-secondary-600 mt-2">
            Join exciting challenges from the community
          </p>
        </div>

        {/* Search and Filters */}
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
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="form-input md:w-48"
          >
            {challengeTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Rooms Grid */}
        {filteredRooms.length === 0 ? (
          <div className="card text-center py-12">
            <Users className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              No public rooms found
            </h3>
            <p className="text-secondary-600 mb-6">
              {searchTerm || filterType !== 'all' 
                ? 'No rooms match your search criteria.' 
                : 'No public rooms are available at the moment.'}
            </p>
            <button
              onClick={() => router.push('/rooms/create')}
              className="btn btn-primary"
            >
              Create a Public Room
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
                    <p className="text-sm text-secondary-600">
                      Created by {room.createdBy}
                    </p>
                  </div>
                  <span className="badge badge-primary">Public</span>
                </div>

                {/* Room Description */}
                <p className="text-sm text-secondary-600 mb-4 line-clamp-2">
                  {room.description}
                </p>

                {/* Room Stats */}
                <div className="space-y-3 mb-4">
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
                    <div className="flex items-center text-secondary-600">
                      <Users className="w-4 h-4 mr-2" />
                      {room.participants.length}/{room.maxParticipants}
                    </div>
                    <div className="flex items-center text-secondary-600">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      {Math.round(room.averageCompletionRate)}% completion
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary-600">
                      {room.totalSubmissions} submissions
                    </span>
                    <span className="text-secondary-600">
                      {room.scoringType === 'binary' ? 'Binary' : 'Points'} scoring
                    </span>
                  </div>
                </div>

                {/* Challenge Details */}
                <div className="bg-secondary-50 rounded-lg p-3 mb-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Daily Target:</span>
                      <span className="font-medium">{room.dailyTarget}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Proof Required:</span>
                      <span className="font-medium">{room.requireProof ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Late Submissions:</span>
                      <span className="font-medium">{room.allowLateSubmissions ? 'Allowed' : 'Not Allowed'}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => router.push(`/room/${room.code}`)}
                    className="btn btn-outline flex-1"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </button>
                  <button
                    onClick={() => handleJoinRoom(room.code)}
                    className="btn btn-primary flex-1"
                    disabled={room.participants.length >= room.maxParticipants}
                  >
                    {room.participants.length >= room.maxParticipants ? 'Full' : 'Join Room'}
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