const CACHE='plantq-v2';
const SHELL=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
// Prima la rete (cosi gli aggiornamenti arrivano subito), poi la copia salvata se sei offline.
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request).then(res=>{
    const u=new URL(e.request.url);
    if(res&&(res.ok||res.type==='opaque')&&(u.origin===location.origin||u.host.endsWith('googleapis.com')||u.host.endsWith('gstatic.com'))){
      const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));
    }
    return res;
  }).catch(()=>caches.match(e.request).then(hit=>hit||caches.match('index.html'))));
});
