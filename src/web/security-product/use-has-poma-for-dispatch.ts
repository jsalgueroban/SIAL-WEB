// Adapted from fe-sial-web 4dfeb23d: poma/hooks/use-has-poma-for-dispatch.ts
"use client";

import {
  hasPomaLoadingForDispatchAction,
  type PomaDispatchLookup,
} from "./bridge";
import { useEffect, useState } from "react";

interface DispatchLoadingCheck {
  key: string;
  hasLoading: boolean;
}

function lookupKey(radication: string, dispatchedAt: string): string {
  return `${radication}|${dispatchedAt}`;
}

export function useHasPomaForDispatch(lookup?: PomaDispatchLookup): boolean {
  const radication = lookup?.radication ?? "";
  const dispatchedAt = lookup?.dispatchedAt ?? "";
  const [check, setCheck] = useState<DispatchLoadingCheck>();

  useEffect(() => {
    if (!radication || !dispatchedAt) return;

    let active = true;
    hasPomaLoadingForDispatchAction({ radication, dispatchedAt })
      .catch(() => false)
      .then((hasLoading) => {
        if (active) {
          setCheck({ key: lookupKey(radication, dispatchedAt), hasLoading });
        }
      });

    return () => {
      active = false;
    };
  }, [radication, dispatchedAt]);

  return (
    check?.key === lookupKey(radication, dispatchedAt) && check.hasLoading
  );
}
