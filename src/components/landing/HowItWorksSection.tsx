import { Link } from "react-router-dom";
import { useTranslation } from "@/lib/i18n";

export function HowItWorksSection() {
  const { t, locale } = useTranslation();

  const steps = [
    { number: "01", title: t("how.step1.title"), desc: t("how.step1.desc") },
    { number: "02", title: t("how.step2.title"), desc: t("how.step2.desc") },
    { number: "03", title: t("how.step3.title"), desc: t("how.step3.desc") },
  ];

  const tagline =
    locale === "pt" ? "10 minutos para começar. 90 dias para estar pronto." :
    locale === "es" ? "10 minutos para empezar. 90 días para estar listo." :
    locale === "fr" ? "10 minutes pour commencer. 90 jours pour être prêt." :
    "10 minutes to start. 90 days to get ready.";

  const linkLabel =
    locale === "pt" ? "Começar agora — é grátis" :
    locale === "es" ? "Comenzar ahora — es gratis" :
    locale === "fr" ? "Commencer maintenant — c'est gratuit" :
    "Start now — it's free";

  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t("how.title")}
        </h2>
        <p className="mb-14 text-muted-foreground">{tagline}</p>

        <div className="space-y-0">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-8 border-t border-border py-10 last:border-b">
              <div className="w-10 shrink-0 pt-1 text-4xl font-bold text-primary/20 leading-none select-none">
                {step.number}
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link to="/signup" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            {linkLabel} →
          </Link>
        </div>
      </div>
    </section>
  );
}
