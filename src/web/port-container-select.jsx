import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { MultiSearchSelectInput } from "@banasandev/banasan-ui";
const mounted = new WeakSet();
function ContainerSelect({ source }) {
  const [state, setState] = useState(source.sialContainerSelection.read);
  useEffect(() => {
    const sync = () => setState(source.sialContainerSelection.read());
    source.addEventListener('sial:selection-state', sync);
    return () => source.removeEventListener('sial:selection-state', sync);
  }, [source]);
  return <MultiSearchSelectInput id="sial-container-selection" label="Contenedores" required
    options={state.options} value={state.value} pageSize={5}
    searchPlaceholder="Buscar contenedor disponible" emptySelectionText="Sin contenedores seleccionados"
    onChange={value => source.sialContainerSelection.change(value)} />;
}
export function mountPortContainerSelect() {
  const source = document.querySelector('[data-container-search-select]');
  if (!source?.sialContainerSelection || mounted.has(source)) return;
  mounted.add(source);
  const host = document.createElement('div');
  host.dataset.sialComponent = 'MultiSearchSelectInput';
  host.dataset.sialSource = '@banasandev/banasan-ui';
  source.before(host);
  source.classList.add('sial-native-proxy');
  source.parentElement.querySelector('label')?.classList.add('sial-native-proxy');
  document.querySelector('#selectedContainersList')?.classList.add('sial-native-proxy');
  createRoot(host).render(<ContainerSelect source={source} />);
}
