import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root=path.dirname(fileURLToPath(import.meta.url));
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const previous=read('Korpsbrev.html');
const scripts=[...previous.matchAll(/<script>([\s\S]*?)<\/script>/g)];
if(scripts.length!==4)throw Error('Fant ikke de fire innebygde skriptene.');
const fonts=previous.match(/const KORPS_FONT_DATA=(\{[^\n]+\});/)[1];
const logo=previous.match(/const DEFAULT_LOGO='([^']+)';/)[1];
const updater=read('src/updater.js')+'\n'+read('src/status-check.js');
const version=updater.match(/const APP_VERSION='(\d+\.\d+\.\d+)'/)[1];
const notices=read('THIRD-PARTY-NOTICES.txt');
let html=read('src/shell.html').replace(/1\.0\.0/g,version)
 .replace('<!-- PDFLIB -->',()=>'<script>'+scripts[0][1]+'</script>')
 .replace('<!-- FONTKIT -->',()=>'<script>'+scripts[1][1]+'</script>')
 .replace('/* PDFENGINE */',()=>read('src/pdf-engine.js'))
 .replace('/* UPDATER */',()=>updater)
 .replace('__FONTS__',()=>fonts).replace('__LOGO__',()=>logo)
 .replace('</body>',()=>'<\!-- THIRD-PARTY NOTICES\n'+notices.replace(/--/g,'—')+'\n--></body>');
fs.writeFileSync(path.join(root,'Korpsbrev.html'),html);
fs.writeFileSync(path.join(root,'version.json'),JSON.stringify({app:'korpsbrev',version,file:'Korpsbrev.html',sha256:createHash('sha256').update(html).digest('hex')},null,2)+'\n');
console.log('Korpsbrev '+version+' er bygget.');
