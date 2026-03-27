import { useTranslation } from "@/lib/i18n";

export function FeaturesSection() {
  const { locale } = useTranslation();

  const problems = [
    {
      before: locale === "kea" ? "\"Bu skoru sta baxo. Ka bu konsigui agora.\"" : "\"Your score is too low. You can't qualify right now.\"",
      after: locale === "kea" ? "Nos IA ta splika pamodi e kuma bu pode muda keli." : "Our AI explains exactly why — and exactly what to dispute.",
    },
    {
      before: locale === "kea" ? "\"Bu tem divida velha na bu reporte.\"" : "\"You have old collections on your report.\"",
      after: locale === "kea" ? "Kartas di disputa prontu pa Equifax, Experian, TransUnion." : "Dispute letters ready for Equifax, Experian, and TransUnion.",
    },
    {
      before: locale === "kea" ? "\"Bu ka sabe undi bu ta sta pa kompra kaza.\"" : "\"I don't know where I stand or what to do next.\"",
      after: locale === "kea" ? "Planu di 90 dia ku pasus klaru, simana pa simana." : "A 90-day plan with clear steps, week by week.",
    },
    {
      before: locale === "kea" ? "\"N ta papia Kriolu/Portuges/Espanhol — ka N ta ntende ingles finaseru.\"" : "\"I speak Kriolu/Portuguese/Spanish — financial English is confusing.\"",
      after: locale === "kea" ? "Nos IA ta papia bu lingua. Literalmente." : "Our AI speaks your language. Literally.",
    },
  ];

  return (
    <section className="bg-muted/30 px-4 py-20">
      <div className="mx-auto max-w-4xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
          {locale === "kea" ? "Problema ku nos ta resolve" : "The problems we solve"}
        </p>
        <h2 className="mb-14 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {locale === "kea"
            ? "Bu dja obi tudu kes frazi li."
            : "You've heard these before."}
        </h2>

        <div className="space-y-6">
          {problems.map((p, i) => (
            <div
              key={i}
              className="grid gap-4 rounded-xl border border-border bg-card p-6 sm:grid-cols-2 sm:gap-8"
            >
              <div>
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                  {locale === "kea" ? "Antes" : "The problem"}
                </div>
                <p className="text-muted-foreground leading-relaxed">{p.before}</p>
              </div>
              <div>
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-primary/70">
                  {locale === "kea" ? "Morabeza ta fase" : "What Morabeza does"}
                </div>
                <p className="font-medium text-foreground leading-relaxed">{p.after}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
