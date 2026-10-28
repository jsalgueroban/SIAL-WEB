import React from "react";
import { createRoot } from "react-dom/client";
import "@banasandev/banasan-ui/style.css";
import { OrderCategories } from "./order-categories.jsx";
import { TransportCatalog } from "./transport-catalogs.jsx";
import { mountLegacyTableControls } from "./legacy-table-controls.jsx";
import { KnownDevices } from "./known-devices.jsx";
import { mountShell } from "./shell-navigation.jsx";
import { MaterialsInventory } from "./materials-inventory.jsx";
import { MaterialsMovements } from "./materials-movements.jsx";
import { MaterialsOperations } from "./materials-operations.jsx";
import { MaterialsCatalog } from "./materials-catalogs.jsx";
import { MaterialsOrderTracking, MaterialsRecurringOrders } from "./materials-order-followup.jsx";
import { MaterialsOrderTraceAlternative } from "./materials-order-trace-alternative.jsx";
import { MaterialsOrderTrace } from "./materials-order-trace.jsx";
import { MaterialsOrderAdjustment } from "./materials-order-adjustment.jsx";
import { MaterialsSuggestedOrder } from "./materials-suggested-order.jsx";
import { MaterialsRecipes } from "./materials-recipes.jsx";
import { MaterialsTransportOrders } from "./materials-transport-orders.jsx";
import { MaterialsMaster } from "./materials-master.jsx";
import { MaterialsAdditionalOrders } from "./materials-additional-orders.jsx";
import { MaterialsApproval } from "./materials-approval.jsx";
import { MaterialsDeliveryControl } from "./materials-delivery-control.jsx";
import { FarmReferenceClasses } from "./farm-reference-classes.jsx";

import { AccountProfile } from "./account-profile.jsx";

import { FarmCatalog_grupos } from "./farm-catalog-grupos.jsx";
import { FarmCatalog_productos } from "./farm-catalog-productos.jsx";
import { FarmCatalog_sectores } from "./farm-catalog-sectores.jsx";

export { mountShell };

const mounts = {
  "farm-grupos": FarmCatalog_grupos,
  "farm-productos": FarmCatalog_productos,
  "farm-sectores": FarmCatalog_sectores,

  "account-profile": AccountProfile,
  "farm-reference-classes": FarmReferenceClasses,
  "order-categories": OrderCategories,
  "transport-licenses": () => <TransportCatalog catalog="licenses" />,
  "transport-vehicle-types": () => <TransportCatalog catalog="vehicleTypes" />,
  "known-devices": KnownDevices,
  "materials-stock": () => <MaterialsInventory kind="stock" />,
  "materials-pallets": () => <MaterialsInventory kind="pallets" />,
  "materials-movements": MaterialsMovements,
  "materials-summaries": () => <MaterialsOperations kind="summaries" />,
  "materials-deliveries": () => <MaterialsOperations kind="deliveries" />,
  "materials-suppliers": () => <MaterialsCatalog kind="suppliers" />,
  "materials-rules": () => <MaterialsCatalog kind="rules" />,
  "materials-order-tracking": MaterialsOrderTracking,
  "materials-recurring-orders": MaterialsRecurringOrders,
  "materials-order-trace": () => new URLSearchParams(location.search).get("composicion") === "alternativa"
    ? <MaterialsOrderTraceAlternative /> : <MaterialsOrderTrace />,
  "materials-order-adjustment": MaterialsOrderAdjustment,
  "materials-suggested-order": MaterialsSuggestedOrder,
  "materials-recipes": MaterialsRecipes,
  "materials-transport-orders": MaterialsTransportOrders,
  "materials-master": MaterialsMaster,
  "materials-reference-config": () => <MaterialsMaster view="config" />,
  "materials-additional-orders": MaterialsAdditionalOrders,
  "materials-approval": MaterialsApproval,
  "materials-delivery-control": MaterialsDeliveryControl
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
