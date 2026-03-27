import { useTranslation } from "@/lib/i18n";

export function FeaturesSection() {
  const { locale } = useTranslation();

  type ProblemSet = { before: string; after: string }[];

  const problems: Record<string, ProblemSet> = {
    en: [
      { before: '"Your score is too low. You can\'t qualify right now."', after: "Our AI explains exactly why — and exactly what to dispute." },
      { before: '"You have old collections on your report."', after: "Dispute letters ready for Equifax, Experian, and TransUnion." },
      { before: '"I don\'t know where I stand or what to do next."', after: "A 90-day plan with clear steps, week by week." },
      { before: '"Financial English is confusing."', after: "Our AI speaks your language. Literally." },
    ],
    pt: [
      { before: '"Sua pontuação está muito baixa. Você não se qualifica agora."', after: "Nossa IA explica exatamente o porquê — e o que contestar." },
      { before: '"Você tem cobranças antigas no seu relatório."', after: "Cartas de disputa prontas para Equifax, Experian e TransUnion." },
      { before: '"Não sei onde estou ou o que fazer a seguir."', after: "Um plano de 90 dias com passos claros, semana a semana." },
      { before: '"O inglês financeiro é confuso."', after: "Nossa IA fala seu idioma. Literalmente." },
    ],
    es: [
      { before: '"Tu puntaje es muy bajo. No calificas ahora."', after: "Nuestra IA explica exactamente por qué — y qué disputar." },
      { before: '"Tienes cobros antiguos en tu reporte."', after: "Cartas de disputa listas para Equifax, Experian y TransUnion." },
      { before: '"No sé dónde estoy parado ni qué hacer."', after: "Un plan de 90 días con pasos claros, semana a semana." },
      { before: '"El inglés financiero es confuso."', after: "Nuestra IA habla tu idioma. Literalmente." },
    ],
    fr: [
      { before: '"Votre score est trop bas. Vous ne pouvez pas vous qualifier."', after: "Notre IA explique exactement pourquoi — et quoi contester." },
      { before: '"Vous avez d\'anciennes dettes sur votre rapport."', after: "Lettres de contestation prêtes pour Equifax, Experian et TransUnion." },
      { before: '"Je ne sais pas où j\'en suis ni quoi faire."', after: "Un plan de 90 jours avec des étapes claires, semaine par semaine." },
      { before: '"L\'anglais financier est déroutant."', after: "Notre IA parle votre langue. Littéralement." },
    ],
  };

  const labels: Record<string, { problem: string; solution: string; title: string; sub: string }> = {
    en: { problem: "The problem", solution: "What Morabeza does", title: "You've heard these before.", sub: "The problems we solve" },
    pt: { problem: "O problema", solution: "O que o Morabeza faz", title: "Você já ouviu isso antes.", sub: "Os problemas que resolvemos" },
    es: { problem: "El problema", solution: "Lo que hace Morabeza", title: "Ya has escuchado esto antes.", sub: "Los problemas que resolvemos" },
    fr: { problem: "Le problème", solution: "Ce que Morabeza fait", title: "Vous avez déjà entendu ça.", sub: "Les problèmes que nous résolvons" },
  };

  const lang = locale === "kea" ? "en" : locale;
  const p = problems[lang] ?? problems.en;
  const l = labels[lang] ?? labels.en;

  return (
    <section className="bg-muted/30 px-4 py-20">
      <div className="mx-auto max-w-4xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">{l.sub}</p>
        <h2 className="mb-14 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{l.title}</h2>

        <div className="space-y-6">
          {p.map((item, i) => (
            <div key={i} className="grid gap-4 rounded-xl border border-border bg-card p-6 sm:grid-cols-2 sm:gap-8">
              <div>
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">{l.problem}</div>
                <p className="text-muted-foreground leading-relaxed">{item.before}</p>
              </div>
              <div>
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-primary/70">{l.solution}</div>
                <p className="font-medium text-foreground leading-relaxed">{item.after}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
