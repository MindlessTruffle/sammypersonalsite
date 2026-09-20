export function tearDestination(href,base,options={}){
 if(options.modified||options.download||options.native||options.target&&options.target!=='_self')return null;
 let url;try{url=new URL(href,base);}catch{return null;}
 if(url.origin!==new URL(base).origin||url.search||url.hash)return null;
 const root=options.root||'/';
 if(!url.pathname.startsWith(root))return null;
 const route='/'+url.pathname.slice(root.length);
 if(!/^\/(?:[a-z0-9-]+\/|notes\/[a-z0-9-]+\/)$/.test(route))return null;
 return url.pathname;
}
