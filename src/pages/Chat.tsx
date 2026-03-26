import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Send, Plus, Trash2, Home, Loader2, ChevronLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageLimitReached } from "@/components/MessageLimitReached";
import { useAuth } from "@/hooks/use-auth";
import { useMessageLimit } from "@/hooks/use-message-limit";
import { useAnalytics } from "@/hooks/use-analytics";
import { supabase } from "@/integrations/supabase/client";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

export default function Chat() {
  const { user } = useAuth();
  const { trackPageView, trackEvent } = useAnalytics();
  const limit = useMessageLimit();

  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    trackPageView("/chat");
  }, [trackPageView]);

  // Load conversations for logged-in users
  useEffect(() => {
    if (!user) return;
    supabase
      .from("conversations")
      .select("id, title, created_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .then(({ data }) => setConversations((data ?? []) as Conversation[]));
  }, [user]);

  // Load messages for active conversation
  useEffect(() => {
    if (!activeConvId) return;
    supabase
      .from("messages")
      .select("id, role, content")
      .eq("conversation_id", activeConvId)
      .order("created_at", { ascending: true })
      .then(({ data }) => setMessages((data ?? []) as Message[]));
  }, [activeConvId]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const createConversation = async () => {
    if (!user) return null;
    const { data } = await supabase
      .from("conversations")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .insert({ user_id: user.id, title: "New Conversation" } as any)
      .select("id, title, created_at")
      .single();
    const conv = data as Conversation | null;
    if (conv) {
      setConversations((prev) => [conv, ...prev]);
      setActiveConvId(conv.id);
      setMessages([]);
    }
    return conv?.id ?? null;
  };

  const deleteConversation = async (id: string) => {
    await supabase.from("conversations").delete().eq("id", id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConvId === id) {
      setActiveConvId(null);
      setMessages([]);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || streaming) return;
    if (limit.isAtLimit) return;

    const userContent = input.trim();
    setInput("");

    // Ensure conversation exists for logged-in users
    let convId = activeConvId;
    if (user && !convId) {
      convId = await createConversation();
    }

    // Optimistic user message
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: userContent };
    setMessages((prev) => [...prev, userMsg]);

    // Build messages for API
    const apiMessages = [
      ...messages.map((m) => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: userContent },
    ];

    const lang = selectedLanguage ?? "en";
    const systemNote = lang !== "en" ? ` Respond in ${SUPPORTED_LANGUAGES.find((l) => l.code === lang)?.name ?? "English"}.` : "";

    setStreaming(true);
    limit.increment();
    trackEvent("chat_message_sent", { language: lang });

    // Placeholder for streaming response
    const assistantId = crypto.randomUUID();
    setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (session?.access_token) headers["Authorization"] = `Bearer ${session.access_token}`;

      const res = await fetch(`${SUPABASE_URL}/functions/v1/chat`, {
        method: "POST",
        headers,
        body: JSON.stringify({ messages: apiMessages, systemNote }),
      });

      if (!res.ok || !res.body) throw new Error("Failed to connect");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (raw === "[DONE]") continue;
          try {
            const parsed = JSON.parse(raw);
            if (parsed.type === "content_block_delta" && parsed.delta?.text) {
              fullContent += parsed.delta.text;
              setMessages((prev) =>
                prev.map((m) => (m.id === assistantId ? { ...m, content: fullContent } : m))
              );
            }
          } catch {
            // ignore parse errors
          }
        }
      }

      // Save messages to DB for logged-in users
      if (user && convId) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await supabase.from("messages").insert([
          { conversation_id: convId, role: "user", content: userContent },
          { conversation_id: convId, role: "assistant", content: fullContent },
        ] as any);
        // Update conversation title if first message
        if (messages.length === 0) {
          const title = userContent.slice(0, 50) + (userContent.length > 50 ? "..." : "");
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await supabase.from("conversations").update({ title, updated_at: new Date().toISOString() } as any).eq("id", convId);
          setConversations((prev) =>
            prev.map((c) => (c.id === convId ? { ...c, title } : c))
          );
        }
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
    } finally {
      setStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Language selection screen
  if (!selectedLanguage) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <Link to="/" className="mb-8 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Home className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground">Morabeza<span className="text-primary">.ai</span></span>
        </Link>
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground">Choose Your Language</h1>
        <p className="mb-8 text-sm text-muted-foreground">Select the language you'd like to chat in.</p>
        <div className="grid w-full max-w-md grid-cols-2 gap-3">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLanguage(lang.code)}
              className="rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary hover:shadow-md"
            >
              <div className="font-medium text-foreground">{lang.name}</div>
              <div className="mt-1 text-xs text-muted-foreground truncate">{lang.greeting}</div>
            </button>
          ))}
        </div>
        <button
          onClick={() => setSelectedLanguage("en")}
          className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip → Chat in English
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-background transition-transform md:relative md:translate-x-0`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <Home className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm text-foreground">Morabeza<span className="text-primary">.ai</span></span>
          </Link>
          <button className="md:hidden p-1" onClick={() => setSidebarOpen(false)}>
            <ChevronLeft className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={() => {
              if (user) createConversation();
              else { setActiveConvId(null); setMessages([]); }
            }}
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="space-y-1 p-2">
            {user ? (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`group flex items-center justify-between rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors ${
                    activeConvId === conv.id ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                  onClick={() => setActiveConvId(conv.id)}
                >
                  <span className="truncate">{conv.title}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
                    className="hidden group-hover:block p-1 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <p className="px-3 py-2 text-xs text-muted-foreground">
                <Link to="/signin" className="text-primary hover:underline">Sign in</Link> to save conversations.
              </p>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main chat area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <button className="md:hidden p-2" onClick={() => setSidebarOpen(true)}>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              {SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage)?.name ?? "English"}
            </span>
            <button
              onClick={() => setSelectedLanguage(null)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Change
            </button>
          </div>
          {!user && (
            <Button variant="outline" size="sm" asChild>
              <Link to="/signup">Sign Up Free</Link>
            </Button>
          )}
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 px-4">
          <div className="mx-auto max-w-2xl space-y-4 py-6">
            {messages.length === 0 && (
              <div className="py-12 text-center">
                <div className="mb-4 text-4xl">🏠</div>
                <h2 className="mb-2 text-lg font-semibold text-foreground">
                  {SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage)?.greeting ?? "Hello!"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Ask me anything about mortgages, credit, or homeownership.
                </p>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                      <ReactMarkdown>{msg.content || "▋"}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="mx-auto max-w-2xl">
            {limit.isAtLimit ? (
              <MessageLimitReached />
            ) : (
              <div className="flex gap-2">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about mortgages, credit, homeownership..."
                  className="min-h-[44px] max-h-32 resize-none"
                  rows={1}
                  disabled={streaming}
                />
                <Button
                  onClick={handleSend}
                  disabled={streaming || !input.trim()}
                  size="icon"
                  className="h-11 w-11 shrink-0"
                >
                  {streaming ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
            {!user && !limit.isAtLimit && (
              <p className="mt-2 text-center text-xs text-muted-foreground">
                {limit.remaining} messages remaining today.{" "}
                <Link to="/signup" className="text-primary hover:underline">
                  Sign up for unlimited.
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
