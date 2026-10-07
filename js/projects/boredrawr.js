(() => {
 const grid=document.querySelector('.statement-grid');
 const slogan=grid.querySelector('.slogan');
 const lines=Array.from(slogan.children);
 let queued=false;
 function fit(){
  queued=false;
  let low=20,high=68;
  for(let i=0;i<12;i++){
   const mid=(low+high)/2;
   slogan.style.fontSize=mid+'px';
   if(lines.every(line=>line.scrollWidth<=slogan.clientWidth))low=mid;else high=mid;
  }
  slogan.style.fontSize=low+'px';
  grid.style.setProperty('--slogan-height',slogan.getBoundingClientRect().height+'px');
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(fit);}}
 new ResizeObserver(schedule).observe(grid);
 document.fonts.ready.then(schedule);
 schedule();
})();

// Image enlargement is available on desktop only.
(() => {
 const dialog=document.getElementById('projectImageDialog');
 const image=dialog.querySelector('img');
 const desktop=window.matchMedia('(min-width:651px)');
 document.querySelectorAll('.image-zoom-trigger').forEach(button => {
  button.addEventListener('click',() => {
   if(!desktop.matches)return;
   const source=button.parentElement.querySelector('img');
   image.src=source.currentSrc||source.src;
   image.alt=source.alt;
   dialog.showModal();
  });
 });
 dialog.querySelector('.image-dialog-close').addEventListener('click',() => dialog.close());
 dialog.addEventListener('click',event => {if(event.target===dialog)dialog.close();});
 desktop.addEventListener('change',() => {if(!desktop.matches&&dialog.open)dialog.close();});
})();
