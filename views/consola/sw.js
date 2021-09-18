//asignar un nombre y versión al cache
const
	CACHE_NAME = 'v2_cache', 
	urlsToCache = [
		'/',
	];

//durante la fase de instalación, se almacena en caché los activos estáticos
self.addEventListener('install', e => {
	e.waitUntil(
		caches.open(CACHE_NAME).then(cache => {
			return cache.addAll(urlsToCache).then(() => self.skipWaiting());
		}).catch(err => console.log('Falló registro de cache', err))
	);
});

//una vez que se instala el SW, se activa y busca los recursos para hacer que funcione sin conexión
self.addEventListener('activate', e => {
  const cacheWhitelist = [CACHE_NAME];
	e.waitUntil(
		caches.keys().then(cacheNames => {
			return Promise.all(
				cacheNames.map(cacheName => {
					//Eliminamos lo que ya no se necesita en cache
					if (cacheWhitelist.indexOf(cacheName) === -1) {
						return caches.delete(cacheName);
					}
				})
			);
		}).then(() => self.clients.claim()) // Le indica al SW activar el cache actual
	);
});

//cuando el navegador recupera una url
self.addEventListener('fetch', e => {
  //Responder ya sea con el objeto en caché o continuar y buscar la url real
  e.respondWith(
    caches.match(e.request).then(res => {
			if (res) {
				return res; //recuperar del cache
			}
			return fetch(e.request); //recuperar de la petición a la url
		})
  );
});

self.addEventListener('push', function(event) {
	console.log('[Service Worker] Push Received.');
	console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

	const title = 'Notificaciones activadas';
	const options = {
		"body": "Ahora se muestran notificaciones de los dispositivos",
		"vibrate": [200, 100, 200, 100, 200, 100, 400],
		//"tag": "request",
		actions: [  
			{
				action: 'listo',
				title: 'Listo'
			}
		]
	};

	event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {  
	var messageId = event.notification.data;

	event.notification.close();  

	if (event.action === 'listo') {
		//
	}
	else if (event.action === 'reply') {
		clients.openWindow("/messages?reply=" + messageId);  
	}  
	else {
		clients.openWindow("/messages?reply=" + messageId);  
	}
	event.waitUntil(
		clients.openWindow('https://developers.google.com/web/')
	);
}, false);