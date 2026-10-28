/* Mantiene el foco en la acción de origen al cerrar el detalle adaptado. */
(() => {
  let origin = null;
  document.addEventListener("click", (event) => {
    if (event.target.closest?.("[data-open-detail]")) origin = document.activeElement;
    if (event.target.closest?.(".sial-filter-reset")) {
      requestAnimationFrame(() => document.querySelector(".sial-library-search input")?.focus());
    }
    if (event.target.closest?.("#closeDetail, .sial-library-detail-drawer .bui-drawer-close, #detailBackdrop")) {
      requestAnimationFrame(() => { if (origin?.isConnected) origin.focus(); });
    }
  }, true);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.querySelector("#detailDrawer.show")) {
      requestAnimationFrame(() => { if (origin?.isConnected) origin.focus(); });
    }
  }, true);
})();
