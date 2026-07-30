"""v4 polish — responsive shell, motion, touch feedback, interaction fixes."""

POLISH_CSS = """
/* === V4 POLISH: responsive + motion + touch === */
:root{
  --t-fast:120ms;--t-med:200ms;--t-slow:280ms;
  --spring:cubic-bezier(.34,1.4,.64,1);
  --ease-out:cubic-bezier(.22,1,.36,1);
}
.app-shell{
  width:100%;max-width:min(100vw,430px);margin:0 auto;
  height:100dvh;min-height:100dvh;min-height:-webkit-fill-available;
  -webkit-tap-highlight-color:transparent;touch-action:manipulation;
}
@media(min-width:480px){
  body{background:#121212;}
  .app-shell{
    margin-top:max(0px,calc((100dvh - min(100dvh,920px))/2));
    height:min(100dvh,920px);border-radius:0 0 28px 28px;
    box-shadow:0 40px 100px -30px rgba(0,0,0,.8);
  }
}
@media(min-width:768px){
  .app-shell{max-width:390px;border-radius:32px;margin-top:24px;height:min(844px,92dvh);}
}
#app{display:flex;flex-direction:column;flex:1;min-height:0;overflow:hidden;}
.screens{contain:layout style;}
.screen{
  padding:2px 20px calc(112px + env(safe-area-inset-bottom,0px));
  scroll-behavior:smooth;-webkit-overflow-scrolling:touch;
  will-change:opacity,transform;
  transition:opacity var(--t-fast) var(--ease-out),transform var(--t-med) var(--spring),visibility var(--t-fast);
}
.screen.screen-exit{opacity:0;transform:translateX(-12px);pointer-events:none;}
.screen.screen-enter{animation:screenIn var(--t-med) var(--spring) both;}
@keyframes screenIn{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:none}}
.subscreen{
  transition:transform var(--t-med) var(--spring);
  padding-bottom:calc(48px + env(safe-area-inset-bottom,0px));
}
.subscreen.sub-exit{transform:translateX(100%);}
.topbar{position:sticky;top:0;z-index:40;backdrop-filter:blur(16px);background:color-mix(in srgb,var(--bg) 82%,transparent);}
.sync-banner{position:relative;z-index:39;flex-shrink:0;}
.bottomnav,.hub-bar,.rail-actions-v3{
  position:relative;z-index:50;
  transform:translateZ(0);
  transition:transform var(--t-fast) var(--ease-out);
}
.bottomnav .navitem{position:relative;transition:color var(--t-fast),transform var(--t-fast) var(--spring);}
.bottomnav .navitem:active{transform:scale(.92);}
.bottomnav .navitem.active::after{
  content:'';position:absolute;bottom:2px;left:50%;width:4px;height:4px;
  border-radius:50%;background:var(--accent);transform:translateX(-50%);
  animation:navPop var(--t-med) var(--spring);
}
@keyframes navPop{from{transform:translateX(-50%) scale(0)}to{transform:translateX(-50%) scale(1)}}
.btn,.icon-btn,.hub-btn,.pin-key,.pick-card,.persona-chip,.cmd-item,.board-card,.row,.note-card,.s-node{
  -webkit-tap-highlight-color:transparent;touch-action:manipulation;
}
.btn,.icon-btn,.hub-btn,.pin-key{transition:transform var(--t-fast) var(--spring),background var(--t-fast),border-color var(--t-fast),box-shadow var(--t-fast);}
.btn:active,.icon-btn:active,.hub-btn:active,.pin-key:active,.pick-card:active,.persona-chip:active{
  transform:scale(.96);
}
.row:active,.note-card:active,.cmd-item:active,.board-card:active{background:var(--surface-2);}
.card.list .row{animation:rowIn var(--t-med) var(--ease-out) both;}
.card.list .row:nth-child(1){animation-delay:20ms}
.card.list .row:nth-child(2){animation-delay:45ms}
.card.list .row:nth-child(3){animation-delay:70ms}
.card.list .row:nth-child(4){animation-delay:95ms}
.card.list .row:nth-child(5){animation-delay:120ms}
@keyframes rowIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
#drawer{transition:transform var(--t-med) var(--spring);}
#sheet{transition:transform var(--t-med) var(--spring);}
#scrim{transition:opacity var(--t-fast);}
#scrim.show{animation:scrimIn var(--t-fast) both;}
@keyframes scrimIn{from{opacity:0}to{opacity:1}}
.cmd-palette{transition:opacity var(--t-fast),transform var(--t-med) var(--spring),visibility var(--t-fast);}
.cmd-palette.show{animation:popIn var(--t-med) var(--spring);}
@keyframes popIn{from{opacity:0;transform:translateY(-12px) scale(.98)}to{opacity:1;transform:none}}
#toast{
  transition:opacity var(--t-fast),transform var(--t-med) var(--spring),visibility var(--t-fast)!important;
  pointer-events:none;
}
.prod-flows .flow{transition:opacity var(--t-med) var(--ease-out);}
.prod-flows .flow.flow-enter{animation:flowIn var(--t-med) var(--ease-out) both;}
@keyframes flowIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.ob-step{animation:flowIn var(--t-med) var(--ease-out) both;}
.ptour-card,.ptour-invite{animation:popIn var(--t-med) var(--spring);}
.drawer-head .osid,.profile-hero .osid{
  font-family:'JetBrains Mono',ui-monospace,monospace;font-size:11px;font-weight:700;
  color:var(--accent);letter-spacing:.04em;margin-top:4px;
}
.logo-mark,.splash-logo{flex-shrink:0;display:block;}
.brand .logo-mark{width:38px;height:38px;}
.chips{-webkit-overflow-scrolling:touch;scrollbar-width:none;}
.chips::-webkit-scrollbar{display:none;}
.screen.active .hero,.screen.active .page-head{animation:flowIn var(--t-med) var(--ease-out) both;}
.task-row.done .row-title{text-decoration:line-through;opacity:.55;transition:opacity var(--t-fast);}
.pbar i{transition:width var(--t-slow) var(--ease-out);}
.ripple-host{position:relative;overflow:hidden;}
.ripple{
  position:absolute;border-radius:50%;background:currentColor;opacity:.12;
  transform:scale(0);animation:ripple .5s var(--ease-out) forwards;pointer-events:none;
}
@keyframes ripple{to{transform:scale(4);opacity:0}}
@media(prefers-reduced-motion:reduce){
  .screen,.subscreen,#drawer,#sheet,.btn,.row{animation:none!important;transition-duration:.001ms!important;}
}
"""

