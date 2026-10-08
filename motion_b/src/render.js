const puppeteer = require('/Users/fahimzahar/Downloads/MAIA/Codex_MAIA/06. Creatives/New Videos_MAIA/10. Feature-Outcome Series/motion/src_a/oms/node_modules/puppeteer-core');
const { spawn } = require('child_process'); const path=require('path'), fs=require('fs');
const CHROME='/Users/fahimzahar/.cache/hyperframes/chrome/chrome-headless-shell/mac_arm-152.0.7928.2/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const NAME={same:'scene_same-order',review:'scene_review-confirm',recap:'scene_recap',f4:'scene4_quotation_full',f5:'scene5_sales-order_full',f6:'scene6_delivery-order_full',f7:'scene7_invoice_full',s4:'scene4_quotation',s5:'scene5_sales-order',s6:'scene6_delivery-order',s7:'scene7_invoice',s8:'scene8_erp-sync'};
(async()=>{
  const scene=process.argv[2], stills=process.argv[3]; const mode=process.argv[4]||'9x16'; const W=mode==='16x9'?1920:1080,H=mode==='16x9'?1080:1920;
  const b=await puppeteer.launch({executablePath:CHROME,headless:'shell',args:['--no-sandbox','--allow-file-access-from-files']});
  const pg=await b.newPage(); await pg.setViewport({width:W,height:H,deviceScaleFactor:1});
  pg.on('pageerror',e=>console.log('PAGEERR',e.message)); pg.on('console',m=>{if(m.type()==='error')console.log('CONERR',m.text())});
  await pg.goto('file://'+path.join(__dirname,'docs.html')+'?scene='+scene+'&mode='+mode);
  await pg.waitForFunction('window.__ready===true',{timeout:20000});
  const dur=await pg.evaluate('window.__dur');
  const out=path.join(__dirname,'..',NAME[scene]+'_'+mode+'.mp4');
  if(stills){const d='/tmp/stills_'+scene+'_'+mode;fs.mkdirSync(d,{recursive:true});for(const t of stills.split(',')){await pg.evaluate(`render(${t})`);await pg.screenshot({path:`${d}/s_${t}.png`});}await b.close();return;}
  const ff=spawn('ffmpeg',['-loglevel','error','-y','-f','image2pipe','-framerate','30','-i','-','-vf','scale=out_range=tv:out_color_matrix=bt709,format=yuv420p','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-c:v','libx264','-crf','16','-preset','slow','-movflags','+faststart',out],{stdio:['pipe','inherit','inherit']});
  const n=Math.round(dur*30);
  for(let i=0;i<n;i++){await pg.evaluate(`render(${i/30})`);const buf=await pg.screenshot({type:'jpeg',quality:94});if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));}
  ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();console.log(out,dur);
})();
