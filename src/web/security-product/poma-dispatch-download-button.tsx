// Adapted from fe-sial-web 4dfeb23d: poma/components/poma-dispatch-download-button.tsx
import React from "react";
"use client";

import { Button, DocumentFileIcon } from "@banasandev/banasan-ui";
import {
  resolvePomaLoadingByDispatchAction,
  type PomaDispatchLookup,
  type PomaLoadingIdentity,
  usePomaGeneration,
} from "./bridge";
import { PomaGenerationOverlay } from "./poma-generation-overlay";

function responseIdentity(
  response: Awaited<ReturnType<typeof resolvePomaLoadingByDispatchAction>>,
): PomaLoadingIdentity {
  if (!response.ok || response.success === false || !response.data) {
    throw new Error(
      response.message?.trim() ||
        "No fue posible identificar el POMA de la salida seleccionada.",
    );
  }

  return response.data;
}

export function PomaDispatchDownloadButton(lookup: PomaDispatchLookup) {
  const { generate, generationStep, isGenerating } = usePomaGeneration();

  const generateSelectedPoma = () =>
    generate(async () =>
      responseIdentity(await resolvePomaLoadingByDispatchAction(lookup)),
    );

  return (
    <>
      <Button
        variant="filled"
        disabled={isGenerating}
        onClick={generateSelectedPoma}
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
