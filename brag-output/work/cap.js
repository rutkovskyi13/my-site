const {chromium}=require('playwright');const path=require('path');(async()=>{
const [mode,...rest]=process.argv.slice(2);
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('requestfailed',r=>errs.push('FAIL '+r.url()));
await p.goto('file://'+path.resolve('video.html'));
await p.evaluate(async()=>{await document.fonts.ready;
 const srcs=[...Array(24).keys()].map(i=>`assets/turn/${String(i).padStart(2,'0')}.webp`).concat([...Array(37).keys()].map(i=>`assets/point/${String(i).padStart(2,'0')}.webp`));
 await Promise.all(srcs.map(s=>{const im=new Image();im.src=s;return im.decode().catch(()=>{})}));});
const shot=async(t,f)=>{await p.evaluate(t=>window.render(t),t);await p.evaluate(()=>Promise.all([...document.images].filter(i=>i.offsetParent).map(i=>i.decode().catch(()=>{}))));await p.screenshot({path:f});};
if(mode==='stills'){for(const t of rest.map(Number)) await shot(t,`stills/t${t.toFixed(2)}.png`);}
else{const fps=30,dur=Number(rest[0]);for(let i=0;i<Math.round(fps*dur);i++){await shot(i/fps,`frames/f${String(i).padStart(4,'0')}.png`);}}
console.log('errors',JSON.stringify(errs));await b.close()})()
