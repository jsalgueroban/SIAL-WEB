import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { RadioCard, Table, Pagination, IconButton, LockIcon } from '@banasandev/banasan-ui';

function useSnapshot(node, read) {
  const [snapshot, setSnapshot] = useState(read);
  useEffect(() => {
    const observer = new MutationObserver(() => setSnapshot(read()));
    observer.observe(node, { subtree: true, childList: true, characterData: true, attributes: true });
    setSnapshot(read());
    return () => observer.disconnect();
  }, [node]);
  return snapshot;
}
function Master({ native }) {
  const items = useSnapshot(native, () => [...native.querySelectorAll('button')].map((button, index) => ({ button, index, title:button.querySelector('strong')?.textContent, description:button.querySelector('small')?.textContent, meta:button.querySelector('.assignment-master-count')?.textContent, checked:button.getAttribute('aria-pressed')==='true',href:button.dataset.permissionHref,label:button.dataset.permissionLabel })));
  return <div className="assignment-radio-list">{items.map(item => <div className="assignment-role-option" key={`${item.index}-${item.title}`}><RadioCard name="assignment-master" value={String(item.index)} title={item.title} description={item.description} meta={item.meta} checked={item.checked} onChange={() => item.button.click()} />{item.href && <div className="assignment-role-permission"><IconButton variant="ghost" aria-label={item.label} title={item.label} onClick={()=>location.assign(item.href)}><AnimatedLock /></IconButton></div>}</div>)}</div>;
}
function AnimatedLock() {
  return <svg className="assignment-animated-lock" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="6" y="11" width="12" height="9" rx="1"/><path className="assignment-lock-shackle" d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>;
}
function DetailTable({ native }) {
  const snapshot = useSnapshot(native, () => ({headers:[...native.querySelectorAll('thead th')].filter(th=>!th.hidden).map(th=>th.textContent), rows:[...native.querySelectorAll('tbody tr')].map((tr,index)=>({index,cells:[...tr.cells].map(cell=>({text:cell.textContent.trim(),title:cell.querySelector('strong')?.textContent,detail:cell.querySelector('.muted')?.textContent,link:cell.querySelector('a')?.getAttribute('href'),label:cell.querySelector('a')?.getAttribute('aria-label')}))}))}));
  const columns=snapshot.headers.map((header,index)=>({key:`column-${index}`,header,render:row=>{const cell=row.cells[index];if(!cell)return null;if(cell.link)return <IconButton variant="ghost" aria-label={cell.label} title={cell.label} onClick={()=>location.assign(cell.link)}><LockIcon /></IconButton>;if(cell.title)return <div className="assignment-table-identity"><strong>{cell.title}</strong>{cell.detail&&<small>{cell.detail}</small>}</div>;return <span>{cell.text}</span>;}}));
  return <Table columns={columns} data={snapshot.rows} rowKey={row=>row.index} minWidth="480px" emptyState="No hay asignaciones para mostrar." />;
}
function Pager({ native }) {
  const state=useSnapshot(native,()=>({page:Number(native.dataset.page)||1,total:Number(native.dataset.total)||0}));
  return <Pagination page={state.page} pageSize={10} total={state.total} pageSizeOptions={[10]} onPageChange={page=>native.dispatchEvent(new CustomEvent('assignment:page',{detail:page}))} />;
}
export function mountAssignmentComponents() {
  const master=document.getElementById('assignmentResults'), table=document.querySelector('.assignment-detail .table-wrap');
  if(!master||!table)return;
  for(const [native,Component,name] of [[master,Master,'RadioCard'],[table,DetailTable,'Table'],...Array.from(document.querySelectorAll('.assignment-detail .assignment-pagination')).map(native=>[native,Pager,'Pagination'])]){
    const mount=document.createElement('div');mount.dataset.sialComponent=name;mount.dataset.sialSource='@banasandev/banasan-ui';mount.className=`assignment-library-${name.toLowerCase()}`;native.before(mount);native.classList.add('sial-native-proxy');createRoot(mount).render(<Component native={native}/>);
  }
}
