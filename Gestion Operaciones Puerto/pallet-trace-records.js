window.SIALPalletTraceRecords = (() => {
  const records = [];

  // Explicit simulations of contracts found in the real pallet feature.
  const simulationBase = {simulation:true,farm:'Santa Isabel',farmCode:'0527',week:'SEM-2026-43',reference:'BAN-REF-014 V1',type:'Completo',boxes:54,location:'ZE Puerto Norte',container:'No asignado',operation:'OP-DEMO-4301',dispatch:'No disponible'};
  const simulationActor = {location:'ZE Puerto Norte',responsible:'Carlos Mendoza'};
  records.unshift(
    {...simulationBase,sscc:'177012345678900101',status:'Pallet rearmado',statusKey:'reassembled',updated:'23/10/2026, 10:30',events:[
      ['23/10/2026','10:30','Pallet rearmado','ZE Puerto Norte','ARM-DEMO-4301']
    ],movementDetails:[{...simulationActor,build:{start:'23/10/2026, 10:00',end:'23/10/2026, 10:30',responsible:'Carlos Mendoza',sources:[{sscc:'177012345678900118',boxes:30},{sscc:'177012345678900125',boxes:24}],composition:[{reference:'BAN-REF-014',version:'V1',boxes:54}],observations:'Consolidación de 30 y 24 cajas provenientes de dos pallets.'}}]},
    {...simulationBase,sscc:'177012345678900118',type:'Incompleto',boxes:18,status:'Pallet rearmado',statusKey:'reassembled',updated:'23/10/2026, 10:30',events:[
      ['23/10/2026','07:00','Pallet creado','Finca Santa Isabel','ARM-DEMO-4300'],
      ['23/10/2026','10:30','Pallet rearmado','30 cajas evacuadas a otro pallet','ARM-DEMO-4301']
    ],movementDetails:[{location:'Finca Santa Isabel',responsible:'Laura Martínez'}, {...simulationActor,build:{start:'23/10/2026, 10:00',end:'23/10/2026, 10:30',responsible:'Carlos Mendoza',destinations:[{sscc:'177012345678900101',boxes:30}],composition:[{reference:'BAN-REF-014',version:'V1',boxes:30}],observations:'Se retiraron 30 cajas. El contenido actual del pallet conserva 18 cajas.'}}]},
    {...simulationBase,sscc:'177012345678900132',status:'Descargado de camión',statusKey:'unloaded-truck',updated:'23/10/2026, 11:20',events:[
      ['23/10/2026','07:00','Pallet creado','Finca Santa Isabel','ARM-DEMO-4302'],
      ['23/10/2026','08:30','Cargado en camión','Finca Santa Isabel','OP-DEMO-4302'],
      ['23/10/2026','11:20','Descargado de camión','ZE Puerto Norte','OP-DEMO-4302']
    ],operation:'OP-DEMO-4302',movementDetails:[{location:'Finca Santa Isabel',responsible:'Laura Martínez'}, {location:'Finca Santa Isabel',responsible:'Laura Martínez',vehicle:'CAM102',filing:'419',driver:'Andrés Torres',loadingStartedAt:'23/10/2026, 08:00',loadingCompletedAt:'23/10/2026, 08:30'}, {...simulationActor,vehicle:'CAM102',filing:'419',driver:'Andrés Torres',novelty:'Con novedad',noveltyReason:'Embalaje dañado',observation:'Se identificaron dos cajas con embalaje deteriorado durante la descarga. Se registró la novedad para su revisión; la cantidad recibida se conserva en 54 cajas.'}]},
    {...simulationBase,sscc:'177012345678900149',location:'Finca Santa Isabel',status:'Cargado en camión',statusKey:'loaded-truck',updated:'23/10/2026, 09:15',events:[
      ['23/10/2026','07:15','Pallet creado','Finca Santa Isabel','ARM-DEMO-4303'],
      ['23/10/2026','09:15','Cargado en camión','Finca Santa Isabel','OP-DEMO-4303']
    ],operation:'OP-DEMO-4303',movementDetails:[{location:'Finca Santa Isabel',responsible:'Laura Martínez'}, {location:'Finca Santa Isabel',responsible:'Laura Martínez',vehicle:'CAM102',filing:'419',driver:'Andrés Torres',loadingStartedAt:'23/10/2026, 08:45',loadingCompletedAt:'23/10/2026, 09:15'}]}
  );

  // Case inspected in the live product on 2026-11-03. Other rows remain synthetic.
  const liveTransport = {container:'MMAU145959-7',vehicle:'KUS221',filing:'62',driver:'SANDRO JOSE CABRERA MELÉNDEZ'};
  records.unshift({sscc:'353970050177452895',farm:'MANANTIAL ORGÁNICO',farmCode:'0419',week:'SEM-2026-43',reference:'EDKORG V1',type:'Completo',boxes:54,status:'Descargado de contenedor',statusKey:'unloaded',location:'Zona Externa.',container:'MMAU145959-7',operation:'OP-7724E616',dispatch:'No disponible',updated:'22/10/2026, 20:47:24',events:[
    ['22/10/2026','08:45','Pallet creado','MANANTIAL ORGÁNICO','ARM-0BC45CDF'],
    ['22/10/2026','11:56','Cargado en contenedor','MANANTIAL ORGÁNICO','OP-7724E616'],
    ['22/10/2026','17:36','Despachado a puerto','MANANTIAL ORGÁNICO','OP-7724E616'],
    ['22/10/2026','18:55','Recibido en puerto','Zona Externa','OP-7724E616'],
    ['22/10/2026','20:47','Descargado de contenedor','Zona Externa.','OP-7724E616'],
  ],movementDetails:[
    {location:'MANANTIAL ORGÁNICO · 0419',responsible:'ANGIE MELISSA CONSTANTE PABON',build:{start:'22/10/2026, 08:00',end:'22/10/2026, 08:45',responsible:'ANGIE MELISSA CONSTANTE PABON',composition:[{reference:'EDKORG',version:'V1',boxes:54}]}},
    {...liveTransport,location:'MANANTIAL ORGÁNICO · 0419',responsible:'ANGIE MELISSA CONSTANTE PABON'},
    {...liveTransport,location:'MANANTIAL ORGÁNICO · 0419',responsible:'ANGIE MELISSA CONSTANTE PABON'},
    {...liveTransport,location:'Zona Externa',responsible:'KEINER LUIS PACHECO SANCHEZ'},
    {...liveTransport,location:'Zona Externa.',responsible:'NIDIA ESTER BARROS CARDONA',novelty:'Sin novedad'},
  ]});

  const secondTransport = {container:'MMAU135866-8',vehicle:'KUS342',filing:'64',driver:'DIEGO ALFREDO ANGARITA DIETES'};
  records.splice(1,0,{sscc:'353970050177492747',farm:'MANANTIAL ORGÁNICO',farmCode:'0419',week:'SEM-2026-43',reference:'CLORFTFYMI13 V4',type:'Incompleto',boxes:26,status:'Descargado de contenedor',statusKey:'unloaded',statusTone:'success',location:'Zona Externa.',container:'MMAU135866-8',operation:'OP-C042A898',dispatch:'No disponible',updated:'23/10/2026, 21:21:27',events:[
    ['23/10/2026','16:01','Pallet creado','MANANTIAL ORGÁNICO','ARM-1BA8DA60'],
    ['23/10/2026','17:12','Cargado en contenedor','MANANTIAL ORGÁNICO','OP-C042A898'],
    ['23/10/2026','18:26','Despachado a puerto','MANANTIAL ORGÁNICO','OP-C042A898'],
    ['23/10/2026','19:02','Recibido en puerto','Zona Externa','OP-C042A898'],
    ['23/10/2026','21:21','Descargado de contenedor','Zona Externa.','OP-C042A898']
  ],movementDetails:[
    {location:'MANANTIAL ORGÁNICO · 0419',responsible:'ANGIE MELISSA CONSTANTE PABON',build:{start:'23/10/2026, 13:01',end:'23/10/2026, 16:01',responsible:'ANGIE MELISSA CONSTANTE PABON',composition:[{reference:'CLORFTFYMI13',version:'V4',boxes:26}]}},
    {...secondTransport,location:'MANANTIAL ORGÁNICO · 0419',responsible:'ANGIE MELISSA CONSTANTE PABON'},
    {...secondTransport,location:'MANANTIAL ORGÁNICO · 0419',responsible:'ESTEBAN DAVID BARRAZA CABRERA'},
    {...secondTransport,location:'Zona Externa',responsible:'JUAN CARLOS ANAYA ANAYA'},
    {...secondTransport,location:'Zona Externa.',responsible:'VANESA ALEXANDRA FONSECA LOPEZ',novelty:'Sin novedad'}
  ]});
  records[0].statusTone='success';
  // Complete simulated creation events using explicit fixture data, never real identities.
  for(const record of records.filter(item=>item.simulation)) {
    if(record.events[0][2]!=='Pallet creado') continue;
    const start=record.events[0][1];
    record.movementDetails[0].build={start:`23/10/2026, ${start==='07:15'?'06:30':'06:15'}`,end:`23/10/2026, ${start}`,responsible:'Laura Martínez',composition:[{reference:'BAN-REF-014',version:'V1',boxes:record.sscc==='177012345678900118'?48:54}]};
  }

  return records;
})();
