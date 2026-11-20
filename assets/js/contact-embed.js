(() => {
  const frame=document.querySelector('.servicem8-frame');
  const status=document.querySelector('.servicem8-loading');
  if (!frame || !status) return;
  // The vendor frame is cross-origin. Keep its separate full-page link visible
  // at all times, including when browser privacy settings prevent the embed.
  const timer=setTimeout(()=>{status.hidden=true;},8000);
  frame.addEventListener('load',()=>{clearTimeout(timer);status.hidden=true;},{once:true});
  if (document.readyState!=='complete') status.hidden=false;
})();
