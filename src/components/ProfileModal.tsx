import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface ProfileModalProps {
  open: boolean;
  onClose: (saved: boolean) => void;
}

export function ProfileModal({ open, onClose }: ProfileModalProps) {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [mailingAddress, setMailingAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    if (!fullName.trim() || !mailingAddress.trim()) {
      toast.error("Please fill in both fields.");
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, full_name: fullName.trim(), mailing_address: mailingAddress.trim() });
    setLoading(false);
    if (error) {
      toast.error("Failed to save profile. Please try again.");
    } else {
      onClose(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>One more thing before we start</DialogTitle>
          <DialogDescription>
            We need your name and mailing address to generate your FCRA dispute letters. This information stays private.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="pm-name">Full Name</Label>
            <Input
              id="pm-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Maria Silva"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pm-address">Mailing Address</Label>
            <Input
              id="pm-address"
              value={mailingAddress}
              onChange={(e) => setMailingAddress(e.target.value)}
              placeholder="123 Main St, Brockton, MA 02301"
            />
          </div>
          <Button onClick={handleSave} className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save & Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
