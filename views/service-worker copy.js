// asignar un nombre y versión al cache
const CACHE_NAME = 'V3'
const assets = [

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
]

const addResourcesToCache = async (resources) => {
  const cache = await caches.open(CACHE_NAME)
  await cache.addAll(resources)
}

const putInCache = async (request, response) => {
  const cache = await caches.open(CACHE_NAME)
  await cache.put(request, response)
}

const cacheFirst = async ({ request, preloadResponsePromise, fallbackUrl }) => {
  // First try to get the resource from the cache
  const responseFromCache = await caches.match(request)
  if (responseFromCache) {
    return responseFromCache
  }

  // Next try to use (and cache) the preloaded response, if it's there
  const preloadResponse = await preloadResponsePromise
  if (preloadResponse) {
    console.info('using preload response', preloadResponse)
    putInCache(request, preloadResponse.clone())
    return preloadResponse
  }

  // Next try to get the resource from the network
  try {
    const responseFromNetwork = await fetch(request)
    // response may be used only once
    // we need to save clone to put one copy in cache
    // and serve second one
    putInCache(request, responseFromNetwork.clone())
    return responseFromNetwork
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl)
    if (fallbackResponse) {
      return fallbackResponse
    }
    // when even the fallback response is not available,
    // there is nothing we can do, but we must always
    // return a Response object
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' }
    })
  }
}

// Enable navigation preload
const enableNavigationPreload = async () => {
  if (self.registration.navigationPreload) {
    // Enable navigation preloads!
    await self.registration.navigationPreload.enable()
  }
}

// durante la fase de instalación, se almacena en caché los activos estáticos
self.addEventListener('install', event => {
  event.waitUntil(addResourcesToCache(assets))
})

// una vez que se instala el SW, se activa y busca los recursos para hacer que funcione sin conexión
self.addEventListener('activate', event => {
  event.waitUntil(enableNavigationPreload())
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
      preloadResponsePromise: event.preloadResponse,
      fallbackUrl: 'https://s3-symbol-logo.tradingview.com/alphabet--600.png'
    })
  )
})

self.addEventListener('push', function (event) {
  console.log('[Service Worker] Push Received.')
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`)

  const title = 'Notificaciones activadas'
  const options = {
    body: 'Ahora se muestran notificaciones de los dispositivos',
    vibrate: [200, 100, 200, 100, 200, 100, 400],
    // "tag": "request",
    actions: [
      {
        action: 'listo',
        title: 'Listo'
      }
    ]
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', function (event) {
  const messageId = event.notification.data

  event.notification.close()

  if (event.action === 'listo') {
    //
  } else if (event.action === 'reply') {
    clients.openWindow('/messages?reply=' + messageId)
  } else {
    clients.openWindow('/messages?reply=' + messageId)
  }
  event.waitUntil(
    clients.openWindow('https://developers.google.com/web/')
  )
}, false)
