import {readFileSync} from 'node:fs';
import {writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {projects,notes,social} from './content.mjs';
let domain='';
try{domain=readFileSync(new URL('../docs/CNAME',import.meta.url),'utf8').trim();}catch(error){if(error.code!=='ENOENT')throw error;}
if(domain&&!/^(?:[a-z0-9-]+\.)+[a-z]{2,}$/i.test(domain))throw Error('Invalid custom domain in docs/CNAME');
export const SITE_URL=domain?`https://${domain}/`:'https://mindlesstruffle.github.io/sammypersonalsite/';
export const absolute=route=>new URL(route,SITE_URL).href;
export const verification=JSON.parse(readFileSync(new URL('./search-verification.json',import.meta.url),'utf8'));
for(const key of ['google','bing','indexNowKey'])if(verification[key]&&!/^[A-Za-z0-9_-]+$/.test(verification[key]))throw Error('Invalid search verification token: '+key);
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const titleNames={'number-company':'The Number Company','neodev':'Neo Developer League','icon-emulator':'Icon Emulator','larpmegle':'Larpmegle','backflip':'Backflip Off a Cliff'};
const projectTitles={'number-company':'The Number Company — Numbered T-Shirt Project','neodev':'Neo Developer League — Interactive Website Project','icon-emulator':'Icon Emulator — Game Art Workflow','larpmegle':'Larpmegle — Three-Person Video Debate Game','backflip':'Backflip Off a Cliff — Game Development Project'};
const noteTitles={'one-shirt-one-number':'One Shirt, One Number — The Number Company','a-hundred-seconds':'A Hundred Seconds — Larpmegle Game Format'};
export const profileDescription='Sammy Hawari (mindlesstruffle) is a software developer in Waterloo, Ontario, building websites, creative tools, and games. Explore his projects and experience.';
export const pages=[
 {path:'',kind:'profile',name:'Sammy Hawari',title:'Sammy Hawari | Software Developer in Waterloo',description:profileDescription},
 ...projects.map(p=>({path:p.slug+'/',kind:'project',name:titleNames[p.slug],title:projectTitles[p.slug]+' | Sammy Hawari',description:p.intro,project:p})),
 ...notes.map(n=>({path:'notes/'+n.slug+'/',kind:'article',name:n.title,title:noteTitles[n.slug]+' | Sammy Hawari',description:n.body[0][1],note:n}))
];
export const person={
 '@type':'Person','@id':absolute('#person'),name:'Sammy Hawari',alternateName:'mindlesstruffle',url:SITE_URL,
 description:'Software developer and Laurel Heights Secondary School student in Waterloo, Ontario.',
 jobTitle:'Software Developer',homeLocation:{'@type':'Place',name:'Waterloo, Ontario, Canada'},
 sameAs:social.map(([,url])=>url)
};
export function pageSchema(page){
 const url=absolute(page.path),personRef={'@id':person['@id']};
 const website={'@type':'WebSite','@id':absolute('#website'),url:SITE_URL,name:'Sammy Hawari',inLanguage:'en',publisher:personRef};
 const webpage={'@type':page.kind==='profile'?'ProfilePage':'WebPage','@id':url+'#webpage',url,name:page.title,description:page.description,inLanguage:'en',isPartOf:{'@id':website['@id']}};
 const graph=[person,website,webpage];
 if(page.kind==='profile')webpage.mainEntity=personRef;
 if(page.kind==='project'){
  const p=page.project;
  const work={'@type':'CreativeWork','@id':url+'#project',name:page.name,url,description:p.intro,creator:personRef,genre:p.type,keywords:p.stack.split(' · '),mainEntityOfPage:{'@id':webpage['@id']}};
  graph.push(work);webpage.mainEntity={'@id':work['@id']};
 }
 if(page.kind==='article'){
  // Existing notes have only month-level dates; do not invent exact publication days.
  const article={'@type':'Article','@id':url+'#article',url,headline:page.name,description:page.description,author:personRef,publisher:personRef,inLanguage:'en',mainEntityOfPage:{'@id':webpage['@id']},about:{'@id':absolute(page.note.project+'/')+'#project'},articleBody:page.note.body.map(([h,p])=>h+'\n'+p).join('\n\n')};
  graph.push(article);webpage.mainEntity={'@id':article['@id']};
 }
 return {'@context':'https://schema.org','@graph':graph};
}
export function seoHead(route){
 const page=pages.find(p=>p.path===route),missing=!page;
 if(missing&&route!=='404.html')throw Error('Missing SEO manifest entry: '+route);
 const title=page?.title||'Page Not Found | Sammy Hawari',description=page?.description||'This page could not be found.';
 const image=absolute('assets/sammy-icon-emulator-social.png'),alt='Pixel-art meadow blended with Icon Emulator’s branching dice and clover workspace';
 const meta=(key,value,property=false)=>`<meta ${property?'property':'name'}="${key}" content="${escape(value)}">`;
 const tags=[`<title>${escape(title)}</title>`,meta('description',description),meta('author','Sammy Hawari'),meta('robots',missing?'noindex,follow':'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1')];
 for(const [key,name] of [['google','google-site-verification'],['bing','msvalidate.01']])if(verification[key])tags.push(meta(name,verification[key]));
 if(page)tags.push(`<link rel="canonical" href="${absolute(route)}">`,`<link rel="alternate" type="text/markdown" href="${absolute(route+'index.md')}" title="Markdown version">`,`<link rel="describedby" type="text/plain" href="${absolute('llms.txt')}">`);
 for(const [key,value] of Object.entries({'og:title':title,'og:description':description,'og:site_name':'Sammy Hawari','og:type':page?.kind==='article'?'article':'website','og:url':absolute(route),'og:locale':'en_CA','og:image':image,'og:image:type':'image/png','og:image:width':'1730','og:image:height':'909','og:image:alt':alt}))tags.push(meta(key,value,true));
 for(const [key,value] of Object.entries({'twitter:card':'summary_large_image','twitter:creator':'@mindlesstruffle','twitter:title':title,'twitter:description':description,'twitter:image':image,'twitter:image:alt':alt}))tags.push(meta(key,value));
 if(page)tags.push(`<script type="application/ld+json" id="site-schema">${JSON.stringify(pageSchema(page)).replace(/</g,'\\u003c')}</script>`);
 return tags.join('');
}
export function markdown(page){
 const lines=[`# ${page.name}`,'',`Source: ${absolute(page.path)}`,'','By Sammy Hawari.',''];
 if(page.kind==='profile'){
  lines.push(profileDescription,'','Sammy attends Laurel Heights Secondary School in Waterloo, Ontario. His portfolio lists a Data Science Intern role at Yupp and Founder & Lead Developer roles at Inspect Element and SLOPIFY LIVE.','','## Projects','',...pages.filter(p=>p.kind==='project').map(p=>`- [${p.name}](${absolute(p.path)}): ${p.description}`),'','## Project notes','',...pages.filter(p=>p.kind==='article').map(p=>`- [${p.name}](${absolute(p.path)})`),'','## Public profiles','',...social.map(([name,url])=>`- [${name}](${url})`));
 }else if(page.kind==='project'){
  const p=page.project;lines.push(p.intro,'',`Status / focus: ${p.type}`,`Tools: ${p.stack}`,'',...p.sections.flatMap(([h,text])=>['## '+h,'',text,'']));
  if(p.link)lines.push(`[${p.label}](${p.link})`,'');
 }else{
  lines.push(`Note label: ${page.note.date}`,'',...page.note.body.flatMap(([h,text])=>['## '+h,'',text,'']),`[Related project](${absolute(page.note.project+'/')})`);
 }
 return lines.join('\n').trim()+'\n';
}
export async function writeDiscovery(output){
 const sitemap=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(p=>'  <url><loc>'+escape(absolute(p.path))+'</loc></url>').join('\n')}\n</urlset>\n`;
 // No lastmod until a genuine content-change date is recorded. Deploy time is not content age.
 const robots=`# Public portfolio pages and assets are available to search crawlers.\nUser-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: *\nAllow: /\n\nSitemap: ${absolute('sitemap.xml')}\n`;
 const llms=['# Sammy Hawari','',`> ${profileDescription}`,'',`Official portfolio: ${SITE_URL}`,'','Project availability varies: the Number Company and Larpmegle pages describe prototypes; Icon Emulator describes a local application. The linked pages contain the project details.','','## Profile','',`- [Sammy Hawari](${absolute('index.md')}): Background and links to public profiles.`,'','## Projects','',...pages.filter(p=>p.kind==='project').map(p=>`- [${p.name}](${absolute(p.path+'index.md')}): ${p.description}`),'','## Project notes','',...pages.filter(p=>p.kind==='article').map(p=>`- [${p.name}](${absolute(p.path+'index.md')}): ${p.description}`),'','## Optional','',`- [Combined project text](${absolute('llms-full.txt')}): The same public summaries and notes in one file.`,`- [XML sitemap](${absolute('sitemap.xml')}): Canonical HTML pages.`,''].join('\n');
 await mkdir(output,{recursive:true});
 if(verification.indexNowKey)await writeFile(path.join(output,verification.indexNowKey+'.txt'),verification.indexNowKey+'\n');
 await Promise.all([writeFile(path.join(output,'sitemap.xml'),sitemap),writeFile(path.join(output,'robots.txt'),robots),writeFile(path.join(output,'llms.txt'),llms),writeFile(path.join(output,'llms-full.txt'),pages.map(markdown).join('\n---\n\n'))]);
 for(const page of pages){await mkdir(path.join(output,page.path),{recursive:true});await writeFile(path.join(output,page.path,'index.md'),markdown(page));}
}
