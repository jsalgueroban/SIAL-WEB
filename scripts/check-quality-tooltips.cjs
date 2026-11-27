async page => {
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const assert=(value,message)=>{if(!value)throw Error(message);};
  const visibleTips=()=>page.locator('.qc-tooltip').evaluateAll(nodes=>nodes.filter(n=>n.getBoundingClientRect().height>0&&n.textContent&&getComputedStyle(n).visibility!=='hidden'&&getComputedStyle(n).display!=='none'&&Number(getComputedStyle(n).opacity)>0).map(n=>{const r=n.getBoundingClientRect();return {text:n.textContent,x:r.x,y:r.y,right:r.right,bottom:r.bottom};}));
  let inspected=0;
  const hoverAll=async()=>{
    for(const id of ['results','weekly','defects']){
      const chart=page.locator(`[data-quality-chart=${id}]`);
      await chart.scrollIntoViewIfNeeded();await page.waitForTimeout(1100);
      const box=await chart.locator('.bui-echarts-preview').boundingBox();
      let points;
      if(id==='results')points=[0,120,180,240].map(deg=>{const a=deg*Math.PI/180;return {x:box.x+box.width/2+92*Math.cos(a),y:box.y+122+92*Math.sin(a)};});
      else points=await chart.locator('svg path').evaluateAll(nodes=>nodes.filter(n=>{const fill=n.getAttribute('fill');const r=n.getBoundingClientRect();return fill&&fill!=='none'&&fill!=='transparent'&&r.width>15&&r.height>12&&!['#f0f4f8','#26374a'].includes(fill);}).map(n=>{const r=n.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};}));
      assert(points.length>0,`${id}: data marks`);
      for(const p of points){await page.mouse.move(p.x,p.y);await page.waitForTimeout(120);const tips=await visibleTips();assert(tips.length===1,`${id}: expected one tooltip, got ${JSON.stringify(tips)}`);const t=tips[0];const v=page.viewportSize();assert(t.x>=0&&t.y>=0&&t.right<=v.width+1&&t.bottom<=v.height+1,`${id}: tooltip outside viewport`);assert(t.text.length>5,`${id}: tooltip empty`);inspected++;}
      await page.mouse.move(5,5);await page.waitForTimeout(120);assert((await visibleTips()).length===0,`${id}: stale tooltip after leave`);
      assert(!((await chart.locator('svg').textContent())||'').includes('total'),`${id}: defaults restored`);
    }
  };
  await page.setViewportSize({width:1440,height:1000});await page.goto('http://127.0.0.1:8765/Calidad/inspecciones.html?vista=analitica');await page.waitForSelector('[data-chart-ready=true]');
  await hoverAll();
  await page.getByRole('button',{name:'Porcentaje',exact:true}).click();await hoverAll();
  await page.getByRole('button',{name:'Rechazo total: 3 inspecciones',exact:true}).click();await hoverAll();
  for(const name of ['Bandeja','Analítica']){await page.getByRole('button',{name,exact:true}).click();await hoverAll();}
  await page.getByRole('textbox',{name:'Buscar inspección',exact:true}).fill('PL-8459');await hoverAll();
  await page.getByRole('textbox',{name:'Buscar inspección',exact:true}).fill('');
  const theme=page.getByRole('button',{name:/Cambiar a modo/});await theme.click();await hoverAll();
  await page.setViewportSize({width:390,height:844});await hoverAll();
  assert(errors.length===0,errors.join('\n'));
  return {inspected,errors};
}

