import {readFileSync,writeFileSync,mkdirSync,copyFileSync} from 'node:fs';
const root = 'videos/spain-housing-long';
const story = JSON.parse(readFileSync(`${root}/story.json`,'utf8'));
const request = {provider:'kokoro',voice:'bm_george',lang:'en',speed:1,bgm:{mode:'none'},lines:[{id:'long',text:story.scenes.map(s=>s.text).join('\n\n')},{id:'short',text:story.short.map(s=>s.text).join('\n\n')}]};
writeFileSync(`${root}/audio_request.json`,JSON.stringify(request,null,2));
for (const [key,seconds,name] of [['scenes',300,'long'],['short',50,'short']]) {
  const project=`videos/spain-housing-${name}`;
  mkdirSync(`${project}/.hyperframes`,{recursive:true});
  writeFileSync(`${project}/narration.txt`,story[key].map(s=>s.text).join('\n\n'));
  if(name==='short')copyFileSync(`${root}/design.md`,`${project}/design.md`);
  writeFileSync(`${project}/BRIEF.md`,`# Spain's housing paradox\n\nLanguage: English, explicitly selected by user.\nDuration: ${seconds}s.\nFormat: ${name==='long'?'1920×1080':'1080×1920'}.\nVoice generated locally. HyperFrames composition. Publication requested on ${name==='long'?'YouTube':'YouTube Shorts, Instagram and TikTok'}.\nStyle inferred: documentary with original animated illustrations.\nPublication access pending; YouTube browser session signed out. Instagram and TikTok profiles not yet identified.\n`);
  writeFileSync(`${project}/.hyperframes/expanded-prompt.md`, `# ${story.title}\n\nDesign: charcoal #191D21, paper #F1EBDD, vermilion #FF714F. Barlow Condensed 800, IBM Plex Mono 400, Georgia.\nRhythm: hook—evidence—paradox—explain—human consequence—resolve.\nThree depth planes: moving architectural linework behind, hero diagrams and short type in the middle, labels and a red connecting thread in front. Sources stay legible. Primary push transition 0.45s; related ideas crossfade 0.5s. Caption timing comes from local speech recognition checked against the script. Avoid unsupported claims, stock-photo fakery, arbitrary bouncy motion and dense slides.\n\n`+story[key].map((s,i)=>`## Scene ${i+1}: ${s.title}\nConcept: ${s.text}\nMood: architectural dossier, precise and humane.\nForeground: ${s.stat}; attribution ${s.source}.\nMidground: ${s.kind} illustration; lines draw, figures slide and structural pieces rise.\nBackground: drifting building silhouettes, a thin moving vermilion thread, registration lines.\nChoreography: title settles from left with expo.out; diagram unfolds with power3.out; data annotation fades with sine.out. Hold for narration with slow diagram motion.\nTransition: ${i%3===0?'directional push, 0.45s, power3.inOut':'crossfade, 0.5s, power2.inOut'}.\n`).join('\n'));
  console.log(`${name}: ${story[key].length} scenes, ${story[key].map(s=>s.text).join(' ').split(/\s+/).length} words`);
}
