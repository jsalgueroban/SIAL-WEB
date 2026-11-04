import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { GroupMove } from './group-move/group_move';

function RoleGroupMove({ available, included }) {
  const read = () => [
    {id:'available',label:'Roles disponibles',emptyText:'No hay roles disponibles.',items:[...available.querySelectorAll('.role-option')].map(item => ({id:item.querySelector('strong').textContent.trim(),label:item.querySelector('strong').textContent.trim(),description:item.querySelector('strong + span')?.textContent.trim()}))},
    {id:'included',label:'Roles incluidos',emptyText:'No hay roles incluidos.',items:[...included.querySelectorAll('.role-option')].map(item => ({id:item.querySelector('strong').textContent.trim(),label:item.querySelector('strong').textContent.trim(),description:item.querySelector('strong + span')?.textContent.trim()}))}
  ];
  const [groups,setGroups] = useState(read);
  useEffect(() => {
    const observer = new MutationObserver(() => setGroups(read()));
    observer.observe(available,{childList:true}); observer.observe(included,{childList:true});
    return () => observer.disconnect();
  },[available,included]);
  return <GroupMove groups={groups} label="Asignación de roles" onMove={({itemId,fromGroupId,toGroupId}) => {
    const source=fromGroupId==='available'?available:included, target=toGroupId==='available'?available:included;
    const item=[...source.querySelectorAll('.role-option')].find(node=>node.querySelector('strong').textContent.trim()===itemId);
    if (!item) return;
    item.querySelector('input').checked=false;
    target.appendChild(item);
    document.dispatchEvent(new CustomEvent('sial:company-role-moved'));
  }} />;
}
export function mountCompanyRoleMove() {
  const available=document.getElementById('rolesExcluded'), included=document.getElementById('rolesIncluded');
  const layout=available?.closest('.transfer-layout');
  if (!available || !included || !layout || layout.dataset.groupMoveMounted) return;
  layout.dataset.groupMoveMounted='true';
  const mount=document.createElement('div'); mount.dataset.sialComponent='GroupMove'; mount.dataset.sialSource='proposal-local-library-candidate';
  layout.before(mount); layout.hidden=true; layout.style.display='none';
  createRoot(mount).render(<RoleGroupMove available={available} included={included} />);
}
