import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { CreditReportUpload } from "@/components/CreditReportUpload";
import { ProfileModal } from "@/components/ProfileModal";
import { Navbar } from "@/components/landing/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { useAnalytics } from "@/hooks/use-analytics";
import { useTranslation } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

export default function Credit() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { trackPageView, trackEvent } = useAnalytics();
  const { t } = useTranslation();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const checked = useRef(false);

  useEffect(() => {
    trackPageView("/credit");
  }, [trackPageView]);

  useEffect(() => {
    if (!user || checked.current) return;
    checked.current = true;
    supabase
      .from("profiles")
      .select("full_name, mailing_address")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        const profile = data as { full_name: string | null; mailing_address: string | null } | null;
        if (!profile?.full_name || !profile?.mailing_address) {
          setShowProfileModal(true);
        }
      });
  }, [user]);

  const handleUpload = async (file: File) => {
    if (!user) {
      navigate("/signin");
      return;
    }
    setUploading(true);
    try {
      // Create a credit_reports record
      const { data: reportData, error: reportError } = await supabase
        .from("credit_reports")
        .insert({ user_id: user.id, status: "analyzing" })
        .select("id")
        .single();

      if (reportError || !reportData) {
        throw new Error("Failed to create report record");
      }

      const reportId = (reportData as { id: string }).id;

      // Convert file to base64
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let binary = "";
      for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
      const fileBase64 = btoa(binary);

      trackEvent("credit_report_uploaded");

      // Kick off async analysis
      const { data: { session } } = await supabase.auth.getSession();
      fetch(`${SUPABASE_URL}/functions/v1/analyze-credit-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          fileBase64,
          fileName: file.name,
          reportId,
          userId: user.id,
        }),
      }).catch(() => {
        // Analysis runs async; errors handled via polling in AgentRunner
      });

      navigate("/agent-progress", { state: { reportId } });
    } catch (err) {
      toast.error("Upload failed. Please try again.");
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
            {t("upload.title")}
          </h1>
          <p className="text-muted-foreground">{t("upload.subtitle")}</p>
        </div>
        {uploading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">{t("upload.analyzing")}</p>
          </div>
        ) : (
          <CreditReportUpload onUpload={handleUpload} isUploading={uploading} />
        )}
      </main>
      <ProfileModal
        open={showProfileModal}
        onClose={(saved) => {
          setShowProfileModal(false);
          if (saved) toast.success("Profile saved!");
        }}
      />
    </div>
  );
}
