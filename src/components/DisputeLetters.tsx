import { useState } from "react";
import { Copy, Check, ChevronDown, ChevronUp, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface DisputeLetter {
  id: string;
  bureau: string;
  creditor: string | null;
  letterText: string;
  status: string;
}

interface DisputeLettersProps {
  letters: DisputeLetter[];
}

export function DisputeLetters({ letters }: DisputeLettersProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    toast.success("Letter copied to clipboard");
    setTimeout(() => setCopied(null), 2000);
  };

  if (!letters.length) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-8 text-center">
        <p className="text-sm text-muted-foreground">No dispute letters generated yet.</p>
      </div>
    );
  }

  const bureauColors: Record<string, string> = {
    Equifax: "bg-blue-100 text-blue-700 border-blue-200",
    Experian: "bg-green-100 text-green-700 border-green-200",
    TransUnion: "bg-purple-100 text-purple-700 border-purple-200",
  };

  return (
    <div className="space-y-3">
      {letters.map((letter) => (
        <div key={letter.id} className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <button
            className="flex w-full items-center justify-between gap-4 p-4 text-left hover:bg-muted/30 transition-colors"
            onClick={() => setExpanded(expanded === letter.id ? null : letter.id)}
          >
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <div>
                <div className="text-sm font-medium text-foreground">
                  {letter.creditor || "Dispute Letter"}
                </div>
                <div className="text-xs text-muted-foreground">
                  To: {letter.bureau}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${bureauColors[letter.bureau] ?? "bg-muted text-foreground border-border"}`}>
                {letter.bureau}
              </span>
              {expanded === letter.id ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </button>

          {expanded === letter.id && (
            <div className="border-t border-border">
              <div className="relative">
                <pre className="max-h-64 overflow-y-auto whitespace-pre-wrap p-4 text-xs leading-relaxed text-foreground font-mono bg-muted/20">
                  {letter.letterText}
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute right-3 top-3 gap-1"
                  onClick={() => handleCopy(letter.id, letter.letterText)}
                >
                  {copied === letter.id ? (
                    <><Check className="h-3 w-3" /> Copied</>
                  ) : (
                    <><Copy className="h-3 w-3" /> Copy</>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
