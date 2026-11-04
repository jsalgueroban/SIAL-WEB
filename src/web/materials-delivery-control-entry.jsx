import React from 'react';
import {createRoot} from 'react-dom/client';
import {MaterialsDeliveryControl} from './materials-delivery-control.jsx';

document.querySelectorAll('[data-sial-document-dashboard]').forEach(element=>{
  if(element.dataset.sialDocumentMounted==='true')return;
  element.dataset.sialDocumentMounted='true';
  createRoot(element).render(<MaterialsDeliveryControl/>);
});
