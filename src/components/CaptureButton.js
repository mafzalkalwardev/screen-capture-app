import React from 'react';
import { motion } from 'framer-motion';

const CaptureButton = ({ onClick, disabled }) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`w-full max-w-md mx-auto block px-8 py-4 text-xl font-semibold rounded-lg transition-all ${
        disabled
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl'
      }`}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {disabled ? 'Select a Source First' : 'Capture Screen'}
    </motion.button>
  );
};

export default CaptureButton;