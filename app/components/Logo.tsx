import { motion } from 'framer-motion';
import { Trophy, Target } from 'lucide-react';

export default function Logo() {
  return (
    <motion.div 
      className="flex items-center space-x-2"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="relative">
        <Trophy className="w-8 h-8 text-primary-600" />
        <Target className="w-4 h-4 text-secondary-600 absolute -bottom-1 -right-1" />
      </div>
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent font-display">
          Compit Pal
        </h1>
        <p className="text-xs text-secondary-500 -mt-1">Challenge Together</p>
      </div>
    </motion.div>
  );
} 