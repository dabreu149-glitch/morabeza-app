import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BUREAUS = ["Equifax", "Experian", "TransUnion"] as const;

const BUREAU_ADDRESSES = {
  Equifax: "Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374",
  Experian: "Experian\nP.O. Box 4500\nAllen, TX 75013",
  TransUnion: "TransUnion LLC Consumer Dispute Center\nP.O. Box 2000\nChester, PA 19016",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { items, userName, userAddress } = await req.json();

    const letters = [];

    for (const item of items) {
      for (const bureau of BUREAUS) {
        const prompt = `Write a professional FCRA dispute letter to ${bureau} credit bureau.

Consumer: ${userName}
Consumer Address: ${userAddress}
Bureau Address: ${BUREAU_ADDRESSES[bureau as keyof typeof BUREAU_ADDRESSES]}
Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}

Disputed Item:
- Type: ${item.type}
- Creditor: ${item.creditor}
- Amount: ${item.amount ? `$${item.amount}` : "Not specified"}
- Dispute Reason: ${item.disputeReason}

Write a complete, formal dispute letter that:
1. Clearly identifies the consumer and account
2. States the specific item being disputed
3. Cites the relevant FCRA section (Section 611 for disputes, Section 623 for furnisher disputes)
4. Demands investigation and removal/correction within 30 days
5. Requests written verification of results
6. Is professional and assertive but not threatening
7. Includes a signature line

Return ONLY the letter text, starting with the date.`;

        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1500,
            messages: [{ role: "user", content: prompt }],
          }),
        });

        if (!response.ok) continue;
        const data = await response.json();
        const letterText = data.content[0]?.text ?? "";

        // Save to DB
        await supabase.from("dispute_letters").insert({
          item_id: item.id,
          user_id: user.id,
          bureau,
          letter_text: letterText,
          status: "generated",
        });

        letters.push({ id: item.id, bureau, creditor: item.creditor, letterText });
      }

      // Mark item as generated
      await supabase.from("negative_items").update({ dispute_status: "generated" }).eq("id", item.id);
    }

    // Track progress
    await supabase.from("user_progress").upsert({
      user_id: user.id,
      step: "disputes_generated",
      completed_at: new Date().toISOString(),
    }, { onConflict: "user_id,step" });

    return new Response(JSON.stringify({ letters, count: letters.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("generate-dispute-letters error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
