import { motion } from 'framer-motion';

export const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};