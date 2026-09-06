const healthButton=el('health-check'),healthOutput=el('health-result');
function healthStorage(){const key='__korpsbrev_status__';try{localStorage.setItem(key,'ok');const ok=localStorage.getItem(key)==='ok';localStorage.removeItem(key);return ok;}catch{return false;}}
healthButton.onclick=async()=>{healthButton.disabled=true;healthOutput.dataset.state='';healthOutput.textContent='Kontrollerer …';const checks=[
{label:'Appversjon',ok:/^\d+\.\d+\.\d+$/.test(APP_VERSION),detail:'versjon '+APP_VERSION},
{label:'Lokal lagring',ok:healthStorage(),detail:'innstillinger kan lagres på enheten'},
{label:'Filfunksjoner',ok:typeof FileReader!=='undefined'&&typeof Blob!=='undefined',detail:'åpning og lagring av brev'},
{label:'PDF-kontroll',ok:Boolean(globalThis.PDFLib),detail:'PDF-motor lastet'},
{label:'Nettverk',ok:navigator.onLine,detail:navigator.onLine?'tilkoblet':'frakoblet – brev kan fortsatt lages lokalt'}];
try{const repo=repository();if(!repo)throw Error('ingen oppdateringskilde');const raw=await githubFetch(repo,'version.json');const manifest=JSON.parse(raw);checks.push({label:'Oppdateringskilde',ok:manifest.app==='korpsbrev'&&/^\d+\.\d+\.\d+$/.test(manifest.version),detail:manifest.version?'versjon '+manifest.version:'ugyldig svar'});}catch(e){checks.push({label:'Oppdateringskilde',ok:false,detail:e.name==='AbortError'?'sjekken tok for lang tid':e.message});}
const failed=checks.filter(item=>!item.ok);healthOutput.dataset.state=failed.length===0?'ok':failed.length<checks.length?'warning':'error';const title=document.createElement('strong');title.textContent=failed.length===0?'Alt ser bra ut.':(checks.length-failed.length)+' av '+checks.length+' kontroller bestått.';const list=document.createElement('ul');checks.forEach(item=>{const li=document.createElement('li');li.textContent=(item.ok?'✓':'!')+' '+item.label+': '+item.detail;list.appendChild(li);});healthOutput.replaceChildren(title,list);healthButton.disabled=false;};
