export const stages=['Disponible','Programado','Despachado','Entregado'];
export const types=['Remisiones','Reservas','RTP'];
export const farms=['Santa Isabel','El Retiro','Las Palmas','La Esperanza','San José','Los Naranjos','Buenavista','El Porvenir'];
// Synthetic, deterministic documents; no material quantities and no business identifiers.
const counts=[[[18,12,8,24],[12,8,4,10],[7,6,5,8]],[[12,8,6,20],[8,7,3,11],[4,3,2,6]],[[9,11,4,16],[6,5,3,8],[3,2,2,4]],[[8,6,5,14],[4,4,2,7],[2,2,1,3]],[[5,4,2,9],[3,2,1,5],[1,1,1,2]],[[3,2,1,5],[2,1,0,3],[1,0,0,1]],[[2,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0]]];
export const documents=counts.flatMap((rows,f)=>rows.flatMap((values,t)=>values.flatMap((n,s)=>Array.from({length:n},(_,i)=>({id:`fixture-${f}-${t}-${s}-${i}`,farm:farms[f],type:types[t],stage:stages[s]})))));
export function aggregate(type='all',farm='all',empty=false){
 const rows=empty?[]:documents.filter(d=>(type==='all'||d.type===type)&&(farm==='all'||d.farm===farm));
 const destinations=(farm==='all'?farms:[farm]).map(label=>({label,...Object.fromEntries(types.map((t,i)=>['t'+i,rows.filter(d=>d.farm===label&&d.type===t).length]))}));
 return {total:rows.length,stages:stages.map(label=>({label,value:rows.filter(d=>d.stage===label).length})),destinations};
}
