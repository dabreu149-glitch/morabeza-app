import { useEffect, useState } from "react";
import { CheckCircle, Circle, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/landing/Navbar";
import { useAnalytics } from "@/hooks/use-analytics";
import { DOCUMENT_CHECKLIST } from "@/lib/constants";

const STORAGE_KEY = "morabeza-docs-completed";

type Category = "income" | "assets" | "identity" | "credit" | "history";

const categoryLabels: Record<Category, string> = {
  income: "Income",
  assets: "Assets & Savings",
  identity: "Identity",
  credit: "Credit",
  history: "Payment History",
};

const categoryColors: Record<Category, string> = {
  income: "bg-blue-100 text-blue-700",
  assets: "bg-green-100 text-green-700",
  identity: "bg-purple-100 text-purple-700",
  credit: "bg-orange-100 text-orange-700",
  history: "bg-pink-100 text-pink-700",
};

export default function Documents() {
  const { trackPageView } = useAnalytics();
  const [completed, setCompleted] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    trackPageView("/documents");
  }, [trackPageView]);

  const toggle = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  const categories = [...new Set(DOCUMENT_CHECKLIST.map((d) => d.category))] as Category[];
  const totalCompleted = completed.size;
  const totalItems = DOCUMENT_CHECKLIST.length;
  const pct = Math.round((totalCompleted / totalItems) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
            Document Checklist
          </h1>
          <p className="text-muted-foreground">
            Track the documents you'll need to apply for a mortgage.
          </p>
        </div>

        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                {totalCompleted} of {totalItems} documents ready
              </span>
              <span className="text-sm font-bold text-primary">{pct}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Checklist by category */}
        <div className="space-y-4">
          {categories.map((cat) => {
            const items = DOCUMENT_CHECKLIST.filter((d) => d.category === cat);
            const catCompleted = items.filter((d) => completed.has(d.id)).length;
            return (
              <Card key={cat}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">
                      {categoryLabels[cat]}
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {catCompleted}/{items.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {items.map((item) => {
                      const done = completed.has(item.id);
                      return (
                        <button
                          key={item.id}
                          onClick={() => toggle(item.id)}
                          className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-muted/50"
                        >
                          {done ? (
                            <CheckCircle className="h-5 w-5 shrink-0 text-secondary" />
                          ) : (
                            <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
                          )}
                          <span
                            className={`text-sm ${done ? "line-through text-muted-foreground" : "text-foreground"}`}
                          >
                            {item.label}
                          </span>
                          <span
                            className={`ml-auto rounded-full px-2 py-0.5 text-xs font-medium ${categoryColors[cat]}`}
                          >
                            {categoryLabels[cat]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <FileText className="inline mr-1 h-3 w-3" />
          Progress is saved locally in your browser.
        </p>
      </main>
    </div>
  );
}
