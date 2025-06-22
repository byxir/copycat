import { motion } from "framer-motion";
import { Plus } from "lucide-react";

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
      className="h-full cursor-pointer"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-3xl bg-card/30 border-2 border-dashed border-primary/30 p-12 min-h-[280px] transition-all duration-300 hover:border-primary/60 hover:bg-card/50 flex items-center justify-center group h-full">
        {/* Enhanced glow effect */}
        <div className="absolute inset-0 bg-gradient-to-t to-transparent opacity-0 transition-opacity duration-300 from-primary/20 via-primary/10 group-hover:opacity-100" />

        {/* Animated plus icon */}
        <div className="flex flex-col items-center space-y-4 transition-colors text-primary/70 group-hover:text-primary">
          <motion.div
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <Plus className="w-16 h-16" strokeWidth={1.5} />
          </motion.div>
          <div className="text-center">
            <span className="block text-xl font-semibold">Add New Card</span>
            <span className="mt-1 text-sm text-muted-foreground">
              Click to create a new note
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
