const SC = new URLSearchParams(location.search).get('scene');
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const P=(t,a,b)=>clamp((t-a)/(b-a));
const eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
const esm=x=>x*x*(3-2*x);
const eout=x=>1-Math.pow(1-x,4);
const eback=x=>{const c=1.6;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)};
const lerp=(a,b,x)=>a+(b-a)*x;
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
function kf(t,arr,ez=esm){
  if(t<=arr[0][0])return arr[0].slice(1);
  for(let i=0;i<arr.length-1;i++){ if(t<arr[i+1][0]){const x=ez(P(t,arr[i][0],arr[i+1][0]));return arr[i].slice(1).map((v,j)=>lerp(v,arr[i+1][j+1],x));} }
  return arr[arr.length-1].slice(1);
}
const fmt=n=>n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const LINES=[
 ['FF-CHK-110','Isi Ayam Beku 1kg','ayam fillet',30,'KG',14.50],
 ['FF-CHK-010','Ayam Whole 1.2kg','ayam whole 20 ekor',20,'EKOR',11.50],
 ['FF-NDL-020','Mee Kuning 500g','mee kuning small one',10,'PKT',3.80],
 ['FF-VEG-030','Kobis Bulat','kobis 20kg',20,'KG',2.80],
 ['FF-SEA-040','Udang 31/40 10kg','udang 2 ctn',2,'CTN',168.00],
 ['FF-OIL-050','Minyak Masak 5kg','minyak masak 5kg 6 tin',6,'TIN',32.50]];
const TOTAL=LINES.reduce((s,l)=>s+l[3]*l[5],0); // 1290
const CUST='Dapur Mak Long Catering';
const ICON={
 chk:'<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
 pdf:'<svg viewBox="0 0 24 24"><path d="M12 4v11m0 0l-4-4m4 4l4-4M5 19h14"/></svg>',
 pen:'<svg viewBox="0 0 24 24"><path d="M4 20l4-1 11-11-3-3L5 16z"/></svg>',
 clock:'<svg viewBox="0 0 24 24" style="width:30px;height:30px;stroke:#a3a3a8;fill:none;stroke-width:2;stroke-linecap:round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
 ledger:'<svg viewBox="0 0 24 24"><rect x="4" y="3.5" width="16" height="17" rx="2.5"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>',
 snow:'<svg viewBox="0 0 24 24"><path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5L12 7l2.5-2.5M9.5 19.5L12 17l2.5 2.5"/></svg>',
 mic:'<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/></svg>',
 tk2:'<svg class="tk" viewBox="0 0 34 20"><path d="M2 11l5 5L18 4M14 14l2 2L28 4"/></svg>'};
const DOCS={
 s4:{key:'quotation',dur:11,step:1,stepName:'Quotation',title:'QUOTATION',crumb:'Quotations',no:'QTN-2026-00201',date:'04/10/2026',st:['Draft','Sent'],priced:true,
   prevBot:'Order matched: 6 items from the Dapur Mak Long price list.',prevOut:'Prepare the quotation',bot:'Quotation ready',from:null,pdfName:'QTN-2026-00201.pdf',kb:38,
   foot:'Please review and confirm.'},
 s5:{key:'so',dur:11,step:2,stepName:'Sales Order',title:'SALES ORDER',crumb:'Sales Orders',no:'SO-2026-00350',date:'04/10/2026',st:['Draft','To Bill and Deliver'],priced:true,
   prevBot:'QTN-2026-00201 was accepted by Dapur Mak Long.',prevOut:'Customer confirmed. Create the sales order',bot:'Sales order created',from:'QTN-2026-00201',pdfName:'SO-2026-00350.pdf',kb:41,
   foot:'Status: To Bill and Deliver.'},
 s6:{key:'dn',dur:9,step:3,stepName:'Delivery Order',title:'DELIVERY ORDER',crumb:'Delivery Orders',no:'DN-2026-00188',date:'07/10/2026',st:['To Deliver','Delivered'],priced:false,
   prevBot:'SO-2026-00350 is ready for delivery on Wed, 7 Oct.',prevOut:'Prepare the delivery order',bot:'Delivery order ready',from:'SO-2026-00350',pdfName:'DN-2026-00188.pdf',kb:36,
   foot:'Hafiz can print it for the driver.'},
 s7:{key:'inv',dur:9,step:4,stepName:'Invoice',title:'TAX INVOICE',crumb:'Invoices',no:'INV-2026-00412',date:'07/10/2026',due:'06/11/2026',st:['Draft','Billed'],priced:true,
   prevBot:'DN-2026-00188 was delivered to Dapur Mak Long.',prevOut:'Delivered. Please bill it',bot:'Invoice ready',from:'DN-2026-00188',pdfName:'INV-2026-00412.pdf',kb:40,
   foot:'Terms: 30 days. Due 06/11/2026.'}
};
const STAGE=$('#L');
$('#brand span').textContent='MAIA';

