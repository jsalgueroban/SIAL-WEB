import React,{useEffect,useRef,useState} from 'react';
import {Player} from '@remotion/player';
import {MaintenanceComposition} from './maintenance-composition.jsx';
import {WORKSHOP_FPS,WORKSHOP_FRAMES,WELD_FRAMES} from './maintenance-rig.mjs';

export function MaintenancePlayer(){
  const player=useRef(null),[playing,setPlaying]=useState(true),[replay,setReplay]=useState(0);
  const [reduced,setReduced]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
  const params=new URLSearchParams(location.search),mode=params.get('escena')==='soldadura'?'weld':'workshop';
  const duration=mode==='weld'?WELD_FRAMES:WORKSHOP_FRAMES;
  const raw=params.get('workshop-frame'),inspect=raw!==null&&Number.isFinite(Number(raw))?Math.max(0,Math.min(duration-1,Number(raw))):null;
  const still=reduced?(mode==='weld'?470:1320):inspect;
  useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)'),update=()=>setReduced(media.matches);media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[]);
  useEffect(()=>{if(still!==null){player.current?.pause();player.current?.seekTo(still);}else if(playing)player.current?.play();},[still]);
  return <div className="maintenance-player">
    <Player key={replay} ref={player} component={MaintenanceComposition} inputProps={{mode,inspectionFrame:still,reduced}}
      durationInFrames={duration} fps={WORKSHOP_FPS} compositionWidth={1200} compositionHeight={620}
      style={{width:'100%'}} autoPlay={still===null&&playing} loop initiallyMuted controls={false}
      clickToPlay={false} doubleClickToFullscreen={false} spaceKeyToPlayOrPause={false} numberOfSharedAudioTags={0}/>
    <div className="maintenance-playback" aria-label="Controles de la escena">
      <button type="button" disabled={still!==null} aria-label={playing?'Pausar escena':'Reanudar escena'} onClick={()=>{if(playing)player.current?.pause();else player.current?.play();setPlaying(!playing);}}>
        {playing?'Pausar escena':'Reanudar escena'}
      </button>
      <button type="button" disabled={still!==null} onClick={()=>{setPlaying(true);setReplay(n=>n+1);}}>Volver a ver a Bananito</button>
    </div>
  </div>;
}
