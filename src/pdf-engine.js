/* Local PDF generation. No external services. */
async function makeNewsletterPDF(model, logo, lib, fonts=null, fontkitModule=null) {
  const {PDFDocument, StandardFonts, rgb, PDFName, PDFString}=lib;
  const doc=await PDFDocument.create();
  doc.setTitle(model.title || model.kind); doc.setAuthor('Ullensaker Røde Kors Hjelpekorps');
  if(fonts && fontkitModule) doc.registerFontkit(fontkitModule);
  const regular=await doc.embedFont(fonts?fonts.regular:StandardFonts.Helvetica,{subset:true}), bold=await doc.embedFont(fonts?fonts.bold:StandardFonts.HelveticaBold,{subset:true});
  const red=rgb(.77,.02,.08), ink=rgb(.12,.15,.19), muted=rgb(.38,.41,.45);
  const W=595.28,H=841.89,M=48,CW=W-2*M; let page,y;
  const logoImg=logo ? await doc.embedPng(logo) : null;
  function newPage(){ page=doc.addPage([W,H]); y=H-48;
    if(logoImg){const d=logoImg.scaleToFit(238,60);page.drawImage(logoImg,{x:M,y:y-d.height,width:d.width,height:d.height});}
    else page.drawText('Ullensaker Røde Kors Hjelpekorps',{x:M,y:y-15,font:bold,size:13,color:ink});
    page.drawLine({start:{x:M,y:H-123},end:{x:W-M,y:H-123},thickness:1.5,color:red}); y=H-147;
  }
  newPage();
  function ensure(h){if(y-h<58)newPage();}
  function canEncode(s,font){try{font.encodeText(s);return true;}catch{return false;}}
  function width(s,font,size){if(canEncode(s,font))return font.widthOfTextAtSize(s,size);if(typeof document!=='undefined'){const c=document.createElement('canvas').getContext('2d');c.font=`${font===bold?'bold ':''}${size}px Arial`;return c.measureText(s).width;}return s.length*size*.56;}
  function wrap(s,font,size,max=CW){const out=[];for(const para of String(s).replace(/\r/g,'').replace(/\t/g,'    ').split('\n')){let line=''; for(const part of para.split(/(\s+)/)){if(width(line+part,font,size)<=max){line+=part;continue;}if(line.trim()){out.push(line.trimEnd());line='';}if(width(part,font,size)<=max){line=part.trimStart();continue;}for(const c of Array.from(part)){if(width(line+c,font,size)>max&&line){out.push(line);line='';}line+=c;}}out.push(line.trimEnd());}return out;}
  async function drawTextLine(s,font,size,color){if(!s)return;if(canEncode(s,font)){page.drawText(s,{x:M,y:y-size,font,size,color});}else if(typeof document!=='undefined'){const canvas=document.createElement('canvas');canvas.width=Math.ceil(width(s,font,size)*3+8);canvas.height=Math.ceil(size*1.55*3);const ctx=canvas.getContext('2d');ctx.font=`${font===bold?'bold ':''}${size*3}px Arial`;ctx.fillStyle=`rgb(${Math.round(color.red*255)},${Math.round(color.green*255)},${Math.round(color.blue*255)})`;ctx.textBaseline='alphabetic';ctx.fillText(s,0,size*3);const im=await doc.embedPng(canvas.toDataURL('image/png'));page.drawImage(im,{x:M,y:y-canvas.height/3,width:canvas.width/3,height:canvas.height/3});}else throw Error('Unsupported test character');}
  async function text(s,size=11,font=regular,color=ink,gap=10,link=null){for(const line of wrap(s,font,size)){ensure(size*1.55);await drawTextLine(line,font,size,color);if(link&&line){const annotation=doc.context.obj({Type:'Annot',Subtype:'Link',Rect:[M,y-size*1.4,M+Math.min(CW,width(line,font,size)),y+2],Border:[0,0,0],A:{Type:'Action',S:'URI',URI:PDFString.of(link)}});page.node.addAnnot(doc.context.register(annotation));page.drawLine({start:{x:M,y:y-size-2},end:{x:M+Math.min(CW,width(line,font,size)),y:y-size-2},thickness:.4,color});}y-=size*1.55;}y-=gap;}
  await text([model.kind,model.period].filter(Boolean).join(' · '),10,bold,red,9);
  await text(model.title||model.kind,25,bold,ink,14);
  for(const b of model.blocks){if(b.type==='heading'){ensure(65);await text(b.text,16,bold,ink,7);}else if(b.type==='text')await text(b.text);else if(b.type==='link'&&b.url){ensure(45);await text(b.label||b.url,11,bold,red,12,b.url);}else if(b.type==='image'&&b.data){const im=b.data.startsWith('data:image/png')?await doc.embedPng(b.data):await doc.embedJpg(b.data);const maxW=CW*(b.width||100)/100;const dims=im.scaleToFit(maxW,390);const capLines=b.caption?wrap(b.caption,regular,9):[];ensure(dims.height+Math.min(capLines.length,3)*14+18);page.drawImage(im,{x:M+(CW-dims.width)/2,y:y-dims.height,width:dims.width,height:dims.height});y-=dims.height+8;if(b.caption)await text(b.caption,9,regular,muted,12);else y-=10;}}
  if(model.sender){ensure(65);y-=7;await text(model.sender,11,regular,ink,0);}
  const pages=doc.getPages();pages.forEach((p,i)=>{p.drawLine({start:{x:M,y:44},end:{x:W-M,y:44},thickness:.5,color:rgb(.82,.83,.85)});p.drawText('Ullensaker Røde Kors Hjelpekorps',{x:M,y:29,font:regular,size:8,color:muted});p.drawText(`${i+1} / ${pages.length}`,{x:W-M-30,y:29,font:regular,size:8,color:muted});});
  return await doc.save();
}
if(typeof module!=='undefined')module.exports={makeNewsletterPDF};
