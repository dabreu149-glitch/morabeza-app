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
          {locale === "pt" ? "Para famílias imigrantes nos EUA" : locale === "es" ? "Para familias inmigrantes en EE.UU." : locale === "fr" ? "Pour les familles immigrantes aux États-Unis" : "For immigrant families across the U.S."}
        </p>

        {/* Headline */}
        <h1 className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl">
          {locale === "pt" ? (
            <>Sua pontuação de crédito<br /><span className="text-primary">não é seu futuro.</span></>
          ) : locale === "es" ? (
            <>Tu puntaje de crédito<br /><span className="text-primary">no es tu futuro.</span></>
          ) : locale === "fr" ? (
            <>Votre score de crédit<br /><span className="text-primary">n'est pas votre avenir.</span></>
          ) : (
            <>Your credit score<br /><span className="text-primary">is not your future.</span></>
          )}
        </h1>

        {/* Sub */}
        <p className="mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {t("hero.subtitle")}
        </p>

        {/* CTAs */}
        <div className="flex flex-col gap-3 sm:flex-row" id="how-it-works">
          <Button size="lg" asChild className="gap-2 px-8 text-base">
            <Link to="/signup">
              <Upload className="h-4 w-4" />
              {t("hero.cta")}
            </Link>
          </Button>
          <Button variant="ghost" size="lg" asChild className="gap-1 text-base">
            <Link to="/chat">
              {locale === "pt" ? "Fale conosco primeiro" : locale === "es" ? "Haz una pregunta primero" : locale === "fr" ? "Posez une question d'abord" : "Ask a question first"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Trust line */}
        <p className="mt-4 text-sm text-muted-foreground">
          {locale === "pt"
            ? "Sem cartão de crédito · ITIN aceito · Disponível em 40+ idiomas"
            : locale === "es"
            ? "Sin tarjeta de crédito · ITIN aceptado · Disponible en 40+ idiomas"
            : locale === "fr"
            ? "Sans carte de crédit · ITIN accepté · Disponible en 40+ langues"
            : "No credit card · ITIN accepted · Available in 40+ languages"}
        </p>

        {/* Honest stats */}
        <div className="mt-14 grid grid-cols-3 gap-6 border-t border-border pt-10">
          <div>
            <div className="text-2xl font-bold text-foreground">$0</div>
            <div className="mt-1 text-sm text-muted-foreground">
              {locale === "pt" ? "Para começar" : locale === "es" ? "Para empezar" : locale === "fr" ? "Pour commencer" : "To start"}
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">90</div>
            <div className="mt-1 text-sm text-muted-foreground">
              {locale === "pt" ? "Dias de plano" : locale === "es" ? "Días de plan" : locale === "fr" ? "Jours de plan" : "Day plan"}
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">3</div>
            <div className="mt-1 text-sm text-muted-foreground">
              {locale === "pt" ? "Cartas de disputa" : locale === "es" ? "Cartas de disputa" : locale === "fr" ? "Lettres de contestation" : "Dispute letters"}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
