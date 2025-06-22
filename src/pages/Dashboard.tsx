import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, FileText } from "lucide-react";
import { db, Card } from "@/lib/database";
import { getRandomGradient } from "@/lib/utils";
import { PageHeader } from "@/components/common/PageHeader";
import { CardItem } from "@/components/common/CardItem";
import { AddCard } from "@/components/common/AddCard";
import { MarkdownEditor } from "@/components/common/MarkdownEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Dashboard = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  // Helper function to generate title from content
  const generateTitleFromContent = (content: string) => {
    const firstLine = content.trim().split("\n")[0];
    // Remove markdown formatting from first line for cleaner title
    return (
      firstLine
        .replace(/^#+\s*/, "")
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .trim() || "Untitled"
    );
  };

  // Load cards from IndexedDB
  const loadCards = useCallback(async () => {
    try {
      const allCards = await db.cards.orderBy("updatedAt").reverse().toArray();
      setCards(allCards);
    } catch (error) {
      console.error("Failed to load cards:", error);
      toast.error("Failed to load cards");
    }
  }, []);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!content.trim()) return;

    try {
      const trimmedTitle = title.trim();

      // Generate title from first line if no title provided
      const finalTitle = trimmedTitle || generateTitleFromContent(content);

      // For new cards without an ID, check if we already have a card with the same content
      // to prevent duplicate creation
      if (!editingCard?.id) {
        // Check for existing card with same content (to prevent duplicates when no title)
        const existingCardByContent = await db.cards
          .where("content")
          .equals(content.trim())
          .first();

        if (existingCardByContent) {
          // Update the existing card instead of creating a new one
          setEditingCard(existingCardByContent);
          setTitle(existingCardByContent.title);
          toast.info("Updating existing card");
          return;
        }

        // Check for existing card with the same title
        const existingCardByTitle = await db.cards
          .where("title")
          .equals(finalTitle)
          .first();

        if (existingCardByTitle) {
          // Update the existing card instead of creating a new one
          setEditingCard(existingCardByTitle);
          setTitle(existingCardByTitle.title);
          setContent(existingCardByTitle.content);
          toast.info("Updating existing card with same title");
          return;
        }
      } else {
        // For existing cards, check for duplicate titles (excluding current card)
        const existingCard = await db.cards
          .where("title")
          .equals(finalTitle)
          .first();

        if (existingCard && existingCard.id !== editingCard.id) {
          toast.error("A card with this title already exists");
          return;
        }
      }

      const now = new Date().toISOString();
      const cardData = {
        title: finalTitle,
        content: content.trim(),
        gradient: editingCard?.gradient || getRandomGradient(),
        createdAt: editingCard?.createdAt || now,
        updatedAt: now,
      };

      if (editingCard?.id) {
        await db.cards.update(editingCard.id, cardData);
        toast.success("Card updated");
      } else {
        const newCardId = await db.cards.add(cardData);
        // Set the editing card to the newly created card to prevent further duplicates
        const newCard = await db.cards.get(newCardId);
        if (newCard) {
          setEditingCard(newCard);
          setTitle(newCard.title);
        }
        toast.success("Card created");
      }

      await loadCards();
    } catch (error) {
      console.error("Failed to save card:", error);
      toast.error("Failed to save card");
    }
  }, [title, content, editingCard, loadCards]);

  // Handle content change with debounced auto-save
  const handleContentChange = (value: string) => {
    setContent(value);

    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    const timeout = setTimeout(autoSave, 500);
    setSaveTimeout(timeout);
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);

    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    const timeout = setTimeout(autoSave, 500);
    setSaveTimeout(timeout);
  };

  const startEditing = (card?: Card) => {
    setEditingCard(card || null);
    setTitle(card?.title || "");
    setContent(card?.content || "");
    setIsEditing(true);
  };

  const stopEditing = () => {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    setIsEditing(false);
    setEditingCard(null);
    setTitle("");
    setContent("");
  };

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col h-screen bg-background"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-4 border-b backdrop-blur-sm border-border/50 bg-background/80 shrink-0">
          <div className="flex gap-4 items-center">
            <Button
              variant="ghost"
              onClick={stopEditing}
              className="flex gap-2 items-center"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Cards
            </Button>
            <div className="flex gap-2 items-center text-muted-foreground">
              <FileText className="w-4 h-4" />
              <span className="text-sm">
                {editingCard ? "Editing Card" : "New Card"}
              </span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Auto-saves after 500ms of inactivity
          </div>
        </div>

        {/* Editor */}
        <div className="flex flex-col flex-1 px-8 py-6 min-h-0">
          <div className="mb-6">
            <Input
              placeholder="Card title (optional)"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="h-12 text-xl font-semibold bg-background/50 border-border/50"
            />
          </div>

          <div className="flex-1 min-h-0">
            <MarkdownEditor
              value={content}
              onChange={handleContentChange}
              placeholder="Start typing your note... 

**Markdown is supported:**
- **Bold text**
- *Italic text*
- ## Headings
- `Code blocks`
- Lists and more!"
              className="h-full"
            />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background"
    >
      <div className="px-8 py-6 w-full">
        <PageHeader title="Card Collection" subtitle="" />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AddCard onClick={() => startEditing()} />

          <AnimatePresence>
            {cards.map((card) => (
              <CardItem key={card.id} card={card} onEdit={startEditing} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