/* ================= document scenes ================= */
const MODE=new URLSearchParams(location.search).get('mode')||'9x16';
const WIDE=MODE==='16x9';
if(WIDE)document.body.classList.add('w');
const CX=WIDE?960:540, CY=WIDE?540:960;
const ctr=el=>{const r=el.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2];};
function mkPdf(D){
  const prow=LINES.map((l,i)=>`<tr><td class="n">${i+1}</td><td><b>${l[1]}</b><div class="s">${l[0]}</div></td><td class="r">${l[3]}</td><td>${l[4]}</td>${D.priced?`<td class="r">${fmt(l[5])}</td><td class="r"><b>${fmt(l[3]*l[5])}</b></td>`:`<td class="r">${l[3]}</td><td class="r">☐</td>`}</tr>`).join('');
  const head=D.priced?'<th>#</th><th>ITEM</th><th class="r">QTY</th><th>UOM</th><th class="r">UNIT PRICE (RM)</th><th class="r">AMOUNT (RM)</th>':'<th>#</th><th>ITEM</th><th class="r">ORDERED</th><th>UOM</th><th class="r">DELIVERED</th><th class="r">CHECK</th>';
  const kv=[['Date',D.date],['Delivery date','07/10/2026'],['Terms','30 days'],D.from?['Reference',D.from]:['Source','WhatsApp'],...(D.due?[['Due date',D.due]]:[])].map(a=>`<span>${a[0]}</span><b>${a[1]}</b>`).join('');
  return `<div class="cam"><div class="pdfwrap" id="pw">
   <div class="lh"><div class="lg"><div class="lgm">${ICON.snow}</div><div><div class="cn">FreezeFood Sdn. Bhd.</div><div class="ca">Frozen &amp; chilled food distribution<br>Kawasan Perindustrian, Melaka, Malaysia</div></div></div>
    <div class="dt"><div class="ti">${D.title}</div><div class="dn" id="pdn">${D.no}</div></div></div>
   <div class="meta"><div class="bx"><div class="h">${D.key==='dn'?'DELIVER TO':'BILL TO'}</div><div class="nm2">${CUST}</div><div class="ad">Taman Seri Melaka<br>Melaka, Malaysia</div></div><div class="bx"><div class="kv">${kv}</div></div></div>
   <table class="pt" id="ptb"><thead><tr>${head}</tr></thead><tbody>${prow}</tbody></table>
   ${D.priced?`<div class="ptot"><table><tr><td>Subtotal</td><td>RM ${fmt(TOTAL)}</td></tr><tr><td>Tax</td><td>RM 0.00</td></tr><tr class="gt" id="ptt"><td>TOTAL</td><td>RM ${fmt(TOTAL)}</td></tr></table></div>`:`<div class="ptot"><table><tr><td>Lines</td><td>6</td></tr><tr class="gt" id="ptt"><td>DELIVERY</td><td>Wed, 7 Oct</td></tr></table></div>`}
   <div class="notes">${D.key==='dn'?'<b>Delivery note.</b> Please check goods against this list on receipt. Frozen items to be stored at -18°C or below.':D.key==='inv'?'<b>Payment terms:</b> 30 days from invoice date. Please quote the invoice number on payment.':'<b>Terms:</b> Prices as per the Dapur Mak Long price list. Payment 30 days. Delivery Wed, 7 Oct 2026.'}</div>
   <div class="sig">${D.key==='dn'?'<div>Delivered by · Hafiz</div><div>Received by · name, signature &amp; date</div>':'<div>Prepared by · MAIA</div><div>Reviewed &amp; confirmed · Aina Sofea</div>'}</div>
   <div class="pf"><span>${D.no} · FreezeFood Sdn. Bhd.</span><span>Page 1 of 1</span></div>
  </div></div>`;
}
function buildDoc(D){
  const tickSvg=ICON.tk2;
  const chat=document.createElement('div');chat.className='layer';
  chat.innerHTML=`<div class="cam"><div class="chat"><div class="pat"></div>
   <div class="chh"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg><div class="av"><img src="../../work/logo_lavender.png"></div><div><div class="n">MAIA</div><div class="s">online</div></div></div>
   <div class="msgs">
    <div class="dchip">TODAY</div>
    <div class="bub in" id="pb"><div>${D.prevBot}</div><div class="tm">08:41</div></div>
    <div class="bub out" id="po"><div>${D.prevOut}</div><div class="tm">08:42 ${tickSvg}</div></div>
    <div class="bub in" id="ty"><div class="typing"><b></b><b></b><b></b></div></div>
    <div class="bub in big" id="bg"><div class="t1">${ICON.chk.replace('<svg','<svg style="width:40px;height:40px;stroke:#00a884;fill:none;stroke-width:3.4;stroke-linecap:round;stroke-linejoin:round"')} ${D.bot}</div>
      <div><span class="mono">${D.no}</span></div><div>${CUST}</div><div style="color:#54656f">6 items · Total RM ${fmt(TOTAL)}</div>
      <div class="pdfc" id="pc"><div class="pdfi">PDF</div><div><div class="fn">${D.pdfName}</div><div class="fm">1 page · ${D.kb} kB · PDF</div></div></div>
      <div>${D.foot}</div><div class="tm">08:42</div></div>
   </div>
   <div class="inbar"><div class="f">Message</div><div class="m">${ICON.mic}</div></div></div></div>`;
  STAGE.appendChild(chat);
  const oms=document.createElement('div');oms.className='layer';
  const rows=LINES.map((l,i)=>{
    const chipHtml=(i===4&&D.priced)?`<span class="chip sm" id="udc"><span class="cs-Check">Needs your check</span><span class="cs-Confirmed" style="opacity:0">Confirmed ✓</span></span>`:'';
    let right,sub;
    if(WIDE){
      right=D.priced?`<div class="c2">${l[3]}</div><div class="c3">${l[4]}</div><div class="c4">${fmt(l[5])}</div><div class="c5">${fmt(l[3]*l[5])}</div>`
        :`<div class="c2">${l[3]}</div><div class="c3">${l[4]}</div><div class="c4"></div><div class="c5" style="display:flex;justify-content:flex-end"><div class="tick" style="opacity:0">${ICON.chk}</div></div>`;
    }else{
      right=D.priced?`<div class="am">${fmt(l[3]*l[5])}</div><div class="qp">${l[3]} ${l[4]} × ${fmt(l[5])}</div>`
        :`<div style="display:flex;align-items:center;gap:18px"><div class="am">${l[3]} ${l[4]}</div><div class="tick" style="opacity:0">${ICON.chk}</div></div>`;}
    sub=D.priced?`<div class="sk">${l[0]} <em>← “${l[2]}”</em>${(WIDE&&i===4)?chipHtml:''}</div>`:`<div class="sk">${l[0]}</div>`;
    return `<div class="row"><div class="rl"><div class="nm">${l[1]}</div>${sub}${(!WIDE&&i===4)?`<div style="margin-top:6px">${chipHtml}</div>`:''}</div><div class="rr">${right}</div></div>`;}).join('');
  const chipStates=D.st.map(s0=>`<span class="cs-${s0.replace(/ /g,'')}">${s0}</span>`).join('');
  const btns=`<div class="btns"><div class="btn" id="bpdf">${ICON.pdf}<span>Generate PDF</span><div class="rip" id="rip"></div></div><div class="btn p">${ICON.pen}<span>Actions</span></div></div>`;
  const hdr=WIDE?`<div class="otb"><div class="org"><img src="../../work/logo_lavender.png" style="background:#0B0B0D;padding:4px"><span>FreezeFood Sdn. Bhd.</span></div><div class="crumb">${D.crumb} &nbsp;›&nbsp; <b>${D.no}</b></div>${btns}</div>`
    :`<div class="otb"><div class="org"><img src="../../work/logo_lavender.png" style="background:#0B0B0D;padding:4px"><span>FreezeFood Sdn. Bhd.</span></div><div class="upd">${ICON.clock}<span>Updated by</span><b>MAIA</b></div></div><div class="crumb">${D.crumb} &nbsp;›&nbsp; <b>${D.no}</b></div>`;
  const infoCells=WIDE?`<div class="c w"><div class="l">Customer</div><div class="v">${CUST}</div></div><div class="c"><div class="l">Date</div><div class="v">${D.date}</div></div><div class="c"><div class="l">${D.due?'Due date':'Delivery date'}</div><div class="v">${D.due||'07/10/2026'}</div></div><div class="c"><div class="l">Source</div><div class="v">${D.from?'From '+D.from:'WhatsApp · forwarded'}</div></div>`
   :`<div class="c w"><div class="l">Customer</div><div class="v">${CUST}</div></div><div class="c"><div class="l">Date</div><div class="v">${D.date}</div></div><div class="c"><div class="l">${D.due?'Due date':'Delivery date'}</div><div class="v">${D.due||'07/10/2026'}</div></div><div class="c"><div class="l">Source</div><div class="v">${D.from?'From '+D.from:'WhatsApp · forwarded'}</div></div><div class="c"><div class="l">Terms</div><div class="v">30 days</div></div>`;
  const colh=WIDE?`<div class="row" style="height:46px;color:var(--mut);font-size:23px;font-weight:700;letter-spacing:1px"><div class="rl">ITEM</div><div class="rr"><div class="c2">QTY</div><div class="c3">UOM</div><div class="c4">${D.priced?'RATE':''}</div><div class="c5" style="font-size:23px;font-weight:700;text-align:right">${D.priced?'AMOUNT':'DELIVERED'}</div></div></div>`:'';
  oms.innerHTML=`<div class="cam"><div class="oms" id="op">${hdr}
   <div class="dh"><div class="dno" id="dno">${D.no}</div><div class="chip" id="chip">${chipStates}</div>${WIDE?`<div class="upd">${ICON.clock}<span>Updated by</span><b>MAIA</b></div>`:''}</div>
   <div class="info">${infoCells}</div>
   <div class="items" id="it"><div class="ih"><span>Items</span><small>6 lines</small></div>${colh}${rows}</div>
   <div class="tot" id="tot">${D.priced?`<div class="tr"><span>Subtotal</span><b id="sub">RM 0.00</b></div><div class="tr g"><span>Total</span><b id="gt">0.00</b></div>`:
     `<div class="tr"><span>Delivery date</span><b>Wed, 7 Oct 2026</b></div><div class="tr g" style="font-size:34px"><span>Delivered</span><b id="gt" style="color:#4ade80;font-size:${WIDE?48:56}px">0 / 6</b></div><div class="prog"><i id="pg" style="width:0"></i></div>`}</div>
   ${WIDE?'':`<div class="foot">${btns}</div>`}
  </div></div>`;
  STAGE.appendChild(oms);
  // ---- pdf
  const pdf=document.createElement('div');pdf.className='layer';
  pdf.innerHTML=mkPdf(D);
  STAGE.appendChild(pdf);
  const PS=WIDE?.8:1.2;
  const pw=$('#pw');
  const PX=WIDE?1230:(540-397*PS), PY=WIDE?122:(CY-561.5*PS);
  pw.style.transform=`translate(${PX}px,${PY}px) scale(${PS})`;pw.style.transformOrigin='0 0';
  const chip=$('#chip');const cspans=$$('span',chip).filter(s=>s.parentNode===chip);const cw=cspans.map(s=>s.offsetWidth);
  const udc=$('#udc');let uw=[];if(udc){uw=$$('span',udc).filter(s=>s.parentNode===udc).map(s=>s.offsetWidth);}
  const rowsEl=$$('.row',oms).filter(r=>r.querySelector('.nm'));
  const chatEls={pb:$('#pb'),po:$('#po'),ty:$('#ty'),bg:$('#bg'),pc:$('#pc')};
  // show all layers for measuring
  const F={dno:ctr($('#dno')),chip:ctr(chip),it:ctr($('#it')),tot:ctr($('#tot')),bp:ctr($('#bpdf')),row0:ctr(rowsEl[0]),row5:ctr(rowsEl[5]),pc:ctr(chatEls.pc),
     op:ctr($('#op')),dnoR:$('#dno').getBoundingClientRect(),chipR:chip.getBoundingClientRect(),totR:$('#tot').getBoundingClientRect(),itR:$('#it').getBoundingClientRect()};
  const PF={tb:ctr($('#ptb')),tot:ctr($('#ptt')),lh:ctr($('.lh')),ptR:$('#ptt').getBoundingClientRect(),tbR:$('#ptb').getBoundingClientRect(),lhR:$('.lh').getBoundingClientRect(),pwR:pw.getBoundingClientRect()};
  const opR=$('#op').getBoundingClientRect(), chR=$('.chat').getBoundingClientRect();
  const ch=chat.firstChild,om=oms.firstChild,pd=pdf.firstChild;
  const dur=D.dur,K=11/dur;
  const camT=(el,k)=>{zs=Math.max(zs,k[0]);el._z=k[0];el.style.transform=`translate(${CX-k[1]*k[0]}px,${CY-k[2]*k[0]}px) scale(${k[0]})`;};
  const bx=(R)=>[R.left+R.width/2,R.top+R.height/2];
  let zs=1;
  return function render(t){
    const u=t*K;zs=1;
    $('#b1').style.transform=`translate(${Math.sin(u*.4)*60}px,${u*14}px)`;$('#b2').style.transform=`translate(${-Math.cos(u*.35)*50}px,${-u*10}px)`;$('#dots').style.transform=`translate(${-u*10}px,${-u*14}px)`;
    const so=P(u,0,.6);$('#top').style.opacity=eout(so)*(1-clamp((zs-1.05)/.1));$('#top').style.transform=`translateY(${(1-eout(so))*-30}px)`;
    $('#steptxt').textContent=`${D.step} of 4 · ${D.stepName}`;$('#step i').innerHTML=[1,2,3,4].map(n=>`<b class="${n<=D.step?'on':''}"></b>`).join('');
    // ======== layer visibility / transitions
    const cIn=eout(P(u,0,.9)),cOut=esm(P(u,WIDE?3.7:3.4,WIDE?4.2:4.0));
    const slide=WIDE?lerp(490,0,esm(P(u,2.7,3.5))):0; // chat starts centred, slides left
    chat.style.display=(u>4.3)?'none':'block';chat.style.opacity=cIn*(1-cOut);
    chat.style.transform=`translate(${slide}px,${(1-cIn)*140-cOut*40}px) scale(${lerp(1,.94,cOut)})`;chat.style.filter=`blur(${cOut*16}px)`;
    const vis=(el,a,b=a+.4,dy=30,sc=.96)=>{const x=eout(P(u,a,b));el.style.opacity=x;el.style.transform=`translateY(${(1-x)*dy}px) scale(${lerp(sc,1,x)})`;};
    vis(chatEls.pb,.3);vis(chatEls.po,.75);
    chatEls.ty.style.display=(u>2.1)?'none':'block';chatEls.ty.style.opacity=P(u,1.25,1.5)*(1-P(u,2.0,2.1));
    $$('.typing b',chatEls.ty).forEach((b,i)=>{b.style.transform=`translateY(${-Math.abs(Math.sin(u*9-i*.8))*10}px)`;});
    {const x=eback(P(u,2.1,2.7));chatEls.bg.style.opacity=clamp(x*2);chatEls.bg.style.transform=`translateY(${(1-x)*70}px) scale(${lerp(.92,1,Math.min(1,x))})`;chatEls.bg.style.transformOrigin='0 100%';}
    {const x=eback(P(u,2.6,3.1));chatEls.pc.style.transform=`scale(${lerp(.85,1,x)})`;chatEls.pc.style.opacity=clamp(P(u,2.5,2.8));}
    // OMS layer
    const oIn=esm(P(u,WIDE?3.9:3.55,WIDE?4.6:4.25)),oOut=WIDE?esm(P(u,8.8,9.3)):esm(P(u,8.0,8.5));
    oms.style.display=(u<(WIDE?3.8:3.5)||u>9.4)?'none':'block';
    oms.style.opacity=oIn*(1-oOut);
    oms.style.transform=WIDE?`translate(${(1-oIn)*-120}px,0) scale(${lerp(1.02,1,oIn)})`:`translateY(${(1-oIn)*90-oOut*40}px) scale(${lerp(1.05,1,oIn)*lerp(1,.94,oOut)})`;
    oms.style.filter=`blur(${(1-oIn)*16+oOut*16}px)`;
    const r0=WIDE?4.4:4.1;
    rowsEl.forEach((r,i)=>{const x=eout(P(u,r0+i*.13,r0+.5+i*.13));r.style.opacity=x;r.style.transform=`translateX(${(1-x)*90}px)`;});
    const mp=esm(P(u,5.0,5.45));chip.style.width=lerp(cw[0],cw[1],mp)+'px';
    cspans[0].style.transform=`translateY(${-mp*70}px)`;cspans[0].style.opacity=1-mp;cspans[1].style.transform=`translateY(${(1-mp)*70}px)`;cspans[1].style.opacity=mp;
    cspans.forEach((s,i)=>{s.style.width=cw[i]+'px'});
    chip.style.boxShadow=`0 0 ${40*Math.sin(Math.PI*P(u,5.0,5.9))}px rgba(238,154,0,.8)`;
    if(udc){const us=$$('span',udc).filter(s=>s.parentNode===udc);const q=esm(P(u,5.9,6.3));udc.style.width=lerp(uw[0],uw[1],q)+'px';us[0].style.opacity=1-q;us[1].style.opacity=q;us[0].style.transform=`translateY(${-q*50}px)`;us[1].style.transform=`translateY(${(1-q)*50}px)`;us.forEach((s,i)=>s.style.width=uw[i]+'px');}
    if(D.priced){const c=eout(P(u,4.5,6.0));$('#sub').textContent='RM '+fmt(TOTAL*c);$('#gt').textContent=fmt(TOTAL*c);
      const pu=Math.sin(Math.PI*P(u,6.8,7.6));$('#gt').style.textShadow=`0 0 ${40*pu}px rgba(238,154,0,.9)`;$('#gt').style.display='inline-block';$('#gt').style.transform=`scale(${1+.06*pu})`;$('#gt').style.transformOrigin='100% 50%';}
    else{let n=0;rowsEl.forEach((r,i)=>{const x=eback(P(u,5.3+i*.2,5.6+i*.2));const tk=$('.tick',r);tk.style.opacity=clamp(x*3);tk.style.transform=`scale(${x})`;if(u>=5.4+i*.2)n++;});
      $('#gt').textContent=n+' / 6';$('#pg').style.width=(n/6*100)+'%';}
    {const pr=P(u,7.7,8.0);const rip=$('#rip');rip.style.opacity=pr>0&&pr<1?.7*(1-pr):0;rip.style.transform=`scale(${1+pr*14})`;$('#bpdf').style.transform=`scale(${1-.05*Math.sin(Math.PI*clamp(pr*1.6))})`;$('#bpdf').style.borderColor=pr>0?'rgba(238,154,0,.9)':'';}
    // PDF layer
    const pI=eout(P(u,WIDE?3.0:8.1,WIDE?3.9:8.9));
    pdf.style.display=(!WIDE&&u<8.0)?'none':'block';
    pdf.style.opacity=clamp(pI*2);
    pdf.style.transform=WIDE?`translate(${(1-pI)*-420}px,${(1-pI)*120}px) scale(${lerp(.82,1,pI)})`:`translateY(${(1-pI)*260}px)`;
    pdf.style.filter=`blur(${(1-pI)*14}px)`;
    // dim page in wide while OMS is the subject
    if(WIDE){const dim=1-.55*esm(P(u,4.4,5.0))*(1-esm(P(u,8.0,8.5)));pdf.style.opacity=clamp(pI*2)*dim;}
    pw.style.boxShadow='0 60px 140px rgba(0,0,0,.75),0 0 '+(120+60*Math.sin(u*2))+'px rgba(238,154,0,.16)';
    // ======== cameras
    const win=(a,b,c,d)=>esm(P(u,a,b))*(1-esm(P(u,c,d)));
    const dimBlocks=(root,map,zoom)=>{for(const sel in map){$$(sel,root).forEach(e=>{const d=zoom*(1-map[sel]);e.style.filter=d>.01?`blur(${d*9}px)`:'';e.style.opacity=1-d*.8;});}};
    if(!WIDE){
      const pc=F.pc;
      camT(ch,kf(u,[[0,1,540,960],[2.6,1,540,960],[3.5,1.12,540,Math.max(pc[1]-60,1100)],[5,1.12,540,Math.max(pc[1]-60,1100)]]));
      const C=F.op[1];
      const dR=F.dnoR,cR=F.chipR;
      camT(om,kf(u,[[3.5,1,540,C],[4.3,1,540,C],[5.0,1.55,(dR.left+Math.max(dR.right,cR.right))/2,(dR.top+cR.bottom)/2],[5.9,1.55,(dR.left+Math.max(dR.right,cR.right))/2,(dR.top+cR.bottom)/2],
        [6.4,1.12,540,F.row0[1]+120],[7.0,1.12,540,F.row5[1]-150],[7.5,1.5,F.totR.right-215,F.tot[1]-10],[7.7,1.5,F.totR.right-215,F.tot[1]-10],
        [8.2,1.0,540,C],[9,1,540,C]]));
      camT(pd,kf(u,[[8.1,1,540,CY],[9.2,1,540,CY],[9.7,1.25,540,PF.tb[1]-30],[10.1,1.25,540,PF.tb[1]-30],[10.7,2.0,PF.ptR.right-215,PF.tot[1]-80],[11,2.0,PF.ptR.right-215,PF.tot[1]-80]]));
    }else{
      const OX=610,S=1.65,pcx=PF.pwR.left+PF.pwR.width/2;
      const yD=(F.dnoR.top+F.itR.top)/2-10, yL=F.itR.top+F.itR.height/2+10, yT=F.tot[1]-100;
      const k=kf(u,[[0,1,960,540],[2.7,1,960,540],[4.4,1,960,540],
        [5.0,S,OX,yD],[5.9,S,OX,yD],[6.4,S,OX,yL-60],[7.0,S,OX,yL+60],[7.5,S,OX,yT],[8.0,S,OX,yT],
        [8.6,1.0,960,540],[9.1,1.0,960,540],
        [9.6,2.0,pcx,PF.tb[1]-20],[10.2,2.0,pcx,PF.tb[1]-20],
        [10.7,2.6,pcx,PF.tot[1]-60],[11,2.6,pcx,PF.tot[1]-60]]);
      camT(ch,k);camT(om,k);camT(pd,k);
    }
    {const zo=clamp(((om._z||1)-1.06)/.15);
     const fd=win(4.8,5.1,5.9,6.2),fi=win(6.2,6.5,7.0,7.3),ft=win(7.3,7.5,8.0,8.3);
     dimBlocks(oms,{'.otb':0,'.dh':fd,'.info':0,'.items':fi,'.tot':ft,'.foot':0},zo);
     const zp=clamp(((pd._z||1)-1.06)/.15);
     const pa=WIDE?win(9.4,9.7,10.2,10.5):win(9.5,9.8,10.1,10.4), pb=win(10.4,10.7,11.2,11.3);
     dimBlocks(pdf,{'.lh':0,'.meta':0,'.pt':pa,'.ptot':pb,'.notes':0,'.sig':0},zp);}
  };
}

