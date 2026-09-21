// Clone only document metadata. No visual DOM nodes or executable scripts are copied.
const selector='link[rel="canonical"],link[rel="alternate"][type="text/markdown"],meta[name="description"],meta[name="author"],meta[name="robots"],meta[property^="og:"],meta[name^="twitter:"],script#site-schema';
export function capturePageMetadata(doc=document){return [...doc.head.querySelectorAll(selector)].map(node=>node.cloneNode(true));}
export function applyPageMetadata(snapshot,doc=document){
 doc.head.querySelectorAll(selector).forEach(node=>node.remove());
 doc.head.append(...snapshot.map(node=>node.cloneNode(true)));
}
