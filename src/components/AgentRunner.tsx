import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Loader2, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useAnalytics } from "@/hooks/use-analytics";

interface AgentStep {
  id: string;
  label: string;
  status: "pending" | "running" | "done" | "error";
  detail?: string;
}

interface AgentRunnerProps {
  reportId: string;
}

const STEPS: AgentStep[] = [
  { id: "analyze", label: "Analyzing your credit report", status: "pending" },
  { id: "disputes", label: "Generating FCRA dispute letters", status: "pending" },
  { id: "plan", label: "Creating your 90-day action plan", status: "pending" },
  { id: "score", label: "Calculating readiness score", status: "pending" },
];

export function AgentRunner({ reportId }: AgentRunnerProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { trackEvent } = useAnalytics();
  const [steps, setSteps] = useState<AgentStep[]>(STEPS);
  const [, setCurrentStep] = useState(0);

  const updateStep = (index: number, patch: Partial<AgentStep>) => {
    setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  };

  const runPipeline = useCallback(async () => {
    if (!user) return;

    // Step 0: Poll for analysis
    updateStep(0, { status: "running" });
    setCurrentStep(0);
    let analysisData: Record<string, unknown> | null = null;
    for (let attempt = 0; attempt < 60; attempt++) {
      const { data } = await supabase
        .from("credit_reports")
        .select("status, parsed_json, credit_score")
        .eq("id", reportId)
        .single();
      const row = data as { status: string; parsed_json: Record<string, unknown> | null; credit_score: number | null } | null;
      if (row?.status === "analyzed" && row.parsed_json) {
        analysisData = row.parsed_json;
        updateStep(0, { status: "done", detail: row.credit_score ? `Score: ${row.credit_score}` : undefined });
        break;
      }
      if (attempt === 59) {
        updateStep(0, { status: "error", detail: "Analysis timed out. Please try again." });
        return;
      }
      await new Promise((r) => setTimeout(r, 2000));
    }

    // Step 1: Generate dispute letters
    updateStep(1, { status: "running" });
    setCurrentStep(1);
    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, mailing_address")
        .eq("id", user.id)
        .single();
      const profile = profileData as { full_name: string | null; mailing_address: string | null } | null;

      const { data: itemsData } = await supabase
        .from("negative_items")
        .select("id, type, creditor, amount, dispute_reason")
        .eq("report_id", reportId)
        .eq("disputable", true);
      const items = itemsData as Array<{ id: string; type: string; creditor: string | null; amount: number | null; dispute_reason: string | null }> | null;

      if (items && items.length > 0) {
        const { error } = await supabase.functions.invoke("generate-dispute-letters", {
          body: {
            items: items.map((i) => ({
              id: i.id,
              type: i.type,
              creditor: i.creditor,
              amount: i.amount,
              disputeReason: i.dispute_reason,
            })),
            userName: profile?.full_name ?? "Unknown",
            userAddress: profile?.mailing_address ?? "Unknown",
          },
        });
        if (error) throw error;
        updateStep(1, { status: "done", detail: `${items.length} letter(s) generated` });
      } else {
        updateStep(1, { status: "done", detail: "No disputable items found" });
      }
    } catch (err) {
      updateStep(1, { status: "error", detail: "Failed to generate letters" });
      toast.error("Dispute letter generation failed. Continuing...");
    }

    // Step 2: Generate action plan
    updateStep(2, { status: "running" });
    setCurrentStep(2);
    try {
      const { error } = await supabase.functions.invoke("generate-action-plan", {
        body: { analysisResult: analysisData, language: "en" },
      });
      if (error) throw error;
      updateStep(2, { status: "done" });
    } catch {
      updateStep(2, { status: "error", detail: "Failed to generate plan" });
      toast.error("Action plan generation failed. Continuing...");
    }

    // Step 3: Calculate readiness score
    updateStep(3, { status: "running" });
    setCurrentStep(3);
    await new Promise((r) => setTimeout(r, 800)); // brief pause for UX
    updateStep(3, { status: "done" });

    trackEvent("agent_pipeline_complete", { reportId });
    toast.success("Your mortgage readiness report is ready!");

    setTimeout(() => navigate("/dashboard"), 1500);
  }, [user, reportId, navigate, trackEvent]);

  useEffect(() => {
    runPipeline();
  }, [runPipeline]);

  return (
    <div className="mx-auto max-w-md w-full space-y-4">
      {steps.map((step) => (
        <div
          key={step.id}
          className={`flex items-start gap-4 rounded-xl border p-4 transition-all ${
            step.status === "running"
              ? "border-primary/30 bg-primary/5"
              : step.status === "done"
              ? "border-secondary/30 bg-secondary/5"
              : step.status === "error"
              ? "border-destructive/30 bg-destructive/5"
              : "border-border bg-muted/20 opacity-50"
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {step.status === "running" && (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            )}
            {step.status === "done" && (
              <CheckCircle className="h-5 w-5 text-secondary" />
            )}
            {step.status === "error" && (
              <XCircle className="h-5 w-5 text-destructive" />
            )}
            {step.status === "pending" && (
              <Clock className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div>
            <div className="text-sm font-medium text-foreground">{step.label}</div>
            {step.detail && (
              <div className="mt-0.5 text-xs text-muted-foreground">{step.detail}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
