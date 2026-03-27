import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

const LANG_OPTIONS = [
  { code: "en" as const, label: "EN" },
  { code: "kea" as const, label: "KRY" },
  { code: "pt" as const, label: "PT" },
  { code: "es" as const, label: "ES" },
  { code: "fr" as const, label: "FR" },
];

export function Navbar() {
  const { user } = useAuth();
  const { t, locale, setLocale } = useTranslation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Home className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold tracking-tight text-foreground">
              Morabeza<span className="text-primary">.ai</span>
            </span>
          </Link>

          {/* Language switcher */}
          <div className="hidden items-center gap-1 md:flex">
            {LANG_OPTIONS.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLocale(lang.code)}
                className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                  locale === lang.code
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* Desktop nav */}
          <div className="hidden items-center gap-6 md:flex">
            <Link to="/resources" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("nav.resources")}
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("nav.dashboard")}
                </Link>
                <Link to="/chat" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("nav.chat")}
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  {t("nav.signout")}
                </Button>
                <Button size="sm" asChild>
                  <Link to="/credit">{t("nav.credit")}</Link>
                </Button>
              </>
            ) : (
              <>
                <Link to="/signin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("nav.signin")}
                </Link>
                <Button size="sm" asChild>
                  <Link to="/signup">{t("nav.signup")}</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="border-t border-border pb-4 pt-2 md:hidden">
            {/* Mobile language switcher */}
            <div className="flex items-center gap-1 px-2 py-2">
              {LANG_OPTIONS.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLocale(lang.code)}
                  className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                    locale === lang.code
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <Link to="/resources" className="px-2 py-2 text-sm text-muted-foreground" onClick={() => setMenuOpen(false)}>
                {t("nav.resources")}
              </Link>
              {user ? (
                <>
                  <Link to="/dashboard" className="px-2 py-2 text-sm text-muted-foreground" onClick={() => setMenuOpen(false)}>
                    {t("nav.dashboard")}
                  </Link>
                  <Link to="/chat" className="px-2 py-2 text-sm text-muted-foreground" onClick={() => setMenuOpen(false)}>
                    {t("nav.chat")}
                  </Link>
                  <button onClick={handleSignOut} className="px-2 py-2 text-sm text-left text-muted-foreground">
                    {t("nav.signout")}
                  </button>
                  <Button size="sm" asChild className="mx-2">
                    <Link to="/credit" onClick={() => setMenuOpen(false)}>{t("nav.credit")}</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/signin" className="px-2 py-2 text-sm text-muted-foreground" onClick={() => setMenuOpen(false)}>
                    {t("nav.signin")}
                  </Link>
                  <Button size="sm" asChild className="mx-2">
                    <Link to="/signup" onClick={() => setMenuOpen(false)}>{t("nav.signup")}</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
