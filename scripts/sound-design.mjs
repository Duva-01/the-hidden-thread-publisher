import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {resolveSfx} from 'file:///C:/Users/Usuario/.codex/skills/hyperframes-media/scripts/lib/sfx.mjs';
for(const name of ['long','short']){
 const project=resolve(`videos/spain-housing-${name}`);
 const {scenes}=JSON.parse(readFileSync(`${project}/timing.json`,'utf8'));
 const cues=scenes.filter((s,i)=>i%3===0||i===1).map((s,i)=>({id:s.id,name:i===0?'impact-bass-1':'whoosh-short'}));
 const result=await resolveSfx({cues,heygenOK:false,headers:null,hyperframesDir:project,sfxLibDir:'C:/Users/Usuario/.codex/skills/media-use/audio/assets/sfx'});
 writeFileSync(`${project}/sound-design.json`,JSON.stringify(result,null,2));
 console.log(`${name}: ${result.sfx.length} local transition accents`);
}
