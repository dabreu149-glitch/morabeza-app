import { SUPPORTED_LANGUAGES } from "@/lib/constants";

export function LanguagesSection() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Your Language, Your Home
        </h2>
        <p className="mb-12 text-muted-foreground">
          Morabeza speaks your language — including Kriolu, the heart of our community.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <div
              key={lang.code}
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm"
            >
              {lang.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
