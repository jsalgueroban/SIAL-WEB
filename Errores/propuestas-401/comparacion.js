const observer=new ResizeObserver(entries=>{
  for(const {target,contentRect} of entries)target.style.setProperty('--preview-scale',String(contentRect.width/1440));
});
document.querySelectorAll('.review-preview').forEach(element=>observer.observe(element));
