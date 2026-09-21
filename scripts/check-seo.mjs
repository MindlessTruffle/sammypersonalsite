import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {pages,SITE_URL,absolute,verification} from './seo.mjs';
const baseline=JSON.parse(await readFile(new URL('./fixtures/content-body-hashes.json',import.meta.url),'utf8'));
for(const [file,hash] of Object.entries(baseline)){
 const body=(await readFile(file,'utf8')).match(/<body>([\s\S]*)<\/body>/)[1];
 assert.equal(createHash('sha256').update(body).digest('hex'),hash,`Visible content changed: ${file}`);
}
const allTitles=new Set();
for(const page of pages){
 const html=await readFile('docs/'+page.path+'index.html','utf8');
 const canonicals=[...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)];
 assert.equal(canonicals.length,1);assert.equal(canonicals[0][1],absolute(page.path));
 assert.ok(html.includes('property="og:url" content="'+absolute(page.path)+'"'));
 assert.ok(html.includes('type="text/markdown" href="'+absolute(page.path+'index.md')+'"'));
 assert.ok(!/noindex|nosnippet|127\.0\.0\.1/.test(html));
 const title=html.match(/<title>(.*?)<\/title>/)[1];assert.ok(!allTitles.has(title),'Unique search titles');allTitles.add(title);
 const schema=JSON.parse(html.match(/<script type="application\/ld\+json" id="site-schema">([\s\S]*?)<\/script>/)[1]);
 assert.equal(schema['@context'],'https://schema.org');
 const person=schema['@graph'].find(n=>n['@type']==='Person');assert.equal(person.name,'Sammy Hawari');assert.equal(person['@id'],absolute('#person'));assert.equal(person.sameAs.length,3);
 const web=schema['@graph'].find(n=>n['@type']==='WebPage'||n['@type']==='ProfilePage');assert.equal(web.url,absolute(page.path));
 assert.ok(!JSON.stringify(schema).includes('aggregateRating'),'No invented reviews');
 if(page.kind==='article'){const article=schema['@graph'].find(n=>n['@type']==='Article');assert.equal(article.author['@id'],person['@id']);assert.equal(article.datePublished,undefined,'No fabricated exact publication date');}
 const markdown=await readFile('docs/'+page.path+'index.md','utf8');assert.ok(markdown.includes('Source: '+absolute(page.path)));
 if(page.project){assert.ok(markdown.includes(page.project.intro));for(const [,p] of page.project.sections)assert.ok(markdown.includes(p.trim()));}
 if(page.note)for(const [,p] of page.note.body)assert.ok(markdown.includes(p.trim()));
}
const errorPage=await readFile('docs/404.html','utf8');assert.match(errorPage,/name="robots" content="noindex,follow"/);assert.ok(!errorPage.includes('rel="canonical"'));
const sitemap=await readFile('docs/sitemap.xml','utf8');
const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
assert.deepEqual(urls,pages.map(p=>absolute(p.path)));assert.ok(!sitemap.includes('<lastmod>'),'No deployment dates pretending to be content updates');
const robots=await readFile('docs/robots.txt','utf8');assert.ok(robots.includes('User-agent: OAI-SearchBot\nAllow: /'));assert.ok(robots.includes('Sitemap: '+absolute('sitemap.xml')));assert.ok(!robots.includes('Disallow: /'));
for(const file of ['llms.txt','llms-full.txt']){
 const text=await readFile('docs/'+file,'utf8');assert.ok(text.startsWith('# Sammy Hawari'));assert.ok(!text.includes('127.0.0.1'));
 for(const match of text.matchAll(/\]\((https:[^)]+)\)/g)){
  if(!match[1].startsWith(SITE_URL))continue;
  const relative=match[1].slice(SITE_URL.length);await stat('docs/'+relative+(relative.endsWith('/')||!relative?'index.html':''));
 }
}
for(const output of ['dist','docs']){
 if(verification.indexNowKey)assert.equal((await readFile(output+'/'+verification.indexNowKey+'.txt','utf8')).trim(),verification.indexNowKey);
 const html=await readFile(output+'/index.html','utf8');
 for(const [key,name] of [['google','google-site-verification'],['bing','msvalidate.01']])assert.equal(html.includes('name="'+name+'"'),Boolean(verification[key]));
}
const share=await readFile('docs/assets/sammy-icon-emulator-social.png');
const shareWidth=share.readUInt32BE(16),shareHeight=share.readUInt32BE(20);
assert.ok(shareWidth>=1200&&shareWidth/shareHeight>1.8&&shareWidth/shareHeight<2,'Wide social preview dimensions');
for(const page of pages){const html=await readFile('docs/'+page.path+'index.html','utf8');assert.ok(html.includes('property="og:image:width" content="'+shareWidth+'"'));assert.ok(html.includes('property="og:image:height" content="'+shareHeight+'"'));assert.ok(html.includes(absolute('assets/sammy-icon-emulator-social.png')));}
assert.ok((await readFile('docs/assets/sammy-s-checkered.svg','utf8')).includes('<svg'));
console.log('SEO checks pass: unchanged page bodies, canonical/OG/schema alignment, Markdown copies, sitemap, crawler policy, error indexing, and share image.');
