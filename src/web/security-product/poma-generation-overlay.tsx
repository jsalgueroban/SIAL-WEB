"use client";
import React from "react";

import { Spinner } from "@banasandev/banasan-ui";

const GENERATION_STEPS = [
  "Validar salida, cargue y seguridad",
  "Consolidar pallets, SSCC y referencias",
  "Construir PDF y registrar auditoría",
];

function PomaGenerationSteps({ activeStep }: { activeStep: number }) {
  return (
    <ol
      className="mx-auto mt-6 grid max-w-72 gap-2.5 text-left"
      aria-label="Progreso de generación"
    >
      {GENERATION_STEPS.map((step, index) => {
        const stepNumber = index + 1;
        const reached = stepNumber <= activeStep;
        return (
          <li
            key={step}
            className={`flex items-center gap-2.5 text-[13px] ${
              reached
                ? "font-semibold text-(--color-primary-600)"
                : "text-(--color-text-2)"
            }`}
          >
            <span
              className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                reached
                  ? "bg-(--color-primary-600) text-white"
                  : "border border-(--color-border-subtle) text-(--color-text-3)"
              }`}
            >
              {stepNumber}
            </span>
            {step}
          </li>
        );
      })}
    </ol>
  );
}

interface PomaGenerationOverlayProps {
  activeStep: number;
  show: boolean;
}

export function PomaGenerationOverlay({
  activeStep,
  show,
}: PomaGenerationOverlayProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="poma-generation-title"
        className="w-full max-w-md rounded-(--radius-surface) bg-(--color-surface) p-8 text-center shadow-2xl"
      >
        <div className="flex justify-center">
          <Spinner size="lg" />
        </div>
        <span className="mt-5 block text-[11px] font-semibold uppercase tracking-[.08em] text-(--color-primary-600)">
          Generando documento
        </span>
        <h2
          id="poma-generation-title"
          className="mt-1 text-[20px] font-semibold text-(--color-text)"
        >
          Preparando la POMA
        </h2>
        <p className="mt-2 text-[13px] leading-[1.55] text-(--color-text-2)">
          Consolidando la salida confirmada y validando la información de la
          operación.
        </p>
        <PomaGenerationSteps activeStep={activeStep} />
      </section>
    </div>
  );
}
