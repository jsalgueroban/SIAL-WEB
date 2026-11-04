// Adapted from fe-sial-web 4dfeb23d: operational/components/operational-audit-toolbar.tsx
import React from "react";
"use client";

import { SearchSelectInput, SelectInput, TextInput, FilterToolbar, DateInput } from "@banasandev/banasan-ui";
import {
  getOperationalAuditFilters,
  OPERATIONAL_AUDIT_STAGE_OPTIONS,
} from "./bridge";
import { getCurrentWeekAction, getWeeksAction } from "./bridge";
import { useQueryParams } from "./bridge";
import { useEffect, useRef, useState } from "react";

type SetParams = ReturnType<typeof useQueryParams>["setParams"];

function normalizeValue(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed === "" || trimmed === "all" ? undefined : trimmed;
}

function updateFilter(setParams: SetParams, key: string, value: string) {
  setParams({ page: undefined, pageSize: undefined, [key]: normalizeValue(value) });
}

function updateYearFilter(setParams: SetParams, value: string) {
  setParams({
    page: undefined,
    pageSize: undefined,
    weekNumber: undefined,
    year: normalizeValue(value),
  });
}

function getSelectedOption(value: string) {
  return value ? { label: value, value } : undefined;
}

function getYearOptions(currentYear: number) {
  return Array.from({ length: 11 }, (_, index) => {
    const year = String(currentYear + 5 - index);
    return { label: year, value: year };
  });
}

export function OperationalAuditToolbar() {
  const { params, setParams } = useQueryParams();
  const filters = getOperationalAuditFilters(params);
  const showAdvanced = params?.get("advanced") === "true";
  const currentYear = new Date().getFullYear();
  const selectedYear = filters.year === "all" ? String(currentYear) : filters.year;
  const [currentWeek, setCurrentWeek] = useState<number>();
  const [isInitializingDefaults, setIsInitializingDefaults] = useState(true);
  const [search, setSearch] = useState(filters.search);
  const [, setWeekQuery] = useState("");
  const defaultsInitialized = useRef(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const selectedWeek = filters.weekNumber === "all" && isInitializingDefaults && currentWeek
    ? `Semana ${currentWeek}`
    : filters.weekNumber === "all" ? "" : `Semana ${filters.weekNumber}`;

  const loadWeekOptions = async ({ query, page, pageSize }: { query: string; page: number; pageSize: number }) => {
    const response = await getWeeksAction({
      page,
      pageSize,
      search: query,
      year: Number(selectedYear),
    });
    const options = [
      ...(page === 1 && !query ? [{ label: "Todas las semanas", value: "" }] : []),
      ...(response.data?.items ?? []).map((week) => ({
        label: `Semana ${week.weekNumber} - ${week.year}`,
        description: week.startDate && week.endDate
          ? `${week.startDate.split("T")[0]} al ${week.endDate.split("T")[0]}`
          : undefined,
        value: `Semana ${week.weekNumber}`,
      })),
    ];

    return { options, total: response.data?.pagination?.total ?? response.meta?.total ?? options.length };
  };

  useEffect(() => { setSearch(filters.search); }, [filters.search]);
  useEffect(() => () => clearTimeout(searchTimer.current), []);
  const changeSearch = (value: string) => {
    setSearch(value);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => updateFilter(setParams, "search", value), 500);
  };
  const clearFilters = () => {
    clearTimeout(searchTimer.current);
    setSearch("");
    setIsInitializingDefaults(false);
    setParams({search:undefined,year:String(currentYear),weekNumber:currentWeek ? String(currentWeek) : undefined,containerStage:undefined,status:undefined,fromDate:undefined,toDate:undefined,advanced:undefined,page:undefined,pageSize:undefined});
  };
  const active = Boolean(search || selectedYear !== String(currentYear) || (currentWeek && filters.weekNumber !== String(currentWeek)) || filters.containerStage !== "all" || filters.fromDate || filters.toDate || filters.status !== "all");
  const dateValue = (value: string) => value ? new Date(`${value}T12:00:00`) : null;
  const changeDate = (key: string, value: Date | null) => {
    const formatted = value ? `${value.getFullYear()}-${String(value.getMonth()+1).padStart(2,"0")}-${String(value.getDate()).padStart(2,"0")}` : "";
    updateFilter(setParams,key,formatted);
  };

  useEffect(() => {
    if (defaultsInitialized.current) return;
    defaultsInitialized.current = true;

    getCurrentWeekAction()
      .catch(() => undefined)
      .then((weekNumber) => {
        if (weekNumber) setCurrentWeek(weekNumber);

        const defaultParams: Record<string, string> = {};
        if (!params?.get("year")) defaultParams.year = String(currentYear);
        if (!params?.get("weekNumber") && weekNumber) defaultParams.weekNumber = String(weekNumber);
        if (Object.keys(defaultParams).length > 0) setParams(defaultParams);
        setIsInitializingDefaults(false);
      });
  }, [currentYear, params, setParams]);

  return (
    <div className="grid gap-3">
      <FilterToolbar active={active} onClear={clearFilters} clearLabel="Restablecer filtros" className="container-audit-filters">
        <TextInput
          id="container-audit-search" label="Buscar operación, contenedor o vehículo"
          placeholder="Buscar OP, contenedor o vehículo"
          value={search}
          onChange={changeSearch}
        />
        <div className="container-filter-field">
          <SelectInput
            className="w-full"
            id="container-audit-year" label="Año"
            value={selectedYear}
            options={getYearOptions(currentYear)}
            onChange={(value) => {
              setIsInitializingDefaults(false);
              updateYearFilter(setParams, String(value));
            }}
          />
        </div>
        <div className="container-filter-field">
          <SearchSelectInput
            id="container-audit-week" label="Semana"
            key={selectedYear}
            className="w-full"
            value={selectedWeek}
            selectedOption={getSelectedOption(selectedWeek)}
            placeholder="Todas las semanas"
            searchPlaceholder="Buscar semana"
            emptyText="No se encontraron semanas."
            errorText="No fue posible cargar las semanas."
            pageSize={10}
            loadOptions={loadWeekOptions}
            onSearch={setWeekQuery}
            onChange={(value) => {
              const normalized = normalizeValue(String(value));
              const match = normalized?.match(/\d+/);
              setParams({
                page: undefined,
                pageSize: undefined,
                weekNumber: match ? match[0] : undefined,
              });
            }}
          />
        </div>
        <SelectInput
          className="container-filter-field"
          id="container-audit-stage" label="Etapa del contenedor"
          value={filters.containerStage}
          options={OPERATIONAL_AUDIT_STAGE_OPTIONS}
          onChange={(value) => updateFilter(setParams, "containerStage", String(value))}
        />
      </FilterToolbar>
      {showAdvanced && (
        <div className="container-audit-dates">
          <DateInput id="container-audit-from" label="Desde" value={dateValue(filters.fromDate)} maxDate={dateValue(filters.toDate) ?? undefined} onChange={value=>changeDate("fromDate",value)}/>
          <DateInput id="container-audit-to" label="Hasta" value={dateValue(filters.toDate)} minDate={dateValue(filters.fromDate) ?? undefined} onChange={value=>changeDate("toDate",value)}/>
        </div>
      )}
    </div>
  );
}



