(() => {
 const grid=document.querySelector('.statement-grid');
 const slogan=grid.querySelector('.slogan');
 const first=slogan.querySelector('span');
 let queued=false;
 function fit(){
  queued=false;
  let low=20,high=68;
  for(let i=0;i<12;i++){
   const mid=(low+high)/2;
   slogan.style.fontSize=mid+'px';
   if(first.scrollWidth<=slogan.clientWidth)low=mid;else high=mid;
  }
  slogan.style.fontSize=low+'px';
  grid.style.setProperty('--slogan-height',slogan.getBoundingClientRect().height+'px');
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(fit);}}
 new ResizeObserver(schedule).observe(grid);
 document.fonts.ready.then(schedule);
 schedule();
})();
