import os
from pathlib import Path

L = Path(__file__).resolve().parents[2]
LOGO = Path(os.environ.get("MAIA_LOGO_DIR", L / "external" / "logo"))
END=101.5
def src(ar):
    s='16x9' if ar=='16x9' else '9x16'
    a=L/'motion_a'; b=L/'motion_b'
    logo_i=LOGO/('logo_intro_16x9.mp4' if ar=='16x9' else 'logo_intro.mp4')
    logo_o=LOGO/('logo_outro_en_16x9.mp4' if ar=='16x9' else 'logo_outro_en.mp4')
    return dict(logo_i=str(logo_i),logo_o=str(logo_o),s2=str(a/f'scene2_inputs_{s}.mp4'),s3a=str(a/f'scene3a_forward_{s}.mp4'),
      s3b=str(a/f'scene3b_understand_{s}.mp4'),s4=str(b/f'scene4_quotation_{s}.mp4'),s5=str(b/f'scene5_sales-order_{s}.mp4'),
      s6=str(b/f'scene6_delivery-order_{s}.mp4'),s7=str(b/f'scene7_invoice_{s}.mp4'),same=str(b/f'scene_same-order_{s}.mp4'),
      rev=str(b/f'scene_review-confirm_{s}.mp4'),s8=str(b/f'scene8_erp-sync_{s}.mp4'),recap=str(b/f'scene_recap_{s}.mp4'))
# group: name, B, t(transition into next), xfade type, parts [(key, ss, speed, film_dur or None=rest)]
G=[
 ('logo',0,0.3,'fade',[('logo_i',0,1.0,None)]),
 ('s2a',5.9,0.15,'fade',[('s2',0,1.0,None)]),
 ('s2bc',10.8,0.25,'smoothleft',[('s2',5.9,1.1,7.0),('s2',13.6,0.9,None)]),
 ('s3a',28.16,0.25,'fade',[('s3a',0,1.0,None)]),
 ('s3b',36.9,0.25,'smoothleft',[('s3b',0,1.0,None)]),
 ('s4',59.7,0.2,'smoothleft',[('s4',0,1.0,None)]),
 ('s5',61.3,0.2,'smoothright',[('s5',0,1.0,None)]),
 ('s6',62.5,0.2,'smoothleft',[('s6',0,1.0,None)]),
 ('s7',63.8,0.25,'fade',[('s7',0,1.0,None)]),
 ('same',65.0,0.25,'fade',[('same',0,1/1.1,None)]),
 ('rev',72.5,0.25,'fade',[('rev',0,1.0,None)]),
 ('s8',79.6,0.25,'fade',[('s8',0,1.0,None)]),
 ('recap',90.5,0.3,'fade',[('recap',0,1.0,None)]),
 ('outro',94.1,0,'fade',[('logo_o',0,1.0,None)]),
]
# NB speed here = source seconds per film second (setpts=PTS/speed). same: 0.909
def groups():
    out=[]
    for i,(n,B,t,x,parts) in enumerate(G):
        nb=G[i+1][1] if i+1<len(G) else END
        tt=t
        D=nb+(tt if i+1<len(G) else 0)-B
        out.append((n,B,D,t,x,parts))
    return out
def local2film(name,local):
    """film time for scene2/etc local time (for cues)"""
    if name=='s2':
        if local<=4.9: return 5.9+local
        if local<=13.6: return 10.8+(local-5.9)/1.1
        return 10.8+7.0+(local-13.6)/0.9
    B={'s3a':28.16,'s3b':36.9,'s4':59.7,'s5':61.3,'s6':62.5,'s7':63.8,'rev':72.5,'s8':79.6,'recap':90.5,'outro':94.1,'logo':0}
    if name=='same': return 65.0+local*1.1
    return B[name]+local
