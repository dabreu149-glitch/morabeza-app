import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="px-4 pt-20 pb-16 sm:pt-28 sm:pb-24">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <CheckCircle className="h-3 w-3" />
          Trusted by immigrant families across Massachusetts
        </div>

        <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
          {t("hero.title")}
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {t("hero.subtitle")}
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button size="lg" asChild className="gap-2 px-8">
            <Link to="/signup">
              {t("hero.cta")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/chat">{t("hero.secondary")}</Link>
          </Button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-secondary" />
            Free to start
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-secondary" />
            10+ languages
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-secondary" />
            ITIN mortgage guidance
          </div>
        </div>
      </div>
    </section>
  );
}
