import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                <Home className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">
                Morabeza<span className="text-primary">.ai</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              AI-powered mortgage readiness for immigrant families. "Morabeza" means warmth and hospitality in Cape Verdean Kriolu.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product</h3>
            <div className="flex flex-col gap-2">
              <Link to="/credit" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Credit Analysis</Link>
              <Link to="/chat" className="text-sm text-muted-foreground hover:text-foreground transition-colors">AI Chat</Link>
              <Link to="/resources" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Resources</Link>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Account</h3>
            <div className="flex flex-col gap-2">
              <Link to="/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Get Started</Link>
              <Link to="/signin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
              <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Community</h3>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Cape Verdean</span>
              <span className="text-sm text-muted-foreground">Brazilian</span>
              <span className="text-sm text-muted-foreground">Latino</span>
              <span className="text-sm text-muted-foreground">Haitian</span>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>© 2025 Morabeza.ai. All rights reserved.</span>
          <span>Made with warmth for immigrant families.</span>
        </div>
      </div>
    </footer>
  );
}
