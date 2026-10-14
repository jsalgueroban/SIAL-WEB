import React, { useEffect, useRef, useState } from "react";
import { Button, Chip, Drawer, IconButton, ViewIcon } from "@banasandev/banasan-ui";

const source = "@banasandev/banasan-ui";
const seed = [
  { id: "KD-101", name: "Samsung Galaxy A54", localId: "sial-android-a54-7c42", platform: "Android", system: "Android 14 · SIAL 2.6", bootstrap: "12/10/2026 08:25", user: "operador.sial", email: "operador@sial.example", active: true, created: "12/10/2026 08:25", updated: "12/10/2026 08:25" },
  { id: "KD-102", name: "Apple iPad 10", localId: "sial-ios-ipad-3d91", platform: "iPadOS", system: "iPadOS 18 · SIAL 2.6", bootstrap: "11/10/2026 15:12", user: "operador.sial", email: "operador@sial.example", active: true, created: "11/10/2026 15:12", updated: "11/10/2026 15:12" },
  { id: "KD-087", name: "Motorola G54", localId: "sial-android-g54-6a83", platform: "Android", system: "Android 13 · SIAL 2.5", bootstrap: "03/09/2026 09:40", user: "operador.sial", email: "operador@sial.example", active: false, created: "03/09/2026 09:40", updated: "02/10/2026 10:17" }
];

function DeviceRow({ device, onView, onToggle }) {
  return <div className="known-device-row">
    <div className="known-device-main">
      <strong>{device.name}</strong>
      <small className="known-device-id">{device.localId}</small>
      <small>{device.system}</small>
      <small>Vinculado: {device.bootstrap}</small>
    </div>
    <div className="known-device-actions">
      <Chip preset={device.active ? "active" : "inactive"} data-sial-component="Chip" data-sial-source={source}>{device.active ? "Autorizado" : "Revocado"}</Chip>
      <IconButton variant="ghost" aria-label={`Ver ${device.name}`} title="Ver detalle" onClick={() => onView(device.id)} data-sial-component="IconButton" data-sial-source={source}><ViewIcon /></IconButton>
      <Button variant="outlined" onClick={() => onToggle(device.id)} data-sial-component="Button" data-sial-source={source}>{device.active ? "Revocar" : "Autorizar"}</Button>
    </div>
  </div>;
}

function DevicePanel({ title, devices, empty, onView, onToggle }) {
  return <section className="known-device-panel" aria-label={title}>
    <div className="known-device-panel-head"><h3>{title}</h3><span className="known-device-panel-count">{devices.length}</span></div>
    <div className="known-device-list">{devices.length ? devices.map((device) => <DeviceRow key={device.id} device={device} onView={onView} onToggle={onToggle} />) : <div className="known-device-empty">{empty}</div>}</div>
  </section>;
}

function ToggleConfirmation({ device, onCancel, onConfirm }) {
  const cancelRef = useRef(null);
  const confirmRef = useRef(null);
  useEffect(() => {
    const previousFocus = document.activeElement;
    cancelRef.current?.focus();
    const onKeydown = (event) => {
      if (event.key === "Escape") onCancel();
      if (event.key !== "Tab") return;
      if (event.shiftKey && document.activeElement === cancelRef.current) { event.preventDefault(); confirmRef.current?.focus(); }
      if (!event.shiftKey && document.activeElement === confirmRef.current) { event.preventDefault(); cancelRef.current?.focus(); }
    };
    document.addEventListener("keydown", onKeydown);
    return () => { document.removeEventListener("keydown", onKeydown); previousFocus?.focus?.(); };
  }, [onCancel]);
  const verb = device.active ? "Revocar" : "Autorizar";
  return <div className="known-device-confirm-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
    <section className="known-device-confirm" role="alertdialog" aria-modal="true" aria-labelledby="known-device-confirm-title" aria-describedby="known-device-confirm-description">
      <h2 id="known-device-confirm-title">{verb} {device.name}</h2>
      <p id="known-device-confirm-description">{device.active ? "En esta propuesta, el equipo pasará a revocado. En el producto real dejaría de operar como dispositivo conocido para el acceso offline." : "En esta propuesta, el equipo volverá a autorizado. El producto real tendría que confirmar el cambio."}</p>
      <div className="known-device-confirm-actions"><Button ref={cancelRef} variant="outlined" onClick={onCancel}>Cancelar</Button><Button ref={confirmRef} variant="filled" onClick={onConfirm}>{verb} dispositivo</Button></div>
    </section>
  </div>;
}

export function KnownDevices() {
  const [devices, setDevices] = useState(seed);
  const [detailId, setDetailId] = useState(null);
  const [pendingId, setPendingId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const active = devices.filter((device) => device.active);
  const revoked = devices.filter((device) => !device.active);
  const detail = devices.find((device) => device.id === detailId);
  const pending = devices.find((device) => device.id === pendingId);
  function confirm() {
    if (!pending) return;
    const action = pending.active ? "revocado" : "autorizado";
    setDevices((current) => current.map((device) => device.id === pending.id ? { ...device, active: !device.active, updated: new Date().toLocaleString("es-CO") } : device));
    setFeedback(`${pending.name}: estado ${action} solo en esta vista de ejemplo.`);
    setPendingId(null);
  }
  return <div className="known-devices">
    <div><p className="page-eyebrow">Seguridad / Dispositivos</p><div className="page-header"><div><h1 className="page-title">Mis dispositivos</h1><p className="page-subtitle">Consulta los equipos asociados a tu usuario y administra cuáles figuran como conocidos para el acceso sin conexión.</p></div></div></div>
    <article className="card known-device-card">
      <div className="card-header"><div><h2 className="card-title">Equipos asociados</h2></div><div className="card-actions"><Chip tone="info" variant="filled" data-sial-component="Chip" data-sial-source={source}>{devices.length} registros</Chip></div></div>
      <div className="known-devices-body">
        <DevicePanel title="Dispositivos autorizados" devices={active} empty="No hay dispositivos autorizados." onView={setDetailId} onToggle={setPendingId} />
        <DevicePanel title="Dispositivos revocados" devices={revoked} empty="No hay dispositivos revocados." onView={setDetailId} onToggle={setPendingId} />
      </div>
      {feedback && <p className="known-device-feedback" role="status">{feedback}</p>}
    </article>
    {detail && <Drawer show onClose={() => setDetailId(null)} title="Detalle de dispositivo" subtitle="Información registrada para el acceso offline." ariaLabel={`Detalle de ${detail.name}`} data={[
      { label: "Usuario", children: detail.user }, { label: "Correo", children: detail.email }, { label: "Dispositivo", children: detail.name }, { label: "ID local", children: detail.localId }, { label: "Plataforma", children: detail.platform }, { label: "Sistema y app", children: detail.system }, { label: "Bootstrap inicial", children: detail.bootstrap }, { label: "Estado", children: detail.active ? "Autorizado" : "Revocado" }, { label: "Registrado", children: detail.created }, { label: "Actualizado", children: detail.updated }
    ]} data-sial-component="Drawer" data-sial-source={source} />}
    {pending && <ToggleConfirmation device={pending} onCancel={() => setPendingId(null)} onConfirm={confirm} />}
  </div>;
}
