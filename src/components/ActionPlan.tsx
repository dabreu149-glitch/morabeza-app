import { CheckCircle, Circle, Calendar } from "lucide-react";

interface Task {
  title: string;
  description?: string;
  completed?: boolean;
}

interface Phase {
  name: string;
  timeframe: string;
  tasks: Task[];
}

interface ActionPlanData {
  title: string;
  summary: string;
  currentScore?: number;
  targetScore?: number;
  phases: Phase[];
  monthlyBudgetTip?: string;
}

interface ActionPlanProps {
  plan: ActionPlanData;
}

export function ActionPlan({ plan }: ActionPlanProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-1 font-semibold text-foreground">{plan.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{plan.summary}</p>
        {plan.currentScore && plan.targetScore && (
          <div className="mt-3 flex items-center gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Current: </span>
              <span className="font-semibold text-foreground">{plan.currentScore}</span>
            </div>
            <span className="text-muted-foreground">→</span>
            <div>
              <span className="text-muted-foreground">Target: </span>
              <span className="font-semibold text-secondary">{plan.targetScore}</span>
            </div>
          </div>
        )}
      </div>

      {/* Phases */}
      {plan.phases.map((phase, phaseIndex) => (
        <div key={phaseIndex} className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 border-b border-border bg-muted/30 px-5 py-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {phaseIndex + 1}
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">{phase.name}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {phase.timeframe}
              </div>
            </div>
          </div>
          <div className="divide-y divide-border">
            {phase.tasks.map((task, taskIndex) => (
              <div key={taskIndex} className="flex items-start gap-3 px-5 py-3">
                {task.completed ? (
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                ) : (
                  <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                )}
                <div>
                  <div className="text-sm font-medium text-foreground">{task.title}</div>
                  {task.description && (
                    <div className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{task.description}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Budget tip */}
      {plan.monthlyBudgetTip && (
        <div className="rounded-xl border border-accent/30 bg-accent/10 p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Monthly Budget Tip</div>
          <p className="text-sm text-foreground">{plan.monthlyBudgetTip}</p>
        </div>
      )}
    </div>
  );
}