/* ================= ERP sync scene ================= */
function buildSync(){
  const DOCSL=[['QTN-2026-00201','Quotation','Sent','Sent'],['SO-2026-00350','Sales Order','To Bill and Deliver','ToBill'],['DN-2026-00188','Delivery Order','Delivered','Delivered'],['INV-2026-00412','Invoice','Billed','Billed']];
  const L=document.createElement('div');L.className='layer';
  const mrows=DOCSL.map(d=>`<div class="mrow"><div><div class="a">${d[0]}</div><div class="b">${d[1]}</div></div><div class="st"><span class="chip sm cs-${d[3]}"><span class="cs-${d[3]}" style="width:auto">${d[2]}</span></span><span class="chip sm sc"><span class="cs-Wait">Waiting</span><span class="cs-Sync">Syncing</span><span class="cs-Synced">Synced ✓</span></span></div></div>`).join('');
  const ecol=(name)=>`<div class="ecol"><div class="ech"><div class="nn">${ICON.ledger}${name}<span class="chip sm cs-Posted" style="height:44px;margin-left:auto"><span class="cs-Posted" style="font-size:24px;width:auto">● Connected</span></span></div></div>${DOCSL.map(d=>`<div class="erow"><div class="ghost" style="opacity:0"><div class="a">${d[0]}</div><div class="b">${d[1]}</div></div><div class="tick" style="opacity:0">${ICON.chk}</div></div>`).join('')}</div>`;
  const hubHtml0=0;
  const hubHtml=`<div id="hubl" style="font-size:36px;font-weight:700;color:var(--lav);display:flex;gap:8px;font-size:${WIDE?'27px':'36px'};align-items:center;justify-content:center;white-space:nowrap;position:absolute;left:0;right:0;top:${WIDE?'22px':'14px'}"></div>`;
  if(WIDE){
    L.innerHTML=`<div class="cam" id="c8">
     <div class="card8" id="mc" style="left:60px;width:700px;top:118px;height:922px"><div class="c8h"><span>MAIA OMS</span><small>${CUST}</small></div>${mrows}</div>
     <div class="hub" id="hub" style="left:770px;width:280px;top:118px;height:922px">${hubHtml}</div>
     <div class="card8" id="ec1" style="left:1060px;width:800px;top:118px;height:445px"><div class="erp2" style="grid-template-columns:1fr">${ecol('SQL Account')}</div></div>
     <div class="card8" id="ec2" style="left:1060px;width:800px;top:595px;height:445px"><div class="erp2" style="grid-template-columns:1fr">${ecol('AutoCount')}</div></div>
     <div id="pills"></div></div>`;
  }else{
    L.innerHTML=`<div class="cam" id="c8">
     <div class="card8" id="mc" style="top:170px"><div class="c8h"><span>MAIA OMS</span><small>${CUST}</small></div>${mrows}</div>
     <div class="hub" id="hub" style="top:${170+108+104*4+30}px;height:260px">${hubHtml}</div>
     <div class="card8" id="ec" style="top:${170+108+416+320}px"><div class="erp2">${ecol('SQL Account')}${ecol('AutoCount')}</div></div>
     <div id="pills"></div></div>`;
  }
  STAGE.appendChild(L);
  $('#steptxt').textContent='Synced to your ERP';$('#step i').innerHTML='<b class="on"></b><b class="on"></b><b class="on"></b><b class="on"></b>';
  const cam=L.firstChild;
  const mrowsEl=$$('.mrow'),ecols=$$('.ecol');
  const sc=$$('.sc'),scs=sc.map(c=>$$('span',c).filter(s=>s.parentNode===c)),scw=scs.map(a=>a.map(s=>s.offsetWidth));
  // wide row heights
  if(WIDE){ $$('.ecol').forEach(c=>{$$('.erow',c).forEach(r=>r.style.height='80px');$('.ech',c).style.height='96px';$('.ech',c).style.padding='0 28px';$('.ech .nn',c).style.height='100%';$('.ech .nn',c).style.fontSize='38px'});
    mrowsEl.forEach(r=>{r.style.height='202px';r.style.padding='0 36px'});$$('.mrow .a').forEach(e=>e.style.fontSize='36px');$$('.mrow .b').forEach(e=>e.style.fontSize='28px');
    $$('.erow .a').forEach(e=>e.style.fontSize='30px');$$('.erow .b').forEach(e=>e.style.fontSize='25px');
    $$('.mrow .st').forEach(e=>e.style.flexDirection='column');$$('.mrow .st').forEach(e=>e.style.alignItems='flex-end');
    $$('.mrow .st').forEach(e=>e.style.gap='10px');
    const mc=$('#mc');const mh=$('.c8h',mc);mh.style.height='100px';}
  const pillsEl=$('#pills');
  const R2=el=>el.getBoundingClientRect();
  const pills=[],ret=[];
  DOCSL.forEach((d,i)=>{[0,1].forEach(c=>{const p=document.createElement('div');p.className='pill';p.textContent=d[0];p.style.opacity=0;p.style.left='0';p.style.top='0';pillsEl.appendChild(p);pills.push({p,i,c,w:0});});
    const p=document.createElement('div');p.className='pill';p.style.background='#4ade80';p.style.color='#04200e';p.style.boxShadow='0 0 40px rgba(74,222,128,.5)';p.textContent='✓ Posted';p.style.opacity=0;p.style.left='0';p.style.top='0';pillsEl.appendChild(p);ret.push(p);});
  pills.forEach(o=>o.w=o.p.offsetWidth);const rw=ret[0].offsetWidth;
  // geometry (world coords, cam identity at build)
  const G=DOCSL.map((d,i)=>{const mr=R2(mrowsEl[i]);const o={mx:WIDE?mr.right-60:540,my:mr.top+mr.height/2,e:[]};
    [0,1].forEach(c=>{const er=$$('.erow',ecols[c])[i];const r=R2($('.ghost',er));const tr=R2(er);o.e.push({x:tr.left+(WIDE?150:150)+ (r.width>0?0:0),y:tr.top+tr.height/2});});
    return o;});
  const hubR=R2($('#hub'));const HX=hubR.left+hubR.width/2,HY=hubR.top+hubR.height/2;
  const T0=1.3,DT=.62;
  return function render(t0){
    const u=t0*0.62;const t=t0;
    $('#b1').style.transform=`translate(${Math.sin(u*.4)*60}px,${u*14}px)`;$('#b2').style.transform=`translate(${-Math.cos(u*.35)*50}px,${-u*10}px)`;$('#dots').style.transform=`translate(${-u*10}px,${-u*14}px)`;
    $('#top').style.opacity=eout(P(u,0,.6));
    const e1=eout(P(u,0,.5)),e2=eout(P(u,.1,.6)),e3=eout(P(u,.2,.7));
    $('#mc').style.opacity=e1;$('#mc').style.transform=WIDE?`translateX(${(1-e1)*-90}px)`:`translateY(${(1-e1)*80}px)`;
    (WIDE?[$('#ec1'),$('#ec2')]:[$('#ec')]).forEach((c,i)=>{const e=i?e3:e2;c.style.opacity=e;c.style.transform=WIDE?`translateX(${(1-e)*110}px)`:`translateY(${(1-e)*110}px)`;});
    $('#hubl').style.opacity=eout(P(u,.3,.8));
    DOCSL.forEach((d,i)=>{
      const ta=T0+i*DT,g=G[i];
      const hi=Math.sin(Math.PI*P(u,ta-.1,ta+.7));mrowsEl[i].style.background=`rgba(238,154,0,${.12*hi})`;
      const tSyn=ta+1.55;const s1=esm(P(u,ta,ta+.25)),s2=esm(P(u,tSyn,tSyn+.3));
      sc[i].style.width=lerp(lerp(scw[i][0],scw[i][1],s1),scw[i][2],s2)+'px';
      scs[i].forEach((s,j)=>{const o=j===0?(1-s1):(j===1?(s1*(1-s2)):s2);s.style.opacity=o;s.style.width=scw[i][j]+'px';const off=j===0?-s1*60:(j===1?(1-s1)*60-s2*60:(1-s2)*60);s.style.transform=`translateY(${off}px)`;});
      [0,1].forEach(c=>{
        const pp=pills[i*2+c];const x=P(u,ta,ta+.85);
        const hy=(WIDE?g.my:HY+40)-30;
        pp.p.style.opacity=c===0?Math.sin(Math.PI*clamp(x))>1?1:Math.sin(Math.PI*clamp(x))*1.3>1?1:Math.sin(Math.PI*clamp(x))*1.3:0;
        pp.p.style.transform=`translate(${HX-pp.w/2+lerp(-14,14,eio(x))}px,${hy}px)`;
        const er=$$('.erow',ecols[c])[i];const gh=$('.ghost',er),tk=$('.tick',er);
        const ap=eback(P(u,ta+.7,ta+1.1));gh.style.opacity=clamp(ap*2);gh.style.transform=`translateX(${(1-clamp(ap,0,1))*-40}px)`;
        const tp=eback(P(u,ta+1.05+c*.1,ta+1.4+c*.1));tk.style.opacity=clamp(tp*3);tk.style.transform=`scale(${tp})`;
        er.style.background=`rgba(74,222,128,${.1*Math.sin(Math.PI*P(u,ta+1.05,ta+1.9))})`;
      });
      const rp=ret[i],rx=P(u,ta+1.25,ta+1.9);
      if(rx>0&&rx<1){const a=eio(rx);const sy2=WIDE?HY:HY;const startY=WIDE?(g.e[0].y+g.e[1].y)/2:(g.e[0].y);
        rp.style.opacity=Math.min(1,Math.sin(Math.PI*rx)*1.4);rp.style.transform=`translate(${HX-rw/2+lerp(14,-14,a)}px,${(WIDE?g.my+34:HY+40)-30}px)`;}else rp.style.opacity=0;
    });
    const allT=T0+3*DT+1.55;const allDone=esm(P(u,allT,allT+.35));
    $('#hubl').innerHTML=allDone>.5?`<span style="font-size:40px;color:#4ade80">✓</span><span style="color:#4ade80">Synced</span>`:`<span style="font-size:36px;color:#EE9A00">${WIDE?'⇄':'⇅'}</span>Two-way sync`;
    $('#hubl').style.transform=`scale(${1+.12*Math.sin(Math.PI*P(u,allT,allT+.8))})`;
    const k=kf(u,[[0,1,CX,CY],[1.2,1,CX,CY],[3.2,1.05,CX,CY],[5,1.05,CX,CY],[6.6,1.02,CX,CY]]);
    cam.style.transform=`translate(${CX-k[1]*k[0]}px,${CY-k[2]*k[0]}px) scale(${k[0]})`;
  };
}

