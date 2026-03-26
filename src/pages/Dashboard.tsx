import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, MessageSquare, CheckSquare, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/landing/Navbar";
import { ReadinessScore } from "@/components/ReadinessScore";
import { DisputeLetters } from "@/components/DisputeLetters";
import { ActionPlan } from "@/components/ActionPlan";
import { useAuth } from "@/hooks/use-auth";
import { useAnalytics } from "@/hooks/use-analytics";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/lib/i18n";
interface CreditReport {
  id: string;
  credit_score: number | null;
  utilization: number | null;
  debt_to_income: number | null;
  savings_documented: number;
  status: string;
}

interface DisputeLetter {
  id: string;
  bureau: string;
  creditor: string | null;
  letterText: string;
  status: string;
}

interface ActionPlanData {
  title: string;
  summary: string;
  currentScore?: number;
  targetScore?: number;
  phases: Array<{
    name: string;
    timeframe: string;
    tasks: Array<{ title: string; description?: string; completed?: boolean }>;
  }>;
  monthlyBudgetTip?: string;
}

interface ProgressStep {
  step: string;
  completed_at: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { trackPageView } = useAnalytics();
  const [report, setReport] = useState<CreditReport | null>(null);
  const [letters, setLetters] = useState<DisputeLetter[]>([]);
  const [actionPlan, setActionPlan] = useState<ActionPlanData | null>(null);
  const [progress, setProgress] = useState<ProgressStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackPageView("/dashboard");
  }, [trackPageView]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase
        .from("credit_reports")
        .select("id, credit_score, utilization, debt_to_income, savings_documented, status")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("user_progress")
        .select("step, completed_at")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false }),
      supabase
        .from("action_plans")
        .select("plan_json")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]).then(async ([reportRes, progressRes, planRes]) => {
      const reportData = reportRes.data as CreditReport | null;
      setReport(reportData);
      setProgress((progressRes.data ?? []) as ProgressStep[]);

      if (planRes.data?.plan_json) {
        setActionPlan(planRes.data.plan_json as unknown as ActionPlanData);
      }

      // Fetch dispute letters for this report
      if (reportData?.id) {
        const { data: itemsData } = await supabase
          .from("negative_items")
          .select("id")
          .eq("report_id", reportData.id);
        const itemIds = (itemsData ?? []).map((i) => i.id);
        if (itemIds.length > 0) {
          const { data: lettersData } = await supabase
            .from("dispute_letters")
            .select("id, bureau, letter_text, status, item_id")
            .in("item_id", itemIds);
          // Merge creditor info
          const { data: negItems } = await supabase
            .from("negative_items")
            .select("id, creditor")
            .in("id", itemIds);
          const creditorMap = Object.fromEntries((negItems ?? []).map((n) => [n.id, n.creditor]));
          setLetters(
            ((lettersData ?? []) as Array<{ id: string; bureau: string; letter_text: string; status: string; item_id: string }>).map((l) => ({
              id: l.id,
              bureau: l.bureau,
              creditor: creditorMap[l.item_id] ?? null,
              letterText: l.letter_text,
              status: l.status,
            }))
          );
        }
      }

      setLoading(false);
    });
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="mx-auto max-w-2xl px-4 py-16 text-center">
          <div className="mb-4 text-5xl">📊</div>
          <h1 className="mb-4 text-2xl font-bold text-foreground">No credit report yet</h1>
          <p className="mb-8 text-muted-foreground">
            Upload your credit report to see your mortgage readiness dashboard.
          </p>
          <Button asChild>
            <Link to="/credit">Upload Credit Report</Link>
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {t("dashboard.title")}
            </h1>
            <p className="text-sm text-muted-foreground">
              Last updated {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/documents">
                <CheckSquare className="mr-2 h-4 w-4" />
                Documents
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/chat">
                <MessageSquare className="mr-2 h-4 w-4" />
                Ask AI
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-6">
            <ReadinessScore
              creditScore={report.credit_score}
              dti={report.debt_to_income}
              savings={report.savings_documented}
            />

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">{t("dashboard.credit")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Credit Score</span>
                  <span className="font-semibold">{report.credit_score ?? "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Utilization</span>
                  <span className="font-semibold">
                    {report.utilization != null ? `${report.utilization}%` : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Debt-to-Income</span>
                  <span className="font-semibold">
                    {report.debt_to_income != null ? `${report.debt_to_income}%` : "N/A"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {progress.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No activity yet.</p>
                ) : (
                  <div className="space-y-2">
                    {progress.slice(0, 6).map((p) => (
                      <div key={p.step} className="flex items-center gap-2">
                        <Clock className="h-3 w-3 shrink-0 text-muted-foreground" />
                        <span className="text-xs capitalize">{p.step.replace(/_/g, " ")}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right columns */}
          <div className="space-y-6 lg:col-span-2">
            <DisputeLetters letters={letters} />
            {actionPlan && <ActionPlan plan={actionPlan} />}
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-dashed border-border p-6 text-center">
          <p className="mb-3 text-sm text-muted-foreground">
            Got an updated credit report? Upload it to refresh your analysis.
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link to="/credit">
              <FileText className="mr-2 h-4 w-4" />
              Upload New Report
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
