import React,{useEffect,useState} from 'react';
import { downloadCalendar } from './calendar-pdf.js';
import {Card,Button,RibbonCode} from '@banasandev/banasan-ui';
const tapeColors={BL:['#fff','#183149'],AZ:['#0075c9','#fff'],RO:['#dc2626','#fff'],CA:['#784b31','#fff'],NE:['#24272c','#fff'],NA:['#f07816','#132a42'],VE:['#258033','#fff'],AM:['#f3d313','#132a42']};
const parse=value=>new Date(`${value.slice(0,10)}T12:00:00Z`);
const iso=date=>date.toISOString().slice(0,10);
const add=(value,n)=>{const date=parse(value);date.setUTCDate(date.getUTCDate()+n);return date;};
export function bogotaToday(){return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Bogota',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
// Product integration injects the server-authorized WeekDto collection through loadWeeks.
// Static proposal uses an explicitly captured snapshot, never browser credentials.
async function snapshotWeeks(year,annual){const root=document.body.dataset.proposalRoot || '.';const response=await fetch(`${root}/shared/cases/${annual?'planning':'home'}-weeks-${year}.json`);if(response.status===404)return [];if(!response.ok)throw new Error('calendar');return (await response.json()).weeks;}
function CalendarView({loadWeeks=snapshotWeeks,today=bogotaToday(),annual=false}){
 const year=parse(today).getUTCFullYear();
 const [weeks,setWeeks]=useState(null),[failed,setFailed]=useState(false),[retry,setRetry]=useState(0);
 useEffect(()=>{let active=true;setFailed(false);setWeeks(null);loadWeeks(year,annual).then(data=>{if(active)setWeeks(data);}).catch(()=>{if(active)setFailed(true);});return()=>{active=false;};},[loadWeeks,retry,year,annual]);
 const content=failed?<div className="home-calendar-empty"><p>No pudimos cargar las semanas.</p><Button variant="outlined" onClick={()=>setRetry(retry+1)}>Reintentar</Button></div>:weeks===null?<p className="home-calendar-empty" role="status">Cargando semanas…</p>:null;
 if(annual && (content || !weeks.length))return content || <p>No hay semanas generadas para {year}.</p>;
 if(annual)return <AnnualCalendar {...{weeks,today,year}} />;
 return <CalendarMonth {...{weeks,today,year,content}} month={parse(today).getUTCMonth()} />;
}
export function HomeCalendar(props){return <CalendarView {...props} />;}
export function PlanningCalendar(){return <CalendarView annual />;}
function AnnualCalendar({weeks,today,year,highlightTodayInExport=false}){

 const [exporting,setExporting]=useState(false);
 const [exportError,setExportError]=useState(false);
 async function exportPdf(event){
   const card=event.currentTarget.closest('.planning-year');
   setExporting(true);
   setExportError(false);
   try { await downloadCalendar(card,year); }
   catch { setExportError(true); }
   finally { setExporting(false); }
 }
 const ribbons=Object.keys(tapeColors).map(code=>weeks.find(week=>week.tapeCode===code)).filter(Boolean);
 return <Card className={highlightTodayInExport ? "planning-year" : "planning-year clean-export"}>
   <header className="planning-year-heading">
     <img className="calendar-print-brand" src="../shared/brand/banasan-calendario.png" alt="Banasan" />
     <Button className="planning-export" variant="outlined" disabled={exporting} onClick={exportPdf}>{exporting?'Generando PDF…':'Exportar a PDF'}</Button>
     {exportError && <span role="alert">No se pudo generar el PDF. Intenta de nuevo.</span>}
     <h2 className="planning-calendar-title"><span className="calendar-screen-label">Calendario </span><span className="calendar-print-label">Calendario bananero</span><span className="calendar-year-value">{year}</span></h2>
     <p>{weeks.length} semanas productivas</p>
   </header>
   <div className="planning-month-grid">
     {Array.from({length:12},(_,month)=><CalendarMonth key={month} {...{weeks,today,year,month}} annual />)}
   </div>
   <aside className="planning-key" aria-label="Identificación de cintas">
     <ul>{ribbons.map(week=><li key={week.tapeCode} data-code={week.tapeCode}><svg aria-hidden="true" className="planning-ribbon-swatch" width="10" height="28" viewBox="0 0 10 28"><rect x="1" y="1" width="8" height="26" rx="2" fill={tapeColors[week.tapeCode][0]} stroke={week.tapeCode==='BL'?'#586b80':tapeColors[week.tapeCode][0]} strokeWidth="1.5"/></svg><strong>{week.tapeCode}</strong><span>{week.tapeColorEs}</span></li>)}</ul>
   </aside>
   <div className="calendar-print-signature"><img src="../shared/brand/isotipo-sial.svg" alt="" />SIAL</div>
 </Card>;
}
function CalendarMonth({weeks,today,year,month,content,annual=false}){
 const date=new Date(Date.UTC(year,month,1));
 const visible=(weeks||[]).filter(w=>annual ? w.month===month+1 : parse(w.startDate)<=new Date(Date.UTC(year,month+1,0,23))&&parse(w.endDate)>=new Date(Date.UTC(year,month,1))).sort((a,b)=>a.startDate.localeCompare(b.startDate));
 const current=(annual || month===parse(today).getUTCMonth()) && visible.find(w=>w.startDate<=today&&w.endDate>=today);
 const names=['D','L','M','M','J','V','S'],full=['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
 const first=visible.length?parse(visible[0].startDate).getUTCDay():1;
 const label=new Intl.DateTimeFormat('es-CO',{month:'long',year:'numeric',timeZone:'UTC'}).format(date);
 const Container=annual?'section':Card;
 return <Container id={annual ? `cal-mes-${month+1}` : undefined} tabIndex={annual?-1:undefined} data-current-month={annual && current ? 'true':undefined} className={annual?'home-calendar planning-month':'home-calendar'}><header>{!annual&&<span>Calendario bananero · {year}</span>}<h2>{new Intl.DateTimeFormat('es-CO',{month:'long',timeZone:'UTC'}).format(date)}</h2></header>{content || (!visible.length?<p className="home-calendar-empty">No hay semanas registradas para este mes.</p>:<><table aria-label={`Calendario bananero de ${label}`}><thead><tr><th scope="col">Sem.</th>{Array.from({length:7},(_,i)=><th key={i} scope="col" aria-label={full[(first+i)%7]}>{names[(first+i)%7]}</th>)}</tr></thead><tbody>{visible.map(w=><tr key={w.weekNumber} className={w===current?'calendar-current-week':''}><th scope="row" className="calendar-ribbon-cell" style={{'--ribbon-color':(tapeColors[w.tapeCode]||tapeColors.BL)[0],'--ribbon-ink':(tapeColors[w.tapeCode]||tapeColors.BL)[1]}} aria-label={`Semana ${w.weekNumber}, cinta ${w.tapeColorEs}`}><span className="calendar-week-number">{w.weekNumber}</span></th>{Array.from({length:7},(_,i)=>{const day=add(w.startDate,i),value=iso(day),outside=day.getUTCMonth()!==month;return <td key={i} className={`${outside?'calendar-outside':''} ${day.getUTCDay()===0?'calendar-sunday':''}`}><span aria-current={value===today?'date':undefined} title={value}>{day.getUTCDate()}</span></td>;})}</tr>)}</tbody></table>{current&&!annual&&<footer><div><strong>Semana actual · {current.weekNumber}</strong><span>{parse(current.startDate).toLocaleDateString('es-CO',{day:'numeric',month:'short',timeZone:'UTC'})} — {parse(current.endDate).toLocaleDateString('es-CO',{day:'numeric',month:'short',timeZone:'UTC'})}</span></div><RibbonCode code={current.tapeCode}>{current.tapeColorEs}</RibbonCode></footer>}</>)}</Container>;
}
