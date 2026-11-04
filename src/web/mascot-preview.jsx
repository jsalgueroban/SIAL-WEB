import React from "react";
import { createRoot } from "react-dom/client";
import { SialMascot } from "@sial/mascot-preview";
import "@sial/mascot-preview-style";
import { SialIsotype } from "./christmas-isotype/sial_isotype";
import { SessionMascot } from "./session-mascot.jsx";
import { SessionModelReview } from './session-model-review.jsx';
import { SessionLegAudit } from './session-leg-audit.jsx';
import { MaintenancePlayer } from './maintenance-player.jsx';
import { MaintenanceArmAudit } from './maintenance-arm-audit.jsx';
import { Neutral404Player } from './neutral-404-player.jsx';
import { NeutralArmAudit } from './neutral-arm-audit.jsx';

function mountMascots() {
  document.querySelectorAll('[data-neutral-arm-audit]').forEach(element=>{if(element.dataset.mounted==='true')return;element.dataset.mounted='true';createRoot(element).render(<NeutralArmAudit/>);});
  document.querySelectorAll('[data-neutral-404]').forEach(element=>{
    if(element.dataset.mounted==='true')return;
    element.dataset.mounted='true';
    createRoot(element).render(<Neutral404Player/>);
  });
  document.querySelectorAll('[data-maintenance-arm-audit]').forEach(element=>{
    if(element.dataset.mounted==='true')return;
    element.dataset.mounted='true';
    createRoot(element).render(<MaintenanceArmAudit/>);
  });
  document.querySelectorAll('[data-maintenance-scene]').forEach(element=>{
    if(element.dataset.mounted==='true')return;
    element.dataset.mounted='true';
    createRoot(element).render(<MaintenancePlayer/>);
  });
  document.querySelectorAll('[data-session-leg-audit]').forEach(element=>{
    if(element.dataset.mounted==='true')return;
    element.dataset.mounted='true';
    createRoot(element).render(<SessionLegAudit/>);
  });
  document.querySelectorAll('[data-session-model-review]').forEach(element=>{
    if(element.dataset.mounted==='true')return;
    element.dataset.mounted='true';
    createRoot(element).render(<SessionModelReview/>);
  });
  document.querySelectorAll(".error401-brand-mark").forEach((element) => {
    if (element.dataset.mounted === "true") return;
    element.dataset.mounted = "true";
    createRoot(element).render(<SialIsotype variant="christmas" motion="festive" size={44} aria-hidden="true" />);
  });
  document.querySelectorAll('[data-sial-mascot="forbidden"]').forEach((element) => {
    if (element.dataset.mounted === "true") return;
    element.dataset.mounted = "true";
    createRoot(element).render(element.hasAttribute("data-session-scene") ? <SessionMascot /> : <SialMascot pose="forbidden" motion="loop" size="100%" />);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountMascots, { once: true });
} else {
  mountMascots();
}
