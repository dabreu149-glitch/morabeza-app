import { useTranslation } from "@/lib/i18n";

export function SocialProofSection() {
  const { locale } = useTranslation();

  const copy = {
    en: {
      eyebrow: "Why we built this",
      title: "We know this situation personally.",
      p1: "Too many Cape Verdean, Brazilian, Latino, and Haitian families come to America with the dream of owning a home. And too many hear \"no\" from a bank without understanding why — or what to do next.",
      p2: "Morabeza was built to change that. In your language. At your pace. Without judgment.",
      fcra: "You have a legal right to dispute inaccurate items on your credit report. Morabeza writes those letters for you.",
      itin: "No green card yet? Homeownership may still be possible. We explain your ITIN mortgage options.",
      lang: "Kriolu, Portuguese, Spanish, French, English. Speak the way you speak at home.",
      langLabel: "5 languages",
    },
    pt: {
      eyebrow: "Por que construímos isso",
      title: "Conhecemos essa situação pessoalmente.",
      p1: "Muitas famílias cabo-verdianas, brasileiras, latinas e haitianas vêm para a América com o sonho de ter uma casa. E muitas ouvem \"não\" do banco sem entender o porquê — ou o que fazer a seguir.",
      p2: "O Morabeza foi criado para mudar isso. No seu idioma. No seu ritmo. Sem julgamento.",
      fcra: "Você tem direito legal de contestar itens incorretos em seu relatório de crédito. O Morabeza escreve essas cartas para você.",
      itin: "Ainda sem green card? A casa própria ainda pode ser possível. Explicamos suas opções de hipoteca com ITIN.",
      lang: "Kriolu, Português, Espanhol, Francês, Inglês. Fale do jeito que fala em casa.",
      langLabel: "5 idiomas",
    },
    es: {
      eyebrow: "Por qué construimos esto",
      title: "Conocemos esta situación personalmente.",
      p1: "Demasiadas familias caboverdianas, brasileñas, latinas y haitianas vienen a América con el sueño de tener una casa. Y demasiadas escuchan \"no\" del banco sin entender por qué — ni qué hacer a continuación.",
      p2: "Morabeza fue construido para cambiar eso. En tu idioma. A tu ritmo. Sin juicios.",
      fcra: "Tienes el derecho legal de disputar artículos incorrectos en tu reporte de crédito. Morabeza escribe esas cartas por ti.",
      itin: "¿Todavía sin green card? La propiedad puede seguir siendo posible. Explicamos tus opciones de hipoteca ITIN.",
      lang: "Kriolu, Portugués, Español, Francés, Inglés. Habla como hablas en casa.",
      langLabel: "5 idiomas",
    },
    fr: {
      eyebrow: "Pourquoi nous avons créé ceci",
      title: "Nous connaissons cette situation personnellement.",
      p1: "Trop de familles cap-verdiennes, brésiliennes, latinos et haïtiennes viennent en Amérique avec le rêve d'avoir une maison. Et trop entendent \"non\" de la banque sans comprendre pourquoi — ni quoi faire ensuite.",
      p2: "Morabeza a été créé pour changer cela. Dans votre langue. À votre rythme. Sans jugement.",
      fcra: "Vous avez le droit légal de contester les éléments inexacts de votre rapport de crédit. Morabeza rédige ces lettres pour vous.",
      itin: "Pas encore de green card ? L'accession à la propriété peut encore être possible. Nous expliquons vos options de prêt ITIN.",
      lang: "Kriolu, Portugais, Espagnol, Français, Anglais. Parlez comme vous parlez chez vous.",
      langLabel: "5 langues",
    },
  };

  const lang = locale === "kea" ? "en" : locale;
  const c = copy[lang as keyof typeof copy] ?? copy.en;

  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">{c.eyebrow}</p>
            <h2 className="mb-5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{c.title}</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>{c.p1}</p>
              <p>{c.p2}</p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-1 text-3xl font-bold text-foreground">FCRA</div>
              <p className="text-sm text-muted-foreground">{c.fcra}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-1 text-3xl font-bold text-foreground">ITIN</div>
              <p className="text-sm text-muted-foreground">{c.itin}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-1 text-3xl font-bold text-primary">{c.langLabel}</div>
              <p className="text-sm text-muted-foreground">{c.lang}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
