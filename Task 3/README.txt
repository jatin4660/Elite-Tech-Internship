# OfflineMart

OfflineMart is a small Progressive Web App demo for an Indian e-commerce platform. It includes rupee pricing, product photos, a responsive catalog, cart storage, a web app manifest, service worker caching, offline page support, and demo notifications.

## Run

Start a local static server from this folder, then open the shown localhost URL.

```bash
python -m http.server 4173
```

## Test the PWA features

1. Open the app on `http://localhost:4173`.
2. Add products to the cart, refresh, and confirm the cart remains.
3. Open browser developer tools, set the Network panel to Offline, then refresh the page.
4. Use the notification button to allow and trigger a demo sale notification.
5. Use the browser install prompt when it appears.

## Focus Areas Covered

- Service worker: `service-worker.js`
- Cache API: app shell files are cached during install
- Responsive design: product grid, cart drawer, and filters adapt across screen sizes
- Push notifications: permission request plus service-worker notification demo
