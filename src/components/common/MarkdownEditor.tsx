import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Edit,
  Type,
  Bold,
  Italic,
  Heading,
  Code,
  List,
} from "lucide-react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const MarkdownEditor = ({
  value,
  onChange,
  placeholder,
  className,
}: MarkdownEditorProps) => {
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText =
      value.substring(0, start) +
      before +
      selectedText +
      after +
      value.substring(end);

    onChange(newText);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const toolbarButtons = [
    {
      label: "Bold",
      action: () => insertMarkdown("**", "**"),
      icon: Bold,
      shortcut: "Ctrl+B",
    },
    {
      label: "Italic",
      action: () => insertMarkdown("*", "*"),
      icon: Italic,
      shortcut: "Ctrl+I",
    },
    {
      label: "Heading",
      action: () => insertMarkdown("## "),
      icon: Heading,
      shortcut: "Ctrl+H",
    },
    {
      label: "Code",
      action: () => insertMarkdown("`", "`"),
      icon: Code,
      shortcut: "Ctrl+`",
    },
    {
      label: "List",
      action: () => insertMarkdown("- "),
      icon: List,
      shortcut: "Ctrl+L",
    },
  ];

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "b":
            e.preventDefault();
            insertMarkdown("**", "**");
            break;
          case "i":
            e.preventDefault();
            insertMarkdown("*", "*");
            break;
          case "h":
            e.preventDefault();
            insertMarkdown("## ");
            break;
          case "`":
            e.preventDefault();
            insertMarkdown("`", "`");
            break;
          case "l":
            e.preventDefault();
            insertMarkdown("- ");
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [value]);

  return (
    <div className={`flex relative flex-col h-full ${className}`}>
      {/* Persistent Toolbar */}
      <div className="flex justify-between items-center p-3 rounded-t-lg border backdrop-blur-sm bg-background/95 border-border shrink-0">
        <div className="flex gap-1 items-center">
          {toolbarButtons.map((button) => {
            const IconComponent = button.icon;
            return (
              <Button
                key={button.label}
                variant="ghost"
                size="sm"
                onClick={button.action}
                className="px-3 h-8 text-xs"
                title={`${button.label} (${button.shortcut})`}
              >
                <IconComponent className="mr-1 w-3 h-3" />
                {button.label}
              </Button>
            );
          })}
        </div>

        <div className="flex gap-2 items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
            className="px-3 h-8 text-xs"
          >
            {isPreview ? (
              <Edit className="mr-1 w-3 h-3" />
            ) : (
              <Eye className="mr-1 w-3 h-3" />
            )}
            {isPreview ? "Edit" : "Preview"}
          </Button>
          <div className="flex items-center text-xs text-muted-foreground">
            <Type className="mr-1 w-3 h-3" />
            Markdown
          </div>
        </div>
      </div>

      {/* Editor/Preview */}
      <div className="flex-1 min-h-0">
        {isPreview ? (
          <div className="overflow-y-auto p-6 h-full rounded-b-lg border border-t-0 bg-background/50 border-border">
            <div className="max-w-none prose prose-invert">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="mb-4 text-3xl font-bold text-foreground">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="mb-3 text-2xl font-semibold text-foreground">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="mb-2 text-xl font-medium text-foreground">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-4 leading-relaxed text-foreground/90">
                      {children}
                    </p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-foreground">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="text-foreground/80">{children}</em>
                  ),
                  ul: ({ children }) => (
                    <ul className="mb-4 space-y-2 list-disc list-inside text-foreground/90">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="mb-4 space-y-2 list-decimal list-inside text-foreground/90">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed">{children}</li>
                  ),
                  code: ({ children }) => (
                    <code className="px-2 py-1 font-mono text-sm rounded bg-muted text-foreground">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="overflow-x-auto p-4 mb-4 rounded-lg bg-muted">
                      {children}
                    </pre>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="pl-4 mb-4 italic border-l-4 border-primary text-foreground/80">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {value || "*Start typing to see preview...*"}
              </ReactMarkdown>
            </div>
          </div>
        ) : (
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="h-full font-mono text-base leading-relaxed rounded-t-none border-t-0 resize-none border-border bg-background/50"
          />
        )}
      </div>
    </div>
  );
};
