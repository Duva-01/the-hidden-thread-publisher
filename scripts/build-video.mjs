import {readFileSync,writeFileSync,mkdirSync,copyFileSync} from 'node:fs';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const colors={ink:'#191D21',paper:'#F1EBDD',red:'#FF714F',muted:'#BEB8AA',grid:'#343A40'};
const line=(x1,y1,x2,y2,c='currentColor',w=3)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}"/>`;
const text=(x,y,t,size=28,anchor='start',cls='')=>`<text class="${cls}" x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" fill="currentColor">${esc(t)}</text>`;
function house(x,y,size=90,accent=false){return `<g class="unit" transform="translate(${x} ${y})"><path d="M0 ${size*.38} L${size*.5} 0 L${size} ${size*.38} V${size} H0Z" fill="${accent?colors.red:'none'}" stroke="currentColor" stroke-width="3"/><path d="M${size*.39} ${size} V${size*.57} H${size*.64} V${size}" fill="none" stroke="currentColor" stroke-width="3"/></g>`;}
function apartment(x,y,w,h){let windows='';for(let r=0;r<Math.floor((h-40)/48);r++)for(let c=0;c<Math.floor((w-24)/38);c++)windows+=`<rect class="window" x="${14+c*38}" y="${18+r*48}" width="19" height="25" fill="${(c+r)%4===0?colors.red:'none'}" stroke="currentColor" stroke-width="2"/>`;return `<g class="building" transform="translate(${x} ${y})"><rect width="${w}" height="${h}" fill="${colors.ink}" stroke="currentColor" stroke-width="3"/>${windows}</g>`;}
function diagram(kind){
  let d='';
  if(['city','price','end'].includes(kind)){
    d=apartment(45,155,170,330)+apartment(245,65,205,420)+apartment(490,220,165,265)+line(15,486,705,486);
    if(kind==='price')d+=`<path class="draw red" d="M30 390 L190 343 L325 277 L467 219 L675 95" fill="none" stroke="${colors.red}" stroke-width="9"/><path d="M638 98 L680 92 L673 133" fill="none" stroke="${colors.red}" stroke-width="9"/>`;
    else d+=`<path class="draw" d="M5 533 H200 V310 H280 V525 H715" fill="none" stroke="${colors.red}" stroke-width="7"/>`;
  }else if(kind==='bars'){
    d=line(70,470,660,470)+`<rect class="bar" x="155" y="147.5" width="140" height="322.5" fill="currentColor"/><rect class="bar" x="420" y="165" width="140" height="305" fill="${colors.red}"/>`+text(225,115,'12.9%',50,'middle')+text(490,130,'12.2%',50,'middle')+text(225,520,'Q1 2026',28,'middle')+text(490,520,'Q2 2026',28,'middle');
  }else if(['money','deposit'].includes(kind)){
    d=house(290,25,155,true)+line(367,195,367,270,colors.red,5)+line(140,270,595,270,colors.red,5);
    for(let i=0;i<2;i++){let x=65+i*355;d+=`<g class="unit"><rect x="${x}" y="310" width="290" height="150" rx="0" fill="none" stroke="currentColor" stroke-width="3"/>${text(x+145,370,i?'AFTER':'BEFORE',24,'middle')}${text(x+145,430,kind==='money'?(i?'€224,400':'€200,000'):(i?'€44,880':'€40,000'),42,'middle')}</g>`;}
    d+=text(367,535,kind==='money'?'+€24,400':'ASSUMED DEPOSIT: 20%',34,'middle');
  }else if(['balance','gap','empty'].includes(kind)){
    for(let r=0;r<3;r++)for(let c=0;c<5;c++)d+=house(62+c*130,60+r*145,80,(r+c)%3===0);
    d+=text(367,550,kind==='empty'?'BUILDINGS ≠ AVAILABLE HOMES':kind==='gap'?'CUMULATIVE FLOW IMBALANCE':'ILLUSTRATION · NOT ONE ICON PER HOME',24,'middle');
  }else if(kind==='map'){
    d=house(40,85,135)+apartment(455,170,180,280)+`<path class="draw" d="M112 250 C90 420 190 500 335 400 S570 520 540 110" stroke="${colors.red}" stroke-width="7" stroke-dasharray="12 10" fill="none"/>`+text(110,60,'VACANT',27,'middle')+text(545,490,'JOBS',30,'middle')+text(260,545,'DISTANCE IS A BARRIER',25,'middle');
  }else if(kind==='keys'){
    d=`<g class="unit"><circle cx="210" cy="210" r="110" fill="none" stroke="currentColor" stroke-width="13"/><circle cx="210" cy="210" r="32" fill="${colors.red}"/><path d="M290 290 L535 535 M445 445 L495 395 M490 490 L540 440" fill="none" stroke="currentColor" stroke-width="20"/></g>`+text(400,170,'REPAIRS',30)+text(400,220,'OFFERED',30)+text(400,270,'REACHABLE',30);
  }else if(['uses','access','levers','thread'].includes(kind)){
    const labels={uses:['LIVE','VISIT','INVEST'],access:['SUITABLE','REACHABLE','AFFORDABLE'],levers:['SUPPLY','PROTECTION','ACCESS'],thread:['HOMES','PLACES','BUDGETS']}[kind];
    const points=[[140,140],[570,280],[190,465]];
    d=`<path class="draw" d="M140 140 C570 70 675 390 190 465" fill="none" stroke="${colors.red}" stroke-width="8"/>`;
    points.forEach(([x,y],i)=>{d+=`<g class="unit"><circle cx="${x}" cy="${y}" r="67" fill="${colors.ink}" stroke="currentColor" stroke-width="3"/>${text(x,y+15,String(i+1).padStart(2,'0'),45,'middle')}${text(x,y+111,labels[i],28,'middle')}</g>`;});
  }else if(kind==='loop'){
    d=`<path class="draw" d="M350 65 C720 65 720 520 350 520 C-20 520 -20 65 350 65" fill="none" stroke="${colors.red}" stroke-width="6"/>`;
    [[350,70,'RENT'],[565,330,'SAVINGS'],[180,455,'DEPOSIT']].forEach(([x,y,t])=>d+=`<g class="unit"><rect x="${x-110}" y="${y-35}" width="220" height="70" fill="${colors.ink}"/>${text(x,y+12,t,32,'middle')}</g>`);
    d+=house(285,230,130,true);
  }else if(kind==='build'){
    d=apartment(180,250,220,240)+line(520,35,520,510,colors.red,9)+line(325,65,690,65,colors.red,9)+line(350,65,350,195,colors.red,4)+line(325,195,375,195,colors.red,6)+text(367,555,'TIME IS PART OF THE COST',28,'middle');
  }
  return `<svg viewBox="0 0 735 600" role="img" aria-label="${esc(kind)} conceptual illustration"><g fill="none" color="${colors.paper}" font-family="IBM Plex Mono">${d}</g></svg>`;
}
for(const name of ['long','short']){
 const project=`videos/spain-housing-${name}`;
 const {duration,scenes,captions}=JSON.parse(readFileSync(`${project}/timing.json`,'utf8'));
 const portrait=name==='short',W=portrait?1080:1920,H=portrait?1920:1080;
 mkdirSync(`${project}/assets`,{recursive:true});
 for(const [src,dst] of [['gsap/dist/gsap.min.js','gsap.min.js'],['@fontsource/barlow-condensed/files/barlow-condensed-latin-800-normal.woff2','display.woff2'],['@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2','mono.woff2']])copyFileSync(`.tools/render/node_modules/${src}`,`${project}/assets/${dst}`);
 const sceneHTML=scenes.map((s,i)=>`<section id="scene-${i}" class="scene ${!portrait&&i%4===2?'reverse':''}" style="z-index:${i+1};opacity:${i?0:1}">
 <div class="architecture" data-layout-ignore><span class="ghost">${String(i+1).padStart(2,'0')}</span><div class="bgline"></div></div>
 <div class="scene-content"><div class="eyebrow">${esc(s.label||'THE HIDDEN THREAD / SPAIN')}</div><div class="rule"></div><div class="main"><div class="words"><h1>${esc(s.title)}</h1><div class="stat ${s.stat.length>19?'small':''}">${esc(s.stat)}</div><p class="annotation">${esc(i===0?'The system behind the headline.':s.kind==='empty'?'A historical count. A present-day question.':s.kind==='map'?'The right home. In the right place.':s.kind==='money'||s.kind==='deposit'?'A moving barrier to entry.':'Follow the connection.')}</p></div><div class="visual">${diagram(s.kind)}</div></div><div class="source">${esc(s.source)}</div></div></section>`).join('');
 const capHTML=captions.map((c,i)=>`<div id="cap-${i}" class="caption" style="opacity:0">${esc(c.text)}</div>`).join('');
 const sfx=JSON.parse(readFileSync(`${project}/sound-design.json`,'utf8')).sfx;
 const soundHTML=sfx.map((s,i)=>`<audio id="sfx-${i}" src="${s.file}" data-start="${scenes.find(x=>x.id===s.id).start+.12}" data-duration="${s.duration_s}" data-track-index="${31+i}" data-volume="0.13"></audio>`).join('');
 const html=`<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Spain's Housing Paradox — ${name}</title><script src="assets/gsap.min.js"></script><style>
 @font-face{font-family:'Barlow Condensed';src:url('assets/display.woff2')}@font-face{font-family:'IBM Plex Mono';src:url('assets/mono.woff2')}
 *{box-sizing:border-box}html,body{margin:0;width:${W}px;height:${H}px;overflow:hidden;background:${colors.ink};color:${colors.paper}}#root{position:relative;width:${W}px;height:${H}px;overflow:hidden;font-family:'Barlow Condensed',sans-serif}
 .scene{position:absolute;inset:0;background:${colors.ink};overflow:hidden}.scene-content{position:relative;width:100%;height:100%;padding:${portrait?'145px 95px 490px':'85px 110px 175px'};display:flex;flex-direction:column;gap:${portrait?28:22}px}
 .eyebrow{font:24px 'IBM Plex Mono';letter-spacing:3px;color:${colors.muted}}.rule{height:3px;background:${colors.red};transform-origin:left}
 .main{flex:1;min-height:0;display:flex;gap:55px;align-items:center}.words{width:50%;flex-shrink:0;display:flex;flex-direction:column;gap:28px}.visual{flex:1;min-width:0}.visual svg{width:100%;display:block;overflow:visible}h1{font-size:128px;line-height:.94;letter-spacing:-2px;margin:0;font-weight:800;max-width:100%}
 .stat{color:${colors.red};font-size:92px;line-height:1.03;font-variant-numeric:tabular-nums;max-width:100%;overflow-wrap:normal}.stat.small{font-size:60px}.annotation{font-family:Georgia,serif;font-size:32px;line-height:1.2;color:${colors.muted};max-width:700px;margin:0}.source{font:24px/1.4 'IBM Plex Mono';color:${colors.muted};max-width:1550px}
 .reverse .main{flex-direction:row-reverse}.architecture{position:absolute;inset:0;overflow:hidden;opacity:.22}.ghost{position:absolute;right:60px;top:-110px;font-size:720px;line-height:1;color:${colors.grid}}.bgline{position:absolute;left:6%;top:46%;width:90%;height:2px;background:${colors.muted};transform:rotate(-9deg)}
 .branding{position:absolute;left:${portrait?95:110}px;bottom:${portrait?210:55}px;z-index:90;font:22px 'IBM Plex Mono';color:${colors.muted};letter-spacing:3px}.progress{position:absolute;bottom:0;left:0;height:6px;width:100%;transform-origin:left;background:${colors.red};z-index:100}
 .caption{position:absolute;z-index:95;left:${portrait?85:150}px;right:${portrait?130:150}px;top:${portrait?1375:910}px;min-height:${portrait?180:75}px;display:flex;align-items:center;justify-content:center;text-align:center;font-family:'Barlow Condensed';font-size:${portrait?64:48}px;line-height:1.1;padding:12px 24px;background:${colors.ink};color:${colors.paper};max-width:${portrait?865:1620}px}
 ${portrait?`.main{flex-direction:column;align-items:stretch;gap:35px;justify-content:flex-start}.words{width:100%;gap:23px}.visual{flex:0;width:100%;height:550px}.visual svg{height:100%;width:100%}h1{font-size:112px;line-height:.96;letter-spacing:-1px}.stat{font-size:92px}.stat.small{font-size:68px}.annotation{font-size:31px}.source{font-size:25px;line-height:1.45}.scene-content{padding-bottom:600px}.eyebrow{font-size:23px;letter-spacing:1px}`:''}
 </style></head><body><div id="root" data-composition-id="main" data-width="${W}" data-height="${H}" data-start="0" data-duration="${duration}">${sceneHTML}<div class="branding">THE HIDDEN THREAD / 2026</div>${capHTML}<div class="progress"></div><audio id="narration" src="assets/narration.wav" data-start="0" data-duration="${duration}" data-track-index="30" data-volume="1"></audio>${soundHTML}</div>
 <script>window.__timelines=window.__timelines||{};const tl=gsap.timeline({paused:true});const scenes=${JSON.stringify(scenes.map(s=>({start:s.start,end:s.end})))},captions=${JSON.stringify(captions)};
 scenes.forEach((s,i)=>{const q='#scene-'+i, t=s.start+.22, dur=s.end-s.start;
 if(i){const old='#scene-'+(i-1);if(i%3===0){tl.to(old,{x:-${W},duration:.45,ease:'power3.inOut'},s.start);tl.fromTo(q,{x:${W},opacity:1},{x:0,opacity:1,duration:.45,ease:'power3.inOut',immediateRender:false},s.start)}else{tl.to(old,{opacity:0,duration:.5,ease:'power2.inOut'},s.start);tl.fromTo(q,{opacity:0},{opacity:1,duration:.5,ease:'power2.inOut',immediateRender:false},s.start)}tl.set(old,{opacity:0},s.start+.51)}
 tl.fromTo(q+' h1',{x:-55,opacity:0},{x:0,opacity:1,duration:.8,ease:'expo.out',immediateRender:false},t);
 tl.fromTo(q+' .eyebrow',{opacity:0},{opacity:1,duration:.45,ease:'sine.out',immediateRender:false},t+.12);
 tl.fromTo(q+' .rule',{scaleX:0},{scaleX:1,duration:.7,ease:'power2.out',immediateRender:false},t+.2);
 tl.fromTo(q+' .stat',{y:35,opacity:0},{y:0,opacity:1,duration:.65,ease:'power3.out',immediateRender:false},t+.45);
 tl.fromTo(q+' .annotation',{opacity:0},{opacity:1,duration:.8,ease:'sine.out',immediateRender:false},t+.7);
 tl.fromTo(q+' .source',{opacity:0},{opacity:1,duration:.4,ease:'power1.out',immediateRender:false},t+.7);
 tl.fromTo(q+' .visual',{y:35,opacity:0},{y:0,opacity:1,duration:1,ease:'power3.out',immediateRender:false},t+.28);
 const units=document.querySelectorAll(q+' .unit,'+q+' .building,'+q+' .bar');if(units.length)tl.fromTo(units,{opacity:0},{opacity:1,duration:.6,stagger:Math.min(.3,(dur*.45)/units.length),ease:'power1.out',immediateRender:false},t+.6);
 const paths=document.querySelectorAll(q+' .draw');paths.forEach(path=>{const length=path.getTotalLength();tl.fromTo(path,{strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,duration:Math.min(6,dur*.5),ease:'power2.inOut',immediateRender:false},t+1)});
 tl.to(q+' .architecture',{x:i%2?35:-35,y:i%2?-15:15,duration:Math.max(.2,dur-.3),ease:'none'},s.start+.1);
 tl.to(q+' .visual svg',{y:i%2?8:-8,duration:Math.max(.2,dur-1.8),ease:'sine.inOut'},t+1.3);
 });
 captions.forEach((c,i)=>{tl.set('#cap-'+i,{opacity:1},c.start);tl.set('#cap-'+i,{opacity:0},c.end)});
 tl.fromTo('.progress',{scaleX:0},{scaleX:1,duration:${duration},ease:'none'},0);tl.to('#scene-${scenes.length-1}',{opacity:0,duration:.5,ease:'power2.in'},${duration-.5});window.__timelines.main=tl;
 </script></body></html>`;
 writeFileSync(`${project}/index.html`,html);
 console.log(`Built ${name}: ${scenes.length} scenes / ${captions.length} captions / ${duration}s`);
}
