'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Users, Trophy, TrendingUp, Target, Sparkles, ArrowRight } from 'lucide-react';
import Logo from '@/components/Logo';

export default function LandingPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        router.push('/home');
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Users,
      title: 'Join Challenges',
      description: 'Create or join rooms with unique codes',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Target,
      title: 'Track Progress',
      description: 'Submit daily progress and build streaks',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Trophy,
      title: 'Compete & Win',
      description: 'Climb leaderboards and earn achievements',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      icon: TrendingUp,
      title: 'Analytics',
      description: 'Detailed insights and performance tracking',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Left side - Hero section */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 text-white p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              rotate: -360,
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              duration: 25, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-md mx-auto lg:mx-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-4 mb-8"
          >
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <Image
                src="/logo.png"
                alt="Compit Pal Logo"
                width={80}
                height={80}
                className="rounded-xl shadow-2xl"
                priority
              />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl lg:text-7xl font-bold"
            >
              Compit Pal
            </motion.h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl lg:text-2xl mb-12 text-primary-100 font-display leading-relaxed"
          >
            Competitive challenge tracking for friends and communities
          </motion.p>
          
          <div className="space-y-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ x: 10 }}
                className="flex items-center space-x-4 group"
              >
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`bg-gradient-to-r ${feature.color} p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300`}
                >
                  <feature.icon className="w-6 h-6" />
                </motion.div>
                <div>
                  <h3 className="font-bold text-lg font-display">{feature.title}</h3>
                  <p className="text-primary-100 text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Floating elements */}
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute top-20 right-20 text-6xl opacity-20"
          >
            🏆
          </motion.div>
          <motion.div
            animate={{ 
              y: [0, 10, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute bottom-20 left-20 text-4xl opacity-20"
          >
            🎯
          </motion.div>
        </div>
      </motion.div>

      {/* Right side - Auth forms */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex-1 bg-gradient-to-br from-white via-secondary-50 to-accent-50 p-8 lg:p-12 flex items-center justify-center relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ 
              rotate: -360,
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 30, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute top-20 right-20 w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-30"
          />
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              duration: 35, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute bottom-20 left-20 w-80 h-80 bg-accent-100 rounded-full blur-3xl opacity-20"
          />
        </div>

        <div className="relative z-10 w-full max-w-md">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-8"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-4xl font-bold text-secondary-900 mb-3 font-display"
            >
              {isLogin ? 'Welcome Back' : 'Join Compit Pal'}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-secondary-600 font-display text-lg"
            >
              {isLogin ? 'Sign in to continue your challenges' : 'Create your account to get started'}
            </motion.p>
          </motion.div>

          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            onSubmit={handleSubmit} 
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <label htmlFor="username" className="form-label font-medium">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="form-input text-secondary-900 border-2 focus:border-primary-500 transition-all"
                placeholder="Enter your username"
                required
              />
            </motion.div>

            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label htmlFor="email" className="form-label font-medium">
                    Email (optional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input text-secondary-900 border-2 focus:border-primary-500 transition-all"
                    placeholder="Enter your email"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <label htmlFor="password" className="form-label font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input pr-12 text-secondary-900 border-2 focus:border-primary-500 transition-all"
                  placeholder="Enter your password"
                  required
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-secondary-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-secondary-400" />
                  )}
                </motion.button>
              </div>
            </motion.div>

            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label htmlFor="confirmPassword" className="form-label font-medium">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="form-input pr-12 text-secondary-900 border-2 focus:border-primary-500 transition-all"
                      placeholder="Confirm your password"
                      required
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-secondary-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-secondary-400" />
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="spinner w-5 h-5"
                  />
                  <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </motion.button>
          </motion.form>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mt-8 text-center"
          >
            <p className="text-secondary-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({
                    username: '',
                    password: '',
                    confirmPassword: '',
                    email: '',
                  });
                }}
                className="text-accent-600 hover:text-accent-700 font-medium font-display transition-colors"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </motion.button>
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="mt-8 pt-8 border-t border-secondary-200"
          >
            <div className="text-center">
              <p className="text-sm text-secondary-500 mb-4 flex items-center justify-center">
                <Sparkles className="w-4 h-4 mr-2" />
                Popular challenge types
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  className="badge badge-primary">💻 Coding</motion.span>
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  className="badge badge-accent">🏃‍♂️ Fitness</motion.span>
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  className="badge badge-success">📚 Learning</motion.span>
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  className="badge badge-secondary">✨ Habits</motion.span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
} 