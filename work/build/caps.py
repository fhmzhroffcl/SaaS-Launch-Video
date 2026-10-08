import json,re,sys
from timeline import *
def ts(t):
    h=int(t//3600);m=int(t%3600//60);s=t%60
    return f"{h}:{m:02d}:{s:05.2f}"
O='{\\c&H009AEE&}';Wc='{\\c&HFFFFFF&}'
KIN=[ # start,end,text(ass runs)
 (28.0,30.2,f"Meet {O}MAIA"),
 (7.6,10.2,f"Text {O}·{Wc} Voice note {O}·{Wc} Handwritten {O}·{Wc} Email"),
 (47.0,51.6,f"Right SKU. Right unit. {O}Right price."),
 (65.2,69.6,f"Quotation {O}→{Wc} Sales Order {O}→{Wc} Delivery Order {O}→{Wc} Invoice"),
 (72.0,74.7,f"Your team stays {O}in control"),
 (83.0,88.0,f"SQL Account {O}·{Wc} AutoCount"),
]
def hdr(ar,fs,sub):
    W,H=(1920,1080) if ar=='16x9' else (1080,1920)
    return f"""[Script Info]
ScriptType: v4.00+
PlayResX: {W}
PlayResY: {H}
WrapStyle: 0
[V4+ Styles]
Format: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding
Style: D,Montserrat,{fs},&H00FFFFFF,&H00FFFFFF,&HE0100C0B,&H00000000,1,0,0,0,100,100,0,0,3,{16 if not sub else 12},0,5,60,60,10,1
[Events]
Format: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text
"""
def kin(ar):
    W,H=(1920,1080) if ar=='16x9' else (1080,1920)
    fs=50 if ar=='16x9' else 52
    x=W//2; y=1010 if ar=='16x9' else 1730
    out=hdr(ar,fs,False)
    for s,e,t in KIN:
        if ar=='9x16' and 'Quotation' in t: t=t.replace('Sales Order','Sales Order\\N',1).replace('Delivery Order','Delivery Order',1); t=t.replace('{\\c&HFFFFFF&} Sales','{\\c&HFFFFFF&} Sales')
        yy=y+(38 if (ar=='16x9' and 'SQL' in t) else 0); ff='\\fs42' if (ar=='16x9' and 'SQL' in t) else ''
        out+=f"Dialogue: 0,{ts(s)},{ts(e)},D,,0,0,0,,{{\\an5{ff}\\move({x},{yy+26},{x},{yy},0,320)\\fad(300,300)}}{t}\n"
    return out
def sub(ar):
    W,H=(1920,1080) if ar=='16x9' else (1080,1920)
    fs=44 if ar=='16x9' else 54
    x=W//2; y=1010 if ar=='16x9' else 1730
    maxc=46 if ar=='16x9' else 26
    d=json.load(open('../launch_en_words.json'))
    ws=[(w['start'],w['end'],w['word'].strip()) for s in d['segments'] for w in s['words'] if w['start']<99.5]
    # fix tokens
    fixed=[];i=0
    while i<len(ws):
        s,e,w=ws[i]
        if w.lower()=='maya' and i+2<len(ws) and ws[i+1][2].lower()=='.whatsapp':
            fixed.append((s,ws[i+2][1],'maia.wasap.my.'));i+=3;continue
        if 'maya' in w.lower(): w=re.sub('(?i)maya','MAIA',w)
        if w.lower()=='auto' and ws[i+1][2].startswith('-count'):
            fixed.append((s,ws[i+1][1],'AutoCount'+ws[i+1][2][6:]));i+=2;continue
        if w.lower()=='account,': w='Account,'
        fixed.append((s,e,w));i+=1
    # fix 'maya whatsapp my' handled; 'Maya.' etc
    ws=fixed
    chunks=[];cur=[]
    for s,e,w in ws:
        cur.append((s,e,w))
        txt=' '.join(c[2] for c in cur)
        if len(txt)>=maxc*0.7 and re.search(r'[.,?!]$',w) or len(txt)>=maxc*1.7 :
            chunks.append(cur);cur=[]
    if cur: chunks.append(cur)
    out=hdr(ar,fs,True)
    for ci,c in enumerate(chunks):
        txt=' '.join(x[2] for x in c)
        # wrap to 2 lines
        if len(txt)>maxc:
            words=txt.split();l1='';
            for k,w in enumerate(words):
                if len(l1+' '+w)>len(txt)/2+4 and k>0: break
                l1=(l1+' '+w).strip()
            txt=l1+'\\N'+' '.join(words[len(l1.split()):])
        s=c[0][0]+1.0-0.05; e=(chunks[ci+1][0][0]+1.0-0.05) if ci+1<len(chunks) else c[-1][1]+1.3
        e=min(e,c[-1][1]+1.0+0.9)
        txt=txt.replace('MAIA',f"{O}MAIA{Wc}")
        out+=f"Dialogue: 0,{ts(s)},{ts(e)},D,,0,0,0,,{{\\an5\\pos({x},{y})\\fad(80,80)}}{txt}\n"
    return out
for ar in ['16x9','9x16']:
    open(f'kin_{ar}.ass','w').write(kin(ar)); open(f'sub_{ar}.ass','w').write(sub(ar))
