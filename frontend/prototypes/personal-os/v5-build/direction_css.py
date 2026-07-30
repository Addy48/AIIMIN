"""Direction-specific CSS — appended to opus design system."""

V5_CSS = """
/* === V5 direction layers (palette-locked) === */
.msg.ai .ava{background:linear-gradient(140deg,#ff8c5f,#ff6b35);color:#fff;}
.flame-stat{width:52px;height:52px;border-radius:14px;display:grid;place-items:center;
  background:var(--accent-soft);font-family:var(--font-display);font-weight:700;font-size:22px;color:var(--accent);}
.bottomnav-4 .navitem{flex:1;}
.bottomnav-4 .fab{display:none;}
.hub-bar{display:flex;gap:6px;padding:10px 16px 14px;background:var(--nav-blur);
  backdrop-filter:blur(20px);border-top:1px solid var(--border);flex:0 0 auto;}
.hub-btn{flex:1;height:44px;border-radius:var(--r-full);font-size:12px;font-weight:700;
  color:var(--text-3);background:var(--surface-2);border:1px solid var(--border);transition:all var(--t2) var(--ease);}
.hub-btn.on,.hub-btn:active{background:var(--accent);color:#fff;border-color:var(--accent);}
.board-cols{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;min-height:340px;}
.board-col{background:var(--surface-2);border:1px solid var(--border);border-radius:var(--r-md);padding:10px;min-height:180px;}
.board-col-h{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--text-3);margin-bottom:10px;display:flex;justify-content:space-between;}
.board-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:12px;margin-bottom:8px;cursor:grab;box-shadow:var(--shadow-card);transition:transform var(--t2) var(--ease),border-color var(--t2);}
.board-card:active{cursor:grabbing;transform:scale(.98);}
.board-card b{display:block;font-size:13px;margin-bottom:4px;color:var(--text-1);}
.board-card p{font-size:11px;color:var(--text-3);margin:0;}
.board-card.pinned{border-color:var(--accent-line);box-shadow:0 0 0 1px var(--accent-soft);}
.layout-switch{display:flex;gap:8px;padding:0 0 14px;}
.timeline-nav{display:flex;gap:8px;padding:0 0 16px;}
.timeline-spine{position:relative;padding-left:28px;padding-bottom:20px;}
.timeline-spine::before{content:'';position:absolute;left:8px;top:0;bottom:0;width:2px;background:var(--border);}
.tl-now{font-size:12px;font-weight:700;color:var(--accent);margin-bottom:16px;display:flex;align-items:center;gap:8px;}
.pulse-dot{width:10px;height:10px;border-radius:50%;background:var(--accent);animation:pulseDot 1.4s ease infinite;}
@keyframes pulseDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.85)}}
.tl-block{position:relative;margin-bottom:18px;padding-left:8px;scroll-snap-align:start;}
.tl-block time{font-size:11px;color:var(--text-3);font-weight:600;}
.tl-card{margin-top:6px;padding:12px 14px;border-radius:14px;background:var(--surface);border:1px solid var(--border);}
.tl-card.accent{border-color:var(--accent-line);box-shadow:0 0 0 1px var(--accent-soft);}
.tl-block.locked .tl-card{opacity:.65;border-style:dashed;}
.tl-block.done .tl-card{opacity:.72;}
.rail-actions-v3{display:flex;gap:10px;padding:12px 16px 16px;background:var(--nav-blur);
  backdrop-filter:blur(20px);border-top:1px solid var(--border);flex:0 0 auto;}
.pulse-tabs-v3{display:flex;margin:0 16px 12px;background:var(--surface-2);border-radius:var(--r-full);padding:3px;border:1px solid var(--border);}
.pulse-tabs-v3 button{flex:1;height:44px;border-radius:var(--r-full);font-size:13px;font-weight:700;color:var(--text-3);}
.pulse-tabs-v3 button.on{background:var(--accent);color:#fff;}
.spatial-toolbar{display:flex;align-items:center;gap:8px;padding:12px 16px 8px;flex:0 0 auto;}
.spatial-wrap{flex:1;overflow:hidden;touch-action:none;position:relative;background:var(--sunken);min-height:0;}
.spatial-canvas{position:absolute;inset:0;width:100%;height:100%;transition:transform .2s var(--ease);transform-origin:center center;}
.s-node{position:absolute;width:92px;padding:12px 10px;border-radius:16px;background:var(--surface);
  border:1px solid var(--border);box-shadow:var(--shadow-card);text-align:center;cursor:pointer;transition:transform var(--t2) var(--ease);}
.s-node:active{transform:scale(.96);}
.s-node span{display:block;font-size:12px;font-weight:700;color:var(--text-1);}
.s-node small{font-size:10px;color:var(--text-3);}
.s-node.core{border-color:var(--accent);background:var(--accent-soft);}
.s-edges{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;}
.spatial-minimap{position:absolute;right:16px;bottom:88px;width:56px;height:80px;border-radius:10px;
  background:var(--surface);border:1px solid var(--border);opacity:.85;z-index:10;}
.cmd-palette{position:absolute;left:16px;right:16px;top:18%;z-index:200;background:var(--elevated);
  border:1px solid var(--border);border-radius:var(--r-lg);padding:12px;box-shadow:var(--shadow-pop);
  opacity:0;visibility:hidden;transform:translateY(-8px);transition:all var(--t2) var(--ease);}
.cmd-palette.show{opacity:1;visibility:visible;transform:none;}
.cmd-palette input{width:100%;padding:12px 14px;border-radius:12px;border:1px solid var(--border);
  background:var(--surface-2);color:var(--text-1);margin-bottom:8px;font-size:14px;}
.cmd-item{padding:12px 10px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;transition:background var(--t2);}
.cmd-item:hover,.cmd-item:active{background:var(--accent-soft);color:var(--accent);}
.tier-card{padding:16px;border-radius:var(--r-md);border:1px solid var(--border);background:var(--surface);margin-bottom:10px;}
.tier-card.current{border-color:var(--accent-line);box-shadow:0 0 0 1px var(--accent-soft);}
.tier-card h4{margin:0 0 4px;font-family:var(--font-display);font-size:16px;color:var(--text-1);}
.tier-card .price{font-size:22px;font-weight:700;color:var(--accent);font-family:var(--font-display);}
.tier-card .note{font-size:12px;color:var(--text-3);margin:4px 0 10px;}
.tier-card ul{margin:0;padding-left:18px;font-size:12px;color:var(--text-2);line-height:1.55;}
.tier-card .badge{display:inline-block;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;
  padding:4px 8px;border-radius:99px;background:var(--accent-soft);color:var(--accent);margin-bottom:8px;}
.chat-shell{flex:1;display:flex;flex-direction:column;min-height:0;border-radius:var(--r-lg);border:1px solid var(--border);
  background:var(--surface);overflow:hidden;margin-bottom:0;}
.chat-thread{flex:1;overflow-y:auto;padding:14px 16px;}
.screen-timeline{scroll-snap-type:y proximity;}
.mission-metric{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.mission-metric .stat{margin:0;}
"""
