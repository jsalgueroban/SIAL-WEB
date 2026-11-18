const assets = "../shared/vendor/calendar-pdf/";
const ink = "#172339";
const blue = "#004a87";
const border = "#d6dfe7";

async function readFont(weight) {
  const response = await fetch(assets + "Poppins-" + weight + ".ttf");
  if (!response.ok) throw new Error("Fuente no disponible");
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function logo(element) {
  await element.decode();
  const canvas = document.createElement("canvas");
  canvas.width = element.naturalWidth;
  canvas.height = element.naturalHeight;
  canvas.getContext("2d").drawImage(element, 0, 0);
  return canvas.toDataURL("image/png");
}

let library;
function loadLibrary() {
  if (!library) library = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = assets + "jspdf.umd.min.js";
    script.onload = () => resolve(window.jspdf.jsPDF);
    script.onerror = () => { library = undefined; reject(new Error("PDF no disponible")); };
    document.head.append(script);
  });
  return library;
}

export async function downloadCalendar(card, year) {
  const weights = ["Regular", "Bold", "SemiBold"];
  const [PDF, fonts, brand, signature] = await Promise.all([
    loadLibrary(), Promise.all(weights.map(readFont)),
    logo(card.querySelector(".calendar-print-brand")), logo(card.querySelector(".calendar-print-signature img"))
  ]);
  const doc = new PDF({orientation:"landscape", unit:"pt", format:"a4", compress:true, putOnlyUsedFonts:true});
  weights.forEach((weight, index) => {
    doc.addFileToVFS(weight + ".ttf", fonts[index]);
    doc.addFont(weight + ".ttf", "Poppins", weight);
  });
  const text = (value, x, y, size, weight="Regular", color=ink, align="left") => {
    doc.setFont("Poppins", weight).setFontSize(size).setTextColor(color);
    doc.text(value, x, y, {align});
  };
  const cell = (x,y,w,h,fill) => {
    doc.setLineWidth(.55).setDrawColor(border).setFillColor(fill).rect(x,y,w,h,"FD");
  };
  doc.addImage(brand,"PNG",22.5,24.75,119.25,30);
  text("CALENDARIO BANANERO",421,37.5,16,"Bold",blue,"center");
  text(String(year),421,54,12.8,"Bold",blue,"center");
  text(card.querySelector(".planning-year-heading p").textContent,819,42,8,"Regular","#495669","right");
  doc.setDrawColor(border).setLineWidth(.7).line(22.5,66,819,66);
  const months = Array.from(card.querySelectorAll(".planning-month"));
  const quarterRows = [0,1,2,3].map(q => Math.max(...months.slice(q*3,q*3+3).map(m=>m.querySelectorAll("tbody tr").length)));
  const rowHeight = Math.min(13, (447-4*26)/quarterRows.reduce((a,b)=>a+b,0));
  const gap = (450-4*26-quarterRows.reduce((a,b)=>a+b,0)*rowHeight)/4;
  let top = 95.25;
  months.forEach((month,index) => {
    const x = 22.5+(index%3)*269.53;
    const name = month.querySelector("h2").textContent;
    text(name[0].toLocaleUpperCase("es")+name.slice(1),x,top,9,"SemiBold");
    const table = month.querySelector("table");
    if (!table) text("Sin semanas registradas",x,top+16,8);
    else Array.from(table.rows).forEach((row,r) => {
      const y = top+3+r*rowHeight;
      let left = x;
      Array.from(row.cells).forEach((entry,c) => {
        const w = c===0 ? 28.5 : 32.75;
        const ribbon = r>0 && c===0;
        const style = entry.style;
        cell(left,y,w,rowHeight,r===0?"#f4f7fa":ribbon?style.getPropertyValue("--ribbon-color").trim():"#ffffff");
        let color = r===0?"#495669":ribbon?style.getPropertyValue("--ribbon-ink").trim():ink;
        if (entry.classList.contains("calendar-sunday")) color="#c33737";
        if (entry.classList.contains("calendar-outside")) color=entry.classList.contains("calendar-sunday")?"#e9b7b7":"#adb4bd";
        text(entry.textContent.toLocaleUpperCase("es"),left+w/2,y+rowHeight*.76,ribbon?9:8,r===0?"SemiBold":ribbon?"Bold":"Regular",color,"center");
        left+=w;
      });
    });
    if(index%3===2) top+=26+rowHeight*quarterRows[Math.floor(index/3)]+gap;
  });
  doc.setDrawColor(border).line(22.5,531,752,531);
  const ribbons=Array.from(card.querySelectorAll(".planning-key li"));
  ribbons.forEach((item,index)=>{
    const x=28+index*725/ribbons.length;
    const swatch=item.querySelector("rect");
    doc.setDrawColor(swatch.getAttribute("stroke")).setFillColor(swatch.getAttribute("fill")).setLineWidth(.9).roundedRect(x,540,6,19,1.3,1.3,"FD");
    text(item.querySelector("strong").textContent,x+12,547,8.5,"Bold");
    text(item.querySelector("span").textContent,x+12,557,8);
  });
  doc.addImage(signature,"PNG",764,537,20,20);
  text("SIAL",819,555,13,"Bold",blue,"right");
  doc.save("Calendario-bananero-"+year+".pdf");
}
