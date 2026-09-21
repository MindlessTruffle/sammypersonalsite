import {pages,absolute,SITE_URL,verification} from './seo.mjs';
const submit=process.argv.includes('--submit');
const paths=process.argv.slice(2).filter(arg=>!arg.startsWith('--'));
const unknown=process.argv.slice(2).filter(arg=>arg.startsWith('--')&&!['--submit','--dry-run'].includes(arg));
if(unknown.length)throw Error('Unknown options: '+unknown.join(', '));
const selected=paths.length?paths.map(route=>{const page=pages.find(p=>p.path===route);if(!page)throw Error('Unknown canonical route: '+route);return page;}):pages;
const key=verification.indexNowKey;if(!key)throw Error('IndexNow key is not configured');
const payload={host:new URL(SITE_URL).hostname,key,keyLocation:absolute(key+'.txt'),urlList:selected.map(p=>absolute(p.path))};
if(!submit){console.log(JSON.stringify({mode:'dry-run',endpoint:'https://api.indexnow.org/indexnow',host:payload.host,urls:payload.urlList},null,2));}
else{
 const live=await fetch(payload.keyLocation,{signal:AbortSignal.timeout(15000)});
 if(!live.ok||(await live.text()).trim()!==key)throw Error('Publish the current docs build first: IndexNow verification file is not live.');
 const sitemap=await fetch(absolute('sitemap.xml'),{signal:AbortSignal.timeout(15000)});
 const text=await sitemap.text();if(!sitemap.ok||payload.urlList.some(url=>!text.includes('<loc>'+url+'</loc>')))throw Error('Live sitemap does not contain all submitted canonical URLs.');
 const response=await fetch('https://api.indexnow.org/indexnow',{method:'POST',headers:{'Content-Type':'application/json; charset=utf-8'},body:JSON.stringify(payload),signal:AbortSignal.timeout(20000)});
 if(![200,202].includes(response.status))throw Error('IndexNow returned HTTP '+response.status+'. No automatic retry performed.');
 console.log(`${payload.urlList.length} URLs received by IndexNow (HTTP ${response.status}). Receipt does not guarantee indexing or ranking.`);
}
