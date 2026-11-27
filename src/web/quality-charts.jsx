import React, {memo, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Button, Card} from '@banasandev/banasan-ui';
import {SialChart} from 'banasan-ui-conmat/charts';
import {getInstanceByDom} from 'echarts/core';
import {results, resultColors, defectNames} from './quality-inspections-data.js';
import './quality-charts.css';

const fmt = value => new Intl.NumberFormat('es-CO', {maximumFractionDigits:1}).format(value);
const stableSettings = {motion:false, labels:false, smooth:false};
const weeks = ['46','47','48'];
const duration = {enter:820, update:460, emphasis:180};
// The library rebuilds its default options on render. Keep unrelated hover and
// counter updates outside that render boundary so they cannot replace our options.
const StableSialChart = memo(SialChart);

function chartOption(config,chart) {
  const option=config.buildOption(environment(),chart.getWidth(),config.reduced);
  option.tooltip={...option.tooltip,renderMode:'html',appendTo:()=>document.body,confine:false,transitionDuration:0,hideDelay:0,className:'qc-tooltip',extraCssText:'z-index:10000;pointer-events:none;white-space:pre-line;',position:(point,params,element,rect,size)=>{
    const bounds=chart.getDom().getBoundingClientRect();
    return [Math.max(8-bounds.left,Math.min(point[0]+18,window.innerWidth-bounds.left-size.contentSize[0]-8)),Math.max(8-bounds.top,Math.min(point[1]+18,window.innerHeight-bounds.top-size.contentSize[1]-8))];
  }};
  return option;
}

function useReducedMotion() {
  const [reduced,setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener('change',update);
    return () => media.removeEventListener('change',update);
  },[]);
  return reduced;
}

function AnimatedNumber({value,reduced,replay}) {
  const [display,setDisplay] = useState(value);
  const last = useRef(value);
  const previousReplay = useRef(replay);
  useEffect(() => {
    if(reduced) {last.current=value;setDisplay(value);return;}
    const startValue = previousReplay.current===replay ? last.current : 0;
    previousReplay.current=replay;
    const start=performance.now();
    let frame;
    const tick = now => {
      const progress=Math.min(1,(now-start)/650);
      const next=startValue+(value-startValue)*(1-Math.pow(1-progress,3));
      last.current=next;setDisplay(next);
      if(progress<1)frame=requestAnimationFrame(tick);
    };
    frame=requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  },[value,reduced,replay]);
  return <span aria-label={fmt(value)}><span aria-hidden="true">{Number.isInteger(value)?Math.round(display):fmt(display)}</span></span>;
}

function environment() {
  const css=getComputedStyle(document.documentElement);
  const token=(key,fallback)=>css.getPropertyValue(key).trim()||fallback;
  const dark=document.documentElement.dataset.theme==='dark';
  return {dark,text:token('--color-text','#1a1f36'),muted:token('--color-text-2','#687386'),border:token('--color-border-subtle','#e7eaf0'),surface:token('--color-surface','#fff'),font:token('--font-primary','Poppins, sans-serif'),track:dark?'#26374a':'#f0f4f8'};
}

/** Local feature adapter. SialChart owns mounting, SVG renderer, selection and disposal.
 * Only documented ECharts instance methods customize the mounted chart; no package writes.
 */
