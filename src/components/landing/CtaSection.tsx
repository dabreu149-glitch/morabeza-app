import { Link } from "react-router-dom";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";

export function CtaSection() {
  const { locale } = useTranslation();

  const headline =
    locale === "pt" ? "Não espere o banco te dizer que está pronto." :
    locale === "es" ? "No esperes que el banco te diga que estás listo." :
    locale === "fr" ? "N'attendez pas que la banque vous dise que vous êtes prêt." :
    "Don't wait for a bank to tell you you're ready.";

  const sub =
    locale === "pt" ? "Envie seu relatório de crédito hoje. Veja exatamente onde você está. É grátis para começar." :
    locale === "es" ? "Sube tu reporte de crédito hoy. Descubre exactamente dónde estás. Es gratis para empezar." :
    locale === "fr" ? "Téléchargez votre rapport de crédit aujourd'hui. Voyez exactement où vous en êtes. C'est gratuit." :
    "Upload your credit report today. Find out exactly where you stand. It's free to start.";

  const btnLabel =
    locale === "pt" ? "Enviar Relatório — Grátis" :
    locale === "es" ? "Subir Reporte — Gratis" :
    locale === "fr" ? "Télécharger le Rapport — Gratuit" :
    "Upload Your Report — Free";

  const chatLabel =
    locale === "pt" ? "Fale conosco primeiro" :
    locale === "es" ? "Haz una pregunta primero" :
    locale === "fr" ? "Posez une question d'abord" :
    "Ask a question first";

  return (
    <section className="px-4 py-24 bg-primary">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
          {headline}
        </h2>
        <p className="mb-8 text-primary-foreground/80">{sub}</p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button size="lg" variant="secondary" asChild className="gap-2 px-8 text-base">
            <Link to="/credit">
              <Upload className="h-4 w-4" />
              {btnLabel}
            </Link>
          </Button>
          <Button size="lg" variant="ghost" asChild className="text-primary-foreground hover:text-primary-foreground hover:bg-primary-foreground/10">
            <Link to="/chat">{chatLabel}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
