import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

let visitorId: string | null = null;

function getVisitorId(): string {
  if (visitorId) return visitorId;
  const stored = localStorage.getItem("morabeza-visitor-id");
  if (stored) {
    visitorId = stored;
    return visitorId;
  }
  visitorId = crypto.randomUUID();
  localStorage.setItem("morabeza-visitor-id", visitorId);
  return visitorId;
}

export function useAnalytics() {
  const trackEvent = useCallback(
    async (eventName: string, metadata?: Record<string, unknown>) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await supabase.from("events").insert({
          event_name: eventName,
          visitor_id: getVisitorId(),
          metadata: (metadata ?? null) as any,
        } as any);
      } catch {
        // analytics failures are non-critical
      }
    },
    []
  );

  const trackPageView = useCallback(async (page: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await supabase.from("page_views").insert({
        page,
        visitor_id: getVisitorId(),
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
      } as any);
    } catch {
      // non-critical
    }
  }, []);

  return { trackEvent, trackPageView };
}
