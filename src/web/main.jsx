import React from "react";
import { createRoot } from "react-dom/client";
import "@banasandev/banasan-ui/style.css";
import { OrderCategories } from "./order-categories.jsx";
import { TransportCatalog } from "./transport-catalogs.jsx";
import { mountLegacyTableControls } from "./legacy-table-controls.jsx";
import { KnownDevices } from "./known-devices.jsx";

const mounts = {
  "order-categories": OrderCategories,
  "transport-licenses": () => <TransportCatalog catalog="licenses" />,
  "transport-vehicle-types": () => <TransportCatalog catalog="vehicleTypes" />,
  "known-devices": KnownDevices
};

function mountProposalViews() {
  mountLegacyTableControls();
  document.querySelectorAll("[data-sial-react-view]").forEach((element) => {
    const View = mounts[element.dataset.sialReactView];
    if (!View || element.dataset.sialMounted === "true") return;
    element.dataset.sialMounted = "true";
    createRoot(element).render(<View />);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountProposalViews, { once: true });
} else {
  mountProposalViews();
}
