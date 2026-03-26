import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AgentRunner } from "@/components/AgentRunner";

export default function AgentProgress() {
  const location = useLocation();
  const navigate = useNavigate();
  const reportId = (location.state as { reportId?: string })?.reportId;

  useEffect(() => {
    if (!reportId) navigate("/credit", { replace: true });
  }, [reportId, navigate]);

  if (!reportId) return null;

  return (
    <div className="min-h-screen bg-background">
      <AgentRunner reportId={reportId} />
    </div>
  );
}
