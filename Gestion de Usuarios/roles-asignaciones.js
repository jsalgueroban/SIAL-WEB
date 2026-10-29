/* Los datos y la persistencia son de demostración y no representan permisos reales. */
(() => {
  const el=id=>document.getElementById(id), view=el('assignmentView'), company=el('assignmentCompany'), search=el('assignmentSearch');
  const tbody=el('assignmentResults');
  const norm=value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const roles={'SIAL Central':{'administrador general':'admin-general','seguridad y roles':'seguridad-roles','consulta auditoria':'consulta-auditoria'},Banapalma:{'supervisor campo':'supervisor-campo','gestor documental':'gestor-documental'}};
  const users=[{user:'m.garcia',name:'María García',document:'CC 1020304050',relations:{'SIAL Central':['Administrador general','Seguridad y roles'],Banapalma:['Supervisor campo']}},{user:'j.perez',name:'Julián Pérez',document:'CE 778899',relations:{Banapalma:['Supervisor campo']}},{user:'l.rojas',name:'Luis Rojas',document:'CC 99112233',relations:{AgroCeiba:['Consulta historica']}}];
  const params=new URLSearchParams(location.search);
  try {const raw=localStorage.getItem('sial-proposal-user-company-roles-v1');if(raw){const data=JSON.parse(raw);if(data.user!=='m.garcia'||!data.relations||typeof data.relations!=='object')throw new Error();users[0].relations=data.relations;}}catch{el('assignmentCount').textContent='No se pudieron leer las asignaciones locales.';return;}
  if(params.get('escenario')==='volumen'){
    for(let i=1;i<=500;i++)users.push({user:`demo.${String(i).padStart(4,'0')}`,name:`Usuario demo ${String(i).padStart(4,'0')}`,document:`DEMO ${String(i).padStart(6,'0')}`,relations:{'SIAL Central':['Administrador general'],...(i%3===0?{Banapalma:['Supervisor campo']}:{})}});
    const scenario=el('assignmentScenario');scenario.textContent='Volver a datos de demostración iniciales';scenario.href='roles-asignaciones.html';
  }
  if([...company.options].some(option=>option.value===params.get('empresa')))company.value=params.get('empresa');
  if(params.get('rol'))search.value=params.get('rol');
  let page=1, detailPage=1, active=null, origin=null;
  const pageSize=10;
  function link(role,org){const id=roles[org]?.[norm(role)];if(!id)return null;const a=document.createElement('a');a.href=`gestion-permisos-rol.html?rol=${encodeURIComponent(id)}`;a.textContent='Ver permisos';a.setAttribute('aria-label',`Ver permisos de ${role} en ${org}`);return a;}
  function groups(){const map=new Map(),query=norm(search.value.trim());for(const person of users)for(const [org,assigned] of Object.entries(person.relations))for(const role of assigned){if(company.value!=='all'&&company.value!==org)continue;const key=view.value==='role'?`${org}\u0000${role}`:person.user;if(!map.has(key))map.set(key,{key,title:view.value==='role'?role:person.name,subtitle:view.value==='role'?org:person.user,document:person.document,role,company:org,items:[]});map.get(key).items.push({name:person.name,user:person.user,document:person.document,role,company:org});}return [...map.values()].filter(group=>!query||norm(`${group.title} ${group.subtitle} ${group.items.map(item=>`${item.name} ${item.user} ${item.document} ${item.role} ${item.company}`).join(' ')}`).includes(query)).sort((a,b)=>a.title.localeCompare(b.title,'es'));}
  function paginate(total,current,prev,next,range){const pages=Math.max(1,Math.ceil(total/pageSize)),safe=Math.min(current,pages);prev.disabled=safe<=1;next.disabled=safe>=pages;const pager=prev.closest('.assignment-pagination');pager.dataset.page=String(safe);pager.dataset.total=String(total);range.textContent=total?`${(safe-1)*pageSize+1}–${Math.min(safe*pageSize,total)} de ${total}`:'0 resultados';return safe;}
  function render(){
    const items=groups();
    page=paginate(items.length,page,el('assignmentPrevious'),el('assignmentNext'),el('assignmentRange'));
    el('assignmentResultsTitle').textContent=view.value==='role'?'Roles':'Usuarios';
    el('assignmentCount').textContent=items.length?`${items.length} ${items.length===1?'resultado':'resultados'}`:'Sin resultados';
    tbody.replaceChildren();
    const previous=active && items.find(item=>item.key===active.key);
    const visible=items.slice((page-1)*pageSize,page*pageSize);
    const selected=visible.find(item=>item.key===previous?.key) || visible[0] || null;
    for(const group of visible){
      const button=document.createElement('button');button.type='button';button.className='assignment-master-item';
      button.setAttribute('aria-pressed',String(selected?.key===group.key));
      if(view.value==='role'){const permission=link(group.role,group.company);if(permission){button.dataset.permissionHref=permission.getAttribute('href');button.dataset.permissionLabel=permission.getAttribute('aria-label');}}
      const text=document.createElement('span'),title=document.createElement('strong'),sub=document.createElement('small'),total=document.createElement('span');
      title.textContent=group.title;sub.textContent=group.subtitle;text.append(title,sub);total.className='assignment-master-count';
      total.textContent=`${group.items.length} ${view.value==='role'?(group.items.length===1?'usuario':'usuarios'):(group.items.length===1?'rol':'roles')}`;
      button.append(text,total);button.addEventListener('click',()=>{active=group;detailPage=1;render();});tbody.append(button);
    }
    if(!selected){active=null;el('assignmentDetailTitle').textContent='Sin resultados';el('assignmentDetailSubtitle').textContent='Prueba otra búsqueda o empresa.';el('detailResults').replaceChildren();el('detailCount').textContent='';paginate(0,1,el('detailPrevious'),el('detailNext'),el('detailRange'));return;}
    active=selected;el('assignmentDetailTitle').textContent=active.title;el('assignmentDetailSubtitle').textContent=active.subtitle;
    el('detailFirstHeading').textContent=view.value==='role'?'Usuario':'Rol';el('detailSecondHeading').textContent=view.value==='role'?'Identificación':'Empresa';
    el('detailActionHeading').hidden=view.value==='role';
    renderDetail();
  }
  function renderDetail(){
    if(!active)return;
    const items=[...active.items].sort((a,b)=>view.value==='role'?a.name.localeCompare(b.name,'es'):a.role.localeCompare(b.role,'es'));
    detailPage=paginate(items.length,detailPage,el('detailPrevious'),el('detailNext'),el('detailRange'));
    el('detailCount').textContent=items.length?`${items.length} ${view.value==='role'?(items.length===1?'usuario':'usuarios'):(items.length===1?'rol':'roles')}`:'Sin resultados para esta búsqueda.';
    const list=el('detailResults');list.replaceChildren();
    for(const item of items.slice((detailPage-1)*pageSize,detailPage*pageSize)){
      const tr=document.createElement('tr'),first=document.createElement('td'),strong=document.createElement('strong'),small=document.createElement('div'),second=document.createElement('td');
      strong.textContent=view.value==='role'?item.name:item.role;small.className='muted';small.textContent=view.value==='role'?item.user:'';first.append(strong,small);
      second.textContent=view.value==='role'?item.document:item.company;tr.append(first,second);
      if(view.value==='user'){const actions=document.createElement('td'),a=link(item.role,item.company);if(a)actions.append(a);else actions.textContent='No disponible';tr.append(actions);}
      list.append(tr);
    }
  }
  [view,company,search].forEach(input=>input.addEventListener(input===search?'input':'change',()=>{page=1;detailPage=1;active=null;render();}));
  el('assignmentPrevious').addEventListener('click',()=>{page--;detailPage=1;render();});el('assignmentNext').addEventListener('click',()=>{page++;detailPage=1;render();});
  el('assignmentPrevious').closest('.assignment-pagination').addEventListener('assignment:page',event=>{page=event.detail;detailPage=1;render();});
  el('detailPrevious').closest('.assignment-pagination').addEventListener('assignment:page',event=>{detailPage=event.detail;renderDetail();});
  el('detailPrevious').addEventListener('click',()=>{detailPage--;renderDetail();});el('detailNext').addEventListener('click',()=>{detailPage++;renderDetail();});
  render();
})();
