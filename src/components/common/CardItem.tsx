import { motion } from "framer-motion";
import { Edit3, Copy, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card } from "@/lib/database";
import { copyToClipboard } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CardItemProps {
  card: Card;
  onEdit: (card: Card) => void;
  onDelete: (card: Card) => void;
}

export const CardItem = ({ card, onEdit, onDelete }: CardItemProps) => {
  const handleCopy = async () => {
    const success = await copyToClipboard(card.content);
    if (success) {
      toast.success("Copied to clipboard!");
    } else {
      toast.error("Failed to copy");
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(card);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(card);
  };

  const getTitle = () => {
    if (card.title) return card.title;

    const firstLine = card.content.trim().split("\n")[0];
    // Remove markdown formatting from first line for cleaner title
    return (
      firstLine
        .replace(/^#+\s*/, "")
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .trim() || "Untitled"
    );
  };

  const getPreviewContent = () => {
    const content =
      card.content.length > 200
        ? `${card.content.substring(0, 200)}...`
        : card.content;
    return content;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative h-full cursor-pointer group"
      onClick={handleCopy}
    >
      <div className="relative overflow-hidden rounded-3xl bg-card/80 backdrop-blur-sm border border-border/50 p-8 h-[280px] transition-all duration-300 hover:border-border hover:bg-card/90">
        {/* Enhanced gradient glow effect */}
        <div
          className={`absolute inset-x-0 bottom-0 h-full bg-gradient-to-t ${card.gradient} opacity-40 group-hover:opacity-40 transition-opacity duration-300`}
        />

        {/* Content */}
        <div className="flex relative z-10 flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-4">
            <h3 className="flex-1 pr-4 text-xl font-bold truncate text-foreground">
              {getTitle()}
            </h3>
            <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 hover:bg-background/20"
                onClick={handleEdit}
              >
                <Edit3 className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 hover:bg-destructive/20 hover:text-destructive"
                onClick={handleDelete}
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="overflow-hidden flex-1">
            <div className="max-w-none prose prose-invert prose-sm line-clamp-6">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => (
                    <p className="mb-2 leading-relaxed text-muted-foreground">
                      {children}
                    </p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-foreground">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="text-foreground/90">{children}</em>
                  ),
                  h1: ({ children }) => (
                    <h1 className="mb-2 text-lg font-bold text-foreground">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="mb-2 text-base font-semibold text-foreground">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="mb-1 text-sm font-medium text-foreground">
                      {children}
                    </h3>
                  ),
                  ul: ({ children }) => (
                    <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="space-y-1 list-decimal list-inside text-muted-foreground">
                      {children}
                    </ol>
                  ),
                  code: ({ children }) => (
                    <code className="bg-muted/50 text-foreground px-1 py-0.5 rounded text-xs">
                      {children}
                    </code>
                  ),
                }}
              >
                {getPreviewContent()}
              </ReactMarkdown>
            </div>
          </div>

          <div className="flex justify-between items-end pt-4 mt-6 h-full">
            {/* <span className="text-xs text-muted-foreground">
              {new Date(card.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span> */}
            <div className="flex gap-2 items-center opacity-0 transition-opacity group-hover:opacity-100">
              <Copy className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Click to copy
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
