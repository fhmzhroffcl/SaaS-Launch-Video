import os, subprocess, sys
from pathlib import Path
from timeline import *
ROOT = Path(__file__).resolve().parents[2]
SF=os.environ.get('MAIA_SFX_DIR', str(ROOT/'external'/'sfx'))
import glob
def f(p): return glob.glob(os.path.join(SF,p+'*.wav'))[0]
W=f('whoosh-v0-a5'); SW=f('swoosh-v0-737'); POP=f('pop-v0-C'); DING=f('ding-v0-C'); SH=f('shutter'); TK=f('tick-v0-6b'); TY=f('type-v0'); CL=f('click'); SUC=f('success'); SHI=f('shimmer'); TAP=f('tap-v0-C')
ev=[] # (time, file, gain_dB)
def a(t,fl,g): ev.append((t,fl,g))
# transitions
for i in range(1,len(G)):
    t=G[i][1]; a(t-0.05, SW if i%2 else W, -4)
# scene2 cues
for l in [1.4,1.67,1.93,2.2,2.47]: a(local2film('s2',l),POP,-2)
a(local2film('s2',2.73),DING,-3); a(local2film('s2',3.0),CL,-4)
a(local2film('s2',7.87),SH,0); a(local2film('s2',9.17),POP,-2); a(local2film('s2',9.53),DING,-4)
a(local2film('s2',11.0),CL,-3); a(local2film('s2',12.2),W,-6)
import numpy as np
for k in np.arange(14.0,21.7,0.45): a(local2film('s2',k),TY,-12)
a(local2film('s2',16.8),CL,-6); a(local2film('s2',19.5),CL,-6)
for l in [1.47,2.93,4.40,5.87]: a(local2film('s3a',l),POP,-3)
for l in [0.2,1.7,3.7,5.0]: a(local2film('s3b',l),TK,-3)
a(local2film('s3b',6.6),POP,-3)
for i in range(6): a(local2film('s3b',10.0+0.93*i),TK,-5)
for l in np.arange(16.2,17.4,0.2): a(local2film('s3b',l),TK,-8)
a(local2film('s3b',17.4),DING,-6)
a(local2film('s4',1.4),TK,-4); a(local2film('s5',1.1),TK,-4); a(local2film('s6',0.2),TK,-4); a(local2film('s7',0.2),TK,-4)
for l in [0,1.65,3.3,4.95]: a(local2film('same',l)+0.0,TK,-6)
a(local2film('rev',2.9),CL,-4); a(local2film('rev',3.6),TK,-4); a(local2film('rev',5.0),CL,-3); a(local2film('rev',5.2),DING,-3)
for l in [1.5,3.0,4.5,6.1]:
    a(local2film('s8',l),W,-8); a(local2film('s8',l+1.0),TK,-5); a(local2film('s8',l+2.5),TK,-5)
a(local2film('s8',8.9),DING,-2)
a(local2film('recap',0.4),POP,-4); a(local2film('recap',1.0),DING,-4)
a(94.1+4.0,DING,-2); a(94.1+4.0,SHI,-10)
ins=['-i',os.environ.get('MAIA_VO',str(ROOT/'vo_in'/'launch_en.mp3')),'-stream_loop','-1','-i','BGM']
BGM=os.environ.get('MAIA_BGM',str(ROOT/'external'/'music.mp3'))
ins[-1]=BGM
fc=[]
fc.append("[0:a]aresample=48000,highpass=f=80,afftdn=nr=6:nf=-45,acompressor=threshold=-22dB:ratio=2.2:attack=15:release=180:makeup=2,adelay=1000|1000,apad=whole_dur=%s,asplit=2[vo][vosc]"%END)
fc.append(f"[1:a]aresample=48000,atrim=duration={END},loudnorm=I=-41:TP=-6:LRA=7,volume='if(lt(t,5),1.8,if(between(t,79.6,90.5),1.6,if(gt(t,93.5),2.0,1)))':eval=frame,afade=t=out:st={END-2}:d=2,aformat=channel_layouts=stereo[bg0]")
fc.append("[bg0][vosc]sidechaincompress=threshold=0.02:ratio=6:attack=40:release=500:makeup=1[bg]")
n=len(ev); labs=[]
for i,(t,fl,g) in enumerate(ev):
    ins+=['-i',fl]
    fc.append(f"[{i+2}:a]aresample=48000,aformat=channel_layouts=stereo,volume={g-6}dB,adelay={int(max(t,0)*1000)}|{int(max(t,0)*1000)}[s{i}]")
    labs.append(f'[s{i}]')
fc.append(''.join(labs)+f"amix=inputs={n}:normalize=0:duration=longest,apad=whole_dur={END}[sfx]")
fc.append("[vo]aformat=channel_layouts=stereo[vo2]")
fc.append("[vo2]asplit=2[vo2][vo3];[bg]asplit=2[bg][bg3];[sfx]asplit=2[sfx][sfx3]")
fc.append("[vo2][bg][sfx]amix=inputs=3:normalize=0:duration=first,atrim=duration=%s[mix]"%END)
cmd=['ffmpeg','-y','-hide_banner','-loglevel','error']+ins+['-filter_complex',';'.join(fc),'-map','[mix]','-ar','48000','mix_raw.wav','-map','[vo3]','stem_vo.wav','-map','[bg3]','stem_bg.wav','-map','[sfx3]','stem_sfx.wav']
r=subprocess.run(cmd,capture_output=True,text=True);print(r.returncode,r.stderr[-1500:])
