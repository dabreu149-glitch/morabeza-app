import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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

    const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { analysisResult, language } = await req.json();

    const prompt = `Create a personalized 90-day mortgage readiness action plan based on this credit analysis:

Credit Score: ${analysisResult.creditScore ?? "Unknown"}
Credit Utilization: ${analysisResult.utilization ?? "Unknown"}%
Debt-to-Income Ratio: ${analysisResult.debtToIncome ?? "Unknown"}%
Total Debt: $${analysisResult.totalDebt ?? "Unknown"}
Negative Items: ${analysisResult.negativeItems?.length ?? 0} items (${analysisResult.negativeItems?.filter((i: { disputable: boolean }) => i.disputable).length ?? 0} disputable)
Summary: ${analysisResult.summary ?? ""}
Top Actions: ${analysisResult.topActions?.join(", ") ?? ""}
Mortgage Readiness: ${analysisResult.mortgageReadinessEstimate ?? "Unknown"}

${language && language !== "en" ? `Respond in ${language}.` : ""}

Return ONLY valid JSON with this structure:
{
  "title": "Your 90-Day Mortgage Readiness Plan",
  "summary": "<2-3 sentence personalized summary>",
  "currentScore": ${analysisResult.creditScore ?? 0},
  "targetScore": <realistic target score in 90 days>,
  "phases": [
    {
      "name": "Phase 1: Foundation (Days 1-30)",
      "timeframe": "Days 1-30",
      "tasks": [
        {
          "title": "<task title>",
          "description": "<specific actionable description>",
          "priority": "<high|medium|low>",
          "estimatedImpact": "<expected score or financial impact>"
        }
      ]
    },
    {
      "name": "Phase 2: Momentum (Days 31-60)",
      "timeframe": "Days 31-60",
      "tasks": [...]
    },
    {
      "name": "Phase 3: Readiness (Days 61-90)",
      "timeframe": "Days 61-90",
      "tasks": [...]
    }
  ],
  "monthlyBudgetTip": "<specific monthly savings/payment tip>"
}

Make tasks specific, actionable, and realistic for an immigrant family in Massachusetts.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 3000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) throw new Error(`Anthropic API error: ${response.status}`);

    const data = await response.json();
    const content = data.content[0]?.text ?? "";

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");

    const plan = JSON.parse(jsonMatch[0]);

    // Save to DB
    await supabase.from("action_plans").insert({
      user_id: user.id,
      plan_json: plan,
    });

    // Track progress
    await supabase.from("user_progress").upsert({
      user_id: user.id,
      step: "action_plan_generated",
      completed_at: new Date().toISOString(),
    }, { onConflict: "user_id,step" });

    return new Response(JSON.stringify(plan), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("generate-action-plan error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
