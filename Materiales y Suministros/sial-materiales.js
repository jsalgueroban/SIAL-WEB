const SIALMaterials = (() => {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const esc = (value) => SIALCore.escapeHtml(value ?? "");

  const icons = {
    eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"></path><circle cx="12" cy="12" r="3"></circle>',
    edit: '<path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"></path>',
    inactive: '<path d="m18 6-12 12"></path><path d="m6 6 12 12"></path>',
    active: '<path d="M20 6 9 17l-5-5"></path>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path>',
    camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle>'
  };

  const statusMap = {
    SUGERIDO: ["status-warning", "Sugerido"],
    CONSULTADO: ["status-active", "Consultado"],
    ADICIONAL: ["status-warning", "Adicional"],
    PENDIENTE_VALIDACION: ["status-warning", "Pendiente validacion"],
    VALIDADO: ["status-active", "Validado"],
    LISTO_DESPACHO: ["status-warning", "Listo despacho"],
    NOTIFICADO: ["status-active", "Notificado"],
    ASIGNADO: ["status-warning", "Asignado"],
    EN_TRANSITO: ["status-warning", "En transito"],
    ENTREGADA: ["status-active", "Entregada"],
    CERRADA: ["status-active", "Cerrada"],
    INACTIVO: ["status-inactive", "Inactivo"],
    ACTIVO: ["status-active", "Activo"],
    REVISION: ["status-warning", "Revision"],
    ERROR: ["status-inactive", "Error"]
  };
  const notificationKey = "sial-materiales-notifications";
  const hu826ConfigKey = "sial-hu826-configurations";
  let recipeLineSequence = 0;

  // Muestra fiel de la fuente real PARAMETROS de la hoja "Parametros Explosion de Materiales".
  // Los campos de HU826 que no existen en la fuente quedan pendientes de parametrización;
  // no se inventan valores para permitir una activación.
  const materials = [
    { id: "PAR-16FT7BD-8-101279", reference: "16FT7BD-8", sapMaterial: "101279", name: "BASE BBS11 FYFFES 13 KG (20 UND) V2", quantityPerBox: "1", unit: "UN", classification: "CONVENCIONAL FAIRTRADE", referenceList: "16FT7BD-8", recipeVersion: "", validityStart: "", validityEnd: "", waste: "", substitutes: "", rounding: "", status: "REVISION", source: "PARAMETROS", audit: "Carga fuente - hoja PARAMETROS|24/08/2026" },
    { id: "PAR-16FT7BD-8-102247", reference: "16FT7BD-8", sapMaterial: "102247", name: "TAPA BLD98 FYF FT BLANCA 13KG (30 UND)V3", quantityPerBox: "1", unit: "UN", classification: "CONVENCIONAL FAIRTRADE", referenceList: "20LD7RA-20", recipeVersion: "", validityStart: "", validityEnd: "", waste: "", substitutes: "", rounding: "", status: "REVISION", source: "PARAMETROS", audit: "Carga fuente - hoja PARAMETROS|24/08/2026" },
    { id: "PAR-16FT7BD-8-1970", reference: "16FT7BD-8", sapMaterial: "1970", name: "ESTIBAS FYFFES 1.02X1.20 MTS (MQ)", quantityPerBox: "0,01516", unit: "UN", classification: "CONVENCIONAL FAIRTRADE", referenceList: "21X5BDOF", recipeVersion: "", validityStart: "", validityEnd: "", waste: "", substitutes: "", rounding: "", status: "REVISION", source: "PARAMETROS", audit: "Carga fuente - hoja PARAMETROS|24/08/2026" },
    { id: "PAR-16FT7BD-8-5418", reference: "16FT7BD-8", sapMaterial: "5418", name: "ESQUINERO KRAFT 2.13 MTS (20 UND)", quantityPerBox: "0,06061", unit: "UN", classification: "CONVENCIONAL FAIRTRADE", referenceList: "544 - PR TROPY 54-0", recipeVersion: "", validityStart: "", validityEnd: "", waste: "", substitutes: "", rounding: "", status: "REVISION", source: "PARAMETROS", audit: "Carga fuente - hoja PARAMETROS|24/08/2026" },
    { id: "PAR-16FT7BD-8-322", reference: "16FT7BD-8", sapMaterial: "322", name: "ESQUINERO KRAFT 1.95 MTS (20 UND)", quantityPerBox: "0,06060606061", unit: "UN", classification: "CONVENCIONAL FAIRTRADE", referenceList: "AGSTDBVRA-1", recipeVersion: "", validityStart: "", validityEnd: "", waste: "", substitutes: "", rounding: "", status: "REVISION", source: "PARAMETROS", audit: "Carga fuente - hoja PARAMETROS|24/08/2026" },
    { id: "PAR-16FT7BD-8-4925", reference: "16FT7BD-8", sapMaterial: "4925", name: "ZUNCHO AMARILLO SIN IMPRESIÓN", quantityPerBox: "0,8", unit: "M", classification: "CONVENCIONAL FAIRTRADE", referenceList: "AGSTDRA-1", recipeVersion: "", validityStart: "", validityEnd: "", waste: "", substitutes: "", rounding: "", status: "REVISION", source: "PARAMETROS", audit: "Carga fuente - hoja PARAMETROS|24/08/2026" }
  ];

  try {
    const savedConfigurations = JSON.parse(localStorage.getItem(hu826ConfigKey) || "[]");
    if (Array.isArray(savedConfigurations)) materials.unshift(...savedConfigurations);
  } catch { /* La propuesta continúa usando la fuente semilla si el almacenamiento local no es legible. */ }

  const suppliers = [
    { id: "PRO-001", code: "PRV-CAR-01", name: "Cartonera Caribe", type: "Cartonera", contact: "operaciones@cartonera.example", status: "ACTIVO", audit: "Crear - compras.sial|08/06/2026 11:05" },
    { id: "PRO-002", code: "PRV-EST-01", name: "Estibas del Norte", type: "Estibadero", contact: "despachos@estibas.example", status: "ACTIVO", audit: "Crear - compras.sial|09/06/2026 12:18" },
    { id: "PRO-003", code: "PRV-ETQ-01", name: "Etiquetas del Caribe", type: "Proveedor material", contact: "coordinacion@etiquetas.example", status: "REVISION", audit: "Revision - compras.sial|21/06/2026 08:40" }
  ];

  const stock = [
    { id: "STK-001", finca: "Finca Santa Isabel", sapMaterial: "101279", material: "Caja carton corrugado", available: 1280, reserved: 120, total: 1400, damaged: 0, unit: "unidad", updated: "28/06/2026 07:40", lastMovement: "Entrada por recepción · MOV-8821", status: "ACTIVO", coverage: "2.4 dias", source: "Movimientos de inventario · HU662" },
    { id: "STK-002", finca: "Finca El Retiro", sapMaterial: "101279", material: "Caja carton corrugado", available: 360, reserved: 40, total: 412, damaged: 12, unit: "unidad", updated: "28/06/2026 07:50", lastMovement: "Ajuste por daño · MOV-8814", status: "REVISION", coverage: "0.8 dias", source: "Movimientos de inventario · HU662" },
    { id: "STK-003", finca: "Finca Santa Isabel", sapMaterial: "1970", material: "Estiba madera exportacion", available: 94, reserved: 12, total: 106, damaged: 2, unit: "unidad", updated: "28/06/2026 06:58", lastMovement: "Salida a orden OTI-546-001", status: "ACTIVO", coverage: "3.1 dias", source: "Movimientos de inventario · HU662" },
    { id: "STK-004", finca: "Finca Las Palmas", sapMaterial: "5418", material: "Separador de pallet", available: 18, reserved: 0, total: 21, damaged: 3, unit: "paquete", updated: "27/06/2026 18:12", lastMovement: "Conteo pendiente · MOV-8792", status: "REVISION", coverage: "Stock bajo", source: "Conteo pendiente · HU662" }
  ];

  // Datos de muestra para separar claramente la receta del catálogo de materiales.
  // La cantidad total de inventario se recibe del contrato de saldo; no se calcula en la interfaz.
  const recipes = [
    { id: "REC-16FT7BD-8-V1", reference: "16FT7BD-8", version: "V1", materials: [{ sapMaterial: "101279", name: "BASE BBS11 FYFFES 13 KG (20 UND) V2", quantityPerBox: "1", unit: "UN" }, { sapMaterial: "102247", name: "TAPA BLD98 FYF FT BLANCA 13KG (30 UND)V3", quantityPerBox: "1", unit: "UN" }, { sapMaterial: "1970", name: "ESTIBAS FYFFES 1.02X1.20 MTS (MQ)", quantityPerBox: "0,01516", unit: "UN" }], status: "ACTIVO", source: "HU826 · receta por referencia y versión", audit: "Crear - configuracion.materiales|24/08/2026 10:20" },
    { id: "REC-20LD7RA-20-V2", reference: "20LD7RA-20", version: "V2", materials: [{ sapMaterial: "102247", name: "TAPA BLD98 FYF FT BLANCA 13KG (30 UND)V3", quantityPerBox: "1", unit: "UN" }, { sapMaterial: "5418", name: "ESQUINERO KRAFT 2.13 MTS (20 UND)", quantityPerBox: "0,06061", unit: "UN" }, { sapMaterial: "4925", name: "ZUNCHO AMARILLO SIN IMPRESIÓN", quantityPerBox: "0,8", unit: "M" }], status: "ACTIVO", source: "HU826 · receta por referencia y versión", audit: "Editar - configuracion.materiales|25/08/2026 15:10" },
    { id: "REC-21X5BDOF-V1", reference: "21X5BDOF", version: "V1", materials: [{ sapMaterial: "1970", name: "ESTIBAS FYFFES 1.02X1.20 MTS (MQ)", quantityPerBox: "0,01516", unit: "UN" }, { sapMaterial: "322", name: "ESQUINERO KRAFT 1.95 MTS (20 UND)", quantityPerBox: "0,06060606061", unit: "UN" }], status: "REVISION", source: "HU826 · receta por referencia y versión", audit: "Crear - configuracion.materiales|26/08/2026 08:35" }
  ];

  const movements = [
    { id: "MOV-8821", sapMaterial: "101279", material: "Caja carton corrugado", type: "ENTRADA", quantity: 1400, unit: "unidad", date: "2026-06-28", dateLabel: "28/06/2026 07:40", reason: "Recepción de proveedor", user: "almacen.santa-isabel", finca: "Finca Santa Isabel", status: "ACTIVO", source: "HU662 · movimiento de inventario", audit: "Registrar entrada - almacen.santa-isabel|28/06/2026 07:40" },
    { id: "MOV-8814", sapMaterial: "101279", material: "Caja carton corrugado", type: "AJUSTE", quantity: -12, unit: "unidad", date: "2026-06-28", dateLabel: "28/06/2026 07:50", reason: "Daño identificado en conteo", user: "almacen.el-retiro", finca: "Finca El Retiro", status: "REVISION", source: "HU662 · movimiento de inventario", audit: "Registrar ajuste - almacen.el-retiro|28/06/2026 07:50" },
    { id: "MOV-8808", sapMaterial: "1970", material: "Estiba madera exportacion", type: "SALIDA", quantity: -80, unit: "unidad", date: "2026-06-28", dateLabel: "28/06/2026 06:58", reason: "Despacho de orden OTI-546-001", user: "supervisor.almacen", finca: "Finca Santa Isabel", status: "ACTIVO", source: "HU662 · movimiento de inventario", audit: "Registrar salida - supervisor.almacen|28/06/2026 06:58" },
    { id: "MOV-8792", sapMaterial: "5418", material: "Separador de pallet", type: "AJUSTE", quantity: -3, unit: "paquete", date: "2026-06-27", dateLabel: "27/06/2026 18:12", reason: "Conteo físico pendiente de validación", user: "almacen.las-palmas", finca: "Finca Las Palmas", status: "REVISION", source: "HU662 · movimiento de inventario", audit: "Registrar ajuste - almacen.las-palmas|27/06/2026 18:12" }
  ];

  const orders = [
    { id: "PED-071", type: "Sugerido", finca: "Finca Santa Isabel", week: "Semana 27 - 2026", material: "Caja carton corrugado", quantity: 1400, unit: "unidad", stock: "1280 unidad", document: "RPT", docState: "Auto clasificado", status: "SUGERIDO", destination: "Finca Santa Isabel", reason: "Calculado desde aviso de corte", source: "HU659", audit: "Generar - sistema|28/06/2026 06:00" },
    { id: "PED-072", type: "Adicional", finca: "Finca El Retiro", week: "Semana 27 - 2026", material: "Caja carton corrugado", quantity: 520, unit: "unidad", stock: "360 unidad", document: "Remision", docState: "Requiere confirmacion", status: "PENDIENTE_VALIDACION", destination: "Finca El Retiro", reason: "Incremento extraordinario por corte", source: "HU666", audit: "Crear - almacen.pedidos|28/06/2026 08:42" },
    { id: "PED-073", type: "Sugerido", finca: "Finca Las Palmas", week: "Semana 27 - 2026", material: "Separador de pallet", quantity: 35, unit: "paquete", stock: "18 paquete", document: "Reserva", docState: "Auto clasificado", status: "CONSULTADO", destination: "ZE Puerto Norte", reason: "Stock consultado por finca", source: "HU659/HU662", audit: "Consultar - productor.finca|28/06/2026 09:14" },
    { id: "PED-074", type: "Estandar", finca: "Finca Santa Isabel", week: "Semana 27 - 2026", material: "Estiba madera exportacion", quantity: 80, unit: "unidad", stock: "94 unidad", document: "RPT", docState: "Confirmado", status: "VALIDADO", destination: "ZE Puerto Norte", reason: "Pedido base semanal", source: "HU667", audit: "Validar - supervisor.almacen|28/06/2026 10:05" }
  ];

  const transportOrders = [
    { id: "OTI-546-001", document: "RPT-2026-0881", docType: "RPT", finca: "Finca Santa Isabel", vehicle: "TUL458", driver: "Carlos Mendoza", materials: "Caja carton corrugado, Estiba madera", quantity: "1480 unidades", status: "NOTIFICADO", notified: "Transporte 28/06 10:20; Conductor 28/06 10:25; Seguridad 28/06 10:28; Finca 28/06 10:30", source: "HU546/HU669/HU670/HU532", audit: "Notificar - sistema|28/06/2026 10:30" },
    { id: "OTI-546-002", document: "REM-2026-0184", docType: "Remision", finca: "Finca El Retiro", vehicle: "CAM-102", driver: "Ana Ramirez", materials: "Caja carton corrugado", quantity: "520 unidades", status: "LISTO_DESPACHO", notified: "Pendiente", source: "HU546/HU669", audit: "Crear - usuario.logistico|28/06/2026 11:05" },
    { id: "OTI-546-003", document: "RES-2026-0045", docType: "Reserva", finca: "Finca Las Palmas", vehicle: "Sin asignar", driver: "--", materials: "Separador de pallet", quantity: "35 paquetes", status: "ASIGNADO", notified: "Finca 28/06 12:12", source: "HU546/HU670", audit: "Asignar - almacen.pedidos|28/06/2026 12:12" }
  ];

  const supplierSummaries = [
    { id: "RES-668-001", provider: "Cartonera Caribe", period: "28/06/2026", ordersCount: 2, materials: "Caja carton corrugado", quantities: "1920 unidades", destination: "Santa Isabel / El Retiro", status: "NOTIFICADO", generated: "28/06/2026 13:00", sent: "28/06/2026 13:04", source: "HU668" },
    { id: "RES-668-002", provider: "Estibas del Norte", period: "Semana 27 - 2026", ordersCount: 1, materials: "Estiba madera exportacion", quantities: "80 unidades", destination: "Finca Santa Isabel", status: "LISTO_DESPACHO", generated: "28/06/2026 13:10", sent: "Pendiente", source: "HU668" },
    { id: "RES-668-003", provider: "Suministros Banasan", period: "Semana 27 - 2026", ordersCount: 1, materials: "Separador de pallet", quantities: "35 paquetes", destination: "Finca Las Palmas", status: "PENDIENTE_VALIDACION", generated: "Pendiente", sent: "Pendiente", source: "HU668" }
  ];

  const deliveries = [
    { id: "ENT-681-001", order: "OTI-546-001", document: "RPT-2026-0881", finca: "Finca Santa Isabel", driver: "Carlos Mendoza", receiver: "Laura Pineda", deliveredAt: "28/06/2026 15:40", status: "ENTREGADA", evidence: "Foto receptor + firma digital", pod: "POD-682-001", source: "HU681/HU682/HU547", audit: "Entregar - transportista.app|28/06/2026 15:40" },
    { id: "ENT-681-002", order: "OTI-546-002", document: "REM-2026-0184", finca: "Finca El Retiro", driver: "Ana Ramirez", receiver: "Pendiente", deliveredAt: "Pendiente", status: "EN_TRANSITO", evidence: "Requerida para cierre", pod: "Pendiente", source: "HU681/HU682", audit: "Salida - transporte|28/06/2026 13:20" },
    { id: "ENT-547-001", order: "OTI-546-003", document: "RES-2026-0045", finca: "Finca Las Palmas", driver: "Sin asignar", receiver: "Pendiente", deliveredAt: "Pendiente", status: "ASIGNADO", evidence: "Foto obligatoria", pod: "Pendiente", source: "HU547", audit: "Asignar - almacen.pedidos|28/06/2026 12:12" }
  ];

  const pallets = [
    { id: "PAL-559-001", reference: "BAN-REF-001", finca: "Finca Santa Isabel", pallets: 18, boxesLeft: 0, destination: "Contenedor SIALU1234567", status: "ACTIVO", type: "Completo", source: "HU559" },
    { id: "PAL-559-002", reference: "BAN-REF-004", finca: "Finca El Retiro", pallets: 9, boxesLeft: 0, destination: "ZE Puerto Norte", status: "ACTIVO", type: "Completo", source: "HU559" },
    { id: "PAL-560-001", reference: "BAN-REF-011", finca: "Finca Las Palmas", pallets: 1, boxesLeft: 14, destination: "Consolidacion posterior", status: "REVISION", type: "Mocho", source: "HU560" },
    { id: "PAL-560-002", reference: "BAN-REF-014", finca: "Finca Santa Isabel", pallets: 1, boxesLeft: 8, destination: "Consolidacion posterior", status: "REVISION", type: "Mocho", source: "HU560" }
  ];

  const rules = [
    { id: "REG-667-001", code: "DOC-RPT", name: "Pedido semanal validado", result: "RPT", condition: "Pedido base o sugerido con stock confirmado", status: "ACTIVO", audit: "Crear - admin.documental|25/06/2026 09:00" },
    { id: "REG-667-002", code: "DOC-REM", name: "Despacho adicional", result: "Remision", condition: "Pedido adicional validado para envio fisico", status: "ACTIVO", audit: "Crear - admin.documental|25/06/2026 09:12" },
    { id: "REG-667-003", code: "DOC-RES", name: "Material reservado", result: "Reserva", condition: "Stock apartado sin despacho inmediato", status: "REVISION", audit: "Editar - admin.documental|28/06/2026 08:00" }
  ];

  const viewConfig = {
    dashboard: { title: "Materiales y suministros", eyebrow: "Gestion / Materiales y suministros", subtitle: "Centro operativo para pedidos, stock, ordenes, proveedores, entregas y trazabilidad documental.", hu: "HU659, HU660, HU662, HU666, HU667, HU826, HU546, HU668, HU681, HU682", channel: "Web gestiona y consulta · móvil ejecuta en campo cuando la HU lo requiere." },
    pedidos: { title: "Gestion de pedidos de materiales", eyebrow: "Materiales / Pedidos", subtitle: "Pedidos sugeridos, adicionales y estandar vinculados a finca, semana, stock y documento logistico.", hu: "HU659, HU660, HU666, HU667", channel: "Web: genera, ajusta y procesa · móvil: consulta o captura de campo solo cuando aplique." },
    inventario: { title: "Inventario de materiales", eyebrow: "Materiales / Inventario", subtitle: "Consulta existencias disponibles, reservadas y totales por material y finca.", hu: "HU662", channel: "Web: consulta de gestión · móvil: consulta complementaria, sin editar saldos." },
    pallets: { title: "Inventario de pallets", eyebrow: "Materiales / Pallets", subtitle: "Pallets completos y mochos para planificar cargues y consolidaciones.", hu: "HU559, HU560" },
    ordenes: { title: "Ordenes de transporte de insumos", eyebrow: "Materiales / Ordenes", subtitle: "Ordenes con documento logistico, vehiculo, finca destino y notificaciones operativas.", hu: "HU546, HU669, HU670, HU532", channel: "Web: registra y notifica · móvil: consulta y ejecuta hitos de campo." },
    proveedores: { title: "Resumen para proveedores externos", eyebrow: "Materiales / Proveedores externos", subtitle: "Generacion y envio digital de resumen para cartoneras y estibaderos.", hu: "HU668" },
    entregas: { title: "Seguimiento de entregas y POD", eyebrow: "Materiales / Entregas", subtitle: "Consulta de entrega efectiva, evidencia, firma digital y trazabilidad asociada.", hu: "HU681, HU682, HU547, HU607", channel: "Web: seguimiento, gestión y auditoría · móvil: captura de recepción, foto y firma." },
    materiales: { title: "Catálogo de materiales", eyebrow: "Materiales / Catálogo", subtitle: "Maestra de materiales con código SAP, nombre, unidad de medida y estado.", hu: "HU826", channel: "Web: administra el catálogo y las recetas · móvil: no administra la maestra." },
    movimientos: { title: "Movimientos de inventario", eyebrow: "Materiales / Inventario", subtitle: "Historial auditable de entradas, salidas y ajustes de materiales.", hu: "HU662", channel: "Web: consulta y seguimiento de movimientos · móvil: consulta complementaria cuando el rol operativo lo requiera." },
    recetas: { title: "Recetas de materiales", eyebrow: "Materiales / Recetas", subtitle: "Configuración de materiales requerida por caja, asociada a una combinación de Referencia + Versión.", hu: "HU826", channel: "Web: crea, edita, consulta y activa recetas · móvil: no administra la maestra." },
    proveedoresMaster: { title: "Gestion de proveedores", eyebrow: "Materiales / Maestra", subtitle: "Proveedores externos para resumenes digitales y coordinacion de entregas.", hu: "HU668 soporte" },
    reglas: { title: "Reglas documentales", eyebrow: "Materiales / Documentos", subtitle: "Parametrizacion de clasificacion automatica para RPT, remision y reserva.", hu: "HU667" }
  };

  function status(value) {
    const meta = statusMap[value] || ["status-warning", value || "Revision"];
    return `<span class="status ${meta[0]}">${esc(meta[1])}</span>`;
  }

  function documentTag(value) {
    return `<span class="tag">${esc(value)}</span>`;
  }

  function iconButton(label, icon, attrs = "") {
    return `<button class="icon-btn" type="button" aria-label="${esc(label)}" title="${esc(label)}" ${attrs}><svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${icons[icon]}</svg></button>`;
  }

  function detailButton(type, id) {
    return iconButton("Visualizar detalle", "eye", `data-material-detail="${esc(type)}" data-record-id="${esc(id)}"`);
  }

  function stateButton(label) {
    const icon = /^Activar/i.test(label) ? "active" : "inactive";
    return iconButton(label, icon);
  }

  function tableShell({ title, subtitle, countId, searchId, searchPlaceholder = "Buscar orden, finca, material o documento", statusId, contextId, contextLabel, contextOptions, rows, headers, body, filename, primary = "", notice = "", extraFilters = "", embeddedForm = "" }) {
    return `
      ${notice}
      <article class="card mt-24">
        <div class="card-header">
          <div><h2 class="card-title">${esc(title)}</h2><p class="card-subtitle">${esc(subtitle)}</p></div>
          <div class="card-actions">
            <span class="chip" id="${esc(countId)}">0 registros visibles</span>
            <button class="btn btn-secondary" type="button" data-export-table data-export-filename="${esc(filename)}" aria-label="Exportar ${esc(title)}"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3h18v4H3zM7 7v13h10V7"></path></svg><span>Exportar</span></button>
            ${primary}
          </div>
        </div>
        <div class="card-body">
          <div class="toolbar materials-toolbar">
            <input class="input" id="${esc(searchId)}" type="search" aria-label="Buscar" placeholder="${esc(searchPlaceholder)}" />
            <select class="select" id="${esc(statusId)}" aria-label="Filtrar por estado">
              <option value="all">Todos los estados</option>
              <option value="active">Activos / cerrados</option>
              <option value="warning">Pendientes / revision</option>
              <option value="inactive">Inactivos / bloqueo</option>
            </select>
            <select class="select" id="${esc(contextId)}" aria-label="${esc(contextLabel)}">
              <option value="all">${esc(contextLabel)}</option>
              ${contextOptions.map((item) => `<option value="${esc(item.value)}">${esc(item.label)}</option>`).join("")}
            </select>
            ${extraFilters}
          </div>
        </div>
        ${embeddedForm}
        <div class="table-wrap">
          <table class="materials-table" data-material-table="${esc(rows)}">
            <thead><tr>${headers.map((item) => `<th>${esc(item)}</th>`).join("")}<th>Acciones</th></tr></thead>
            <tbody>${body}</tbody>
          </table>
        </div>
        <div class="card-body"><div class="empty-state" id="${esc(rows)}Empty">No hay registros que coincidan con los filtros.</div></div>
      </article>
    `;
  }

  function rowDataset(item, context, state = item.status) {
    const stateClass = state === "ACTIVO" || state === "VALIDADO" || state === "ENTREGADA" || state === "CERRADA" || state === "CONSULTADO" || state === "NOTIFICADO" ? "active" : state === "INACTIVO" || state === "ERROR" ? "inactive" : "warning";
    return `data-status="${stateClass}" data-context="${esc(context)}" data-code="${esc(item.id || item.code)}" data-name="${esc(item.name || item.finca || item.provider || item.order || item.document || item.reference)}" data-state="${esc(state)}" data-audit="${esc(item.audit || "")}"`;
  }

  function orderRows() {
    return orders.map((item) => `
      <tr ${rowDataset(item, item.type.toLowerCase(), item.status)}>
        <td><div class="materials-record-main"><strong>${esc(item.id)}</strong><span>${esc(item.source)}</span></div></td>
        <td>${esc(item.type)}</td>
        <td>${esc(item.finca)}<br><span class="muted">${esc(item.week)}</span></td>
        <td>${esc(item.material)}<br><span class="muted">${esc(item.quantity)} ${esc(item.unit)}</span></td>
        <td>${esc(item.stock)}</td>
        <td>${documentTag(item.document)}<br><span class="muted">${esc(item.docState)}</span></td>
        <td>${status(item.status)}</td>
        <td class="muted">${esc(item.audit).replace("|", "<br>")}</td>
        <td><div class="row-actions">${detailButton("order", item.id)}${stateButton(item.status === "INACTIVO" ? "Activar pedido" : "Inactivar pedido")}</div></td>
      </tr>
    `).join("");
  }

  function stockRows() {
    return stock.map((item) => `
      <tr ${rowDataset(item, item.finca, item.status)}>
        <td><div class="materials-record-main"><strong>${esc(item.sapMaterial)}</strong><span>${esc(item.finca)}</span></div></td>
        <td>${esc(item.material)}</td><td>${esc(item.unit)}</td>
        <td><strong>${esc(item.available)}</strong></td><td>${esc(item.reserved)}</td><td><strong>${esc(item.total)}</strong><br><span class="muted">Informado por saldo</span></td>
        <td>${esc(item.lastMovement)}<br><span class="muted">${esc(item.updated)}</span></td>
        <td><div class="row-actions">${detailButton("stock", item.id)}<a class="icon-btn" href="movimientos-inventario.html?material=${encodeURIComponent(item.sapMaterial)}" aria-label="Ver movimientos del material" title="Ver movimientos del material"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${icons.eye}</svg></a></div></td>
      </tr>
    `).join("");
  }

  function palletRows() {
    return pallets.map((item) => `
      <tr ${rowDataset(item, item.type.toLowerCase(), item.status)}>
        <td><div class="materials-record-main"><strong>${esc(item.reference)}</strong><span>${esc(item.source)}</span></div></td>
        <td>${esc(item.type)}</td>
        <td>${esc(item.finca)}</td>
        <td>${esc(item.pallets)}</td>
        <td>${esc(item.boxesLeft)}</td>
        <td>${esc(item.destination)}</td>
        <td>${status(item.status)}</td>
        <td class="muted">Actualizar - operacion.movilidad<br>28/06/2026 08:30</td>
        <td><div class="row-actions">${detailButton("pallet", item.id)}</div></td>
      </tr>
    `).join("");
  }

  function transportRows() {
    return transportOrders.map((item) => `
      ${(() => { const notifications = notificationState(item.id); return `
      <tr ${rowDataset(item, item.docType.toLowerCase(), item.status)}>
        <td><div class="materials-record-main"><strong>${esc(item.id)}</strong><span>${esc(item.source)}</span></div></td>
        <td>${documentTag(item.docType)}<br><span class="muted">${esc(item.document)}</span></td>
        <td>${esc(item.finca)}</td>
        <td>${esc(item.vehicle)}<br><span class="muted">${esc(item.driver)}</span></td>
        <td>${esc(item.materials)}<br><span class="muted">${esc(item.quantity)}</span></td>
        <td>${status(item.status)}<br><span class="muted">Transporte: ${hasNotification(item, "transport") ? "notificado" : "pendiente"}<br>Conductor: ${item.driver === "--" ? "sin asignar" : hasNotification(item, "driver") ? "notificado" : "pendiente"}</span></td>
        <td class="muted">${esc(item.audit).replace("|", "<br>")}</td>
        <td><div class="row-actions">${detailButton("transport", item.id)}${iconButton("Notificar a transporte", "send", `data-material-action="notify-transport" data-record-id="${esc(item.id)}"`)}${iconButton("Notificar al conductor", "send", `data-material-action="notify-driver" data-record-id="${esc(item.id)}" ${item.driver === "--" || item.vehicle === "Sin asignar" ? "disabled" : ""}`)}${stateButton("Inactivar orden")}</div></td>
      </tr>
      `; })()}
    `).join("");
  }

  function summaryRows() {
    return supplierSummaries.map((item) => `
      <tr ${rowDataset(item, item.provider, item.status)}>
        <td><div class="materials-record-main"><strong>${esc(item.provider)}</strong><span>${esc(item.source)}</span></div></td>
        <td>${esc(item.period)}</td>
        <td>${esc(item.ordersCount)}</td>
        <td>${esc(item.materials)}<br><span class="muted">${esc(item.quantities)}</span></td>
        <td>${esc(item.destination)}</td>
        <td>${status(item.status)}</td>
        <td class="muted">Generado: ${esc(item.generated)}<br>Enviado: ${esc(item.sent)}</td>
        <td><div class="row-actions">${detailButton("summary", item.id)}${iconButton("Generar y compartir resumen", "send", `data-material-action="send-summary" data-record-id="${esc(item.id)}"`)}${stateButton("Inactivar resumen")}</div></td>
      </tr>
    `).join("");
  }

  function deliveryRows() {
    return deliveries.map((item) => `
      <tr ${rowDataset(item, item.finca, item.status)}>
        <td><div class="materials-record-main"><strong>${esc(item.order)}</strong><span>${esc(item.source)}</span></div></td>
        <td>${esc(item.document)}</td>
        <td>${esc(item.finca)}</td>
        <td>${esc(item.driver)}</td>
        <td>${esc(item.receiver)}<br><span class="muted">${esc(item.deliveredAt)}</span></td>
        <td>${esc(item.evidence)}<br><span class="muted">${esc(item.pod)}</span></td>
        <td>${status(item.status)}</td>
        <td class="muted">${esc(item.audit).replace("|", "<br>")}</td>
        <td><div class="row-actions">${detailButton("delivery", item.id)}<a class="icon-btn" href="../Trazabilidad/auditoria-operativa.html" aria-label="Ver auditoria operativa" title="Ver auditoria operativa"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${icons.eye}</svg></a></div></td>
      </tr>
    `).join("");
  }

  function materialRows() {
    return materials.map((item) => `
      <tr ${rowDataset(item, item.unit, item.status)}>
        <td><div class="materials-record-main"><strong>${esc(item.sapMaterial)}</strong><span>Material SAP</span></div></td>
        <td>${esc(item.name)}</td><td>${esc(item.unit)}</td><td>${status(item.status)}</td><td class="muted">${esc(item.audit).replace("|", "<br>")}</td>
        <td><div class="row-actions">${detailButton("material", item.id)}${iconButton("Editar material", "edit", "data-edit-inline")}${stateButton(item.status === "INACTIVO" ? "Activar material" : "Inactivar material")}</div></td>
      </tr>
    `).join("");
  }

  function recipeRows() {
    return recipes.map((item) => `
      <tr ${rowDataset(item, item.reference, item.status)}>
        <td><div class="materials-record-main"><strong>${esc(item.reference)}</strong><span>Referencia</span></div></td>
        <td>${esc(item.version)}</td>
        <td><strong>${item.materials.length}</strong><br><span class="muted">materiales requeridos</span></td>
        <td>${item.materials.slice(0, 2).map((line) => `${esc(line.sapMaterial)} · ${esc(line.quantityPerBox)} ${esc(line.unit)}`).join("<br>")} ${item.materials.length > 2 ? `<br><span class="muted">+ ${item.materials.length - 2} material(es)</span>` : ""}</td>
        <td>${status(item.status)}</td><td class="muted">${esc(item.audit).replace("|", "<br>")}</td>
        <td><div class="row-actions">${detailButton("recipe", item.id)}${iconButton("Editar receta", "edit", "data-edit-inline")}${stateButton(item.status === "INACTIVO" ? "Activar receta" : "Inactivar receta")}</div></td>
      </tr>
    `).join("");
  }

  function movementRows() {
    return movements.map((item) => `
      <tr ${rowDataset(item, item.type.toLowerCase(), item.status)} data-movement-date="${esc(item.date)}">
        <td><div class="materials-record-main"><strong>${esc(item.id)}</strong><span>${esc(item.sapMaterial)}</span></div></td>
        <td>${esc(item.material)}</td><td>${documentTag(item.type)}</td>
        <td><strong>${esc(item.quantity)} ${esc(item.unit)}</strong></td>
        <td>${esc(item.dateLabel)}</td><td>${esc(item.reason)}</td><td>${esc(item.user)}</td>
        <td><div class="row-actions">${detailButton("movement", item.id)}</div></td>
      </tr>
    `).join("");
  }

  function supplierRows() {
    return suppliers.map((item) => `
      <tr ${rowDataset(item, item.type, item.status)}>
        <td>${esc(item.code)}</td><td>${esc(item.name)}</td><td>${esc(item.type)}</td><td>${esc(item.contact)}</td><td>${status(item.status)}</td><td class="muted">${esc(item.audit).replace("|", "<br>")}</td>
        <td><div class="row-actions">${detailButton("supplier", item.id)}${iconButton("Editar proveedor", "edit", "data-edit-inline")}${stateButton(item.status === "INACTIVO" ? "Activar proveedor" : "Inactivar proveedor")}</div></td>
      </tr>
    `).join("");
  }

  function ruleRows() {
    return rules.map((item) => `
      <tr ${rowDataset(item, item.result.toLowerCase(), item.status)}>
        <td>${esc(item.code)}</td><td>${esc(item.name)}</td><td>${documentTag(item.result)}</td><td>${esc(item.condition)}</td><td>${status(item.status)}</td><td class="muted">${esc(item.audit).replace("|", "<br>")}</td>
        <td><div class="row-actions">${detailButton("rule", item.id)}${iconButton("Editar regla", "edit", "data-edit-inline")}${stateButton(item.status === "INACTIVO" ? "Activar regla" : "Inactivar regla")}</div></td>
      </tr>
    `).join("");
  }

  function notice(text, type = "info") {
    return `<div class="notice notice-${type}"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 8v5"></path><path d="M12 16h.01"></path></svg><span>${esc(text)}</span></div>`;
  }

  function notificationState(id) {
    try { return JSON.parse(localStorage.getItem(notificationKey) || "{}")[id] || {}; } catch { return {}; }
  }

  function hasNotification(item, recipient) {
    if (notificationState(item.id)[recipient]) return true;
    const seed = String(item.notified || "");
    return recipient === "transport" ? seed.includes("Transporte") : recipient === "driver" ? seed.includes("Conductor") : recipient === "farm" ? seed.includes("Finca") : false;
  }

  function saveNotification(id, recipient) {
    let state = {};
    try { state = JSON.parse(localStorage.getItem(notificationKey) || "{}"); } catch { state = {}; }
    state[id] = { ...(state[id] || {}), [recipient]: new Date().toISOString() };
    localStorage.setItem(notificationKey, JSON.stringify(state));
    return state[id];
  }

  function header(view) {
    const cfg = viewConfig[view] || viewConfig.dashboard;
    const legacyCatalogMeta = view === "materiales"
      ? `${notice(`Historias cubiertas: ${cfg.hu}. Esta propuesta es estatica y deja contratos listos para backend futuro.`)}${cfg.channel ? notice(`Canal y responsabilidad: ${cfg.channel}`, "info") : ""}`
      : "";
    return `
      <p class="page-eyebrow">${esc(cfg.eyebrow)}</p>
      <div class="page-header">
        <div><h1 class="page-title">${esc(cfg.title)}</h1><p class="page-subtitle">${esc(cfg.subtitle)}</p></div>
      </div>
      ${legacyCatalogMeta}
    `;
  }

  function dashboard() {
    return `
      ${header("dashboard")}
      <article class="card materials-navigation-card">
        <div class="card-header"><div><h2 class="card-title">Operación de materiales</h2><p class="card-subtitle">Selecciona la actividad que necesitas gestionar o consultar.</p></div></div>
        <div class="card-body materials-navigation-grid">
          <section class="materials-navigation-group" aria-labelledby="materialsSetupTitle"><h3 id="materialsSetupTitle">Configuración</h3><a class="btn btn-secondary" href="gestion-materiales.html">Catálogo de materiales</a><a class="btn btn-secondary" href="recetas-materiales.html">Recetas de materiales</a><a class="btn btn-secondary" href="gestion-proveedores.html">Proveedores</a><a class="btn btn-secondary" href="reglas-documentales.html">Reglas documentales</a></section>
          <section class="materials-navigation-group" aria-labelledby="materialsOrderTitle"><h3 id="materialsOrderTitle">Pedidos e inventario</h3><a class="btn btn-primary" href="gestion-pedidos-materiales.html">Gestionar pedidos</a><a class="btn btn-secondary" href="inventario-materiales-finca.html">Inventario de materiales</a><a class="btn btn-secondary" href="movimientos-inventario.html">Movimientos de inventario</a><a class="btn btn-secondary" href="inventario-pallets.html">Inventario de pallets</a></section>
          <section class="materials-navigation-group" aria-labelledby="materialsDeliveryTitle"><h3 id="materialsDeliveryTitle">Despacho y seguimiento</h3><a class="btn btn-secondary" href="ordenes-transporte-insumos.html">Órdenes de transporte</a><a class="btn btn-secondary" href="resumen-proveedores.html">Resumen para proveedores</a><a class="btn btn-secondary" href="seguimiento-entregas.html">Entregas y evidencias</a><a class="btn btn-secondary" href="trazabilidad-pedido.html">Trazabilidad de pedidos</a></section>
        </div>
      </article>
    `;
  }

  function searchSelectData(source) {
    if (source === "reference") {
      return recipes.map((item) => ({
        value: `${item.reference} · ${item.version}`,
        detail: `${item.materials.length} materiales configurados`,
        chip: statusMap[item.status]?.[1] || "Revisión",
        chipClass: `status ${statusMap[item.status]?.[0] || "status-warning"}`,
        search: `${item.reference} ${item.version} ${item.id}`
      }));
    }
    if (source === "unit") {
      return [
        { value: "UN", detail: "Unidad", chip: "Unidad", chipClass: "tag", search: "un unidad" },
        { value: "M", detail: "Metro", chip: "Unidad", chipClass: "tag", search: "m metro unidad" }
      ];
    }
    const selectByName = source === "materialName";
    return materials.map((item) => ({
      value: selectByName ? item.name : item.sapMaterial,
      detail: selectByName ? `Código SAP: ${item.sapMaterial} · ${item.unit}` : `${item.name} · ${item.unit}`,
      chip: item.unit,
      chipClass: "tag",
      materialId: item.id,
      search: `${item.sapMaterial} ${item.name} ${item.unit}`
    }));
  }

  function searchableSelect({ id, source, placeholder }) {
    return `<div class="search-select" data-material-search-select="${esc(source)}"><input class="input" id="${esc(id)}" type="search" autocomplete="off" required aria-haspopup="listbox" aria-expanded="false" aria-controls="${esc(id)}Panel" data-search-select-input placeholder="${esc(placeholder)}"><div class="search-select-panel is-hidden" id="${esc(id)}Panel" data-search-select-panel><div class="search-select-list" role="listbox" data-search-select-list></div></div></div>`;
  }

  function recipeMaterialLine() {
    const selectorId = `recipeMaterialSelect${recipeLineSequence++}`;
    return `<div class="grid recipe-material-line"><div class="field span-8"><label class="label" for="${esc(selectorId)}">Código SAP <span class="required">*</span></label>${searchableSelect({ id: selectorId, source: "material", placeholder: "Buscar por código SAP o material" })}<div class="field-note">Seleccione el material por código SAP.</div></div><div class="field span-4"><label class="label">Cantidad/caja <span class="required">*</span></label><input class="input" required inputmode="decimal" placeholder="1 UN"><div class="field-note">Cantidad sugerida por caja.</div></div></div>`;
  }

  function inlineForm(kind) {
    if (kind === "receta") {
      return `
        <div class="inline-form-panel materials-inline-form is-hidden" id="materialInlineForm" data-inline-form-panel>
          <div class="form-heading"><h2 data-inline-form-title>Nueva receta</h2><p>Asocie la receta a una combinación única de Referencia + Versión y defina los materiales requeridos por caja.</p></div>
          <div class="form-body">
            <form data-material-form novalidate>
              <section class="section"><div class="grid">
                <div class="field span-12"><label class="label" for="recipeReferenceSelect">Referencia + Versión <span class="required">*</span></label>${searchableSelect({ id: "recipeReferenceSelect", source: "reference", placeholder: "Buscar referencia y versión" })}<div class="field-note">Seleccione la combinación que identifica la receta.</div></div>
              </div></section>
              <section class="section"><div class="section-heading"><div><p class="section-kicker">Materiales requeridos</p><h3>Cantidad sugerida por caja</h3></div><button class="btn btn-secondary" type="button" data-material-action="add-recipe-line">Agregar material</button></div>
                <div data-recipe-lines>
                  ${recipeMaterialLine()}
                </div>
              </section>
              <div class="form-actions"><button class="btn btn-secondary" type="button" data-cancel-inline-form>Cancelar</button><button class="btn btn-primary" type="submit">Guardar receta</button></div>
            </form>
          </div>
        </div>
      `;
    }
    if (kind === "catalogo") {
      return `
        <div class="inline-form-panel materials-inline-form is-hidden" id="materialInlineForm" data-inline-form-panel>
          <div class="form-heading"><h2 data-inline-form-title>Nuevo material</h2><p>Formulario corto dentro de la gestión. El código SAP identifica el material en el catálogo.</p></div>
          <div class="form-body">
            <div class="notice notice-success is-hidden" id="formOk">Material listo para guardar.</div>
            <form data-material-form novalidate>
              <section class="section"><div class="grid">
                <div class="field span-4"><label class="label" for="catalogMaterialCodeSelect">Código SAP <span class="required">*</span></label>${searchableSelect({ id: "catalogMaterialCodeSelect", source: "materialCode", placeholder: "Buscar por código SAP" })}<div class="field-note">Seleccione el código SAP del material.</div></div>
                <div class="field span-5"><label class="label" for="catalogMaterialNameSelect">Nombre <span class="required">*</span></label>${searchableSelect({ id: "catalogMaterialNameSelect", source: "materialName", placeholder: "Buscar por nombre de material" })}<div class="field-note">Seleccione el nombre asociado al código SAP.</div></div>
                <div class="field span-3"><label class="label" for="catalogMaterialUnitSelect">Unidad de medida <span class="required">*</span></label>${searchableSelect({ id: "catalogMaterialUnitSelect", source: "unit", placeholder: "Buscar unidad de medida" })}<div class="field-note">Seleccione una unidad disponible.</div></div>
              </div></section>
              <div class="form-actions"><button class="btn btn-secondary" type="button" data-cancel-inline-form>Cancelar</button><button class="btn btn-primary" type="submit">Guardar material</button></div>
            </form>
          </div>
        </div>
      `;
    }
    if (kind === "material") {
      return `
        <div class="inline-form-panel materials-inline-form is-hidden" id="materialInlineForm" data-inline-form-panel>
          <div class="form-heading"><h2 data-inline-form-title>Configurar referencia</h2><p>HU826 · la referencia solo queda disponible para pedidos cuando la configuración está completa y validada.</p></div>
          <div class="form-body">
            <div class="notice notice-info">La fuente real usa la hoja PARAMETROS. Los campos de receta, vigencia, desperdicio, sustitutos y redondeo son controles de HU826 y deben completarse antes de activar.</div>
            <form data-material-form data-hu826-form novalidate>
              <section class="section"><div class="section-heading"><div><p class="section-kicker">Datos de PARAMETROS</p><h3>Identidad de la configuración</h3></div><span class="tag">Fuente real</span></div><div class="grid">
                <div class="field span-3"><label class="label" for="hu826Reference">Referencia <span class="required">*</span></label><input class="input" id="hu826Reference" name="reference" data-material-field="reference" required placeholder="16FT7BD-8"><div class="field-note">Columna Referencia.</div></div>
                <div class="field span-3"><label class="label" for="hu826SapMaterial">Material SAP <span class="required">*</span></label><input class="input" id="hu826SapMaterial" name="sapMaterial" data-material-field="sapMaterial" required placeholder="101279"><div class="field-note">Columna Material SAP.</div></div>
                <div class="field span-6"><label class="label" for="hu826Name">Nombre del material <span class="required">*</span></label><input class="input" id="hu826Name" name="name" data-material-field="name" required placeholder="BASE BBS11 FYFFES 13 KG (20 UND) V2"><div class="field-note">Debe corresponder al catálogo real.</div></div>
                <div class="field span-3"><label class="label" for="hu826Quantity">Cantidad/Caja <span class="required">*</span></label><input class="input" id="hu826Quantity" name="quantityPerBox" data-material-field="quantityPerBox" required inputmode="decimal" placeholder="0,06061"><div class="field-note">Se conserva la precisión de la fuente.</div></div>
                <div class="field span-3"><label class="label" for="hu826Unit">Unidad de medida SAP <span class="required">*</span></label><input class="input" id="hu826Unit" name="unit" data-material-field="unit" required placeholder="UN"><div class="field-note">Columna Unidad de medida en SAP.</div></div>
                <div class="field span-3"><label class="label" for="hu826Classification">Clasificación <span class="required">*</span></label><input class="input" id="hu826Classification" name="classification" data-material-field="classification" required value="CONVENCIONAL FAIRTRADE"><div class="field-note">Clasificación que aplica a la referencia.</div></div>
                <div class="field span-3"><label class="label" for="hu826ReferenceList">Listado de referencias <span class="required">*</span></label><input class="input" id="hu826ReferenceList" name="referenceList" data-material-field="referenceList" required placeholder="16FT7BD-8"><div class="field-note">Relación de referencias de la fuente.</div></div>
              </div></section>
              <section class="section"><div class="section-heading"><div><p class="section-kicker">Reglas de HU826</p><h3>Versión y vigencia</h3></div><span class="tag tag-warning">Requerido para activar</span></div><div class="grid">
                <div class="field span-3"><label class="label" for="hu826Recipe">Receta / versión <span class="required">*</span></label><input class="input" id="hu826Recipe" name="recipeVersion" data-material-field="recipeVersion" required placeholder="REC-16FT7BD-8 v1"><div class="field-note">No se toma de un valor inventado.</div></div>
                <div class="field span-3"><label class="label" for="hu826Start">Vigencia desde <span class="required">*</span></label><input class="input" id="hu826Start" name="validityStart" data-material-field="validityStart" required type="date"><div class="field-note">Inicio de vigencia de la configuración.</div></div>
                <div class="field span-3"><label class="label" for="hu826End">Vigencia hasta <span class="required">*</span></label><input class="input" id="hu826End" name="validityEnd" data-material-field="validityEnd" required type="date"><div class="field-note">Debe ser posterior al inicio.</div></div>
                <div class="field span-3"><label class="label" for="hu826Waste">Desperdicio (%) <span class="required">*</span></label><input class="input" id="hu826Waste" name="waste" data-material-field="waste" required type="number" min="0" max="100" step="0.01" placeholder="0"><div class="field-note">Entre 0 y 100.</div></div>
                <div class="field span-4"><label class="label" for="hu826Substitutes">Sustitutos <span class="required">*</span></label><input class="input" id="hu826Substitutes" name="substitutes" data-material-field="substitutes" required placeholder="Ninguno o Material SAP relacionado"><div class="field-note">No se activa sin declarar sustitución o ausencia.</div></div>
                <div class="field span-4"><label class="label" for="hu826Rounding">Regla de redondeo <span class="required">*</span></label><input class="input" id="hu826Rounding" name="rounding" data-material-field="rounding" required placeholder="Entero superior"><div class="field-note">Regla aplicada al pedido sugerido.</div></div>
                <div class="field span-4"><label class="label" for="hu826Status">Estado de configuración <span class="required">*</span></label><select class="select" id="hu826Status" name="status" data-material-field="status" required><option value="REVISION">Guardar en revisión</option><option value="ACTIVO">Activar configuración</option></select><div class="field-note">Activar requiere pasar todas las validaciones.</div></div>
              </div></section>
              <section class="section"><div class="section-heading"><div><p class="section-kicker">Contexto operativo</p><h3>Relación con pedido y finca</h3></div><span class="tag">Trazabilidad HU826</span></div><div class="grid">
                <div class="field span-4"><label class="label" for="hu826Farm">Finca <span class="required">*</span></label><select class="select" id="hu826Farm" name="farm" data-material-field="farm" required><option value="">Seleccionar finca</option><option>ANGELES</option><option>ARENAL</option><option>BUENAVISTA</option><option>DESPENSA</option><option>FABLISKA</option><option>GISELLE BEATRIZ</option><option>MANANTIAL</option></select><div class="field-note">Catálogo FINCAS.</div></div>
                <div class="field span-4"><label class="label" for="hu826OrderType">Tipo de pedido <span class="required">*</span></label><select class="select" id="hu826OrderType" name="orderType" data-material-field="orderType" required><option value="">Seleccionar tipo</option><option>Estibas</option><option>Normal</option><option>Prioritario</option><option>Adicional</option></select><div class="field-note">Catálogo FINCAS.</div></div>
                <div class="field span-4"><label class="label" for="hu826Week">Semana <span class="required">*</span></label><select class="select" id="hu826Week" name="week" data-material-field="week" required><option value="">Seleccionar semana</option>${Array.from({ length: 7 }, (_, index) => `<option>${index + 1}</option>`).join("")}</select><div class="field-note">Semanas disponibles en la fuente.</div></div>
                <div class="field span-4"><label class="label" for="hu826SourceRequest">Aviso de corte o pedido <span class="required">*</span></label><input class="input" id="hu826SourceRequest" name="sourceRequest" data-material-field="sourceRequest" required placeholder="PED-071 / aviso de corte"><div class="field-note">Entidad que origina la necesidad.</div></div>
                <div class="field span-4"><label class="label" for="hu826Document">Documento logístico <span class="required">*</span></label><select class="select" id="hu826Document" name="logisticDocument" data-material-field="logisticDocument" required><option value="">Seleccionar documento</option><option>RPT</option><option>Remisión</option><option>Reserva</option></select><div class="field-note">Documento aplicable al contexto.</div></div>
                <div class="field span-4"><label class="label" for="hu826Rule">Regla de validación <span class="required">*</span></label><select class="select" id="hu826Rule" name="validationRule" data-material-field="validationRule" required><option value="">Seleccionar regla</option><option>Stock disponible</option><option>Configuración vigente</option><option>Excepción por tolerancia</option></select><div class="field-note">Regla que habilita el siguiente paso.</div></div>
                <div class="field span-3"><label class="label" for="hu826Suggested">Cantidad sugerida <span class="required">*</span></label><input class="input" id="hu826Suggested" name="suggestedQuantity" data-material-field="suggestedQuantity" required type="number" min="0" step="0.00001"><div class="field-note">Cantidad calculada para el contexto.</div></div>
                <div class="field span-3"><label class="label" for="hu826Adjusted">Cantidad ajustada <span class="required">*</span></label><input class="input" id="hu826Adjusted" name="adjustedQuantity" data-material-field="adjustedQuantity" required type="number" min="0" step="0.00001"><div class="field-note">Cantidad confirmada o ajustada.</div></div>
                <div class="field span-3"><label class="label" for="hu826Stock">Stock disponible <span class="required">*</span></label><input class="input" id="hu826Stock" name="availableStock" data-material-field="availableStock" required type="number" min="0" step="0.00001"><div class="field-note">No se edita como saldo libre.</div></div>
                <div class="field span-3"><label class="label" for="hu826User">Usuario responsable <span class="required">*</span></label><input class="input" id="hu826User" name="responsibleUser" data-material-field="responsibleUser" required value="almacen.admin"><div class="field-note">Se registra en auditoría.</div></div>
                <div class="field span-12"><label class="label" for="hu826Observation">Observación / motivo <span class="required">*</span></label><textarea class="input" id="hu826Observation" name="observation" data-material-field="observation" required rows="3" placeholder="Explique la configuración, ajuste o novedad."></textarea><div class="field-note">Obligatoria para trazabilidad y casos de excepción.</div></div>
              </div></section>
              <div class="notice notice-warning" data-hu826-form-message role="status" hidden></div>
              <div class="form-actions"><button class="btn btn-secondary" type="button" data-cancel-inline-form>Cancelar</button><button class="btn btn-primary" type="submit">Guardar configuración</button></div>
            </form>
          </div>
        </div>
      `;
    }
    const config = {
      pedido: ["Nuevo pedido adicional", "Guardar pedido adicional", "Relaciona la necesidad excepcional con el pedido base antes de enviarla a validación.", [["Semana de corte", "Semana 27 - 2026"], ["Finca", "Finca El Retiro"], ["Pedido base", "PED-071"], ["Motivo", "Necesidad extraordinaria de corte"]]],
      supplier: ["Nuevo proveedor", "Guardar proveedor", "Registra los datos necesarios para coordinar resúmenes y entregas.", [["Codigo", "PRV-NUE-01"], ["Nombre proveedor", "Proveedor externo"], ["Tipo", "Cartonera"], ["Contacto", "contacto@proveedor.example"]]],
      rule: ["Nueva regla documental", "Guardar regla", "Define la condición con la que se clasifica el documento logístico.", [["Codigo", "DOC-NUE"], ["Nombre regla", "Regla de clasificacion"], ["Resultado", "RPT"], ["Condicion", "Pedido validado con stock disponible"]]]
    }[kind];
    return `
      <div class="inline-form-panel materials-inline-form is-hidden" id="materialInlineForm" data-inline-form-panel>
        <div class="form-heading"><h2 data-inline-form-title>${esc(config[0])}</h2><p>${esc(config[2])}</p></div>
        <div class="form-body">
          <div class="notice notice-success is-hidden" id="formOk">Registro listo para guardar.</div>
          <form data-material-form novalidate>
            <section class="section"><div class="grid">
              ${config[3].map(([label, placeholder]) => `<div class="field span-3"><label class="label">${esc(label)} <span class="required">*</span></label><input class="input" required placeholder="${esc(placeholder)}"></div>`).join("")}
            </div></section>
            <div class="form-actions"><button class="btn btn-secondary" type="button" data-cancel-inline-form>Cancelar</button><button class="btn btn-primary" type="submit">${esc(config[1])}</button></div>
          </form>
        </div>
      </div>
    `;
  }

  const contextByView = {
    pedidos: [{ value: "sugerido", label: "Sugeridos" }, { value: "adicional", label: "Adicionales" }, { value: "estandar", label: "Estandar" }],
    inventario: [{ value: "Finca Santa Isabel", label: "Finca Santa Isabel" }, { value: "Finca El Retiro", label: "Finca El Retiro" }, { value: "Finca Las Palmas", label: "Finca Las Palmas" }],
    pallets: [{ value: "completo", label: "Completos" }, { value: "mocho", label: "Mochos" }],
    ordenes: [{ value: "rpt", label: "RPT" }, { value: "remision", label: "Remision" }, { value: "reserva", label: "Reserva" }],
    proveedores: suppliers.map((item) => ({ value: item.name, label: item.name })),
    entregas: [{ value: "Finca Santa Isabel", label: "Finca Santa Isabel" }, { value: "Finca El Retiro", label: "Finca El Retiro" }, { value: "Finca Las Palmas", label: "Finca Las Palmas" }],
    materiales: [{ value: "UN", label: "UN" }, { value: "M", label: "M" }],
    movimientos: [{ value: "entrada", label: "Entradas" }, { value: "salida", label: "Salidas" }, { value: "ajuste", label: "Ajustes" }],
    recetas: [{ value: "16FT7BD-8", label: "16FT7BD-8" }, { value: "20LD7RA-20", label: "20LD7RA-20" }, { value: "21X5BDOF", label: "21X5BDOF" }],
    proveedoresMaster: [{ value: "Cartonera", label: "Cartonera" }, { value: "Estibadero", label: "Estibadero" }, { value: "Proveedor material", label: "Proveedor material" }],
    reglas: [{ value: "rpt", label: "RPT" }, { value: "remision", label: "Remision" }, { value: "reserva", label: "Reserva" }]
  };

  function renderView(view) {
    if (view === "dashboard") return dashboard();
    const map = {
      pedidos: ["Pedidos de materiales", "Listado operativo con stock consultado, origen del pedido y documento logistico.", "pedidoCount", "pedidoSearch", "pedidoStatus", "pedidoContext", "Todos los tipos", contextByView.pedidos, ["Pedido", "Tipo", "Finca / semana", "Material / cantidad", "Stock consultado", "Documento", "Estado", "Auditoria"], orderRows(), "pedidos-materiales", '<button class="btn btn-primary" type="button" data-open-inline-form>Pedido adicional</button>', "", "", inlineForm("pedido")],
      inventario: ["Existencias de materiales", "Inventario por finca con saldo disponible, reservado y total informado.", "stockCount", "stockSearch", "stockStatus", "stockContext", "Todas las fincas", contextByView.inventario, ["Código SAP / finca", "Material", "Unidad", "Disponible", "Reservado", "Total", "Último movimiento / actualización"], stockRows(), "inventario-materiales", "", ""],
      pallets: ["Pallets completos e incompletos", "Inventario ZE para planificar cargue de contenedores y consolidacion posterior.", "palletCount", "palletSearch", "palletStatus", "palletContext", "Todos los tipos", contextByView.pallets, ["Referencia", "Tipo", "Finca origen", "Pallets", "Cajas restantes", "Destino", "Estado", "Auditoria"], palletRows(), "inventario-pallets", '<a class="btn btn-secondary" href="../pallets/armar-pallet.html">Ver flujo movil</a>', ""],
      ordenes: ["Ordenes de transporte", "Ordenes de insumos con documento, vehiculo, finca destino y notificacion.", "transportCount", "transportSearch", "transportStatus", "transportContext", "Todos los documentos", contextByView.ordenes, ["Orden", "Documento", "Finca destino", "Vehiculo / conductor", "Materiales", "Estado", "Auditoria"], transportRows(), "ordenes-transporte-insumos", '<button class="btn btn-primary" type="button" data-material-action="notify-all">Notificar pendientes</button>', ""],
      proveedores: ["Resumenes digitales", "Consolidacion por proveedor externo, periodo, materiales, destino y envio.", "summaryCount", "summarySearch", "summaryStatus", "summaryContext", "Todos los proveedores", contextByView.proveedores, ["Proveedor", "Periodo", "Ordenes", "Materiales / cantidades", "Destino", "Estado", "Generacion / envio"], summaryRows(), "resumen-proveedores", '<button class="btn btn-primary" type="button" data-material-action="generate-summary">Generar resumen</button>', ""],
      entregas: ["Entregas y evidencias POD", "Seguimiento read-only de entrega efectiva, responsable, foto/firma y auditoria.", "deliveryCount", "deliverySearch", "deliveryStatus", "deliveryContext", "Todas las fincas", contextByView.entregas, ["Orden", "Documento", "Finca", "Transportista", "Recepcion", "Evidencia", "Estado", "Auditoria"], deliveryRows(), "seguimiento-entregas", '<a class="btn btn-secondary" href="../Trazabilidad/auditoria-operativa.html">Ver auditoria</a>', ""],
      materiales: ["Catálogo de materiales", "Maestra de materiales para consulta, creación, edición y cambio de estado.", "materialCount", "materialSearch", "materialStatus", "materialContext", "Todas las unidades", contextByView.materiales, ["Código SAP", "Nombre", "Unidad de medida", "Estado", "Auditoría"], materialRows(), "catalogo-materiales", '<button class="btn btn-primary" type="button" data-open-inline-form>Nuevo material</button>', notice("El catálogo identifica cada material. La cantidad sugerida por caja pertenece a la receta, no a esta maestra.", "info"), "", inlineForm("catalogo")],
      movimientos: ["Historial de movimientos", "Entradas, salidas y ajustes; filtre por material, tipo de movimiento y rango de fechas.", "movementCount", "movementSearch", "movementStatus", "movementContext", "Todos los tipos", contextByView.movimientos, ["Movimiento / SAP", "Material", "Tipo", "Cantidad", "Fecha", "Motivo", "Usuario"], movementRows(), "movimientos-inventario", "", "", '<input class="input" id="movementDateFrom" type="date" aria-label="Fecha inicial"><input class="input" id="movementDateTo" type="date" aria-label="Fecha final">'],
      recetas: ["Recetas por Referencia + Versión", "Cada receta define los materiales requeridos y la cantidad sugerida por caja.", "recipeCount", "recipeSearch", "recipeStatus", "recipeContext", "Todas las referencias", contextByView.recetas, ["Referencia", "Versión", "Materiales", "Cantidad sugerida por caja", "Estado", "Auditoría"], recipeRows(), "recetas-materiales", '<button class="btn btn-primary" type="button" data-open-inline-form>Nueva receta</button>', "", "", inlineForm("receta")],
      proveedoresMaster: ["Proveedores registrados", "Maestra minima de proveedores externos para resumen digital.", "supplierCount", "supplierSearch", "supplierStatus", "supplierContext", "Todos los tipos", contextByView.proveedoresMaster, ["Codigo", "Proveedor", "Tipo", "Contacto", "Estado", "Auditoria"], supplierRows(), "proveedores", '<button class="btn btn-primary" type="button" data-open-inline-form>Nuevo proveedor</button>', "", "", inlineForm("supplier")],
      reglas: ["Reglas documentales", "Clasificacion automatica para RPT, remision y reserva.", "ruleCount", "ruleSearch", "ruleStatus", "ruleContext", "Todos los resultados", contextByView.reglas, ["Codigo", "Regla", "Resultado", "Condicion", "Estado", "Auditoria"], ruleRows(), "reglas-documentales", '<button class="btn btn-primary" type="button" data-open-inline-form>Nueva regla</button>', "", "", inlineForm("rule")]
    };
    const cfg = map[view];
    const searchPlaceholder = {
      pedidos: "Buscar pedido, finca, material o documento",
      inventario: "Buscar material, código SAP o finca",
      pallets: "Buscar referencia, finca o destino",
      ordenes: "Buscar orden, documento, finca o vehículo",
      proveedores: "Buscar proveedor, periodo o material",
      entregas: "Buscar orden, documento o finca",
      movimientos: "Buscar movimiento, material o usuario",
      recetas: "Buscar referencia, versión o material",
      proveedoresMaster: "Buscar proveedor, código o contacto",
      reglas: "Buscar regla, código o resultado"
    }[view];
    return header(view) + tableShell({
      title: cfg[0],
      subtitle: cfg[1],
      countId: cfg[2],
      searchId: cfg[3],
      searchPlaceholder,
      statusId: cfg[4],
      contextId: cfg[5],
      contextLabel: cfg[6],
      contextOptions: cfg[7],
      headers: cfg[8],
      body: cfg[9],
      filename: cfg[10],
      rows: cfg[10],
      primary: cfg[11],
      notice: cfg[12],
      extraFilters: cfg[13] || "",
      embeddedForm: cfg[14] || ""
    });
  }

  function findRecord(type, id) {
    const maps = { order: orders, stock, pallet: pallets, transport: transportOrders, summary: supplierSummaries, delivery: deliveries, material: materials, movement: movements, recipe: recipes, supplier: suppliers, rule: rules };
    return (maps[type] || []).find((item) => item.id === id);
  }

  const detailLabels = {
    id: "Identificador", reference: "Referencia", version: "Versión", materials: "Materiales requeridos", status: "Estado", source: "Fuente funcional", audit: "Auditoría",
    sapMaterial: "Código SAP", name: "Nombre", quantityPerBox: "Cantidad sugerida por caja", unit: "Unidad de medida", classification: "Clasificación", referenceList: "Listado de referencias",
    validityStart: "Vigencia desde", validityEnd: "Vigencia hasta", waste: "Desperdicio (%)", substitutes: "Sustitutos", rounding: "Regla de redondeo",
    finca: "Finca", material: "Material", available: "Disponible", reserved: "Reservado", total: "Total", damaged: "Dañado", updated: "Fecha de actualización", lastMovement: "Último movimiento", coverage: "Cobertura",
    type: "Tipo", quantity: "Cantidad", date: "Fecha", dateLabel: "Fecha y hora", reason: "Motivo", user: "Usuario", code: "Código", provider: "Proveedor", contact: "Contacto",
    document: "Documento", docType: "Tipo de documento", documentState: "Estado del documento", vehicle: "Vehículo", driver: "Conductor", notified: "Notificaciones", destination: "Destino", week: "Semana",
    order: "Orden", receiver: "Recibido por", deliveredAt: "Fecha de entrega", evidence: "Evidencia", pod: "Comprobante de entrega", pallets: "Pallets", boxesLeft: "Cajas restantes", result: "Resultado", condition: "Condición"
  };

  function detailLabel(key) {
    return detailLabels[key] || key.replace(/([A-Z])/g, " $1").replace(/^./, (value) => value.toUpperCase());
  }

  function detailTitle(type, record) {
    const titles = { material: "Detalle de material", recipe: "Detalle de receta", stock: "Detalle de inventario", movement: "Detalle de movimiento", order: "Detalle de pedido", transport: "Detalle de orden de transporte", supplier: "Detalle de proveedor", rule: "Detalle de regla" };
    return titles[type] || "Detalle del registro";
  }

  function detailRows(record) {
    return Object.entries(record || {}).filter(([key]) => !["audit"].includes(key)).map(([key, value]) => `
      <div class="detail-group"><span class="detail-label">${esc(detailLabel(key))}</span><div class="detail-value">${Array.isArray(value) ? value.map((line) => `<div class="audit-item"><strong>${esc(line.sapMaterial)} · ${esc(line.name)}</strong><div class="muted">Cantidad sugerida por caja: ${esc(line.quantityPerBox)} ${esc(line.unit)}</div></div>`).join("") : key === "status" ? status(value) : value === "" || value == null ? status("REVISION") : esc(value)}</div></div>
    `).join("");
  }

  function openDetail(type, id) {
    const record = findRecord(type, id);
    const drawer = qs("#materialDetailDrawer");
    const backdrop = qs("#materialDetailBackdrop");
    if (!drawer || !record) return;
    drawer.hidden = false;
    drawer.setAttribute("aria-hidden", "false");
    if (backdrop) backdrop.hidden = false;
    qs("[data-material-detail-title]", drawer).textContent = detailTitle(type, record);
    qs("[data-material-detail-subtitle]", drawer).textContent = `Fuente funcional: ${record.source || "Propuesta Materiales y Suministros"}`;
    qs("[data-material-detail-body]", drawer).innerHTML = `
      ${detailRows(record)}
      <div class="detail-group"><span class="detail-label">Auditoría</span><div class="stack">${String(record.audit || "Sin auditoría registrada").split(";").map((item) => `<div class="audit-item"><strong>${esc(item.split("|")[0] || item)}</strong><div class="muted">${esc(item.split("|")[1] || "")}</div></div>`).join("")}</div></div>
      ${type === "transport" && record.status === "LISTO_DESPACHO" ? `<a class="btn btn-primary" href="../Gestion%20de%20Transporte/plan-operacional.html?origen=orden&id=${encodeURIComponent(record.id)}">Planificar transporte</a>` : ""}
    `;
    drawer.classList.add("show");
    backdrop?.classList.add("show");
    qs("[data-close-material-detail]", drawer)?.focus();
  }

  function closeDetail() {
    const drawer = qs("#materialDetailDrawer");
    const backdrop = qs("#materialDetailBackdrop");
    drawer?.classList.remove("show");
    backdrop?.classList.remove("show");
    if (drawer) {
      drawer.setAttribute("aria-hidden", "true");
      drawer.hidden = true;
    }
    if (backdrop) backdrop.hidden = true;
  }

  function initSearchSelects(root = document) {
    qsa("[data-material-search-select]", root).forEach((selectRoot) => {
      if (selectRoot.dataset.searchSelectReady === "true") return;
      selectRoot.dataset.searchSelectReady = "true";
      const input = qs("[data-search-select-input]", selectRoot);
      const panel = qs("[data-search-select-panel]", selectRoot);
      const list = qs("[data-search-select-list]", selectRoot);
      const source = selectRoot.dataset.materialSearchSelect;
      if (!input || !panel || !list) return;

      const close = () => {
        panel.classList.add("is-hidden");
        input.setAttribute("aria-expanded", "false");
      };
      const render = () => {
        const query = input.value.trim().toLocaleLowerCase("es-CO");
        const options = searchSelectData(source).filter((item) => `${item.value} ${item.detail} ${item.search}`.toLocaleLowerCase("es-CO").includes(query));
        if (!options.length) {
          list.innerHTML = '<div class="search-select-empty">No hay resultados para esta búsqueda.</div>';
          return;
        }
        list.innerHTML = options.map((item, index) => `<button class="search-select-option" type="button" role="option" aria-selected="${input.dataset.selectedValue === item.value}" data-search-select-option="${index}"><span><strong>${esc(item.value)}</strong><small>${esc(item.detail)}</small></span><span class="${esc(item.chipClass)}">${esc(item.chip)}</span></button>`).join("");
        qsa("[data-search-select-option]", list).forEach((button) => {
          button.addEventListener("click", () => {
            const item = options[Number(button.dataset.searchSelectOption)];
            if (!item) return;
            input.value = item.value;
            input.dataset.selectedValue = item.value;
            if (["materialCode", "materialName"].includes(source)) {
              const selectedMaterial = materials.find((material) => material.id === item.materialId);
              const form = input.closest("[data-material-form]");
              if (selectedMaterial && form) {
                qsa("[data-material-search-select]", form).forEach((linkedSelect) => {
                  const linkedInput = qs("[data-search-select-input]", linkedSelect);
                  if (!linkedInput) return;
                  if (linkedSelect.dataset.materialSearchSelect === "materialCode") linkedInput.value = selectedMaterial.sapMaterial;
                  if (linkedSelect.dataset.materialSearchSelect === "materialName") linkedInput.value = selectedMaterial.name;
                  linkedInput.dataset.selectedValue = linkedInput.value;
                });
              }
            }
            close();
          });
        });
      };
      const open = () => {
        render();
        panel.classList.remove("is-hidden");
        input.setAttribute("aria-expanded", "true");
      };

      input.addEventListener("focus", open);
      input.addEventListener("input", () => {
        input.dataset.selectedValue = "";
        open();
      });
      input.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          close();
          input.blur();
        }
      });
      selectRoot.closeSearchSelect = close;
    });
    if (document.documentElement.dataset.materialSearchSelectCloseBound !== "true") {
      document.documentElement.dataset.materialSearchSelectCloseBound = "true";
      document.addEventListener("click", (event) => {
        if (event.target.closest("[data-material-search-select]")) return;
        qsa("[data-material-search-select]").forEach((selectRoot) => selectRoot.closeSearchSelect?.());
      });
    }
  }

  function initActions() {
    document.addEventListener("click", (event) => {
      if (!event.target.closest("a[href]")) return;
      if (qs("#materialDetailDrawer")?.classList.contains("show")) closeDetail();
    }, true);
    qsa("[data-material-detail]").forEach((button) => {
      button.addEventListener("click", () => openDetail(button.dataset.materialDetail, button.dataset.recordId));
    });
    qsa("[data-close-material-detail], #materialDetailBackdrop").forEach((node) => node.addEventListener("click", closeDetail));
    qsa("[data-material-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.materialAction;
        const recordId = button.dataset.recordId;
        if (action === "notify-driver" && recordId) {
          const item = transportOrders.find((record) => record.id === recordId);
          if (!item || item.driver === "--" || item.vehicle === "Sin asignar") { showMaterialFeedback("No se puede notificar al conductor: la orden no tiene conductor y vehículo asignados."); return; }
          const previous = hasNotification(item, "driver");
          saveNotification(recordId, "driver");
          showMaterialFeedback(previous ? "El conductor ya estaba notificado; no se duplicó el aviso." : `Notificación al conductor ${item.driver} registrada con ${item.id}.`);
          window.setTimeout(() => window.location.reload(), 700);
          return;
        }
        if (action === "notify-transport" && recordId) {
          const previous = hasNotification(transportOrders.find((record) => record.id === recordId) || { id: recordId }, "transport");
          saveNotification(recordId, "transport");
          showMaterialFeedback(previous ? "Transporte ya estaba notificado; no se duplicó el aviso." : "Notificación a transporte registrada en la trazabilidad.");
          window.setTimeout(() => window.location.reload(), 700);
          return;
        }
        if (action === "notify-all") {
          let eligible = 0; let pending = 0;
          transportOrders.forEach((item) => {
            saveNotification(item.id, "transport"); eligible += 1;
            saveNotification(item.id, "farm");
            if (item.driver !== "--" && item.vehicle !== "Sin asignar") saveNotification(item.id, "driver"); else pending += 1;
          });
          showMaterialFeedback(`${eligible} ordenes notificadas a transporte y finca. ${pending ? `${pending} queda pendiente por asignación de conductor/vehículo.` : "Todos los conductores elegibles fueron notificados."}`);
          window.setTimeout(() => window.location.reload(), 700);
          return;
        }
        if (action === "add-recipe-line") {
          const lines = qs("[data-recipe-lines]");
          if (!lines) return;
          lines.insertAdjacentHTML("beforeend", recipeMaterialLine());
          const addedLine = lines.lastElementChild;
          initSearchSelects(addedLine);
          addedLine?.querySelector("input")?.focus();
          return;
        }
        const table = button.closest(".card") || qs(".page");
        table?.classList.add("materials-generated");
        setTimeout(() => table?.classList.remove("materials-generated"), 1200);
        const msg = action === "send-summary" || action === "generate-summary"
          ? "Resumen digital generado/enviado y registrado en auditoria de propuesta."
          : "Notificacion simulada registrada para transporte, conductor, seguridad o finca.";
        const alert = qs("[data-material-runtime-alert]");
        if (alert) {
          const message = qs("[data-material-runtime-message]", alert);
          if (!message) return;
          message.textContent = msg;
          alert.hidden = false;
          window.clearTimeout(alert.runtimeTimer);
          alert.runtimeTimer = window.setTimeout(() => {
            alert.hidden = true;
            message.textContent = "";
          }, 3200);
        }
      });
    });
    qsa("[data-material-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        qs("#formOk")?.classList.remove("is-hidden");
      });
    });
  }

  function showMaterialFeedback(message) {
    const alert = qs("[data-material-runtime-alert]");
    if (!alert) return;
    const text = qs("[data-material-runtime-message]", alert);
    if (!text) return;
    text.textContent = message;
    alert.hidden = false;
    window.clearTimeout(alert.runtimeTimer);
    alert.runtimeTimer = window.setTimeout(() => { alert.hidden = true; text.textContent = ""; }, 3200);
  }

  function initHu826Form() {
    const form = qs("[data-hu826-form]");
    const message = qs("[data-hu826-form-message]");
    if (!form) return;

    const readFields = () => Object.fromEntries(qsa("[data-material-field]", form).map((field) => [field.dataset.materialField, field.value.trim()]));
    const numberValue = (value) => Number(String(value).replace(",", "."));
    const showMessage = (text, type = "warning") => {
      if (!message) return;
      message.className = `notice notice-${type}`;
      message.textContent = text;
      message.hidden = false;
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = readFields();
      const errors = [];
      const required = ["reference", "sapMaterial", "name", "quantityPerBox", "unit", "classification", "referenceList", "recipeVersion", "validityStart", "validityEnd", "waste", "substitutes", "rounding", "status", "farm", "orderType", "week", "sourceRequest", "logisticDocument", "validationRule", "suggestedQuantity", "adjustedQuantity", "availableStock", "responsibleUser", "observation"];
      required.forEach((field) => { if (!data[field]) errors.push(`Falta ${field}.`); });

      const quantityPerBox = numberValue(data.quantityPerBox);
      const waste = numberValue(data.waste);
      const suggested = numberValue(data.suggestedQuantity);
      const adjusted = numberValue(data.adjustedQuantity);
      const stock = numberValue(data.availableStock);
      if (data.quantityPerBox && (!Number.isFinite(quantityPerBox) || quantityPerBox < 0)) errors.push("Cantidad/Caja debe ser un número mayor o igual a cero.");
      if (data.waste && (!Number.isFinite(waste) || waste < 0 || waste > 100)) errors.push("El desperdicio debe estar entre 0 y 100%.");
      ["suggestedQuantity", "adjustedQuantity", "availableStock"].forEach((field) => { if (data[field] && (!Number.isFinite(numberValue(data[field])) || numberValue(data[field]) < 0)) errors.push(`${field} debe ser un número mayor o igual a cero.`); });
      if (data.validityStart && data.validityEnd && data.validityEnd < data.validityStart) errors.push("La vigencia hasta no puede ser anterior a la vigencia desde.");
      if (data.adjustedQuantity && data.suggestedQuantity && adjusted !== suggested && data.validationRule !== "Excepción por tolerancia") errors.push("Un ajuste diferente al sugerido debe usar la regla Excepción por tolerancia.");

      const duplicate = materials.find((item) => item.reference === data.reference && item.sapMaterial === data.sapMaterial && item.recipeVersion === data.recipeVersion);
      if (duplicate) errors.push("Ya existe una configuración con la misma referencia, Material SAP y versión de receta.");

      const idempotencyKey = [data.reference, data.sapMaterial, data.recipeVersion, data.farm, data.week, data.sourceRequest].join("|");
      let savedKeys = {};
      try { savedKeys = JSON.parse(localStorage.getItem(`${hu826ConfigKey}:keys`) || "{}"); } catch { savedKeys = {}; }
      if (savedKeys[idempotencyKey]) errors.push("La misma configuración ya fue registrada; no se duplicó la operación.");

      if (errors.length) {
        showMessage(errors.join(" "), "warning");
        return;
      }

      const now = new Date();
      const configuration = {
        id: `HU826-${data.reference}-${data.sapMaterial}-${Date.now()}`,
        ...data,
        category: data.classification,
        code: data.sapMaterial,
        source: "HU826 · configuración propuesta",
        audit: `Configurar - ${data.responsibleUser}|${now.toLocaleString("es-CO")}`,
        status: data.status
      };
      materials.unshift(configuration);
      try {
        const previous = JSON.parse(localStorage.getItem(hu826ConfigKey) || "[]");
        localStorage.setItem(hu826ConfigKey, JSON.stringify([configuration, ...(Array.isArray(previous) ? previous : [])].slice(0, 50)));
        savedKeys[idempotencyKey] = now.toISOString();
        localStorage.setItem(`${hu826ConfigKey}:keys`, JSON.stringify(savedKeys));
      } catch { /* La evidencia de la propuesta permanece visible durante la sesión. */ }
      showMessage(data.status === "ACTIVO" ? "Configuración validada y activada para el contexto seleccionado." : "Configuración guardada en revisión; todavía no está disponible para HU659.", "success");
      form.reset();
    });
  }

  function initFilters(view) {
    if (view === "dashboard") return;
    const cfg = {
      pedidos: ["#pedidoSearch", "#pedidoStatus", "#pedidoContext", "#pedidos-materialesEmpty", "#pedidoCount"],
      inventario: ["#stockSearch", "#stockStatus", "#stockContext", "#inventario-fincaEmpty", "#stockCount"],
      pallets: ["#palletSearch", "#palletStatus", "#palletContext", "#inventario-palletsEmpty", "#palletCount"],
      ordenes: ["#transportSearch", "#transportStatus", "#transportContext", "#ordenes-transporte-insumosEmpty", "#transportCount"],
      proveedores: ["#summarySearch", "#summaryStatus", "#summaryContext", "#resumen-proveedoresEmpty", "#summaryCount"],
      entregas: ["#deliverySearch", "#deliveryStatus", "#deliveryContext", "#seguimiento-entregasEmpty", "#deliveryCount"],
      materiales: ["#materialSearch", "#materialStatus", "#materialContext", "#materialesEmpty", "#materialCount"],
      movimientos: ["#movementSearch", "#movementStatus", "#movementContext", "#movimientos-inventarioEmpty", "#movementCount"],
      recetas: ["#recipeSearch", "#recipeStatus", "#recipeContext", "#recetas-materialesEmpty", "#recipeCount"],
      proveedoresMaster: ["#supplierSearch", "#supplierStatus", "#supplierContext", "#proveedoresEmpty", "#supplierCount"],
      reglas: ["#ruleSearch", "#ruleStatus", "#ruleContext", "#reglas-documentalesEmpty", "#ruleCount"]
    }[view];
    if (!cfg) return;
    SIALCore.initTableFilters({ rowSelector: "tbody tr", search: cfg[0], status: cfg[1], context: cfg[2], empty: cfg[3], count: cfg[4] });

    if (view === "movimientos") {
      const from = qs("#movementDateFrom");
      const to = qs("#movementDateTo");
      const applyDateRange = () => {
        qsa("[data-movement-date]").forEach((row) => {
          const date = row.dataset.movementDate;
          const matchesDate = (!from?.value || date >= from.value) && (!to?.value || date <= to.value);
          row.dataset.dateMatch = String(matchesDate);
          row.classList.toggle("is-hidden", !matchesDate || row.dataset.filterMatch === "false");
        });
      };
      [from, to].filter(Boolean).forEach((control) => control.addEventListener("change", applyDateRange));
      const material = new URLSearchParams(window.location.search).get("material");
      if (material) {
        const search = qs("#movementSearch");
        if (search) { search.value = material; search.dispatchEvent(new Event("input", { bubbles: true })); }
      }
      applyDateRange();
    }
  }

  function detailShell() {
    return `
      <div class="drawer-backdrop" id="materialDetailBackdrop" hidden></div>
      <aside class="drawer" id="materialDetailDrawer" aria-label="Detalle materiales y suministros" aria-hidden="true" hidden>
        <div class="drawer-head">
          <div><h3 data-material-detail-title>Detalle</h3><p data-material-detail-subtitle>Consulta lateral del registro seleccionado.</p></div>
          <button class="icon-btn" type="button" data-close-material-detail aria-label="Cerrar detalle"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${icons.inactive}</svg></button>
        </div>
        <div class="drawer-body" data-material-detail-body></div>
      </aside>
    `;
  }

  function init(view = "dashboard") {
    SIALCore.initShell({ area: "gestion", module: "materiales", view });
    const root = qs("[data-material-root]");
    if (!root) return;
    root.innerHTML = `${renderView(view)}<div class="notice notice-success material-runtime-alert" data-material-runtime-alert hidden><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span data-material-runtime-message></span></div>${detailShell()}`;
    initFilters(view);
    SIALCore.initTableExport();
    SIALCore.initStateActionConfirm();
    if (["materiales", "recetas", "proveedoresMaster", "reglas", "pedidos"].includes(view)) {
      const newTitle = { pedidos: "Nuevo pedido adicional", recetas: "Nueva receta", proveedoresMaster: "Nuevo proveedor", reglas: "Nueva regla" }[view];
      SIALCore.initEmbeddedForm({ panel: "#materialInlineForm", openButton: "[data-open-inline-form]", cancelButton: "[data-cancel-inline-form]", title: "[data-inline-form-title]", ...(newTitle ? { newTitle } : {}) });
    }
    initActions();
    initSearchSelects();
    initHu826Form();
  }

  return { init };
})();
