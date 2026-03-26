import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";

const DAILY_LIMIT = 20;

interface MessageLimitState {
  count: number;
  limit: number;
  remaining: number;
  isAtLimit: boolean;
  increment: () => Promise<void>;
}

export function useMessageLimit(): MessageLimitState {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("daily_message_count, last_message_date")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (!data) return;
        const today = new Date().toISOString().slice(0, 10);
        if (data.last_message_date === today) {
          setCount(data.daily_message_count ?? 0);
        } else {
          setCount(0);
        }
      });
  }, [user]);

  const increment = async () => {
    if (!user) {
      setCount((c) => c + 1);
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    const newCount = count + 1;
    setCount(newCount);
    await supabase.from("profiles").upsert({
      id: user.id,
      daily_message_count: newCount,
      last_message_date: today,
    });
  };

  return {
    count,
    limit: DAILY_LIMIT,
    remaining: Math.max(0, DAILY_LIMIT - count),
    isAtLimit: count >= DAILY_LIMIT,
    increment,
  };
}
