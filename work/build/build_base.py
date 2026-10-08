import sys,subprocess
from timeline import *
ar=sys.argv[1]; S=src(ar)
gs=groups()
inputs=[];fc=[];idx={}
nin=0
labels=[]
for gi,(n,B,D,t,x,parts) in enumerate(gs):
    segs=[];used=0
    for pi,(k,ss,sp,fd) in enumerate(parts):
        rem=D-used
        fdur=rem if fd is None else fd
        srcdur=fdur*sp
        lab=f'g{gi}p{pi}'
        ii=nin; inputs+=['-i',S[k]]; nin+=1
        # trim, retime, hold-extend, cap
        fc.append(f"[{ii}:v]trim=start={ss}:duration={srcdur+0.5},setpts=(PTS-STARTPTS)/{sp},fps=30,tpad=stop_mode=clone:stop_duration=15,trim=duration={fdur:.4f},setpts=PTS-STARTPTS,format=yuv420p,setsar=1,settb=1/30[{lab}]")
        segs.append(f'[{lab}]'); used+=fdur
    lab=f'G{gi}'
    if len(segs)>1: fc.append(''.join(segs)+f'concat=n={len(segs)}:v=1:a=0,settb=1/30,fps=30[{lab}]')
    else: fc.append(f'{segs[0]}null[{lab}]')
    labels.append(lab)
cur='G0'
for i in range(1,len(gs)):
    n,B,D,t,x,parts=gs[i-1]
    out=f'X{i}'
    fc.append(f"[{cur}][G{i}]xfade=transition={x}:duration={t}:offset={gs[i][1]:.4f},settb=1/30,fps=30[{out}]")
    cur=out
fc.append(f'[{cur}]fps=30,format=yuv420p[vout]')
cmd=['ffmpeg','-y','-hide_banner','-loglevel','error']+inputs+['-filter_complex',';'.join(fc),'-map','[vout]','-t',str(END),'-c:v','libx264','-crf','13','-preset','fast','-pix_fmt','yuv420p',f'base_{ar}.mp4']
open(f'cmd_{ar}.txt','w').write(' '.join(map(repr,cmd)))
r=subprocess.run(cmd,capture_output=True,text=True)
print(ar,r.returncode,r.stderr[-1500:])
