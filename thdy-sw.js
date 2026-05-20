const CACHE_NAME='thdy-family-app-v12';
const CORE_ASSETS=['./','./THDY.html','./index.html','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',event=>{self.skipWaiting();event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(CORE_ASSETS).catch(()=>undefined)));});
self.addEventListener('activate',event=>{event.waitUntil(self.clients.claim());});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;event.respondWith(fetch(event.request).catch(()=>caches.match(event.request).then(r=>r||caches.match('./THDY.html'))));});
self.addEventListener('message',event=>{const data=event.data||{};if(data.type==='THDY_SHOW_NOTIFICATION'){event.waitUntil(self.registration.showNotification(data.title||'THDY 알림',data.options||{}));}});
self.addEventListener('notificationclick',event=>{event.notification.close();event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{for(const client of list){if('focus' in client)return client.focus();}if(clients.openWindow)return clients.openWindow('./THDY.html');}));});
