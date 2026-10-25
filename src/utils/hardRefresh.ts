/**
 * Forces a genuinely fresh reload of the app, bypassing any stale service
 * worker/Cache Storage state: unregisters every active service worker
 * (so a fresh one re-registers on next load), deletes every Cache Storage
 * entry (clearing Workbox's precache and any runtime caches), then reloads
 * the page. Used to let users jump straight to a newly deployed version
 * instead of needing several manual refreshes.
 *
 * @returns A promise that resolves once the reload has been triggered.
 */
export async function hardRefresh(): Promise<void> {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(
      registrations.map((registration) => registration.unregister()),
    );
  }

  if ('caches' in window) {
    const cacheKeys = await caches.keys();
    await Promise.all(cacheKeys.map((key) => caches.delete(key)));
  }

  window.location.reload();
}
