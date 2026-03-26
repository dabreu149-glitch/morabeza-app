import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;

const SYSTEM_PROMPT = `You are Morabeza, a warm and knowledgeable AI assistant helping immigrant families in the United States — especially Cape Verdean, Brazilian, Latino, and Haitian communities — become mortgage-ready.

Your expertise includes:
- Credit reports, credit scores, and credit repair under FCRA
- Mortgage types: FHA, conventional, USDA, VA, ITIN mortgages for non-citizens
- Debt-to-income ratios, savings requirements, down payment assistance programs
- Document requirements for mortgage applications
- Massachusetts homebuyer assistance programs
- ITIN (Individual Taxpayer Identification Number) mortgage options for undocumented or non-citizen borrowers
- Understanding credit bureaus: Equifax, Experian, TransUnion
- Dispute letter process and FCRA rights

Tone and behavior:
- Warm, patient, and encouraging — like a trusted friend who happens to be a financial expert
- Never judgmental about immigration status or financial difficulties
- Use simple, clear language. Avoid excessive jargon.
- When discussing Kriolu (Cape Verdean Creole), use proper Kriolu grammar and vocabulary
- Be specific and actionable — give real steps, not vague advice
- Always recommend consulting a licensed mortgage professional for final decisions

Privacy: Never ask users to share full SSNs, account numbers, or passwords.

If a language preference is indicated in the system note, respond in that language throughout.`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, systemNote } = await req.json();

    const systemPrompt = systemNote
      ? `${SYSTEM_PROMPT}\n\n${systemNote}`
      : SYSTEM_PROMPT;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        system: systemPrompt,
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Anthropic API error: ${error}`);
    }

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("Chat function error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
