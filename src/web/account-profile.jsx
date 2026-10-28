import React, { useEffect, useRef, useState } from "react";
import { Button, TextInput, UsersIcon, CompanyIcon, LockIcon } from "@banasandev/banasan-ui";

const fields = [["Usuario", "usuario.demo"], ["Identificación", "1000000000"], ["Teléfono", "300 000 0000"], ["Correo principal", "usuario.demo@banasan.com.co"], ["Correo alternativo", "alternativo@banasan.com.co"]];
function Details() {
  const renderFields = (items) => items.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>);
  return <section className="account-section account-reading-section" aria-labelledby="personal-title">
    <div className="account-section-heading"><UsersIcon aria-hidden="true"/><h2 id="personal-title">Información personal</h2></div>
    <dl className="account-data account-data-three">{renderFields(fields.slice(0, 3))}</dl>
    <dl className="account-data account-contact">{renderFields(fields.slice(3))}</dl>
  </section>;
}
function Context() {
  return <section className="account-section account-reading-section" aria-labelledby="company-title">
    <div className="account-section-heading"><CompanyIcon aria-hidden="true"/><h2 id="company-title">Compañía y asignaciones</h2></div>
    <dl className="account-data account-data-three">
      <div><dt>Compañía activa</dt><dd>CI BANASAN S.A.S.</dd></div>
      <div><dt>NIT</dt><dd>900000000</dd></div>
      <div><dt>Rol en esta compañía</dt><dd>Super Administrador</dd></div>
    </dl>

  </section>;
}
function Security() {
  const [open,setOpen]=useState(false), [password,setPassword]=useState(""), [confirm,setConfirm]=useState(""), [attempt,setAttempt]=useState(false), [message,setMessage]=useState("");
  const host=useRef(null), trigger=useRef(null);
  const valid=password.length>=8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password);
  useEffect(()=>{ if(open) host.current?.querySelector("input")?.focus(); },[open]);
  function close(){setOpen(false);setPassword("");setConfirm("");setAttempt(false);requestAnimationFrame(()=>trigger.current?.querySelector("button")?.focus());}
  function submit(e){e.preventDefault();setAttempt(true);setMessage("");if(!valid || confirm!==password){host.current?.querySelector(!valid ? "#profile-password" : "#profile-confirm")?.focus();return;}close();setMessage("Validación completada en la propuesta. Tu contraseña y tus sesiones no se modificaron.");}
  return <section className="account-section account-security" aria-labelledby="security-title"><div className="account-security-summary"><div><div className="account-section-heading"><LockIcon aria-hidden="true"/><h2 id="security-title">Contraseña y acceso</h2></div><p>Administra la contraseña con la que ingresas a SIAL.</p></div>{!open && <span ref={trigger}><Button variant="outlined" onClick={()=>{setMessage("");setOpen(true);}}>Cambiar contraseña</Button></span>}</div>{message && <p role="status" className="account-feedback">{message}</p>}{open && <form ref={host} className="inline-form-panel inline-form-compact account-password" onSubmit={submit}><h3>Cambiar contraseña</h3><p>Al actualizarla, tus sesiones activas se cerrarán y tendrás que volver a ingresar.</p><div className="account-password-fields"><TextInput id="profile-password" label="Nueva contraseña" type="password" required value={password} onChange={setPassword} helperText="Mínimo 8 caracteres, una mayúscula, una minúscula y un número." validate={{status:attempt&&!valid,message:"La contraseña no cumple los requisitos."}}/><TextInput id="profile-confirm" label="Confirmar nueva contraseña" type="password" required value={confirm} onChange={setConfirm} validate={{status:attempt&&confirm!==password,message:"Las contraseñas no coinciden."}}/></div><div className="form-actions"><Button variant="outlined" type="button" onClick={close}>Cancelar</Button><Button type="submit">Actualizar contraseña</Button></div></form>}</section>;
}
function Farms() {
  const [expanded, setExpanded] = useState(false);
  const many = new URLSearchParams(location.search).get("fincas") === "muchas";
  const names = Array.from({length: 30}, (_, i) => `Finca de demostración ${String(i + 1).padStart(2, "0")}`);
  return <section className="account-section account-farms" aria-labelledby="farms-title">
    <div className="account-farms-heading"><h2 id="farms-title">Fincas asignadas</h2>{many && <span>30 fincas</span>}</div>
    {many ? <><ul className="account-farms-list">{names.slice(0, expanded ? names.length : 8).map(name => <li key={name}>{name}</li>)}</ul><Button variant="ghost" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? "Ver menos" : "Ver todas las fincas (30)"}</Button></> : <p>No tienes fincas asignadas en la compañía activa.</p>}
  </section>;
}
export function AccountProfile() {
  return <div className="account-profile">
    <div className="page-header"><div><h1 className="page-title">Mi perfil</h1><p className="page-subtitle">Consulta tu información, tus asignaciones y la seguridad de tu cuenta.</p></div></div>
    <article className="card account-surface">
      <header className="account-identity"><span className="account-avatar" aria-hidden="true">UD</span><div><h2>Usuario de demostración</h2><p>Cuenta personal</p></div></header>
      <div className="account-overview"><Details/><Context/></div>
      <Farms/>
    </article>
    <div className="card account-security-card"><Security/></div>
    <p className="account-demo">Propuesta visual · Datos de demostración</p>
  </div>;
}
