import { FileSearch, Mail, Calendar, TrendingUp, Globe, Home } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const icons = { FileSearch, Mail, Calendar, TrendingUp, Globe, Home };

const features = [
  {
    title: "AI Credit Analysis",
    description: "Upload your credit report once. Our AI reads every line, identifies all negative items, and explains what they mean in plain language.",
    icon: "FileSearch",
  },
  {
    title: "FCRA Dispute Letters",
    description: "Automatically generate legally-compliant dispute letters for every disputable item — one per bureau. Ready to mail.",
    icon: "Mail",
  },
  {
    title: "90-Day Action Plan",
    description: "A personalized, step-by-step mortgage readiness plan built around your specific situation and timeline.",
    icon: "Calendar",
  },
  {
    title: "Mortgage Readiness Score",
    description: "Track your readiness across credit, debt, savings, and documentation. Know exactly where you stand.",
    icon: "TrendingUp",
  },
  {
    title: "10+ Languages",
    description: "Chat in Kriolu, Portuguese, Spanish, English, and 6 more languages. Our AI understands your community.",
    icon: "Globe",
  },
  {
    title: "ITIN Mortgage Guidance",
    description: "Specialized knowledge about non-citizen mortgage options, ITIN loans, and lender requirements.",
    icon: "Home",
  },
];

export function FeaturesSection() {
  const { t } = useTranslation();

  return (
    <section className="px-4 py-20 bg-muted/40">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("features.title")}
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            {t("features.subtitle")}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = icons[feature.icon as keyof typeof icons];
            return (
              <div
                key={feature.title}
                className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
