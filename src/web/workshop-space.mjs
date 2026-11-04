// Authored SIAL workshop geometry. All models share this orthographic space.
export const LOGO_THICKNESS=14;
export const project=([x,y,z])=>({x:760+.95*x+.42*z,y:498-y+.12*x-.42*z});
export const logoPoint=(u,v,height=LOGO_THICKNESS)=>project([u-100,height,100-v]);
export const logoMatrix=[.95,.12,-.42,.42,232.45,218.68];
export const screenToLogo=({x,y})=>{const dx=x-707,dy=y-430,det=.4494;return {u:(.42*dx+.42*dy)/det,v:(-.12*dx+.95*dy)/det};};
export const FRACTURE_CENTER=[710,418];
const rim=[[630,310],[745,310],[860,310],[860,420],[860,530],[745,530],[630,530],[630,420]];
const mid=rim.map(([x,y],i)=>[(x+710)/2+(i%2?7:-5),(y+418)/2+(i%3?6:-4)]);
export const fragmentPolygons=rim.map((point,i)=>[point,rim[(i+1)%8],mid[(i+1)%8],FRACTURE_CENTER,mid[i]]);
export function insidePolygon([x,y],poly){let inside=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])inside=!inside;}return inside;}
const bezier=(p0,p1,p2,p3,t)=>{const a=1-t;return [a*a*a*p0[0]+3*a*a*t*p1[0]+3*a*t*t*p2[0]+t*t*t*p3[0],a*a*a*p0[1]+3*a*a*t*p1[1]+3*a*t*t*p2[1]+t*t*t*p3[1]];};
// The existing mark's outline, sampled only for its new side-wall extrusion.
const outline=[[162,884],[162,524]];
for(let i=1;i<=24;i++)outline.push(bezier([162,524],[162,319],[328,153],[533,153],i/24));
outline.push([851,153],[869,171],[869,489]);
for(let i=1;i<=24;i++)outline.push(bezier([869,489],[869,694],[703,860],[498,860],i/24));
outline.push([186,860],[162,884]);
export const brandOutline=outline.map(([x,y])=>[641+(1.0047868*x-4.5532335-120)/4,320+(1.0054432*y-4.6105913-120)/4]);
function segments(a,b,include){const out=[];for(let i=0;i<12;i++){const p=[a[0]+(b[0]-a[0])*i/12,a[1]+(b[1]-a[1])*i/12],q=[a[0]+(b[0]-a[0])*(i+1)/12,a[1]+(b[1]-a[1])*(i+1)/12];if(include([(p[0]+q[0])/2,(p[1]+q[1])/2]))out.push([p,q]);}return out;}
export const fragmentWalls=fragmentPolygons.map(poly=>{
 const walls=[];
 for(let i=0;i<poly.length;i++)walls.push(...segments(poly[i],poly[(i+1)%poly.length],p=>insidePolygon(p,brandOutline)));
 for(let i=0;i<brandOutline.length-1;i++){const a=brandOutline[i],b=brandOutline[i+1];if(insidePolygon([(a[0]+b[0])/2,(a[1]+b[1])/2],poly))walls.push([a,b]);}
 return walls;
});
export function movedUV(point,piece){const a=piece.angle*Math.PI/180,x=point[0]-710,y=point[1]-418;return [710+x*Math.cos(a)-y*Math.sin(a)+piece.x,418+x*Math.sin(a)+y*Math.cos(a)+piece.y];}
export const fragmentFootprints=fragmentWalls.map(walls=>walls.flat());
// Leave a ten-unit margin inside the anvil's usable front/back edges.
export const WORK_FACE={minU:-25,maxU:225,minV:0,maxV:200};
export function containFragment(piece,index){
 const points=fragmentFootprints[index].map(p=>movedUV(p,piece));
 if(!points.length)return piece;
 const us=points.map(p=>p[0]-641),vs=points.map(p=>p[1]-320);
 const dx=Math.max(0,WORK_FACE.minU-Math.min(...us))-Math.max(0,Math.max(...us)-WORK_FACE.maxU);
 const dy=Math.max(0,WORK_FACE.minV-Math.min(...vs))-Math.max(0,Math.max(...vs)-WORK_FACE.maxV);
 return {...piece,x:piece.x+dx,y:piece.y+dy};
}
export function wallQuad([a,b],piece){const p=movedUV(a,piece),q=movedUV(b,piece),h=piece.height||0;return [logoPoint(p[0]-641,p[1]-320,h),logoPoint(q[0]-641,q[1]-320,h),logoPoint(q[0]-641,q[1]-320,h+LOGO_THICKNESS),logoPoint(p[0]-641,p[1]-320,h+LOGO_THICKNESS)];}
export const svgPoints=points=>points.map(p=>`${p.x},${p.y}`).join(' ');
