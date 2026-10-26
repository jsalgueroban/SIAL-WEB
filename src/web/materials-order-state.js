// Estado local de la propuesta: las solicitudes se leen por pedido, no por el último pedido abierto.
export function readSubmittedRequests() {
  const requests = [];
  for (const key of Object.keys(localStorage)) {
    if (!key.startsWith("sial-hu660-adjustment:")) continue;
    try {
      const value = JSON.parse(localStorage.getItem(key) || "null");
      if (value && value.id === key.slice("sial-hu660-adjustment:".length) && Array.isArray(value.recipes) && value.recipes.length) requests.push(value);
    } catch { /* Un borrador inválido no sustituye las demás solicitudes. */ }
  }
  return requests;
}

export function readSubmittedRequest(id) {
  return readSubmittedRequests().find((request) => request.id === id) || null;
}
