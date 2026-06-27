import React from 'react';
import { motion } from 'framer-motion';

const ProgressIndicator = ({ message }) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">{message}</p>
    </motion.div>
  );
};

export default ProgressIndicator;