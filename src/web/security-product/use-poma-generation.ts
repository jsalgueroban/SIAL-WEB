// Adapted from fe-sial-web 4dfeb23d: poma/hooks/use-poma-generation.ts
"use client";

import { useToast } from "./bridge";
import { downloadPoma, type PomaLoadingIdentity } from "./bridge";
import { useRouter } from "./bridge";
import { useEffect, useRef, useState } from "react";

type ResolvePomaLoadingIdentity = () => Promise<PomaLoadingIdentity>;

export function usePomaGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(1);
  const stepTimers = useRef<number[]>([]);
  const { showToast } = useToast();
  const router = useRouter();

  const clearStepTimers = () => {
    stepTimers.current.forEach((timer) => window.clearTimeout(timer));
    stepTimers.current = [];
  };

  useEffect(() => clearStepTimers, []);

  const generate = async (resolveIdentity: ResolvePomaLoadingIdentity) => {
    if (isGenerating) return;

    setIsGenerating(true);
    setGenerationStep(1);
    stepTimers.current.push(
      window.setTimeout(() => setGenerationStep(2), 650),
      window.setTimeout(() => setGenerationStep(3), 1250),
    );

    try {
      const identity = await resolveIdentity();
      await downloadPoma(identity);
      showToast({
        message: "El POMA se generó y descargó correctamente.",
        variant: "success",
      });
      router.refresh();
    } catch (error) {
      showToast({
        message:
          error instanceof Error
            ? error.message
            : "No fue posible generar el POMA.",
        variant: "error",
      });
    } finally {
      clearStepTimers();
      setGenerationStep(1);
      setIsGenerating(false);
    }
  };

  return { generate, generationStep, isGenerating };
}
