import React from 'react';
import {Player} from '@remotion/player';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import {SialMascot} from '@sial/mascot-preview';
import {SessionActor} from './session-composition.jsx';
import {sessionRigAt,SESSION_LOOP_START,SESSION_LOOP_FRAMES,SESSION_FPS} from './session-rig.mjs';

function ReviewActor({frame}){
  const current=useCurrentFrame(),{fps}=useVideoConfig();
  return <SessionActor pose={sessionRigAt(frame??SESSION_LOOP_START+current/fps*SESSION_FPS)}/>;
}
export function SessionModelReview(){
  const raw=new URLSearchParams(location.search).get('scene-frame');
  const frame=raw!==null&&Number.isFinite(Number(raw))?Number(raw):null;
  return <div className="model-grid">
    <section><h2>Modelo existente</h2><p>Acceso restringido · pose original</p><div className="model-stage"><SialMascot pose="forbidden" motion="none" size={260}/></div></section>
    <section><h2>401 · composición ajustada</h2><p>Mismo brazo completo · gesto coordinado</p><div className="model-stage"><Player component={ReviewActor} inputProps={{frame}} durationInFrames={SESSION_LOOP_FRAMES} fps={SESSION_FPS} compositionWidth={485} compositionHeight={560} style={{width:260}} autoPlay={frame===null} loop initiallyMuted numberOfSharedAudioTags={0} controls={frame===null} clickToPlay={false}/></div></section>
  </div>;
}
