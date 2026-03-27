import { Link } from "react-router-dom";
import { ArrowRight, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";

export function HeroSection() {
  const { t, locale } = useTranslation();

  return (
    <section className="px-4 pt-16 pb-20 sm:pt-24 sm:pb-28">
      <div className="mx-auto max-w-4xl">
        {/* Eyebrow */}
        <p className="mb-5 text-sm font-medium uppercase tracking-widest text-primary">
          {locale === "kea" ? "Brockton, Massachusetts" : "Built for Brockton, Massachusetts"}
        </p>

        {/* Headline */}
        <h1 className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl">
          {locale === "kea" ? (
            <>
              Bu skoru di kreditu<br />
              <span className="text-primary">ka sta bu futuru.</span>
            </>
          ) : locale === "pt" ? (
            <>
              Sua pontuação de crédito<br />
              <span className="text-primary">não é seu futuro.</span>
            </>
          ) : locale === "es" ? (
            <>
              Tu puntaje de crédito<br />
              <span className="text-primary">no es tu futuro.</span>
            </>
          ) : locale === "fr" ? (
            <>
              Votre score de crédit<br />
              <span className="text-primary">n'est pas votre avenir.</span>
            </>
          ) : (
            <>
              Your credit score<br />
              <span className="text-primary">is not your future.</span>
            </>
          )}
        </h1>

        {/* Sub */}
        <p className="mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {locale === "kea"
            ? "Manda bu reporte de kreditu. Morabeza ta analiza, ta skriva kartas di disputa pa tudu 3 bureaus, e ta kria bu planu di 90 dia pa kompra kaza."
            : "Upload your credit report. Morabeza analyzes it, writes FCRA dispute letters for all 3 bureaus, and builds your personal 90-day plan to get mortgage-ready."}
        </p>

        {/* CTAs */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" asChild className="gap-2 px-8 text-base">
            <Link to="/signup">
              <Upload className="h-4 w-4" />
              {locale === "kea" ? "Manda Bu Reporte" : t("hero.cta")}
            </Link>
          </Button>
          <Button variant="ghost" size="lg" asChild className="gap-1 text-base">
            <Link to="/chat">
              {locale === "kea" ? "Papia ku nos primeiro" : "Ask a question first"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Honest stats — no fake social proof */}
        <div className="mt-14 grid grid-cols-3 gap-6 border-t border-border pt-10 sm:grid-cols-3">
          <div>
            <div className="text-2xl font-bold text-foreground">$0</div>
            <div className="mt-1 text-sm text-muted-foreground">
              {locale === "kea" ? "Pa kumesa" : "To start"}
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">90</div>
            <div className="mt-1 text-sm text-muted-foreground">
              {locale === "kea" ? "Dias di planu" : "Day plan"}
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">3</div>
            <div className="mt-1 text-sm text-muted-foreground">
              {locale === "kea" ? "Kartas di disputa" : "Dispute letters"}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
