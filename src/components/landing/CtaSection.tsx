import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";

export function CtaSection() {
  const { t } = useTranslation();
  return (
    <section className="px-4 py-24 bg-primary/5">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Ready to Start Your Journey Home?
        </h2>
        <p className="mb-8 text-muted-foreground">
          Join thousands of immigrant families building their path to homeownership.
          It's free to start.
        </p>
        <Button size="lg" asChild className="gap-2 px-8">
          <Link to="/signup">
            {t("hero.cta")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
