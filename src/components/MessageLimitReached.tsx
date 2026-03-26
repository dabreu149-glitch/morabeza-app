import { Link } from "react-router-dom";
import { MessageSquareOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MessageLimitReached() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-muted/20 p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
        <MessageSquareOff className="h-6 w-6 text-muted-foreground" />
      </div>
      <div>
        <h3 className="font-semibold text-foreground">Daily message limit reached</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          You've used your 20 free messages for today. Sign up for a free account to continue chatting.
        </p>
      </div>
      <div className="flex gap-2">
        <Button asChild size="sm">
          <Link to="/signup">Create Free Account</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link to="/signin">Sign In</Link>
        </Button>
      </div>
    </div>
  );
}
