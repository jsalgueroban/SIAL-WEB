"use client";
import React from "react";

import { Button, DocumentFileIcon } from "@banasandev/banasan-ui";
import {
  type PomaLoadingIdentity,
  usePomaGeneration,
} from "./bridge";
import { PomaGenerationOverlay } from "./poma-generation-overlay";

interface PomaDownloadButtonProps extends PomaLoadingIdentity {
  pomaAvailable: boolean;
  pomaGenerationCount: number;
}

export function PomaDownloadButton({
  loadingId,
  loadingType,
  pomaAvailable,
}: PomaDownloadButtonProps) {
  const { generate, generationStep, isGenerating } = usePomaGeneration();
  const generatePoma = () =>
    generate(async () => ({ loadingId, loadingType }));

  return (
    <>
      <Button
        variant="filled"
        disabled={!pomaAvailable || isGenerating}
        onClick={generatePoma}
        className="whitespace-nowrap max-[720px]:w-full"
      >
        <DocumentFileIcon size={17} />
        {isGenerating ? "Generando..." : "Generar POMA"}
      </Button>
      <PomaGenerationOverlay
        show={isGenerating}
        activeStep={generationStep}
      />
    </>
  );
}