function QualityCanvas({data,kind,label,buildOption,replay,reduced,onSelect,onHover,onReady,chartId}) {
  const host=useRef(null), instance=useRef(null), latest=useRef(null);
  const [ready,setReady]=useState(false);
  const stableData=useMemo(()=>data,[JSON.stringify(data)]);
  latest.current={buildOption,reduced,onHover,onReady,onSelect};
  const select=useCallback(selection=>latest.current.onSelect?.(selection),[]);
  useEffect(()=>{
    let active=true, visible=false, discovered=false, frame=0, renderFrame=0;
    const paint=initial=>{
      const chart=instance.current;
      if(!active||!visible||!chart||chart.isDisposed())return;
      const config=latest.current;
      chart.dispatchAction({type:'hideTip'});
      chart.setOption(chartOption(config,chart),{notMerge:initial,replaceMerge:['series','xAxis','yAxis','grid','legend','graphic']});
      setReady(true);
      host.current.dataset.chartReady='true';
      config.onReady?.(chart);
    };
    const schedule=()=>{
      cancelAnimationFrame(renderFrame);
      renderFrame=requestAnimationFrame(()=>paint(false));
    };
    const hover=event=>latest.current.onHover?.(event.componentType==='series'?event.data?.categoryId:null);
    const leave=()=>{latest.current.onHover?.(null);const chart=instance.current;if(chart&&!chart.isDisposed())chart.dispatchAction({type:'hideTip'});};
    window.addEventListener('scroll',leave,true);
    const discover=()=>{
      if(!active)return;
      const element=host.current?.querySelector('.bui-echarts-preview');
      const chart=element&&getInstanceByDom(element);
      if(!chart){frame=requestAnimationFrame(discover);return;}
      discovered=true;instance.current=chart;
      chart.on('mouseover',hover);chart.on('globalout',leave);
      paint(true);
    };
    const intersection=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting)&&!visible){visible=true;if(discovered)paint(true);}
    },{threshold:.15});
    intersection.observe(host.current);
    const resize=new ResizeObserver(schedule);resize.observe(host.current);
    const theme=new MutationObserver(schedule);theme.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme','class','style']});
    frame=requestAnimationFrame(discover);
    return()=>{
      active=false;cancelAnimationFrame(frame);cancelAnimationFrame(renderFrame);
      intersection.disconnect();resize.disconnect();theme.disconnect();
      window.removeEventListener('scroll',leave,true);
      const chart=instance.current;
      if(chart&&!chart.isDisposed()){chart.off('mouseover',hover);chart.off('globalout',leave);}
      instance.current=null;
    };
  },[]);
  useEffect(()=>{
    let frame=requestAnimationFrame(()=>{
      const chart=instance.current;
      if(!chart||chart.isDisposed()||!ready)return;
      chart.dispatchAction({type:'hideTip'});
      chart.setOption(chartOption({buildOption,reduced},chart),{replaceMerge:['series','xAxis','yAxis','grid','legend','graphic']});
    });
    return()=>cancelAnimationFrame(frame);
  },[buildOption,reduced,ready]);
  const previousReplay=useRef(replay);
  useEffect(()=>{
    if(previousReplay.current===replay)return;
    previousReplay.current=replay;
    const chart=instance.current;
    if(chart&&!chart.isDisposed()&&ready){chart.clear();chart.setOption(chartOption({buildOption,reduced},chart),{notMerge:true});}
  },[replay]);
  return <div ref={host} className={`qc-canvas ${ready?'is-ready':''}`} data-quality-chart={chartId}>
    <StableSialChart data={stableData} kind={kind} label={label} height={244} settings={stableSettings} onSelect={select}/>
    <div className="qi-sr"><table><caption>{label}</caption><thead><tr><th scope="col">Categoría</th>{data.series.map(series=><th scope="col" key={series.id}>{series.label}</th>)}</tr></thead><tbody>{data.categories.map((category,i)=><tr key={category.id}><th scope="row">{category.label}</th>{data.series.map(series=><td key={series.id}>{series.values[i]??'Sin dato'}</td>)}</tr>)}</tbody></table></div>
  </div>;
}

function baseOption(theme,reduced) {
  return {animation:!reduced,animationDuration:reduced?0:duration.enter,animationDurationUpdate:reduced?0:duration.update,animationEasing:'cubicOut',animationEasingUpdate:'cubicInOut',textStyle:{fontFamily:theme.font,color:theme.text},legend:[],graphic:[],xAxis:[],yAxis:[],grid:[],tooltip:{trigger:'item',confine:true,renderMode:'richText',backgroundColor:theme.surface,borderColor:theme.border,borderWidth:1,padding:[12,15],textStyle:{fontFamily:theme.font,color:theme.text,fontSize:12}},aria:{enabled:true}};
}

