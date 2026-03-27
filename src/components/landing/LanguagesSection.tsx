import { useTranslation } from "@/lib/i18n";

const FEATURED_LANGUAGES = [
  { flag: "🇨🇻", name: "Kriolu" },
  { flag: "🇧🇷", name: "Português" },
  { flag: "🇵🇹", name: "Português (PT)" },
  { flag: "🇲🇽", name: "Español" },
  { flag: "🇭🇹", name: "Kreyòl" },
  { flag: "🇫🇷", name: "Français" },
  { flag: "🇨🇳", name: "中文" },
  { flag: "🇻🇳", name: "Tiếng Việt" },
  { flag: "🇸🇦", name: "العربية" },
  { flag: "🇮🇳", name: "हिंदी" },
];

export function LanguagesSection() {
  const { locale } = useTranslation();

  const heading =
    locale === "pt" ? "Nós entendemos." :
    locale === "es" ? "Nosotros entendemos." :
    locale === "fr" ? "Nous comprenons." :
    "We understand.";

  const sub =
    locale === "pt" ? "Mais de 40 idiomas, com contexto cultural integrado. Não apenas traduzimos palavras — entendemos como sua comunidade pensa sobre dinheiro, propriedade e família." :
    locale === "es" ? "Más de 40 idiomas, con contexto cultural integrado. No solo traducimos palabras — entendemos cómo tu comunidad piensa sobre dinero, propiedad y familia." :
    locale === "fr" ? "Plus de 40 langues, avec un contexte culturel intégré. Nous ne traduisons pas seulement les mots — nous comprenons comment votre communauté pense à l'argent, à la propriété et à la famille." :
    "40+ languages, with cultural context built in. We don't just translate words — we understand how your community thinks about money, property, and family.";

  const more =
    locale === "pt" ? "+35 mais" :
    locale === "es" ? "+35 más" :
    locale === "fr" ? "+35 autres" :
    "+35 more";

  return (
    <section className="px-4 py-20 bg-muted/30">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {heading}
        </h2>
        <p className="mb-10 max-w-xl text-muted-foreground leading-relaxed">
          {sub}
        </p>

        <div className="flex flex-wrap gap-2">
          {FEATURED_LANGUAGES.map((lang) => (
            <div
              key={lang.name}
              className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm"
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </div>
          ))}
          <div className="flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground">
            {more}
          </div>
        </div>
      </div>
    </section>
  );
}
