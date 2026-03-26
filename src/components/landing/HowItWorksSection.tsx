import { Upload, Cpu, FileText } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export function HowItWorksSection() {
  const { t } = useTranslation();

  const steps = [
    {
      icon: Upload,
      title: t("how.step1.title"),
      desc: t("how.step1.desc"),
      step: "01",
    },
    {
      icon: Cpu,
      title: t("how.step2.title"),
      desc: t("how.step2.desc"),
      step: "02",
    },
    {
      icon: FileText,
      title: t("how.step3.title"),
      desc: t("how.step3.desc"),
      step: "03",
    },
  ];

  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("how.title")}
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={i} className="relative text-center">
              {i < steps.length - 1 && (
                <div className="absolute left-full top-8 hidden w-full border-t border-dashed border-border md:block" style={{ width: "calc(100% - 2rem)", left: "calc(50% + 2rem)" }} />
              )}
              <div className="relative z-10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <step.icon className="h-7 w-7 text-primary" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {step.step}
                </span>
              </div>
              <h3 className="mb-2 font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
