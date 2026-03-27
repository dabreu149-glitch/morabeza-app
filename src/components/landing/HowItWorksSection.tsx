import { Link } from "react-router-dom";
import { useTranslation } from "@/lib/i18n";

export function HowItWorksSection() {
  const { t, locale } = useTranslation();

  const steps = [
    {
      number: "01",
      title: locale === "kea" ? "Manda bu reporte di kreditu" : t("how.step1.title"),
      desc:
        locale === "kea"
          ? "PDF di Equifax, Experian, o TransUnion. Ka importa kual — nu ta le tudu."
          : "PDF from Equifax, Experian, or TransUnion. Doesn't matter which — we read all of them.",
    },
    {
      number: "02",
      title: locale === "kea" ? "IA ta analiza tudu" : t("how.step2.title"),
      desc:
        locale === "kea"
          ? "Nos IA ta otja kada linha. Ta atxa tudu item negatibu. Ta splika bu kuma fala ingles simples — o Kriolu si bu kre."
          : "Our AI reads every line. Finds every negative item. Explains it in plain English — or Kriolu if you prefer.",
    },
    {
      number: "03",
      title: locale === "kea" ? "Bu resebe bu planu" : t("how.step3.title"),
      desc:
        locale === "kea"
          ? "Kartas di disputa prontu pa manda. Planu di 90 dia. Bu skoru di prontidão. Tudu na mesmu lugar."
          : "Dispute letters ready to mail. 90-day action plan. Your mortgage readiness score. All in one place.",
    },
  ];

  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t("how.title")}
        </h2>
        <p className="mb-14 text-muted-foreground">
          {locale === "kea"
            ? "10 minutus pa kumesa. 90 dias pa sta prontu."
            : "10 minutes to start. 90 days to get ready."}
        </p>

        <div className="space-y-0">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex gap-8 border-t border-border py-10 last:border-b"
            >
              <div className="w-10 shrink-0 pt-1 text-4xl font-bold text-primary/20 leading-none select-none">
                {step.number}
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="leading-relaxed text-muted-foreground">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            {locale === "kea" ? "Kumesa agora — é gratis" : "Start now — it's free"} →
          </Link>
        </div>
      </div>
    </section>
  );
}
