import {createRequire} from 'node:module';
const require=createRequire(new URL('../.tools/render/package.json',import.meta.url));
const puppeteer=require('puppeteer-core');
const sharp=require('sharp');
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--allow-file-access-from-files','--disable-gpu'],protocolTimeout:30000});
console.log('Snapshot browser ready');
try{
 for(const name of ['long','short']){
  const project=resolve(`videos/spain-housing-${name}`),portrait=name==='short';
  const timing=JSON.parse(readFileSync(`${project}/timing.json`,'utf8'));
  mkdirSync(`${project}/snapshots`,{recursive:true});
  const page=await browser.newPage();await page.setViewport({width:portrait?1080:1920,height:portrait?1920:1080});
  await page.goto(pathToFileURL(`${project}/index.html`).href,{waitUntil:'domcontentloaded',timeout:30000});await page.evaluate(()=>document.fonts.ready.then(()=>true));console.log(`${name}: fonts ready`);
  const tiles=[];const width=portrait?270:480,height=portrait?480:270,cols=portrait?5:4;
  for(const [i,s] of timing.scenes.entries()){
   await page.evaluate(t=>{window.__timelines.main.seek(t)},(s.start+s.end)/2);
   const buffer=await page.screenshot({path:`${project}/snapshots/scene-${String(i+1).padStart(2,'0')}.png`});
   tiles.push({input:await sharp(buffer).resize(width,height).toBuffer(),left:(i%cols)*width,top:Math.floor(i/cols)*height});
  }
  await sharp({create:{width:width*cols,height:height*Math.ceil(tiles.length/cols),channels:3,background:'#191D21'}}).composite(tiles).jpeg({quality:88}).toFile(`${project}/contact-sheet.jpg`);
  if(!portrait){await page.evaluate(()=>{window.__timelines.main.seek(4);document.querySelectorAll('.caption').forEach(e=>e.style.opacity=0)});await page.screenshot({path:`${project}/thumbnail.png`});}
  await page.close();console.log(`${name}: captured ${tiles.length} scene midpoints`);
 }
}finally{await browser.close()}
