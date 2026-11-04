import React,{useEffect,useRef,useState} from 'react';
import {SialIsotype} from '@banasandev/banasan-ui';

// Proposal-only scene. The published SVG remains the source of brand geometry.
export function HomeLogo3D({paused=false}) {
 const host=useRef(null),fallback=useRef(null),pause=useRef(paused);
 const [ready,setReady]=useState(false);
 useEffect(()=>{pause.current=paused;},[paused]);
 useEffect(()=>{
  let disposed=false,cleanup=()=>{};
  async function mount(){
   const [T,{SVGLoader}]=await Promise.all([import('three'),import('three/addons/loaders/SVGLoader.js')]);
   if(disposed)return;
   const svg=fallback.current.querySelector('svg').cloneNode(true);
   svg.setAttribute('xmlns','http://www.w3.org/2000/svg');svg.setAttribute('width','1024');svg.setAttribute('height','1024');
   const outline=svg.querySelector('clipPath path').getAttribute('d');
   const shape=SVGLoader.createShapes(new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${outline}"/></svg>`).paths[0]);
   const renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
   renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.75));renderer.setClearColor(0,0);
   renderer.outputColorSpace=T.SRGBColorSpace;
   const scene=new T.Scene(),camera=new T.PerspectiveCamera(30,1,1,5000),group=new T.Group();
   camera.position.z=2100;
   const bodyGeometry=new T.ExtrudeGeometry(shape,{depth:58,bevelEnabled:true,bevelThickness:7,bevelSize:6,bevelSegments:3,curveSegments:32});
   bodyGeometry.translate(-520,-520,-29);bodyGeometry.scale(1,-1,1);
   const bodyMaterial=new T.MeshStandardMaterial({color:0x005ca8,metalness:.25,roughness:.3});
   group.add(new T.Mesh(bodyGeometry,bodyMaterial));
   const texture=new T.TextureLoader().load(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(svg))}`,()=>{if(!disposed)setReady(true);});
   texture.colorSpace=T.SRGBColorSpace;
   const faceGeometry=new T.PlaneGeometry(800,800),faceMaterial=new T.MeshStandardMaterial({map:texture,transparent:true,roughness:.32,metalness:.05,depthWrite:false});
   const face=new T.Mesh(faceGeometry,faceMaterial);face.position.z=37;group.add(face);
   scene.add(group,new T.HemisphereLight(0xffffff,0x7897b7,2.7));
   const light=new T.DirectionalLight(0xffffff,3);light.position.set(-800,1000,1500);scene.add(light);
   const rim=new T.DirectionalLight(0xa8d6ff,2);rim.position.set(1000,200,-100);scene.add(rim);
   renderer.domElement.setAttribute('aria-hidden','true');host.current.append(renderer.domElement);
   const resize=()=>{const {width,height}=host.current.getBoundingClientRect();renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();};
   const observer=new ResizeObserver(resize);observer.observe(host.current);resize();
   let frame=0,last=0,time=0,visible=true;
   const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
   const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;});intersection.observe(host.current);
   const draw=now=>{frame=requestAnimationFrame(draw);if(now-last<33)return;const delta=Math.min(now-last,80);last=now;if(!visible||document.hidden)return;
    if(!pause.current&&!reduced.matches)time+=delta/1000;
    group.rotation.set(.10+Math.sin(time*.65)*.035,-.27+Math.sin(time*.45)*.10,-.035);
    const beat=reduced.matches?1:1+Math.pow(Math.max(0,Math.sin(time*Math.PI/2.4)),10)*.025;group.scale.setScalar(beat);
    renderer.render(scene,camera);
   };frame=requestAnimationFrame(draw);
   cleanup=()=>{cancelAnimationFrame(frame);observer.disconnect();intersection.disconnect();bodyGeometry.dispose();bodyMaterial.dispose();faceGeometry.dispose();faceMaterial.dispose();texture.dispose();renderer.dispose();renderer.domElement.remove();};
  }
  mount().catch(()=>setReady(false));
  return()=>{disposed=true;cleanup();};
 },[]);
 return <div className={`home-logo-model ${ready?'is-ready':''}`}><div ref={host} className="home-logo-canvas"/><div ref={fallback} className="home-logo-fallback"><SialIsotype size={150} motion="none"/></div></div>;
}
