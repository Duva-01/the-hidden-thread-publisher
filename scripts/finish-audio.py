"""Normalize duration and obtain local, word-timed captions for both cuts."""
import json, re, subprocess, difflib
from pathlib import Path
import soundfile as sf
from faster_whisper import WhisperModel

ROOT = Path(__file__).resolve().parents[1]
FFMPEG = next((ROOT / '.tools/ffmpeg').glob('*/bin/ffmpeg.exe'))
story = json.loads((ROOT / 'videos/spain-housing-long/story.json').read_text(encoding='utf-8'))
model = WhisperModel('small.en', device='cpu', compute_type='int8', cpu_threads=8, download_root=str(ROOT / '.tools/whisper'))
norm = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())

def stamp(t):
    ms = round(t * 1000)
    return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'

for name, key, total, lead in [('long','scenes',300,0.65), ('short','short',50,0.35)]:
    project = ROOT / f'videos/spain-housing-{name}'
    raw = ROOT / ('videos/spain-housing-long/assets/voice/long.wav' if name=='long' else 'videos/spain-housing-short/voice-raw.wav')
    info = sf.info(raw)
    target = total - lead - 0.75
    speed = info.duration / target
    if not 0.85 <= speed <= 1.2:
        raise RuntimeError(f'{name}: revise script before unnatural tempo adjustment {speed:.3f}')
    output = project / 'assets/narration.wav'
    output.parent.mkdir(parents=True,exist_ok=True)
    subprocess.run([str(FFMPEG),'-y','-v','error','-i',str(raw),'-af',f'atempo={speed},loudnorm=I=-16:TP=-1.5:LRA=7,adelay={round(lead*1000)}:all=1,apad','-t',str(total),'-ar','48000','-ac','1',str(output)],check=True)
    transcript_path = project / 'transcript.json'
    segments,_ = model.transcribe(str(output),language='en',word_timestamps=True,beam_size=5,vad_filter=True,initial_prompt='Spain. The Hidden Thread. Housing. INE. Banco de España.')
    words=[]
    for segment in segments:
        for word in segment.words:
            if word.word.strip():
                words.append({'id':f'w{len(words)}','text':word.word.strip(),'start':round(word.start,3),'end':round(word.end,3)})
    if name == 'long':
        # Full-length ASR omitted part of the closing question; a short crop recovers it.
        tail = project / 'assets/closing-review.wav'
        subprocess.run([str(FFMPEG),'-y','-v','error','-ss','285','-i',str(output),'-t','15',str(tail)],check=True)
        closing,_ = model.transcribe(str(tail),language='en',word_timestamps=True,beam_size=5,vad_filter=False,condition_on_previous_text=False)
        words=[w for w in words if w['start']<285]
        for segment in closing:
            for w in segment.words:
                start,end=285+float(w.start),285+float(w.end)
                if end <= start: start=max(285,start-.18)
                words.append({'text':w.word.strip(),'start':round(start,3),'end':round(end,3)})
    # ASR splits decimal and thousands punctuation into tokens; join them for clean captions.
    cleaned=[]
    for w in words:
        if cleaned and (re.match(r'^[.,]\d',w['text']) or w['text']=='%'):
            cleaned[-1]['text']+=w['text']
            cleaned[-1]['end']=w['end']
        elif cleaned and w['text'].startswith('-'):
            cleaned[-1]['text']+=w['text']
            cleaned[-1]['end']=w['end']
        else: cleaned.append(w)
    words=[dict(w,id=f'w{i}') for i,w in enumerate(cleaned)]
    transcript_path.write_text(json.dumps(words,ensure_ascii=False,indent=2),encoding='utf-8')
    expected = [w for s in story[key] for w in s['text'].split()]
    matcher = difflib.SequenceMatcher(None,[norm(w) for w in expected],[norm(w['text']) for w in words],autojunk=False)
    mapping={a+j:b+j for a,b,n in matcher.get_matching_blocks() for j in range(n)}
    ratio=matcher.ratio()
    if ratio < .90: raise RuntimeError(f'{name}: transcript differs from script ({ratio:.1%}); inspect before composing')
    scenes=[]
    cursor=0
    for scene in story[key]:
        match=next((mapping[i] for i in range(cursor,min(cursor+8,len(expected))) if i in mapping),None)
        if match is None: raise RuntimeError(f'Could not align scene {scene["id"]}')
        scenes.append(dict(scene,start=0 if not scenes else max(0,words[match]['start']-.15)))
        cursor+=len(scene['text'].split())
    for i,s in enumerate(scenes):
        s['end']=scenes[i+1]['start'] if i+1<len(scenes) else total
    groups=[]
    group=[]
    for i,w in enumerate(words):
        group.append(w)
        pause=i+1==len(words) or words[i+1]['start']-w['end']>.18
        if len(group)>=5 or re.search(r'[.!?]$',w['text']) or pause:
            end=min(total,w['end']+.07,words[i+1]['start'] if i+1<len(words) else total)
            groups.append({'text':' '.join(x['text'] for x in group),'start':group[0]['start'],'end':max(end,group[0]['start']+.08)})
            group=[]
    (project/'captions.srt').write_text('\n\n'.join(f'{i+1}\n{stamp(g["start"])} --> {stamp(g["end"])}\n{g["text"]}' for i,g in enumerate(groups)),encoding='utf-8')
    (project/'timing.json').write_text(json.dumps({'duration':total,'tempo':speed,'transcript_match':ratio,'scenes':scenes,'captions':groups},ensure_ascii=False,indent=2),encoding='utf-8')
    print(f'{name}: {total}s, tempo {speed:.3f}, {len(words)} words, script match {ratio:.1%}',flush=True)
