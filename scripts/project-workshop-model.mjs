// Render the original public CC0 Innerscene mesh as lit SVG triangles.
// No WebGL or 3D renderer runs in the final maintenance page.
import {readFile,writeFile} from 'node:fs/promises';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {Box3,Vector3,OrthographicCamera,Color,MeshBasicMaterial} from 'three';
const root=new URL('../assets/workshop/',import.meta.url),bytes=await readFile(new URL('anvil.glb',root));
const loader=new GLTFLoader();
loader.register(()=>({name:'SIAL_VECTOR_PROJECTION',loadMaterial:()=>Promise.resolve(new MeshBasicMaterial())}));
const gltf=await new Promise((resolve,reject)=>loader.parse(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'',resolve,reject));
gltf.scene.updateMatrixWorld(true);
const box=new Box3().setFromObject(gltf.scene),center=box.getCenter(new Vector3()),size=box.getSize(new Vector3());
const camera=new OrthographicCamera(-2,2,2,-2,.01,100);camera.position.copy(center).add(new Vector3(2,1.1,7));camera.lookAt(center);camera.updateMatrixWorld();
const light=new Vector3(-2,5,6).normalize(),faces=[];
gltf.scene.traverse(mesh=>{
 if(!mesh.isMesh)return;
 const geometry=mesh.geometry,index=geometry.index,positions=geometry.attributes.position,count=index?index.count:positions.count;
 for(let i=0;i<count;i+=3){
  const world=[0,1,2].map(k=>new Vector3().fromBufferAttribute(positions,index?index.getX(i+k):i+k).applyMatrix4(mesh.matrixWorld));
  const normal=world[1].clone().sub(world[0]).cross(world[2].clone().sub(world[0])).normalize();
  const view=world.map(v=>v.clone().applyMatrix4(camera.matrixWorldInverse));
  const cameraNormal=normal.clone().transformDirection(camera.matrixWorldInverse);
  if(cameraNormal.z<=0)continue;
  const shade=.42+.58*Math.max(0,normal.dot(light));
  const color=new Color('#7393aa').multiplyScalar(shade);
  faces.push({z:view.reduce((s,v)=>s+v.z,0)/3,points:view.map(v=>[v.x,-v.y]),color:'#'+color.getHexString()});
 }
});
faces.sort((a,b)=>a.z-b.z);
const flat=faces.flatMap(f=>f.points),minX=Math.min(...flat.map(p=>p[0])),minY=Math.min(...flat.map(p=>p[1])),maxX=Math.max(...flat.map(p=>p[0])),maxY=Math.max(...flat.map(p=>p[1]));
const factor=800/(maxX-minX),height=(maxY-minY)*factor;
const polygons=faces.map(f=>`<polygon points="${f.points.map(([x,y])=>`${((x-minX)*factor).toFixed(2)},${((y-minY)*factor).toFixed(2)}`).join(' ')}" fill="${f.color}" stroke="${f.color}" stroke-width=".5"/>`).join('');
await writeFile(new URL('anvil-model.svg',root),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 ${height.toFixed(2)}"><title>CC0 Innerscene anvil, orthographic SIAL material adaptation</title>${polygons}</svg>`);
console.log(JSON.stringify({triangles:faces.length,originalSize:size.toArray(),height}));
