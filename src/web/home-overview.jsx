import React, {useState} from 'react';
import {HomeCalendar,bogotaToday} from './home-calendar.jsx';
import {Card,Button,ChevronDownIcon,ChevronRightIcon,SialIcon} from '@banasandev/banasan-ui';
import {HomeLogo3D} from './home-logo-3d.jsx';
import './home-overview.css';
import roleAccesses from './home-role-accesses.json';

// Snapshot visible en /dashboard, 2026-11-03. Sin autenticación ni permisos simulados.
const company='C.I. BANASAN S.A.S.';
export function HomeOverview({groups=roleAccesses}){
 const [paused,setPaused]=useState(false);
 const today=bogotaToday();
 const dateLabel=new Intl.DateTimeFormat('es-CO',{weekday:'long',day:'numeric',month:'long',timeZone:'UTC'}).format(new Date(`${today}T12:00:00Z`));
 return <div className="home-baseline home-evolved">
 <div className="page-header"><div><h1 className="page-title">Inicio</h1></div></div>
 <Card className={`home-hero ${paused?'home-motion-paused':''}`}><div className="home-welcome"><div className="home-date"><span>{dateLabel}</span></div><h2>Hola, SOPORTE.<br/>Tu operación comienza aquí.</h2><p><strong>{company}</strong><br/>Consulta tu semana y entra al área que necesitas.</p><Button onClick={()=>document.getElementById('home-quick-title')?.focus()}>Ir a mis accesos <ChevronDownIcon size={18}/></Button></div><div className="home-art" aria-hidden="true"><span className="home-wave home-wave-one"/><span className="home-wave home-wave-two"/><span className="home-wave home-wave-three"/><HomeLogo3D paused={paused}/></div><Button variant="ghost" type="button" className="home-motion-toggle" aria-label={paused?'Activar animación de bienvenida':'Pausar animación de bienvenida'} aria-pressed={paused} onClick={()=>setPaused(!paused)}>{paused?'Activar movimiento':'Pausar movimiento'}</Button></Card>
 <div className="home-main-grid"><Card className="home-panel home-access-panel" aria-labelledby="home-quick-title"><header><div><h2 id="home-quick-title" tabIndex={-1}>Mis accesos</h2><p>Herramientas disponibles para tu trabajo.</p></div></header><div className="home-role-groups">{groups.map(group=><section className="home-role-group" key={group.name}><h3><SialIcon name={group.icon} size={20}/>{group.name}</h3><div>{group.items.map(([label,href])=><a href={href} key={href}><span>{label}</span><ChevronRightIcon size={16}/></a>)}</div></section>)}</div></Card><HomeCalendar today={today}/></div>
 </div>;
}