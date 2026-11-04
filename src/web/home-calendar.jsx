import React,{useEffect,useState} from 'react';
import {Card,Button,RibbonCode} from '@banasandev/banasan-ui';
const tapeColors={BL:['#fff','#183149'],AZ:['#0075c9','#fff'],RO:['#dc2626','#fff'],CA:['#784b31','#fff'],NE:['#24272c','#fff'],NA:['#f07816','#132a42'],VE:['#258033','#fff'],AM:['#f3d313','#132a42']};
const parse=value=>new Date(`${value.slice(0,10)}T12:00:00Z`);
const iso=date=>date.toISOString().slice(0,10);
const add=(value,n)=>{const date=parse(value);date.setUTCDate(date.getUTCDate()+n);return date;};
export function bogotaToday(){return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Bogota',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
// Product integration injects the server-authorized WeekDto collection through loadWeeks.
// Static proposal uses an explicitly captured snapshot, never browser credentials.
async function snapshotWeeks(){const response=await fetch('shared/cases/home-weeks-2026.json');if(!response.ok)throw new Error('calendar');return (await response.json()).weeks;}
export function HomeCalendar({loadWeeks=snapshotWeeks,today=bogotaToday()}){
 const [weeks,setWeeks]=useState(null),[failed,setFailed]=useState(false),[retry,setRetry]=useState(0);
 useEffect(()=>{let active=true;setFailed(false);setWeeks(null);loadWeeks().then(data=>{if(active)setWeeks(data);}).catch(()=>{if(active)setFailed(true);});return()=>{active=false;};},[loadWeeks,retry]);
 const date=parse(today),year=date.getUTCFullYear(),month=date.getUTCMonth();
 const visible=(weeks||[]).filter(w=>parse(w.startDate)<=new Date(Date.UTC(year,month+1,0,23))&&parse(w.endDate)>=new Date(Date.UTC(year,month,1))).sort((a,b)=>a.startDate.localeCompare(b.startDate));
 const current=visible.find(w=>w.startDate<=today&&w.endDate>=today);
 const names=['D','L','M','M','J','V','S'],full=['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
 const first=visible.length?parse(visible[0].startDate).getUTCDay():1;
 const label=new Intl.DateTimeFormat('es-CO',{month:'long',year:'numeric',timeZone:'UTC'}).format(date);
 return <Card className="home-calendar"><header><span>Calendario bananero · {year}</span><h2>{new Intl.DateTimeFormat('es-CO',{month:'long',timeZone:'UTC'}).format(date)}</h2></header>{failed?<div className="home-calendar-empty"><p>No pudimos cargar las semanas.</p><Button variant="outlined" onClick={()=>setRetry(retry+1)}>Reintentar</Button></div>:weeks===null?<p className="home-calendar-empty" role="status">Cargando semanas…</p>:!visible.length?<p className="home-calendar-empty">No hay semanas registradas para este mes.</p>:<><table aria-label={`Calendario bananero de ${label}`}><thead><tr><th scope="col">Sem.</th>{Array.from({length:7},(_,i)=><th key={i} scope="col" aria-label={full[(first+i)%7]}>{names[(first+i)%7]}</th>)}</tr></thead><tbody>{visible.map(w=><tr key={w.weekNumber} className={w===current?'calendar-current-week':''}><th scope="row" className="calendar-ribbon-cell" style={{'--ribbon-color':(tapeColors[w.tapeCode]||tapeColors.BL)[0],'--ribbon-ink':(tapeColors[w.tapeCode]||tapeColors.BL)[1]}} aria-label={`Semana ${w.weekNumber}, cinta ${w.tapeColorEs}`}><span className="calendar-week-number">{w.weekNumber}</span></th>{Array.from({length:7},(_,i)=>{const day=add(w.startDate,i),value=iso(day),outside=day.getUTCMonth()!==month;return <td key={i} className={`${outside?'calendar-outside':''} ${day.getUTCDay()===0?'calendar-sunday':''}`}><span aria-current={value===today?'date':undefined} title={value}>{day.getUTCDate()}</span></td>;})}</tr>)}</tbody></table>{current&&<footer><div><strong>Semana actual · {current.weekNumber}</strong><span>{parse(current.startDate).toLocaleDateString('es-CO',{day:'numeric',month:'short',timeZone:'UTC'})} — {parse(current.endDate).toLocaleDateString('es-CO',{day:'numeric',month:'short',timeZone:'UTC'})}</span></div><RibbonCode code={current.tapeCode}>{current.tapeColorEs}</RibbonCode></footer>}</>}</Card>;
}
