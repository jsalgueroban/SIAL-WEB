import React,{useEffect,useRef} from 'react';
import {createPortal} from 'react-dom';
import {CloseIcon,IconButton,KeyValueGrid} from 'banasan-ui-conmat';

export function ConmatFloatingView({id,title,subtitle,onClose,data=[],children}){
 const surface=useRef(null),close=useRef(onClose);close.current=onClose;
 useEffect(()=>{
  const shell=document.querySelector('.app-shell');const wasInert=shell?.inert;const overflow=document.body.style.overflow;const previous=document.activeElement;
  if(shell)shell.inert=true;document.body.style.overflow='hidden';
  const focusable=()=>[...surface.current.querySelectorAll('button:not(:disabled),input:not(:disabled),[tabindex="0"]')].filter(el=>el.getClientRects().length);
  focusable()[0]?.focus();
  function keyboard(event){
   if(event.defaultPrevented)return;
   const popup=surface.current.querySelector('[aria-haspopup][aria-expanded="true"]');
   if(event.key==='Escape'&&!popup){event.preventDefault();close.current();}
   if(event.key==='Tab'&&!popup){const controls=focusable(),first=controls[0],last=controls.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}}
  }
  document.addEventListener('keydown',keyboard);
  return()=>{document.removeEventListener('keydown',keyboard);if(shell)shell.inert=wasInert;document.body.style.overflow=overflow;if(previous?.isConnected&&!previous.disabled)previous.focus();};
 },[]);
 return createPortal(<div className="conmat-floating-backdrop" onClick={event=>{if(event.target===event.currentTarget)onClose();}}><section id={id} ref={surface} className="conmat-floating-view" role="dialog" aria-modal="true" aria-labelledby="conmat-floating-title" aria-describedby="conmat-floating-subtitle"><header className="conmat-floating-heading"><div><h2 id="conmat-floating-title">{title}</h2><p id="conmat-floating-subtitle">{subtitle}</p></div><IconButton variant="ghost" aria-label="Cerrar ventana" onClick={onClose}><CloseIcon size={20}/></IconButton></header><div className="conmat-floating-body">{data.length>0&&<div className="conmat-floating-facts"><KeyValueGrid columns={2} items={data.map(field=>({label:field.label,value:field.children}))}/></div>}{children}</div></section></div>,document.body);
}
