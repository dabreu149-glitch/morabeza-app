import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnalysisResult {
  creditScore: number | null;
  utilization: number | null;
  debtToIncome: number | null;
  totalDebt: number | null;
  negativeItems: Array<{
    type: string;
    creditor: string;
    amount: number | null;
    disputable: boolean;
    disputeReason: string;
  }>;
  summary: string;
  topActions: string[];
  estimatedScoreImprovement: number;
  mortgageReadinessEstimate: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileBase64, fileName, reportId, userId } = await req.json();

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Update status to analyzing
    if (reportId) {
      await supabase.from("credit_reports").update({ status: "analyzing" }).eq("id", reportId);
    }

    const prompt = `You are analyzing a credit report PDF. Extract all relevant financial information and return a structured JSON analysis.

Analyze the credit report and return ONLY valid JSON with this exact structure:
{
  "creditScore": <number or null>,
  "utilization": <credit utilization percentage as number, e.g. 32.5, or null>,
  "debtToIncome": <debt-to-income ratio as percentage or null>,
  "totalDebt": <total debt amount in dollars or null>,
  "negativeItems": [
    {
      "type": "<late_payment|collection|charge_off|bankruptcy|inquiry|judgment|tax_lien>",
      "creditor": "<creditor name>",
      "amount": <amount in dollars or null>,
      "disputable": <true if item appears inaccurate, outdated, or violates FCRA>,
      "disputeReason": "<specific FCRA-based reason for dispute>"
    }
  ],
  "summary": "<2-3 sentence plain English summary of the credit situation>",
  "topActions": ["<action 1>", "<action 2>", "<action 3>"],
  "estimatedScoreImprovement": <estimated point improvement if all disputes resolved>,
  "mortgageReadinessEstimate": "<ready_now|6_months|12_months|18_plus_months>"
}

FCRA dispute rules to check:
- Items older than 7 years (bankruptcies: 10 years) must be removed
- Duplicate items should be disputed
- Incorrect amounts or dates are disputable
- Accounts not belonging to the consumer are disputable
- Collections where the debt was paid should be disputed`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "document",
                source: {
                  type: "base64",
                  media_type: "application/pdf",
                  data: fileBase64,
                },
              },
              {
                type: "text",
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.content[0]?.text ?? "";

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");

    const analysis: AnalysisResult = JSON.parse(jsonMatch[0]);

    if (reportId && userId) {
      // Update credit_reports with parsed results
      await supabase.from("credit_reports").update({
        parsed_json: analysis as unknown as Record<string, unknown>,
        credit_score: analysis.creditScore,
        utilization: analysis.utilization,
        debt_to_income: analysis.debtToIncome,
        status: "analyzed",
      }).eq("id", reportId);

      // Insert negative items
      if (analysis.negativeItems?.length > 0) {
        await supabase.from("negative_items").insert(
          analysis.negativeItems.map((item) => ({
            report_id: reportId,
            user_id: userId,
            type: item.type,
            creditor: item.creditor,
            amount: item.amount,
            disputable: item.disputable,
            dispute_reason: item.disputeReason,
            dispute_status: "none",
          }))
        );
      }

      // Track progress
      await supabase.from("user_progress").upsert({
        user_id: userId,
        step: "analyzed",
        completed_at: new Date().toISOString(),
      }, { onConflict: "user_id,step" });
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("analyze-credit-report error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
