import { useTranslation } from "@/lib/i18n";

export function SocialProofSection() {
  const { locale } = useTranslation();

  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-12 md:grid-cols-2">
          {/* Origin story */}
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
              {locale === "kea" ? "Pamodi nos kriau Morabeza" : "Why we built this"}
            </p>
            <h2 className="mb-5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {locale === "kea"
                ? "Nu konxi kel situason li."
                : "We know this situation personally."}
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                {locale === "kea"
                  ? "Txeu familia Cape Verdean ta bin Amerika ku sonhu di ten kaza propriu. Ma banku ta diz \"no\" sin splika kuma bu pode muda keli."
                  : "Too many Cape Verdean, Brazilian, Latino, and Haitian families come to America with the dream of owning a home. And too many hear \"no\" from a bank without understanding why — or what to do next."}
              </p>
              <p>
                {locale === "kea"
                  ? "Morabeza foi kriadu pa djuda — na bu lingua, ku pasiensia, sem julga."
                  : "Morabeza was built to change that. In your language. At your pace. Without judgment."}
              </p>
            </div>
          </div>

          {/* The real promise */}
          <div className="flex flex-col gap-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-1 text-3xl font-bold text-foreground">FCRA</div>
              <p className="text-sm text-muted-foreground">
                {locale === "kea"
                  ? "Bu tem diritu legal pa disputa item inkoretu na bu reporte. Morabeza ta skriva kel kartas li pa bu."
                  : "You have a legal right to dispute inaccurate items on your credit report. Morabeza writes those letters for you."}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-1 text-3xl font-bold text-foreground">ITIN</div>
              <p className="text-sm text-muted-foreground">
                {locale === "kea"
                  ? "Ka tem green card inda? Ainda é posivel kompra kaza. Nos ta splika bu kuma."
                  : "No green card yet? Homeownership may still be possible. We explain your ITIN mortgage options."}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-1 text-3xl font-bold text-primary">5 {locale === "kea" ? "linguas" : "languages"}</div>
              <p className="text-sm text-muted-foreground">
                {locale === "kea"
                  ? "Kriolu, Portuges, Espanhol, Franses, Ingles. Papia kuma bu ta papia na kaza."
                  : "Kriolu, Portuguese, Spanish, French, English. Speak the way you speak at home."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
