//asignar un nombre y versión al cache
const
	CACHE_NAME = 'v2_cache', 
	urlsToCache = [

		'/acceso/',
		'/acceso/login.html',
		'/acceso/register.html',
		'/acceso/recover.html',
		'/acceso/forgot.html',

		'/plugins/fontawesome-free/css/all.min.css',
		'/plugins/icheck-bootstrap/icheck-bootstrap.min.css',
		'/plugins/pace-progress/themes/red/pace-theme-minimal.css',
		'/plugins/toastr/toastr.min.css',
		'/adminlte/css/adminlte.min.css',

		'/plugins/jquery/jquery.min.js',
		'/plugins/bootstrap/js/bootstrap.bundle.min.js',
		'/plugins/pace-progress/pace.min.js',
		'/plugins/toastr/toastr.min.js',
		'/plugins/particles/particles.min.js',
		'/plugins/particles/particles-app.js',
		'/adminlte/js/adminlte.min.js',
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