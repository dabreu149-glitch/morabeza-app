import { useReadinessScore } from "@/hooks/use-readiness-score";

interface ReadinessScoreProps {
  creditScore?: number | null;
  dti?: number | null;
  savings?: number | null;
  completedDocIds?: string[];
}

export function ReadinessScore({ creditScore, dti, savings, completedDocIds = [] }: ReadinessScoreProps) {
  const { score, color, breakdown } = useReadinessScore({ creditScore, dti, savings, completedDocIds });

  const colorClasses = {
    red: { ring: "stroke-destructive", text: "text-destructive", bg: "bg-destructive/10" },
    yellow: { ring: "stroke-accent", text: "text-accent-foreground", bg: "bg-accent/30" },
    green: { ring: "stroke-secondary", text: "text-secondary", bg: "bg-secondary/10" },
  };

  const { ring, text, bg } = colorClasses[color];
  const circumference = 2 * Math.PI * 45;
  const dashOffset = circumference * (1 - score / 100);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Gauge */}
      <div className={`relative flex h-40 w-40 items-center justify-center rounded-full ${bg}`}>
        <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" className="stroke-border opacity-30" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            className={ring}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: dashOffset,
              transition: "stroke-dashoffset 1s ease-in-out",
            }}
          />
        </svg>
        <div className="relative text-center">
          <div className={`text-3xl font-bold ${text}`}>{score}</div>
          <div className="text-xs text-muted-foreground">/ 100</div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="w-full space-y-2">
        {[
          { label: "Credit Score", value: breakdown.credit, max: 40 },
          { label: "Debt-to-Income", value: breakdown.dti, max: 20 },
          { label: "Savings", value: breakdown.savings, max: 20 },
          { label: "Documents", value: breakdown.documents, max: 20 },
        ].map(({ label, value, max }) => (
          <div key={label}>
            <div className="mb-1 flex justify-between text-xs text-muted-foreground">
              <span>{label}</span>
              <span>{value}/{max}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted">
              <div
                className="h-1.5 rounded-full bg-primary transition-all duration-700"
                style={{ width: `${(value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
