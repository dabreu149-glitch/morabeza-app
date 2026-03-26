import { useMemo } from "react";
import { DOCUMENT_CHECKLIST } from "@/lib/constants";

interface ReadinessInputs {
  creditScore?: number | null;
  dti?: number | null;
  savings?: number | null;
  completedDocIds?: string[];
}

interface ReadinessScore {
  score: number;
  color: "red" | "yellow" | "green";
  breakdown: {
    credit: number;
    dti: number;
    savings: number;
    documents: number;
  };
}

export function useReadinessScore(inputs: ReadinessInputs): ReadinessScore {
  return useMemo(() => {
    const { creditScore, dti, savings, completedDocIds = [] } = inputs;

    const creditWeight = Math.min(
      40,
      Math.round((Math.max(0, (creditScore ?? 300) - 300) / 550) * 40)
    );
    const dtiWeight = Math.min(
      20,
      Math.round((Math.max(0, 50 - (dti ?? 50)) / 50) * 20)
    );
    const savingsWeight = Math.min(
      20,
      Math.round(((savings ?? 0) / 20000) * 20)
    );
    const totalDocSteps = DOCUMENT_CHECKLIST.length;
    const documentsWeight = Math.round(
      (completedDocIds.length / totalDocSteps) * 20
    );

    const score = creditWeight + dtiWeight + savingsWeight + documentsWeight;
    const color =
      score <= 40 ? "red" : score <= 70 ? "yellow" : "green";

    return {
      score,
      color,
      breakdown: {
        credit: creditWeight,
        dti: dtiWeight,
        savings: savingsWeight,
        documents: documentsWeight,
      },
    };
  }, [inputs]);
}
