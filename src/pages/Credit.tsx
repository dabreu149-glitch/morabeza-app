import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { useAnalytics } from "@/hooks/use-analytics";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

export default function Credit() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { trackPageView, trackEvent } = useAnalytics();
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const checked = useRef(false);

  useEffect(() => {
    trackPageView("/credit");
  }, [trackPageView]);

  // Check profile completeness for logged-in users (silent — no modal needed here)
  useEffect(() => {
    if (!user || checked.current) return;
    checked.current = true;
  }, [user]);

  const runUpload = async (userId: string) => {
    if (!file) return;
    setUploading(true);
    try {
      const { data: reportData, error: reportError } = await supabase
        .from("credit_reports")
        .insert({ user_id: userId, status: "analyzing" })
        .select("id")
        .single();

      if (reportError || !reportData) throw new Error("Failed to create report");

      const reportId = (reportData as { id: string }).id;

      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let binary = "";
      for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
      const fileBase64 = btoa(binary);

      trackEvent("credit_report_uploaded");

      const { data: { session } } = await supabase.auth.getSession();
      fetch(`${SUPABASE_URL}/functions/v1/analyze-credit-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ fileBase64, fileName: file.name, reportId, userId }),
      }).catch(() => {});

      navigate("/agent-progress", { state: { reportId } });
    } catch {
      toast.error("Upload failed. Please try again.");
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!file) { toast.error("Please select your credit report PDF first."); return; }

    if (user) {
      await runUpload(user.id);
      return;
    }

    if (!email || !password) { toast.error("Please enter your email and password."); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters."); return; }

    setUploading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      toast.error(error.message);
      setUploading(false);
      return;
    }
    const userId = data.user?.id;
    if (!userId) {
      toast.error("Signup failed. Please try again.");
      setUploading(false);
      return;
    }
    await runUpload(userId);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") setFile(dropped);
    else toast.error("Please upload a PDF file.");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected?.type === "application/pdf") setFile(selected);
    else if (selected) toast.error("Please upload a PDF file.");
  };

  if (uploading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Analyzing your credit report...</p>
        <p className="text-xs text-muted-foreground">This takes about 30 seconds</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-xl px-4 py-16">

        <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
          Upload Your Credit Report
        </h1>
        <p className="mb-10 text-muted-foreground">
          PDF from Equifax, Experian, or TransUnion. Free to analyze.
        </p>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`mb-6 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
            dragging ? "border-primary bg-primary/5" :
            file ? "border-primary bg-primary/5" :
            "border-border hover:border-primary/50 hover:bg-muted/30"
          }`}
        >
          <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
          <Upload className={`mb-3 h-8 w-8 ${file ? "text-primary" : "text-muted-foreground"}`} />
          {file ? (
            <>
              <p className="font-medium text-foreground">{file.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">Click to change file</p>
            </>
          ) : (
            <>
              <p className="font-medium text-foreground">Drag your PDF here or click to browse</p>
              <p className="mt-1 text-sm text-muted-foreground">Equifax · Experian · TransUnion</p>
            </>
          )}
        </div>

        {/* Sign-up fields for guests */}
        {!user && (
          <div className="mb-6 space-y-3">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Create a password</Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        )}

        <Button onClick={handleSubmit} className="w-full" size="lg">
          {user ? "Analyze My Report" : "Create Account & Analyze — Free"}
        </Button>

        {!user && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/signin" className="text-primary hover:underline">Sign in</Link>
          </p>
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          No credit card · ITIN accepted · Your data is private
        </p>
      </main>
    </div>
  );
}
