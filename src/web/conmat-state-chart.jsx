import React, {useEffect, useRef} from 'react';
import {init, use} from 'echarts/core';
import {BarChart} from 'echarts/charts';
import {AriaComponent, GridComponent, TooltipComponent} from 'echarts/components';
import {SVGRenderer} from 'echarts/renderers';

use([BarChart, GridComponent, TooltipComponent, AriaComponent, SVGRenderer]);

/** Proposal-local ECharts composition; category labels support keyboard filtering. */
export function ConmatStateChart({counts, onSelect}) {
 const host = useRef(null);
 const select = useRef(onSelect);
 select.current = onSelect;
 useEffect(() => {
  const chart = init(host.current, null, {renderer:'svg'});
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const css = () => getComputedStyle(document.documentElement);
  const token = (name, fallback) => css().getPropertyValue(name).trim() || fallback;
  function render() {
   const dark = document.documentElement.dataset.theme === 'dark';
   const text = token('--color-text', dark ? '#e6edf7' : '#243047');
   const grid = token('--color-border-subtle', dark ? '#304057' : '#e6ebf2');
   const colors = [token('--color-warning-500','#c18a08'),token('--color-primary-500','#1478ca'),'#555bc6',token('--color-success-500','#2b8a57')];
   chart.setOption({
    animation:!motion.matches, animationDuration:350, animationDurationUpdate:250,
    textStyle:{fontFamily:css().fontFamily,color:text},
    aria:{enabled:true,label:{description:`Rutas por estado. ${counts.map(item=>`${item.label}: ${item.rutas}`).join('. ')}. Activa una etiqueta de estado para filtrar.`}},
    grid:{left:8,right:35,top:14,bottom:24,containLabel:true},
    tooltip:{trigger:'item',renderMode:'richText',formatter:params=>`${params.name}: ${params.value} rutas`},
    xAxis:{type:'value',min:0,minInterval:1,max:Math.max(1,...counts.map(item=>item.rutas)),axisLabel:{color:text},splitLine:{lineStyle:{color:grid,type:'dashed'}},axisLine:{show:false},axisTick:{show:false}},
    yAxis:{type:'category',inverse:true,data:counts.map(item=>item.label),triggerEvent:true,axisLabel:{color:text,fontSize:12,margin:12,width:host.current.clientWidth<420?110:165,overflow:'break'},axisTick:{show:false},axisLine:{show:false}},
    series:[{id:'conmat-route-states',name:'Rutas',type:'bar',barMaxWidth:20,cursor:'pointer',label:{show:true,position:'right',color:text,fontWeight:600,formatter:'{c}'},itemStyle:{borderRadius:[0,4,4,0]},emphasis:{focus:'self'},data:counts.map((item,i)=>({name:item.label,value:item.rutas,itemStyle:{color:colors[i]}}))}]
   });
  }
  chart.on('click',event=>{
   const label=event.componentType==='yAxis'?event.value:event.name;
   if(counts.some(item=>item.label===label)) select.current(label);
  });
  const observer=new ResizeObserver(()=>chart.resize());
  observer.observe(host.current);
  const theme=new MutationObserver(render);
  theme.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  motion.addEventListener('change',render);
  function accessibleLabels() {
   host.current?.querySelectorAll('svg text').forEach(node=>{
    const item=counts.find(item=>item.label===node.textContent);
    if(!item)return;
    node.setAttribute('tabindex','0');
    node.setAttribute('role','button');
    node.setAttribute('aria-label',`Consultar ${item.label.toLowerCase()}: ${item.rutas} rutas`);
   });
  }
  function activateLabel(event) {
   if(event.key!=='Enter'&&event.key!==' ')return;
   const item=counts.find(item=>item.label===event.target.textContent);
   if(!item||event.target.getAttribute('role')!=='button')return;
   event.preventDefault();select.current(item.label);
  }
  const labels=new MutationObserver(accessibleLabels);
  labels.observe(host.current,{childList:true,subtree:true,characterData:true});
  host.current.addEventListener('keydown',activateLabel);
  const container=host.current;
  render();accessibleLabels();
  return ()=>{observer.disconnect();theme.disconnect();labels.disconnect();container.removeEventListener('keydown',activateLabel);motion.removeEventListener('change',render);chart.dispose();};
 },[counts.map(item=>`${item.label}:${item.rutas}`).join('|')]);
 return <div className="conmat-echarts-section">
  <div ref={host} className="conmat-echarts" data-chart-engine="echarts"/>

 </div>;
}
