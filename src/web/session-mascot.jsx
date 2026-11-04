import React,{useEffect,useRef,useState} from 'react';
import {Player} from '@remotion/player';
import {SessionComposition} from './session-composition.jsx';
import {SESSION_FPS,SESSION_FRAMES,SESSION_LOOP_START,SESSION_LOOP_FRAMES} from './session-rig.mjs';

export function SessionMascot(){
  const player=useRef(null);
  const [idle,setIdle]=useState(false);
  const [replay,setReplay]=useState(0);
  const [reduced,setReduced]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [mobile,setMobile]=useState(()=>matchMedia('(max-width: 680px)').matches);
  const raw=new URLSearchParams(location.search).get('scene-frame');
  const inspect=raw!==null&&Number.isFinite(Number(raw))?Math.max(0,Math.min(SESSION_FRAMES-1,Number(raw))):null;
  const still=reduced?SESSION_LOOP_START:inspect;
  useEffect(()=>{
    const reduce=matchMedia('(prefers-reduced-motion: reduce)'),narrow=matchMedia('(max-width: 680px)');
    const update=()=>{setReduced(reduce.matches);setMobile(narrow.matches);};
    reduce.addEventListener('change',update);narrow.addEventListener('change',update);
    return ()=>{reduce.removeEventListener('change',update);narrow.removeEventListener('change',update);};
  },[]);
  useEffect(()=>{if(still!==null){player.current?.pause();player.current?.seekTo(still);}},[still]);
  useEffect(()=>{
    const current=player.current;
    if(!current||still!==null||idle)return;
    const arrive=()=>setIdle(true);
    current.addEventListener('ended',arrive);
    return ()=>current.removeEventListener('ended',arrive);
  },[still,mobile,idle,replay]);
  return <div className="session-scene"><div aria-hidden="true">
    <Player key={`${mobile?'mobile':'desktop'}-${still===null?'motion':'still'}-${idle?'idle':'entry'}-${replay}`} ref={player} component={SessionComposition}
      inputProps={{inspectionFrame:still,frameOffset:still===null&&idle?SESSION_LOOP_START:0}}
      durationInFrames={still!==null?SESSION_FRAMES:idle?SESSION_LOOP_FRAMES:SESSION_LOOP_START} fps={SESSION_FPS}
      compositionWidth={mobile?346:540} compositionHeight={mobile?310:470}
      style={{width:'100%'}} autoPlay={still===null} initiallyMuted loop={still===null&&idle} controls={false}
      clickToPlay={false} doubleClickToFullscreen={false} spaceKeyToPlayOrPause={false}
      numberOfSharedAudioTags={0} moveToBeginningWhenEnded={false}/>
    </div><button className="session-scene__replay" type="button" disabled={still!==null}
      onClick={()=>{setIdle(false);setReplay(value=>value+1);}}>Volver a ver a Bananito</button></div>;
}
