// Adapted from fe-sial-web 4dfeb23d: poma/components/poma-toolbar.tsx
import React from "react";
"use client";

import { Button, SearchIcon, TextInput } from "@banasandev/banasan-ui";
import { PermissionGate } from "./bridge";
import { useQueryParams } from "./bridge";
import { type FormEvent, useEffect, useState } from "react";

export function PomaToolbar() {
  const { params, setParams } = useQueryParams();
  const radicationParam = params.get("radication") ?? "";
  const [invalid, setInvalid] = useState(false);
  const [radication, setRadication] = useState(radicationParam);

  useEffect(() => {
    setRadication(radicationParam);
  }, [radicationParam]);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!radication) {setInvalid(true);return;}
    setInvalid(false);
    setParams({
      page: "1",
      radication: radication || undefined,
      loadingType: undefined,
      loadingId: undefined,
    });
  };

  return (
    <form onSubmit={submitSearch} className="poma-search">
      <div className="poma-search-controls">
        <TextInput
          label="Radicación"
          placeholder="Ingresa el número de radicación"
          required
          validate={invalid ? {status:"error",message:"Ingresa un número de radicación."} : undefined}
          value={radication}
          onChange={(value: string) => {setRadication(value.replace(/\D/g, ""));setInvalid(false);}}
        />
        <PermissionGate requiredKey={"audit.poma.management.page"} requiredAction={["view"]} fallback={null}>
          <Button type="submit" variant="outlined" className="min-h-10.5 whitespace-nowrap max-[720px]:w-full">
            <SearchIcon size={17} />
            Cargar datos
          </Button>
        </PermissionGate>
      </div>
    </form>
  );
}