POLISH_JS = """
/* === V4 POLISH: nav motion, ripple, drawer/sheet, dedupe fixes === */
(function(){
  const haptic=(ms)=>{try{navigator.vibrate&&navigator.vibrate(ms||8);}catch(e){}};
  let navLock=false;
  const prevGo=typeof go==='function'?go:null;
  if(prevGo){
    window.go=function(name){
      if(navLock)return;
      const cur=document.querySelector('.screen.active');
      const next=document.getElementById('screen-'+name);
      if(!next||cur===next){prevGo(name);return;}
      navLock=true;
      haptic(6);
      if(cur){
        cur.classList.add('screen-exit');
        cur.classList.remove('active');
      }
      setTimeout(()=>{
        document.querySelectorAll('.screen').forEach(s=>s.classList.remove('screen-exit','screen-enter'));
        prevGo(name);
        next.classList.add('screen-enter');
        setTimeout(()=>next.classList.remove('screen-enter'),220);
        navLock=false;
      },cur?90:0);
    };
  }
  const prevOpenSub=typeof openSub==='function'?openSub:null;
  if(prevOpenSub){
    window.openSub=function(id){
      haptic(6);
      prevOpenSub(id);
      const el=document.getElementById(id);
      if(el){el.style.transform='translateX(100%)';requestAnimationFrame(()=>{el.style.transform='';});}
    };
  }
  const prevCloseSub=typeof closeSub==='function'?closeSub:null;
  if(prevCloseSub){
    window.closeSub=function(id){
      const el=document.getElementById(id);
      if(el){
        el.classList.add('sub-exit');
        setTimeout(()=>{el.classList.remove('sub-exit','active');},180);
      }else prevCloseSub(id);
    };
  }
  const prevOpenDrawer=typeof openDrawer==='function'?openDrawer:null;
  if(prevOpenDrawer)window.openDrawer=function(){haptic(8);prevOpenDrawer();};
  const prevOpenSheet=typeof openSheet==='function'?openSheet:null;
  if(prevOpenSheet)window.openSheet=function(){haptic(8);prevOpenSheet();};
  const prevSetChip=typeof setChip==='function'?setChip:null;
  if(prevSetChip)window.setChip=function(btn){haptic(4);prevSetChip(btn);};
  document.addEventListener('click',e=>{
    const t=e.target.closest('.btn,.icon-btn,.hub-btn,.navitem,.row,.pick-card,.persona-chip,.cmd-item');
    if(!t||t.dataset.noRipple)return;
    const r=document.createElement('span');
    r.className='ripple';
    const rect=t.getBoundingClientRect();
    const size=Math.max(rect.width,rect.height);
    r.style.width=r.style.height=size+'px';
    r.style.left=(e.clientX-rect.left-size/2)+'px';
    r.style.top=(e.clientY-rect.top-size/2)+'px';
    if(getComputedStyle(t).position==='static')t.style.position='relative';
    t.classList.add('ripple-host');
    t.appendChild(r);
    setTimeout(()=>r.remove(),520);
  },{passive:true});
  const showFlowOrig=typeof showFlow==='function'?showFlow:null;
  if(showFlowOrig){
    window.showFlow=function(id){
      const flows=document.querySelectorAll('.prod-flows .flow');
      flows.forEach(f=>{if(f.classList.contains('active'))f.classList.remove('active','flow-enter');});
      showFlowOrig(id);
      const el=document.getElementById(id);
      if(el)el.classList.add('flow-enter');
    };
  }
  document.querySelectorAll('.bottomnav .navitem').forEach(n=>{
    n.addEventListener('click',()=>haptic(6),{passive:true});
  });
  if(typeof renderObStep==='function'){
    const ro=renderObStep;
    window.renderObStep=function(){
      const host=document.getElementById('obStepHost');
      if(host)host.style.animation='none';
      ro();
      if(host){void host.offsetWidth;host.style.animation='';}
    };
  }
})();
"""
