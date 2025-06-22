import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface AddCardProps {
  onClick: () => void;
}

export const AddCard = ({ onClick }: AddCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-3xl bg-card/30 border-2 border-dashed border-primary/30 p-12 min-h-[280px] transition-all duration-300 hover:border-primary/60 hover:bg-card/50 flex items-center justify-center group">
        {/* Enhanced glow effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Animated plus icon */}
        <div className="flex flex-col items-center space-y-4 text-primary/70 group-hover:text-primary transition-colors">
          <motion.div
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <Plus className="h-16 w-16" strokeWidth={1.5} />
          </motion.div>
          <div className="text-center">
            <span className="text-xl font-semibold block">Add New Card</span>
            <span className="text-sm text-muted-foreground mt-1">Click to create a new note</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};