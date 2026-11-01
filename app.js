const $=s=>document.querySelector(s);
const LABEL={base:'Base',ours:'Flow-Map GRPO'};
let backbone='meanflow',task='ocr',index=0,k=4,mode='pair';
const samples=()=>window.SAMPLES.filter(s=>s.backbone===backbone&&s.task===task);
const current=()=>samples()[index];
function lightbox(src,label){$('#lightbox-image').src=src;$('#lightbox-image').alt=label;$('#lightbox-caption').textContent=label;$('#lightbox').showModal()}
function tile(src,label,highlight){
 const f=document.createElement('figure');if(highlight)f.className='highlight';const c=document.createElement('figcaption');c.textContent=label;
 const b=document.createElement('button');b.className='image-button';b.setAttribute('aria-label','Enlarge '+label);const im=document.createElement('img');im.src=src;im.alt=label+': '+current().prompt;im.loading='lazy';
 b.append(im);b.addEventListener('click',()=>lightbox(src,label));f.append(c,b);return f}
function setPressed(sel,pred){document.querySelectorAll(sel).forEach(b=>{b.classList.toggle('active',pred(b));b.setAttribute('aria-pressed',String(pred(b)))})}
function renderSteps(){
 const s=current(),box=$('#steps');box.replaceChildren();const l=document.createElement('span');l.textContent='Steps K';box.append(l);
 for(const step of s.steps){const b=document.createElement('button');b.textContent=step;b.className=step===k?'active':'';b.setAttribute('aria-pressed',String(step===k));b.setAttribute('aria-label','K = '+step+(step===4?' (training setting)':''));if(step===4)b.title='Training setting';b.addEventListener('click',()=>{k=step;renderSteps();renderView()});box.append(b)}
 box.hidden=mode==='sweep'}
function renderView(){
 const s=current(),K=String(k);
 $('#pair').hidden=mode!=='pair';$('#slider-panel').hidden=mode!=='slider';$('#sweep-panel').hidden=mode!=='sweep';
 if(mode==='pair'){$('#pair').replaceChildren(tile(s.images.base[K],'Base · K = '+K,false),tile(s.images.ours[K],'Flow-Map GRPO · K = '+K,true))}
 if(mode==='slider'){$('#left-image').src=s.images.base[K];$('#left-image').alt='Base: '+s.prompt;$('#right-image').src=s.images.ours[K];$('#right-image').alt='Flow-Map GRPO: '+s.prompt;$('#left-label').textContent='Base · K = '+K;$('#right-label').textContent='Flow-Map GRPO · K = '+K}
 if(mode==='sweep'){
  const g=$('#sweep');g.replaceChildren();g.style.setProperty('--n',s.steps.length);g.append(document.createElement('span'));
  for(const step of s.steps){const h=document.createElement('span');h.className='col-label';h.textContent='K = '+step;g.append(h)}
  for(const who of ['base','ours']){const r=document.createElement('span');r.className='row-label'+(who==='ours'?' ours-label':'');r.textContent=LABEL[who];g.append(r);
   for(const step of s.steps){const t=tile(s.images[who][String(step)],LABEL[who]+' · K = '+step,who==='ours');t.querySelector('figcaption').remove();g.append(t)}}}
}
function render(){
 const list=samples(),s=current();$('#prompt').textContent=s.prompt;$('#counter').textContent=String(index+1).padStart(2,'0')+' / '+String(list.length).padStart(2,'0');
 if(!s.steps.includes(k))k=4;
 const thumbs=$('#thumbnails');thumbs.replaceChildren();
 list.forEach((sample,i)=>{const b=document.createElement('button');b.className=i===index?'thumb active':'thumb';b.setAttribute('aria-label','Show example '+(i+1));b.setAttribute('aria-pressed',String(i===index));const im=document.createElement('img');im.src=sample.thumbnail;im.alt='';const n=document.createElement('span');n.textContent=String(i+1).padStart(2,'0');b.append(im,n);b.addEventListener('click',()=>{index=i;render()});thumbs.append(b)});
 renderSteps();renderView()}
document.querySelectorAll('[data-backbone]').forEach(b=>b.addEventListener('click',()=>{backbone=b.dataset.backbone;index=0;setPressed('[data-backbone]',t=>t===b);render()}));
document.querySelectorAll('[data-task]').forEach(b=>b.addEventListener('click',()=>{task=b.dataset.task;index=0;setPressed('[data-task]',t=>t===b);render()}));
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;setPressed('[data-mode]',t=>t===b);renderSteps();renderView()}));
const step=d=>{const n=samples().length;index=(index+n+d)%n;render()};
$('#prev').addEventListener('click',()=>step(-1));$('#next').addEventListener('click',()=>step(1));
document.addEventListener('keydown',e=>{if($('#lightbox').open||/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName))return;const r=$('#compare').getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;if(e.key==='ArrowLeft')step(-1);if(e.key==='ArrowRight')step(1)});
$('#wipe').addEventListener('input',e=>{const p=e.target.value;$('#left-layer').style.clipPath=`inset(0 ${100-p}% 0 0)`;$('#divider').style.left=p+'%'});
$('#close-lightbox').addEventListener('click',()=>$('#lightbox').close());$('#lightbox').addEventListener('click',e=>{if(e.target===$('#lightbox'))$('#lightbox').close()});
$('#copy-bib').addEventListener('click',async()=>{const t=$('#bib').textContent;try{await navigator.clipboard.writeText(t)}catch{const r=document.createRange();r.selectNodeContents($('#bib'));const sel=getSelection();sel.removeAllRanges();sel.addRange(r);document.execCommand('copy');sel.removeAllRanges()}$('#copy-bib').textContent='Copied';setTimeout(()=>$('#copy-bib').textContent='Copy',1600)});
render();