/* ================= quick title-led doc reveal ================= */
function chipHTML(D){return D.st.map(s0=>`<span class="cs-${s0.replace(/ /g,'')}">${s0}</span>`).join('');}
function buildQuick(D,dur){
  const root=document.createElement('div');root.className='layer';
  const PS=WIDE?.89:1.1;
  const left=WIDE?110:0;
  root.innerHTML=`<div class="cam"><div id="qt" style="position:absolute;${WIDE?'left:110px;top:230px;width:860px;':'left:60px;top:130px;width:960px;text-align:center;'}">
    <div id="qd" style="display:flex;gap:10px;${WIDE?'':'justify-content:center;'}margin-bottom:${WIDE?24:16}px"><span style="font-size:${WIDE?30:30}px;color:#f5b53d;font-weight:700;margin-right:10px">${D.step} of 4</span>${[1,2,3,4].map(n=>`<b style="width:14px;height:14px;border-radius:7px;margin-top:11px;background:${n<=D.step?'#f5b53d':'rgba(245,181,61,.3)'}"></b>`).join('')}</div>
    <div id="q1" style="white-space:nowrap;font-size:${WIDE?(D.stepName.length>12?106:132):(D.stepName.length>12?104:118)}px;font-weight:800;letter-spacing:-3px;line-height:1.02">${D.stepName}</div>
    <div id="q2" style="font-family:Menlo,monospace;font-size:${WIDE?58:52}px;font-weight:800;color:#EE9A00;margin-top:${WIDE?22:14}px">${D.no}</div>
    <div id="q3" style="margin-top:${WIDE?30:20}px;display:flex;${WIDE?'':'justify-content:center;'}"><div class="chip" id="qc">${chipHTML(D)}</div></div>
    <div id="q4" style="font-size:${WIDE?40:38}px;color:var(--mut);margin-top:${WIDE?34:18}px;font-weight:500">${CUST}<br><span style="color:var(--fg);font-weight:700">6 lines · RM ${fmt(TOTAL)}</span></div>
   </div></div>`;
  STAGE.appendChild(root);
  const pdf=document.createElement('div');pdf.className='layer';pdf.innerHTML=mkPdf(D);STAGE.appendChild(pdf);
  const pw=$('#pw');pw.style.transformOrigin='0 0';
  const px=WIDE?1060:(540-397*PS), py=WIDE?40:(CY-561.5*PS+ (WIDE?0:235));
  $('#top').style.display='none';
  const chip=$('#qc'),cs=$$('span',chip).filter(s=>s.parentNode===chip),cw=cs.map(s=>s.offsetWidth);
  const dyn=dur>=2;
  return function render(t){
    const u=t/dur;
    $('#b1').style.transform=`translate(${Math.sin(t*.4)*60}px,${t*14}px)`;$('#b2').style.transform=`translate(${-Math.cos(t*.35)*50}px,${-t*10}px)`;$('#dots').style.transform=`translate(${-t*10}px,${-t*14}px)`;
    const sl=(el,a,b,dx,dy)=>{const x=eout(P(u,a,b));el.style.opacity=x;el.style.transform=`translate(${(1-x)*dx}px,${(1-x)*dy}px)`;};
    sl($('#qd'),0,.16,0,30);sl($('#q1'),.02,.24,WIDE?-80:0,WIDE?0:60);sl($('#q2'),.1,.3,WIDE?-60:0,WIDE?0:40);sl($('#q3'),.16,.36,0,30);sl($('#q4'),.22,.42,0,30);
    const m=dyn?esm(P(u,.55,.72)):1;chip.style.width=lerp(cw[0],cw[1],m)+'px';
    cs[0].style.opacity=1-m;cs[0].style.transform=`translateY(${-m*70}px)`;cs[1].style.opacity=m;cs[1].style.transform=`translateY(${(1-m)*70}px)`;cs.forEach((s,i)=>s.style.width=cw[i]+'px');
    chip.style.boxShadow=`0 0 ${40*Math.sin(Math.PI*P(u,.55,.9))}px rgba(238,154,0,.8)`;
    const pe=eback(P(u,.04,.4)),po=clamp(P(u,.04,.2)*1.2);
    const push=1+.04*esm(P(u,.2,1));
    pw.style.transform=`translate(${px}px,${py+(1-clamp(pe,0,1.2))*160}px) scale(${PS*lerp(.9,1,Math.min(1,pe))*push})`;pw.style.opacity=po;
    pw.style.boxShadow='0 60px 140px rgba(0,0,0,.75),0 0 '+(120+60*Math.sin(t*2))+'px rgba(238,154,0,.16)';
  };
}
/* ================= same order flowing through 4 documents ================= */
function buildSame(){
  const dur=6.6;
  const DL=[DOCS.s4,DOCS.s5,DOCS.s6,DOCS.s7];
  const root=document.createElement('div');root.className='layer';
  const rows=LINES.map((l,i)=>`<div class="row sm"><div class="rl"><div class="nm">${l[1]}</div><div class="sk">${l[0]}</div></div><div class="rr"><div class="c2">${l[3]}</div><div class="c3">${l[4]}</div><div class="c4 pr">${fmt(l[5])}</div><div class="c5 pr">${fmt(l[3]*l[5])}</div></div></div>`).join('');
  const steps=DL.map((d,i)=>`<div class="stp" id="st${i}"><div class="stn">${i+1}</div><div><div class="sta">${d.no}</div><div class="stb">${d.stepName}</div></div><div class="stk">${ICON.chk}</div></div>`).join('');
  const css=document.createElement('style');css.textContent=`
  .stp{display:flex;align-items:center;gap:18px;border:1.5px solid var(--bd);border-radius:22px;padding:0 24px;background:var(--card);height:${WIDE?150:100}px}
  .stn{width:54px;height:54px;border-radius:27px;background:rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:28px;color:var(--mut);flex:none}
  .sta{font-family:Menlo,monospace;font-weight:800;font-size:${WIDE?34:30}px}.stb{font-size:${WIDE?28:26}px;color:var(--mut);margin-top:3px}
  .stk{margin-left:auto;width:48px;height:48px;border-radius:24px;background:rgba(74,222,128,.15);border:2px solid rgba(74,222,128,.5);display:flex;align-items:center;justify-content:center;opacity:0}.stk svg{width:26px;height:26px;stroke:#4ade80;fill:none;stroke-width:3.4;stroke-linecap:round;stroke-linejoin:round}
  .stp.on{border-color:rgba(238,154,0,.6);background:rgba(238,154,0,.1)}.stp.on .stn{background:#EE9A00;color:#1a1100}
  .row.sm{min-height:${WIDE?96:134}px;display:grid;grid-template-columns:1fr 110px 110px 150px 190px;gap:0;padding:0 28px}.row.sm .rr{display:contents}
  .row.sm .c2,.row.sm .c3,.row.sm .c4,.row.sm .c5{font-size:${WIDE?32:30}px;font-variant-numeric:tabular-nums;text-align:right}.row.sm .c3{text-align:left;padding-left:14px;color:var(--mut)}.row.sm .c4{color:var(--mut)}.row.sm .c5{font-weight:800;font-size:${WIDE?34:32}px}
  .row.sm .nm{font-size:${WIDE?34:32}px}.row.sm .sk{font-size:${WIDE?26:25}px}
  ${WIDE?'':`.row.sm{grid-template-columns:1fr 84px 96px 130px 170px;padding:0 20px}.row.sm .c2,.row.sm .c3,.row.sm .c4{font-size:28px}.row.sm .c5{font-size:30px}.row.sm .nm{font-size:30px}`}
  `;document.head.appendChild(css);
  const card=WIDE?'left:60px;top:90px;width:1130px;':'left:60px;top:440px;width:960px;';
  root.innerHTML=`<div class="cam"><div class="oms" id="op" style="${card}">
    <div class="otb" style="height:${WIDE?130:150}px;padding:0 34px"><div style="position:relative;height:100%;flex:1"><div id="ht" style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center"><div id="hn" style="font-size:${WIDE?52:50}px;font-weight:800;letter-spacing:-1px"></div><div id="hd" style="font-family:Menlo,monospace;font-size:${WIDE?34:32}px;color:#EE9A00;font-weight:800;margin-top:4px"></div></div></div><div class="chip" id="hc"></div></div>
    <div class="items" id="it" style="margin:22px 26px 0"><div class="row sm" style="min-height:56px;color:var(--mut);font-size:24px;font-weight:700;letter-spacing:1px"><div class="rl">ITEM</div><div class="rr"><div class="c2" style="font-size:24px">QTY</div><div class="c3" style="font-size:24px">UOM</div><div class="c4 pr" style="font-size:24px">RATE</div><div class="c5 pr" style="font-size:24px;font-weight:700">AMOUNT</div></div></div>${rows}</div>
    <div class="tot" id="tot" style="flex-direction:row;justify-content:space-between;align-items:center;padding:24px 34px 30px"><div id="tl" style="font-size:30px;color:var(--mut);font-weight:600">6 lines · same order</div><div class="tr g" style="width:auto;margin:0;gap:24px"><span>Total</span><b id="gt" style="color:var(--pri)">${fmt(TOTAL)}</b></div></div>
   </div></div>
   <div id="steps" style="position:absolute;${WIDE?'left:1240px;top:90px;width:620px;display:flex;flex-direction:column;gap:20px':'left:60px;top:130px;width:960px;display:grid;grid-template-columns:1fr 1fr;gap:18px'}">${steps}</div>`;
  STAGE.appendChild(root);
  $('#top').style.display='none';
  const rowsEl=$$('.row.sm',root).slice(1);
  const hc=$('#hc');
  const mk=(D)=>{hc.innerHTML=`<span class="cs-${D.st[1].replace(/ /g,'')}">${D.st[1]}</span>`;return hc.firstChild;};
  // chips measured per doc
  const chipsHtml=DL.map(D=>D.st[1]);
  const phase=1.65;
  const sh=$('#steps');
  // pre-measure chip widths
  const cwid=DL.map(D=>{hc.innerHTML=`<span class="cs-${D.st[1].replace(/ /g,'')}">${D.st[1]}</span>`;return hc.firstChild.offsetWidth;});
  const titles=['Quotation','Sales Order','Delivery Order','Invoice'];
  let last=-1;
  return function render(t){
    $('#b1').style.transform=`translate(${Math.sin(t*.4)*60}px,${t*14}px)`;$('#b2').style.transform=`translate(${-Math.cos(t*.35)*50}px,${-t*10}px)`;$('#dots').style.transform=`translate(${-t*10}px,${-t*14}px)`;
    const e=eout(P(t,0,.6));$('#op').style.opacity=e;$('#op').style.transform=`translateY(${(1-e)*60}px)`;$('#steps').style.opacity=eout(P(t,.1,.7));
    const idx=Math.min(3,Math.floor(t/phase));const lt=t-idx*phase;
    const D=DL[idx];
    if(idx!==last){last=idx;}
    // header swap with slide: first 0.35s of each phase
    const sw=esm(P(lt,0,.4));
    const prev=DL[Math.max(0,idx-1)];
    $('#hn').textContent=D.title.replace('TAX ','');$('#hn').textContent=titles[idx];$('#hd').textContent=D.no;
    $('#ht').style.opacity=idx===0?eout(P(t,.2,.7)):sw;$('#ht').style.transform=`translateY(${(1-(idx===0?1:sw))*28}px)`;
    // chip: show previous→current state
    const stTxt=idx===0?D.st[0]:D.st[1];
    const cur=D.st[1];hc.innerHTML=`<span class="cs-${cur.replace(/ /g,'')}" style="width:${cwid[idx]}px">${cur}</span>`;hc.style.width=cwid[idx]+'px';hc.style.opacity=idx===0?eout(P(t,.3,.8)):sw;
    hc.style.boxShadow=`0 0 ${36*Math.sin(Math.PI*P(lt,.1,.8))}px rgba(238,154,0,.7)`;
    // rows stagger at start + pulse each phase
    rowsEl.forEach((r,i)=>{const x=idx===0?eout(P(t,.35+i*.1,.8+i*.1)):1;r.style.opacity=x;r.style.transform=`translateX(${(1-x)*80}px)`;
      const pu=Math.sin(Math.PI*P(lt,.3+i*.06,.75+i*.06));r.style.background=`rgba(238,154,0,${.1*pu})`;});
    // price columns: hide on DN
    const pf=idx===2?1:0;const pm=idx===2?esm(P(lt,0,.4)):(idx===3?1-esm(P(lt,0,.4)):0);
    $$('.pr',root).forEach(el=>{el.style.opacity=1-pm*.85;});
    $('#tl').textContent=idx===2?'6 / 6 lines delivered':idx===3?'Due 06/11/2026 · 30 days':'6 lines · same order';
    $('#gt').style.opacity=1-pm*.8;
    // steps
    DL.forEach((d,i)=>{const s=$('#st'+i);s.classList.toggle('on',i===idx);const k=$('.stk',s);const dn=i<idx?1:(i===idx&&lt>1.4?1:0);k.style.opacity=dn;});
    // camera: slow push
    const s=1+.025*esm(P(t,0,6.6));const k=[s,CX,CY];$$('.cam',root).forEach(c=>{});
    root.firstChild.style.transform=`translate(${CX-CX*s}px,${CY-CY*s}px) scale(${s})`;
  };
}
/* ================= human review / confirm ================= */
function buildReview(){
  const dur=7;
  const D=DOCS.s5;
  const root=document.createElement('div');root.className='layer';
  const rows=LINES.map((l,i)=>`<div class="row rv" id="rv${i}"><div class="rl"><div class="nm">${l[1]}</div><div class="sk">${l[0]} <em>← “${l[2]}”</em></div></div><div class="rr"><div class="c2">${l[3]}</div><div class="c3">${l[4]}</div><div class="c4">${fmt(l[5])}</div><div class="c5">${fmt(l[3]*l[5])}</div></div>${i===4?`<div class="opts" id="opts"><div class="opt" id="o1"><span>Udang 31/40 10kg</span><i>RM 168.00 / CTN</i></div><div class="opt" id="o2"><span>Udang 41/50 10kg</span><i>other size</i></div></div>`:''}</div>`).join('');
  const css=document.createElement('style');css.textContent=`
  .row.rv{display:grid;grid-template-columns:1fr ${WIDE?'100px 110px 150px 190px':'84px 96px 130px 170px'};align-items:center;min-height:${WIDE?70:128}px;padding:${WIDE?0:'10px'} ${WIDE?28:20}px;overflow:hidden}${WIDE?'':'.row.rv .sk em{display:none}.row.rv .nm .chip{display:block;margin:8px 0 0!important;width:auto}'}body.w .row.rv{min-height:70px;padding:0 28px}.row.rv .rr{display:contents}
  .row.rv .c2,.row.rv .c3,.row.rv .c4,.row.rv .c5{font-size:${WIDE?31:28}px;text-align:right;font-variant-numeric:tabular-nums}.row.rv .c3{text-align:left;padding-left:14px;color:var(--mut)}.row.rv .c4{color:var(--mut)}.row.rv .c5{font-weight:800}
  .row.rv .nm{font-size:${WIDE?33:30}px}.row.rv .sk{font-size:${WIDE?26:25}px}
  .opts{grid-column:1/-1;display:flex;gap:16px;padding:0 0 0 0;overflow:hidden;height:0}
  .opt{flex:1;border:2px solid var(--bd);border-radius:18px;height:84px;display:flex;flex-direction:column;justify-content:center;padding:0 22px;background:var(--card)}.opt span{font-size:${WIDE?31:29}px;font-weight:700}.opt i{font-style:normal;font-size:25px;color:var(--mut);margin-top:2px}
  .opt.sel{border-color:#4ade80;background:rgba(74,222,128,.13)}
  .cur{position:absolute;left:0;top:0;width:60px;height:60px;z-index:30;filter:drop-shadow(0 6px 10px rgba(0,0,0,.6))}
  .banner{display:flex;align-items:center;gap:16px;font-size:${WIDE?32:30}px;font-weight:700;color:#4ade80}
  `;document.head.appendChild(css);
  const card=WIDE?'left:60px;top:36px;width:1180px;':'left:60px;top:140px;width:960px;';
  const side=WIDE?`<div id="side" style="position:absolute;left:1290px;top:36px;width:570px;height:700px;border-radius:34px;background:var(--card);border:1.5px solid var(--bd);padding:34px;display:flex;flex-direction:column;gap:22px"></div>`:'';
  root.innerHTML=`<div class="cam"><div class="oms" id="op" style="${card}">
    <div class="otb" style="height:${WIDE?84:110}px"><div class="org"><img src="../../work/logo_lavender.png" style="background:#0B0B0D;padding:4px"><span>FreezeFood Sdn. Bhd.</span></div><div class="upd"><span>Reviewing</span><b>Aina Sofea</b></div></div>
    <div class="dh" style="flex-direction:row;align-items:center;gap:22px;padding:22px 34px 8px"><div class="dno" id="dno" style="font-size:${WIDE?48:44}px">${D.no}</div><div class="chip" id="chip"><span class="cs-Draft">Draft</span><span class="cs-Confirmed">Confirmed ✓</span></div></div>
    <div class="items" id="it" style="margin:16px 26px 0"><div class="ih"><span>Items</span><small>6 lines</small></div>${rows}</div>
    <div class="tot" style="flex-direction:row;justify-content:space-between;align-items:center;padding:20px 34px 6px"><div style="font-size:30px;color:var(--mut)">Total</div><b id="gt" style="font-size:56px;color:var(--pri);font-weight:800">${fmt(TOTAL)}</b></div>
    <div class="cfoot" style="display:flex;padding:14px 34px 30px"><div class="btn" id="bc" style="flex:1"><span id="bct">Confirm order</span><div class="rip" id="rip"></div></div></div>
   </div>
   ${side}
   <svg class="cur" id="cur" viewBox="0 0 24 24"><path d="M4 2l15 9-6.5 1.6L9.5 19z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></svg></div>`;
  STAGE.appendChild(root);
  $('#top').style.display='none';
  const bc=$('#bc');bc.style.background='var(--pri)';bc.style.color='#1a1100';bc.style.borderColor='transparent';
  const chip=$('#chip');const cs=$$('span',chip).filter(s=>s.parentNode===chip),cw=cs.map(s=>s.offsetWidth);
  const r4=$('#rv4');const opts=$('#opts');
  const baseH=r4.offsetHeight;r4.style.minHeight='';
  // needs-check chip inside row 4
  const nm=$('.nm',r4);nm.insertAdjacentHTML('beforeend',`<span class="chip sm" id="nc" style="margin-left:14px;vertical-align:middle;${WIDE?'':'display:block;margin:8px 0 0'}"><span class="cs-Check">Needs your check</span><span class="cs-Confirmed" style="opacity:0">Confirmed ✓</span></span>`);
  const nc=$('#nc'),ns=$$('span',nc).filter(s=>s.parentNode===nc),nw=ns.map(s=>s.offsetWidth);
  const cam=root.firstChild;
  const ctr2=el=>{const r=el.getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/2]};
    // measure open height
  opts.style.height='84px';const openH=r4.offsetHeight;opts.style.height='0';
  const rowsAll=$$('.row.rv',root);
  const P4=ctr2(r4),B=ctr2(bc);
  const o1=$('#o1');opts.style.height='84px';const O1=ctr2(o1);opts.style.height='0';
  // side panel (wide): review checklist
  if(WIDE){$('#side').innerHTML=`<div style="font-size:36px;font-weight:800">Review</div>
   <div class="chk" id="k0"><b>1</b><span>6 lines matched to SKU, unit and price</span></div>
   <div class="chk" id="k1"><b>2</b><span>1 line needs a check</span></div>
   <div class="chk" id="k2"><b>3</b><span>Confirm before it goes through</span></div>
   <div id="sban" style="margin-top:auto;font-size:30px;color:var(--mut)">Staff stay in control.</div>`;
   const c2=document.createElement('style');c2.textContent=`.chk{display:flex;gap:18px;align-items:flex-start;font-size:30px;line-height:1.3;padding:18px 0;border-bottom:1.5px solid var(--bd)}.chk b{flex:none;width:48px;height:48px;border-radius:24px;background:rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;font-size:26px;color:var(--mut)}.chk.done b{background:rgba(74,222,128,.18);color:#4ade80}`;document.head.appendChild(c2);}
  return function render(t){
    $('#b1').style.transform=`translate(${Math.sin(t*.4)*60}px,${t*14}px)`;$('#b2').style.transform=`translate(${-Math.cos(t*.35)*50}px,${-t*10}px)`;$('#dots').style.transform=`translate(${-t*10}px,${-t*14}px)`;
    const e=eout(P(t,0,.7));$('#op').style.opacity=e;$('#op').style.transform=`translateY(${(1-e)*70}px)`;
    if(WIDE)$('#side').style.opacity=eout(P(t,.3,1));
    rowsAll.forEach((r,i)=>{const x=eout(P(t,.35+i*.09,.8+i*.09));r.style.opacity=x;});
    // row 4 expand 1.7-2.3, collapse 3.3-3.8
    const ex=esm(P(t,1.7,2.3))*(1-esm(P(t,3.4,3.9)));
    opts.style.height=(84*ex)+'px';
    r4.style.paddingBottom=(ex*14)+'px';
    // selection
    const sel=P(t,2.9,3.1);$('#o1').classList.toggle('sel',t>2.95);
    // needs-check chip morph 3.5
    const q=esm(P(t,3.6,3.95));nc.style.width=lerp(nw[0],nw[1],q)+'px';ns[0].style.opacity=1-q;ns[1].style.opacity=q;ns[0].style.transform=`translateY(${-q*50}px)`;ns[1].style.transform=`translateY(${(1-q)*50}px)`;ns.forEach((s,i)=>s.style.width=nw[i]+'px');
    r4.style.background=`rgba(238,154,0,${.12*Math.sin(Math.PI*P(t,1.3,3.9))})`;
    // confirm
    const pr=P(t,5.0,5.35);const rip=$('#rip');rip.style.opacity=pr>0&&pr<1?.7*(1-pr):0;rip.style.transform=`scale(${1+pr*20})`;bc.style.transform=`scale(${1-.04*Math.sin(Math.PI*clamp(pr*1.5))})`;
    const cf=esm(P(t,5.2,5.7));
    $('#bct').innerHTML=cf>.5?`${ICON.chk.replace('<svg','<svg style="width:34px;height:34px;stroke:#04200e;fill:none;stroke-width:3.4;vertical-align:middle;margin-right:10px"')}Confirmed by Aina Sofea`:'Confirm order';
    bc.style.background=cf>.5?'#4ade80':'var(--pri)';
    const m=esm(P(t,5.3,5.8));chip.style.width=lerp(cw[0],cw[1],m)+'px';cs[0].style.opacity=1-m;cs[0].style.transform=`translateY(${-m*70}px)`;cs[1].style.opacity=m;cs[1].style.transform=`translateY(${(1-m)*70}px)`;cs.forEach((s,i)=>s.style.width=cw[i]+'px');
    chip.style.boxShadow=`0 0 ${40*Math.sin(Math.PI*P(t,5.3,6.2))}px rgba(74,222,128,.8)`;
    if(WIDE){$('#k0').classList.toggle('done',t>1.2);$('#k1').classList.toggle('done',t>3.7);$('#k2').classList.toggle('done',t>5.5);$('#sban').innerHTML=t>5.7?'<div class="banner">'+ICON.chk.replace('<svg','<svg style="width:36px;height:36px;stroke:#4ade80;fill:none;stroke-width:3.4"')+'Confirmed. Ready to sync.</div>':'Staff stay in control.';}
    // cursor path
    const cx=kf(t,[[0,CX+300,CY+500],[2.1,CX+300,CY+420],[2.9,O1[0]+30,O1[1]+10],[3.15,O1[0]+30,O1[1]+10],[4.2,B[0]+330,B[1]-20],[5.0,B[0]+60,B[1]+4],[7,B[0]+60,B[1]+4]]);
    $('#cur').style.transform=`translate(${cx[0]}px,${cx[1]}px)`;$('#cur').style.opacity=P(t,1.2,1.6)*(1-P(t,5.5,5.8));
    // sync O1 position as row expands (needs live pos)
    const o1r=ctr2($('#o1'));
    const cc=kf(t,[[0,CX+300,CY+500],[2.1,CX+300,CY+420],[2.9,o1r[0]+30,o1r[1]+10],[3.15,o1r[0]+30,o1r[1]+10],[4.2,B[0]+330,B[1]-20],[5.0,B[0]+60,B[1]+4],[7,B[0]+60,B[1]+4]]);
    $('#cur').style.transform=`translate(${cc[0]}px,${cc[1]}px) scale(${1-.12*Math.sin(Math.PI*P(t,3.1,3.3))})`;
    // camera: push on row 4 then to confirm
    const k=[1,CX,CY];
    cam.style.transform=`translate(${CX-k[1]*k[0]}px,${CY-k[2]*k[0]}px) scale(${k[0]})`;
    if(WIDE)$('#side').style.opacity=eout(P(t,.3,1))*(1-clamp((k[0]-1)/.12));
  };
}
/* ================= recap: chat + ERP side by side ================= */
function buildRecap(){
  const dur=4.4;
  const DOCSL=[['QTN-2026-00201','Quotation'],['SO-2026-00350','Sales Order'],['DN-2026-00188','Delivery Order'],['INV-2026-00412','Invoice']];
  const root=document.createElement('div');root.className='layer';
  const css=document.createElement('style');css.textContent=`.rc{position:absolute;border-radius:${WIDE?44:48}px}.rcerp .c8h{height:96px;font-size:34px}.rcrow{display:flex;align-items:center;justify-content:space-between;height:${WIDE?104:104}px;padding:0 34px;border-bottom:1.5px solid var(--bd)}.rcrow:last-child{border:0}.rcrow .a{font-family:Menlo,monospace;font-size:${WIDE?32:31}px;font-weight:700}.rcrow .b{font-size:26px;color:var(--mut);margin-top:3px}`;document.head.appendChild(css);
  const chatPos=WIDE?'left:90px;top:110px;width:820px;height:860px;':'left:70px;top:200px;width:940px;height:720px;';
  const erpPos=WIDE?'left:1000px;top:110px;width:830px;':'left:60px;top:990px;width:960px;';
  const erpRows=DOCSL.map(d=>`<div class="rcrow"><div><div class="a">${d[0]}</div><div class="b">${d[1]}</div></div><div style="display:flex;gap:12px"><span class="chip sm cs-Synced"><span class="cs-Synced" style="width:auto">SQL Account ✓</span></span><span class="chip sm cs-Synced"><span class="cs-Synced" style="width:auto">AutoCount ✓</span></span></div></div>`).join('');
  root.innerHTML=`<div class="cam"><div class="chat rc" id="ch" style="${chatPos}"><div class="pat"></div>
    <div class="chh" style="height:104px"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg><div class="av" style="width:68px;height:68px"><img src="../../work/logo_lavender.png" style="width:50px;height:50px"></div><div><div class="n">MAIA</div><div class="s">online</div></div></div>
    <div class="msgs" style="top:104px;bottom:20px;gap:14px"><div class="dchip">TODAY</div>
     <div class="bub out" id="m1"><div>Confirm</div><div class="tm">09:03 ${ICON.tk2}</div></div>
     <div class="bub in big" id="m2" style="width:${WIDE?740:850}px"><div class="t1">${ICON.chk.replace('<svg','<svg style="width:40px;height:40px;stroke:#00a884;fill:none;stroke-width:3.4;stroke-linecap:round;stroke-linejoin:round"')} Synced</div><div style="margin-top:6px">${CUST}</div><div style="color:#54656f">Posted to SQL Account and AutoCount</div><div class="tm">09:03</div></div>
    </div></div>
   <div class="card8 rcerp" id="ec" style="${erpPos}"><div class="c8h"><span>Your ERP</span><small>${CUST}</small></div>${erpRows}</div></div>`;
  STAGE.appendChild(root);
  $('#top').style.display='none';
  const ec=$('#ec');ec.style.position='absolute';
  const rows=$$('.rcrow',ec),chs=$$('.chip',ec);
  // wide: vertically centre ERP card
  if(WIDE){const h=ec.offsetHeight;ec.style.top=(110+(860-h)/2)+'px';}
  const cam=root.firstChild;
  return function render(t){
    $('#b1').style.transform=`translate(${Math.sin(t*.4)*60}px,${t*14}px)`;$('#b2').style.transform=`translate(${-Math.cos(t*.35)*50}px,${-t*10}px)`;$('#dots').style.transform=`translate(${-t*10}px,${-t*14}px)`;
    const a=eout(P(t,0,.7)),b=eout(P(t,.2,.9));
    $('#ch').style.opacity=a;$('#ch').style.transform=`translateY(${(1-a)*80}px)`;$('#ec').style.opacity=b;$('#ec').style.transform=`translateY(${(1-b)*100}px)`;
    const m1=eout(P(t,.4,.8)),m2=eback(P(t,1.0,1.5));$('#m1').style.opacity=m1;$('#m1').style.transform=`translateY(${(1-m1)*30}px)`;
    $('#m2').style.opacity=clamp(m2*2);$('#m2').style.transform=`translateY(${(1-m2)*50}px) scale(${lerp(.92,1,Math.min(1,m2))})`;$('#m2').style.transformOrigin='0 100%';
    rows.forEach((r,i)=>{const x=eout(P(t,.5+i*.12,.95+i*.12));r.style.opacity=x;r.style.transform=`translateX(${(1-x)*60}px)`;});
    const s=1+.03*esm(P(t,0,4.4));cam.style.transform=`translate(${CX-CX*s}px,${CY-CY*s}px) scale(${s})`;
  };
}

function fixChips(root){$$('.chip',root).forEach(c=>{const k=[...c.children].filter(s=>s.tagName==='SPAN');if(k.length===1){c.style.width=k[0].offsetWidth+'px';}});}
let R;
const QDUR={s4:2.5,s5:2,s6:1.2,s7:1.2};
window.addEventListener('load',()=>{
  document.fonts.ready.then(()=>{
    if(SC==='s8'){R=buildSync();window.__dur=10.7;}
    else if(SC==='same'){R=buildSame();window.__dur=6.6;}
    else if(SC==='review'){R=buildReview();window.__dur=7;}
    else if(SC==='recap'){R=buildRecap();window.__dur=4.4;}
    else if(QDUR[SC]){R=buildQuick(DOCS[SC],QDUR[SC]);window.__dur=QDUR[SC];}
    else if(SC&&SC[0]==='f'){const key='s'+SC[1];R=buildDoc(DOCS[key]);window.__dur=DOCS[key].dur;}
    fixChips(document);window.render=(t)=>R(t);
    R(0);window.__ready=true;
  });
});
