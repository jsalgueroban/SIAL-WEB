import React,{useEffect,useRef,useState} from 'react';
import {Player} from '@remotion/player';
import {Neutral404Composition} from './neutral-404-composition.jsx';
import {NEUTRAL_FRAMES,NEUTRAL_FPS,NEUTRAL_ENTRY,NEUTRAL_LOOP} from './neutral-404-rig.mjs';
export function Neutral404Player(){
 const ref=useRef(null),[playing,setPlaying]=useState(true),[replay,setReplay]=useState(0),[idle,setIdle]=useState(false),[reduced,setReduced]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
 const params=new URLSearchParams(location.search),mode=params.get('escena')==='ventana'?'quiet':'search',raw=params.get('neutral-frame'),inspect=raw!==null&&Number.isFinite(Number(raw))?Math.max(0,Math.min(NEUTRAL_FRAMES-1,Number(raw))):null,still=reduced?560:inspect;
 useEffect(()=>{const q=matchMedia('(prefers-reduced-motion: reduce)'),update=()=>setReduced(q.matches);q.addEventListener('change',update);return()=>q.removeEventListener('change',update);},[]);
 useEffect(()=>{if(still!==null){ref.current?.pause();ref.current?.seekTo(still);}else if(playing)ref.current?.play();},[still]);
 useEffect(()=>{const p=ref.current;if(!p||idle||still!==null)return;const done=()=>setIdle(true);p.addEventListener('ended',done);return()=>p.removeEventListener('ended',done);},[idle,replay,still]);
 return <div className="neutral-player"><Player key={`${replay}-${idle}`} ref={ref} component={Neutral404Composition} inputProps={{mode,inspectionFrame:still,frameOffset:idle?NEUTRAL_ENTRY:0}} durationInFrames={idle?NEUTRAL_LOOP:NEUTRAL_FRAMES} fps={NEUTRAL_FPS} compositionWidth={1000} compositionHeight={620} style={{width:'100%'}} autoPlay={still===null&&playing} loop={idle} initiallyMuted controls={false} clickToPlay={false} doubleClickToFullscreen={false} spaceKeyToPlayOrPause={false} numberOfSharedAudioTags={0}/>
  <div className="maintenance-playback"><button disabled={still!==null} type="button" onClick={()=>{if(playing)ref.current?.pause();else ref.current?.play();setPlaying(!playing);}}>{playing?'Pausar escena':'Reanudar escena'}</button><button disabled={still!==null} type="button" onClick={()=>{setIdle(false);setPlaying(true);setReplay(v=>v+1);}}>Volver a ver a Bananito</button></div>
 </div>;
}
