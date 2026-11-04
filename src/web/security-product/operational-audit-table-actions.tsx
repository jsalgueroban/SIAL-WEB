// Adapted from fe-sial-web 4dfeb23d: operational/components/operational-audit-table-actions.tsx
import React from "react";
"use client";

import { Button, Chip } from "@banasandev/banasan-ui";
import {
  filterOperationalAuditEvents,
  getOperationalAuditFilters,
  type OperationalAuditEvent,
} from "./bridge";
import { useQueryParams } from "./bridge";

interface OperationalAuditTableActionsProps {
  events: OperationalAuditEvent[];
}



export function OperationalAuditTableActions({ events }: OperationalAuditTableActionsProps) {
  const { params, setParam } = useQueryParams();
  const filters = getOperationalAuditFilters(params);
  const visibleEvents = filterOperationalAuditEvents(events, filters);
  const showAdvanced = params?.get("advanced") === "true";

  const toggleAdvanced = () => setParam("advanced", showAdvanced ? undefined : "true");


  return (
    <>
      <Chip tone="info">{`${visibleEvents.length} ${visibleEvents.length === 1 ? "operación visible" : "operaciones visibles"}`}</Chip>
      <Button variant="outlined" onClick={toggleAdvanced}>
        {showAdvanced ? "Ocultar filtros" : "Más filtros"}
      </Button>

    </>
  );
}

