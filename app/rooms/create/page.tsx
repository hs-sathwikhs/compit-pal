'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, Calendar, Target, Trophy, Lock, Globe } from 'lucide-react';
import { ChallengeType } from '@/types';

export default function CreateRoomPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 30,
    challengeType: 'fitness' as ChallengeType,
    scoringType: 'binary' as 'binary' | 'points',
    dailyTarget: 1,
    requireProof: false,
    allowLateSubmissions: true,
    penalizeLateSubmissions: false,
    hasAdmin: false,
    isPublic: true,
    maxParticipants: 10,
    adminTransferRules: 'activity' as 'manual' | 'activity' | 'voting',
  });

  const challengeTypes = [
    { value: 'fitness', label: 'Fitness', icon: '💪' },
    { value: 'coding', label: 'Coding', icon: '💻' },
    { value: 'learning', label: 'Learning', icon: '📚' },
    { value: 'habits', label: 'Habits', icon: '⭐' },
    { value: 'creative', label: 'Creative', icon: '🎨' },
    { value: 'health', label: 'Health', icon: '🏥' },
    { value: 'custom', label: 'Custom', icon: '🎯' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Submitting room data:', formData);
      
      const response = await fetch('/api/rooms/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Response:', data);

      if (response.ok) {
        // The API returns both room object and roomCode
        const roomCode = data.data.roomCode || data.data.room?.code;
        if (roomCode) {
          router.push(`/room/${roomCode}`);
        } else {
          console.error('No room code in response:', data);
          alert('Room created but no room code received');
        }
      } else {
        alert(data.error || 'Failed to create room');
      }
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Failed to create room. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-secondary-900 font-display">
            Create Challenge Room
          </h1>
          <p className="text-secondary-600 mt-2">
            Set up a new competitive challenge for your friends and community
          </p>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="card">
              <h2 className="card-title mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="form-label">
                    Room Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter room name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="form-input"
                    rows={3}
                    placeholder="Describe your challenge"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="duration" className="form-label">
                      Duration (days)
                    </label>
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="form-input"
                      min="1"
                      max="365"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="maxParticipants" className="form-label">
                      Max Participants
                    </label>
                    <input
                      type="number"
                      id="maxParticipants"
                      name="maxParticipants"
                      value={formData.maxParticipants}
                      onChange={handleInputChange}
                      className="form-input"
                      min="2"
                      max="50"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Challenge Type */}
            <div className="card">
              <h2 className="card-title mb-4">Challenge Type</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {challengeTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`relative cursor-pointer rounded-lg border-2 p-4 text-center transition-all hover:shadow-md ${
                      formData.challengeType === type.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-secondary-200 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="challengeType"
                      value={type.value}
                      checked={formData.challengeType === type.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="text-sm font-medium text-secondary-900">
                      {type.label}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Challenge Settings */}
            <div className="card">
              <h2 className="card-title mb-4">Challenge Settings</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="scoringType" className="form-label">
                      Scoring Type
                    </label>
                    <select
                      id="scoringType"
                      name="scoringType"
                      value={formData.scoringType}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      <option value="binary">Binary (Completed/Not)</option>
                      <option value="points">Points Based</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="dailyTarget" className="form-label">
                      Daily Target
                    </label>
                    <input
                      type="number"
                      id="dailyTarget"
                      name="dailyTarget"
                      value={formData.dailyTarget}
                      onChange={handleInputChange}
                      className="form-input"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="requireProof"
                      checked={formData.requireProof}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <span className="text-sm text-secondary-700">
                      Require proof of completion
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="allowLateSubmissions"
                      checked={formData.allowLateSubmissions}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <span className="text-sm text-secondary-700">
                      Allow late submissions
                    </span>
                  </label>

                  {formData.allowLateSubmissions && (
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="penalizeLateSubmissions"
                        checked={formData.penalizeLateSubmissions}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <span className="text-sm text-secondary-700">
                        Penalize late submissions
                      </span>
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Room Settings */}
            <div className="card">
              <h2 className="card-title mb-4">Room Settings</h2>
              
              <div className="space-y-4">
                              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isPublic"
                    value="true"
                    checked={formData.isPublic === true}
                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.value === 'true' })}
                    className="mr-2"
                  />
                  <Globe className="w-4 h-4 mr-2 text-secondary-600" />
                  <span className="text-sm text-secondary-700">Public Room</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isPublic"
                    value="false"
                    checked={formData.isPublic === false}
                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.value === 'true' })}
                    className="mr-2"
                  />
                  <Lock className="w-4 h-4 mr-2 text-secondary-600" />
                  <span className="text-sm text-secondary-700">Private Room</span>
                </label>
              </div>

                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="hasAdmin"
                      checked={formData.hasAdmin}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <span className="text-sm text-secondary-700">
                      Enable admin system
                    </span>
                  </label>

                  {formData.hasAdmin && (
                    <div>
                      <label htmlFor="adminTransferRules" className="form-label">
                        Admin Transfer Rules
                      </label>
                      <select
                        id="adminTransferRules"
                        name="adminTransferRules"
                        value={formData.adminTransferRules}
                        onChange={handleInputChange}
                        className="form-input"
                      >
                        <option value="activity">Most Active Member</option>
                        <option value="voting">Voting System</option>
                        <option value="manual">Manual Selection</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary"
              >
                {isLoading ? 'Creating...' : 'Create Room'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 