const $=s=>document.querySelector(s);
let backbone='meanflow',task='ocr',index=0,k=4;
const samples=()=>window.SAMPLES.filter(s=>s.backbone===backbone&&s.task===task);
const current=()=>samples()[index];
const pad=n=>String(n).padStart(2,'0');
function lightbox(src,label){$('#lightbox-image').src=src;$('#lightbox-image').alt=label;$('#lightbox-caption').textContent=label;$('#lightbox').showModal()}
function setPressed(sel,pred){document.querySelectorAll(sel).forEach(b=>{b.classList.toggle('active',pred(b));b.setAttribute('aria-pressed',String(pred(b)))})}
function tile(who,label){
 const s=current(),src=s.images[who][String(k)],f=document.createElement('figure');if(who==='ours')f.className='ours';
 const b=document.createElement('button');b.type='button';b.className='zoom';b.setAttribute('aria-label','Enlarge '+label);
 const im=document.createElement('img');im.src=src;im.alt=label+': '+s.prompt;b.append(im);b.addEventListener('click',()=>lightbox(src,label));f.append(b);return f}
function renderStage(){$('#stage').replaceChildren(tile('base','Base · K = '+k),tile('ours','Flow-Map GRPO · K = '+k))}
function renderSteps(){
 const box=$('#steps');box.replaceChildren();
 for(const step of current().steps){const b=document.createElement('button');b.type='button';b.textContent=step;b.className=step===k?'active':'';b.setAttribute('aria-pressed',String(step===k));if(step===4)b.title='Training setting';b.addEventListener('click',()=>{k=step;renderSteps();renderStage()});box.append(b)}}
function render(){
 const list=samples(),s=current();if(!s.steps.includes(k))k=4;
 $('#prompt').textContent='“'+s.prompt+'”';$('#counter').textContent=pad(index+1)+' / '+pad(list.length);
 const thumbs=$('#thumbs');thumbs.replaceChildren();
 list.forEach((sample,i)=>{const b=document.createElement('button');b.type='button';b.className=i===index?'thumb active':'thumb';b.setAttribute('aria-label','Example '+(i+1));b.setAttribute('aria-pressed',String(i===index));const im=document.createElement('img');im.src=sample.thumbnail;im.alt='';b.append(im);b.addEventListener('click',()=>{index=i;render()});thumbs.append(b)});
 renderSteps();renderStage()}
document.querySelectorAll('[data-backbone]').forEach(b=>b.addEventListener('click',()=>{backbone=b.dataset.backbone;index=0;setPressed('[data-backbone]',t=>t===b);render()}));
document.querySelectorAll('[data-task]').forEach(b=>b.addEventListener('click',()=>{task=b.dataset.task;index=0;setPressed('[data-task]',t=>t===b);render()}));
const step=d=>{const n=samples().length;index=(index+n+d)%n;render()};
$('#prev').addEventListener('click',()=>step(-1));$('#next').addEventListener('click',()=>step(1));
document.addEventListener('keydown',e=>{if($('#lightbox').open)return;const r=$('#comparison').getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;if(e.key==='ArrowLeft')step(-1);if(e.key==='ArrowRight')step(1)});
document.querySelectorAll('figure>.zoom').forEach(b=>b.addEventListener('click',()=>lightbox(b.querySelector('img').src,b.dataset.caption)));
$('#close-lightbox').addEventListener('click',()=>$('#lightbox').close());$('#lightbox').addEventListener('click',e=>{if(e.target===$('#lightbox'))$('#lightbox').close()});
$('#copy-bib').addEventListener('click',async()=>{const t=$('#bib').textContent;try{await navigator.clipboard.writeText(t)}catch{const r=document.createRange();r.selectNodeContents($('#bib'));const sel=getSelection();sel.removeAllRanges();sel.addRange(r);document.execCommand('copy');sel.removeAllRanges()}$('#copy-bib').textContent='Copied';setTimeout(()=>$('#copy-bib').textContent='Copy',1600)});
render();
