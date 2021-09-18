//asignar un nombre y versión al cache
const
	CACHE_NAME = 'v2_cache', 
	urlsToCache = [

		'/consola/',

		'/favicon.ico',
		'/images/AdminLTELogo.png',

		'/plugins/fontawesome-free/webfonts/fa-regular-400.woff2',
		'/plugins/fontawesome-free/webfonts/fa-solid-900.woff2',

		'/plugins/toastr/toastr.min.css',
		'/plugins/fontawesome-free/css/all.min.css',
		'/plugins/icheck-bootstrap/icheck-bootstrap.min.css',
		'/plugins/pace-progress/themes/red/pace-theme-minimal.css',

		'/plugins/jquery/jquery.min.js',
		'/plugins/bootstrap/js/bootstrap.bundle.min.js',
		'/plugins/toastr/toastr.min.js',
		'/plugins/pace-progress/pace.min.js',
		'/plugins/particles/particles.min.js',
		'/plugins/particles/particles-app.js',
		'/plugins/snap-svg/snap.svg-min.js',
		'/plugins/fastclick/fastclick.js',

		'/propios/js/Graphics.js',
		'/plugins/Highcharts-Stock/highstock.js',
		'/plugins/Highcharts/highcharts-more.js',
		'/plugins/Highcharts/modules/export-data.js',
		'/plugins/Highcharts/modules/exporting.js',
		'/plugins/Highcharts/modules/solid-gauge.js',
		'/plugins/Highcharts/modules/accessibility.js',
		'/plugins/Highcharts/modules/drilldown.js',

		'/adminlte/css/adminlte.min.css',

		'/adminlte/js/adminlte.min.js'
	];

//durante la fase de instalación, se almacena en caché los activos estáticos
self.addEventListener('install', e => {
	e.waitUntil(
		caches.open(CACHE_NAME).then(cache => {
			return cache.addAll(urlsToCache).then(() => self.skipWaiting());
		}).catch(err => {
			console.log('Falló registro de cache', err)
		})
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