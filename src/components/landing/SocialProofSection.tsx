import { Star } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants";

export function SocialProofSection() {
  return (
    <section className="px-4 py-20 bg-muted/40">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Families Who Got Mortgage-Ready
          </h2>
          <p className="text-muted-foreground">Real stories from immigrant families in Massachusetts.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <blockquote className="mb-4 text-sm leading-relaxed text-foreground">
                "{t.quote}"
              </blockquote>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">From {t.origin}</div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <div className="text-secondary font-medium">+{t.score_after - t.score_before} pts</div>
                  <div>{t.score_before} → {t.score_after}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
