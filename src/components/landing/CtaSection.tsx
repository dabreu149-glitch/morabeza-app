import { Link } from "react-router-dom";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";

export function CtaSection() {
  const { locale } = useTranslation();

  return (
    <section className="px-4 py-24 bg-primary">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
          {locale === "kea"
            ? "Ka spera banku pa diz bu sta prontu."
            : locale === "pt"
            ? "Não espere o banco te dizer que está pronto."
            : locale === "es"
            ? "No esperes que el banco te diga que estás listo."
            : locale === "fr"
            ? "N'attendez pas que la banque vous dise que vous êtes prêt."
            : "Don't wait for a bank to tell you you're ready."}
        </h2>
        <p className="mb-8 text-primary-foreground/80">
          {locale === "kea"
            ? "Manda bu reporte di kreditu agora. É gratis pa kumesa."
            : "Upload your credit report today. Find out exactly where you stand. It's free to start."}
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            variant="secondary"
            asChild
            className="gap-2 px-8 text-base"
          >
            <Link to="/signup">
              <Upload className="h-4 w-4" />
              {locale === "kea" ? "Manda Bu Reporte — Gratis" : "Upload Your Report — Free"}
            </Link>
          </Button>
          <Button
            size="lg"
            variant="ghost"
            asChild
            className="text-primary-foreground hover:text-primary-foreground hover:bg-primary-foreground/10"
          >
            <Link to="/chat">
              {locale === "kea" ? "Papia ku nos primeiro" : "Ask a question first"}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
