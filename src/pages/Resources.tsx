import { useEffect, useState } from "react";
import { Search, BookOpen, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/landing/Navbar";
import { useAnalytics } from "@/hooks/use-analytics";
import { supabase } from "@/integrations/supabase/client";
import { RESOURCES_CATEGORIES } from "@/lib/constants";

interface Resource {
  id: string;
  title: string;
  summary: string | null;
  content: string;
  category: string;
  tags: string[] | null;
}

export default function Resources() {
  const { trackPageView } = useAnalytics();
  const [resources, setResources] = useState<Resource[]>([]);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    trackPageView("/resources");
  }, [trackPageView]);

  useEffect(() => {
    let q = supabase.from("resources").select("id, title, summary, content, category, tags").eq("published", true);
    if (activeCategory) q = q.eq("category", activeCategory);
    q.order("created_at", { ascending: false }).then(({ data }) => {
      setResources((data ?? []) as Resource[]);
      setLoading(false);
    });
  }, [activeCategory]);

  const filtered = resources.filter((r) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      (r.summary ?? "").toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
            Knowledge Base
          </h1>
          <p className="text-muted-foreground">
            Guides, tips, and resources for immigrant homebuyers.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              activeCategory === null
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {RESOURCES_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Resources list */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <BookOpen className="mx-auto mb-4 h-10 w-10 text-muted-foreground/50" />
            <p className="text-muted-foreground">No resources found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((r) => (
              <Card key={r.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setExpanded(expanded === r.id ? null : r.id)}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-base">{r.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {r.summary ?? r.content.slice(0, 120) + "..."}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="shrink-0 text-xs">
                      {r.category}
                    </Badge>
                  </div>
                </CardHeader>
                {expanded === r.id && (
                  <CardContent>
                    <div className="prose prose-sm max-w-none text-foreground">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{r.content}</p>
                    </div>
                    {r.tags && r.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <Tag className="h-3 w-3 text-muted-foreground" />
                        {r.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