export function QualityCharts({rows,filters,onFilter}) {
  const reduced=useReducedMotion();
  const [replay,setReplay]=useState(0),[mode,setMode]=useState('volume'),[hovered,setHovered]=useState(null);
  const donutInstance=useRef(null);
  const counts=results.map(result=>rows.filter(item=>item.result===result).length);
  const total=rows.length;
  const weekly=weeks.map(week=>results.map(result=>rows.filter(item=>String(item.week)===week&&item.result===result).length));
  const defects=defectNames.map(name=>({name,category:name==='Empaque deteriorado'?'Empaque':'Fruta',value:rows.reduce((sum,item)=>sum+item.boxes.reduce((sum,box)=>sum+box.defects.filter(defect=>defect.name===name).reduce((n,d)=>n+d.quantity,0),0),0)})).sort((a,b)=>b.value-a.value||a.name.localeCompare(b.name));
  const defectTotal=defects.reduce((sum,d)=>sum+d.value,0);
  const signature=JSON.stringify({counts,weekly,defects});
  const donutData=useMemo(()=>({categories:results.map(name=>({id:name,label:name})),series:[{id:'inspection-results',label:'Inspecciones',color:resultColors[0],values:counts}]}),[signature]);
  const weeklyData=useMemo(()=>({categories:weeks.map(week=>({id:week,label:`Semana ${week}`})),series:results.map((name,i)=>({id:name,label:name,color:resultColors[i],values:weekly.map(values=>values[i])}))}),[signature]);
  const defectData=useMemo(()=>({categories:defects.map(d=>({id:d.name,label:d.name})),series:[{id:'defects',label:'Cantidad registrada',color:'#337cb5',values:defects.map(d=>d.value)}]}),[signature]);
  const donutOption=useMemo(()=> (theme,width,reduce)=>({
    ...baseOption(theme,reduce),
    tooltip:{...baseOption(theme,reduce).tooltip,formatter:p=>`${p.name}\n${p.value} inspecciones · ${fmt(p.percent)}%`},
    series:[{id:'inspection-results',type:'pie',radius:['68%','88%'],center:['50%','50%'],startAngle:90,padAngle:total?3:0,avoidLabelOverlap:true,stillShowZeroSum:false,label:{show:false},labelLine:{show:false},animationType:'scale',animationDuration:reduce?0:900,animationEasing:'cubicOut',animationDurationUpdate:reduce?0:460,animationTypeUpdate:'transition',stateAnimation:{duration:reduce?0:180,easing:'cubicOut'},emphasis:{scale:true,scaleSize:7,focus:'self',itemStyle:{shadowBlur:14,shadowColor:theme.dark?'#00000040':'#243b5320'}},blur:{itemStyle:{opacity:.22}},data:results.map((name,i)=>({id:name,name,categoryId:name,value:counts[i],itemStyle:{color:resultColors[i],borderRadius:7,opacity:!filters.result||filters.result===name?1:.26}}))}],
  }),[signature,filters.result]);
  const weeklyOption=useMemo(()=> (theme,width,reduce)=>{
    const percent=mode==='percent';
    const totals=weekly.map(values=>values.reduce((n,v)=>n+v,0));
    return {...baseOption(theme,reduce),grid:{left:6,right:12,top:22,bottom:8,containLabel:true},
      xAxis:{type:'category',data:weeks.map(week=>`Sem. ${week}`),axisLabel:{color:theme.muted,fontSize:11,margin:14},axisLine:{show:false},axisTick:{show:false}},
      yAxis:{type:'value',min:0,max:percent?100:Math.max(1,...totals)+1,minInterval:1,splitNumber:4,axisLabel:{color:theme.muted,fontSize:10,formatter:value=>percent?`${value}%`:value},splitLine:{lineStyle:{color:theme.border,type:'dashed'}},axisLine:{show:false},axisTick:{show:false}},
      tooltip:{...baseOption(theme,reduce).tooltip,trigger:'axis',axisPointer:{type:'shadow',shadowStyle:{color:theme.dark?'#ffffff06':'#14365205'}},formatter:items=>`${items[0]?.axisValue??''}\n${items.map(item=>`${item.seriesName}: ${fmt(item.value)}${percent?'%':''}`).join('\n')}`},
      series:results.map((name,i)=>({id:name,name,type:'bar',stack:'results',barWidth:width<320?38:52,animationDuration:reduce?0:720,animationDelay:index=>reduce?0:index*75+i*45,animationDurationUpdate:reduce?0:460,animationDelayUpdate:0,stateAnimation:{duration:reduce?0:180},emphasis:{focus:'series'},blur:{itemStyle:{opacity:.25}},itemStyle:{color:resultColors[i],borderRadius:i===3?[5,5,0,0]:0},label:{show:true,position:'inside',fontSize:11,fontWeight:600,color:'#fff',formatter:params=>params.value>= (percent?12:1)?(percent?`${Math.round(params.value)}%`:params.value):''},data:weeks.map((week,j)=>({id:week,name:`Semana ${week}`,categoryId:week,seriesId:name,value:percent?(totals[j]?weekly[j][i]/totals[j]*100:0):weekly[j][i],itemStyle:{opacity:!filters.week||filters.week===week?1:.24}}))})),
    };
  },[signature,mode,filters.week]);
  const defectOption=useMemo(()=> (theme,width,reduce)=>({
    ...baseOption(theme,reduce),grid:{left:0,right:34,top:12,bottom:22,containLabel:true},
    xAxis:{type:'value',max:Math.max(1,...defects.map(d=>d.value))*1.12,minInterval:1,splitNumber:3,axisLine:{show:false},axisTick:{show:false},axisLabel:{fontSize:10,color:theme.muted},splitLine:{lineStyle:{color:theme.border,type:'dashed'}}},
    yAxis:{type:'category',inverse:true,data:defects.map(d=>d.name),axisLine:{show:false},axisTick:{show:false},axisLabel:{color:theme.text,fontSize:11,lineHeight:16,margin:12,width:width<340?90:112,overflow:'break',formatter:name=>name==='Empaque deteriorado'?'Empaque\ndeteriorado':name}},
    tooltip:{...baseOption(theme,reduce).tooltip,formatter:p=>`${p.name}\n${p.value} cantidades registradas\n${defectTotal?fmt(p.value/defectTotal*100):0}% del total de defectos`},
    series:[{id:'defects',name:'Cantidad registrada',type:'bar',barWidth:18,showBackground:true,backgroundStyle:{color:theme.track,borderRadius:5},animationDuration:reduce?0:720,animationDelay:index=>reduce?0:index*85,animationDurationUpdate:reduce?0:460,animationDelayUpdate:0,stateAnimation:{duration:reduce?0:180},emphasis:{focus:'self',itemStyle:{shadowBlur:10,shadowColor:'#337cb530'}},blur:{itemStyle:{opacity:.25}},label:{show:true,position:'right',distance:8,color:theme.text,fontSize:12,fontWeight:650,valueAnimation:!reduce,formatter:p=>fmt(p.value)},data:defects.map(defect=>({id:defect.name,name:defect.name,categoryId:defect.name,value:defect.value,itemStyle:{borderRadius:[0,5,5,0],opacity:!filters.defect||filters.defect===defect.name?1:.25,color: {type:'linear',x:0,y:0,x2:1,y2:0,colorStops:[{offset:0,color:defect.category==='Empaque'?'#b68b49':'#70abd0'},{offset:1,color:defect.category==='Empaque'?'#d6ab65':'#2778b1'}]}}}))}],
  }),[signature,filters.defect]);
  const focusResult=name=>{
    setHovered(name);
    const instance=donutInstance.current;
    if(!instance||instance.isDisposed())return;
    instance.dispatchAction({type:'downplay',seriesIndex:0});
    if(name)instance.dispatchAction({type:'highlight',seriesIndex:0,dataIndex:results.indexOf(name)});
  };
  const centerName=hovered||filters.result;
  const centerValue=centerName?counts[results.indexOf(centerName)]||0:total;
  return <section className="qc-section" aria-label="Análisis de inspecciones">
    <div className="qc-toolbar"><div><h2>Análisis de calidad</h2><span>Semanas 46–48 · {total} inspecciones</span></div><Button variant="ghost" onClick={()=>{setReplay(value=>value+1);setHovered(null);}} disabled={reduced} title={reduced?'Movimiento reducido activado':'Reproducir la entrada de las gráficas'}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 10a8 8 0 1 1 1 7M4 4v6h6"/></svg>Repetir animación</Button></div>
    <div className="qi-charts qc-grid">
      <Card className="qc-card"><div className="qc-card-head"><div><h3>Resultado del pallet</h3><p>Distribución de inspecciones</p></div><span className="qc-card-index">01</span></div>
        <div className="qc-donut-wrap"><QualityCanvas chartId="results" data={donutData} kind="donut" label="Resultado del pallet" buildOption={donutOption} reduced={reduced} replay={replay} onSelect={selection=>onFilter('result',filters.result===selection.categoryId?'':selection.categoryId)} onHover={setHovered} onReady={instance=>{donutInstance.current=instance;}}/><div className="qc-donut-center"><strong style={centerName?{color:resultColors[results.indexOf(centerName)]}:undefined}><AnimatedNumber value={centerValue} reduced={reduced} replay={replay}/></strong><span>{centerName||'inspecciones'}</span>{centerName&&<small>{total?fmt(centerValue/total*100):0}% del total</small>}</div></div>
        <div className="qc-result-key" aria-label="Filtrar por resultado">{results.map((name,i)=><button key={name} aria-pressed={filters.result===name} aria-label={`${name}: ${counts[i]} inspecciones`} onMouseEnter={()=>focusResult(name)} onMouseLeave={()=>focusResult(null)} onFocus={()=>focusResult(name)} onBlur={()=>focusResult(null)} onClick={()=>onFilter('result',filters.result===name?'':name)}><span className="qc-key-dot" style={{background:resultColors[i]}}/><span>{name}</span><strong>{counts[i]}</strong><small>{total?fmt(counts[i]/total*100):0}%</small></button>)}</div>
        <div className="qc-insight"><span className="qc-insight-dot"/>{total?`${fmt(counts[0]/total*100)}% de pallets aceptados`:'Sin inspecciones en este contexto'}</div>
      </Card>
      <Card className="qc-card"><div className="qc-card-head"><div><h3>Evolución semanal</h3><p>Volumen y composición por resultado</p></div><span className="qc-card-index">02</span></div>
        <div className="qc-week-tools"><div className="qc-segment" role="group" aria-label="Medida de evolución"><button aria-pressed={mode==='volume'} onClick={()=>setMode('volume')}>Inspecciones</button><button aria-pressed={mode==='percent'} onClick={()=>setMode('percent')}>Porcentaje</button></div><span>{mode==='volume'?'N.º de inspecciones':'% de cada semana'}</span></div>
        <QualityCanvas chartId="weekly" data={weeklyData} kind="stacked" label="Evolución semanal" buildOption={weeklyOption} reduced={reduced} replay={replay} onSelect={selection=>onFilter('week',filters.week===selection.categoryId?'':selection.categoryId)}/>
        <div className="qc-week-key">{results.map((name,i)=><span key={name}><i style={{background:resultColors[i]}}/>{name}</span>)}</div>
        <div className="qc-week-buttons">{weeks.map((week,i)=><button key={week} aria-pressed={filters.week===week} aria-label={`Semana ${week}`} onClick={()=>onFilter('week',filters.week===week?'':week)}><span>Sem. {week}</span><b>{weekly[i].reduce((n,v)=>n+v,0)}</b></button>)}</div>
      </Card>
      <Card className="qc-card"><div className="qc-card-head"><div><h3>Defectos frecuentes</h3><p>Ordenados por cantidad registrada</p></div><span className="qc-card-index">03</span></div>
        <div className="qc-defect-stat"><strong><AnimatedNumber value={defectTotal} reduced={reduced} replay={replay}/></strong><span>cantidades registradas<small>No equivalen a gajos únicos</small></span></div>
        <QualityCanvas chartId="defects" data={defectData} kind="horizontal" label="Defectos frecuentes" buildOption={defectOption} reduced={reduced} replay={replay} onSelect={selection=>onFilter('defect',filters.defect===selection.categoryId?'':selection.categoryId)}/>
        <div className="qc-defect-key"><span><i style={{background:'#2778b1'}}/>Fruta</span><span><i style={{background:'#d6ab65'}}/>Empaque</span></div>
        <div className="qc-defect-filters" aria-label="Filtrar por defecto">{defects.map(defect=><button key={defect.name} aria-pressed={filters.defect===defect.name} onClick={()=>onFilter('defect',filters.defect===defect.name?'':defect.name)}>{defect.name}</button>)}</div>
      </Card>
    </div>
  </section>;
}

