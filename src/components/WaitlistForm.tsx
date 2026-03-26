import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface WaitlistFormProps {
  source?: string;
  language?: string;
  placeholder?: string;
}

export function WaitlistForm({ source = "landing", language = "en", placeholder = "Enter your email" }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    const { error } = await supabase.from("waitlist").insert({ email: email.trim(), source, language });
    setLoading(false);
    if (error) {
      if (error.code === "23505") {
        toast.info("You're already on the waitlist!");
      } else {
        toast.error("Failed to join. Please try again.");
      }
    } else {
      setSubmitted(true);
      toast.success("You're on the waitlist! We'll be in touch.");
    }
  };

  if (submitted) {
    return (
      <div className="rounded-lg border border-secondary/30 bg-secondary/10 px-4 py-3 text-sm font-medium text-secondary">
        You're on the list! We'll notify you when you're ready.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        required
        className="flex-1"
      />
      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Join Waitlist
      </Button>
    </form>
  );
}
