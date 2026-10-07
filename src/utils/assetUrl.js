/**
 * Prepend Vite's BASE_URL to any public asset path.
 * Works for both local dev (base = '/') and GitHub Pages (base = '/Pin-Parvati/').
 *
 * Usage: assetUrl('/Photos/Spiti_Bike.jpg')
 *   → '/Photos/Spiti_Bike.jpg'        (dev)
 *   → '/Pin-Parvati/Photos/Spiti_Bike.jpg'  (production)
 */
export function assetUrl(path) {
  // import.meta.env.BASE_URL is injected by Vite at build time.
  // It ends with '/', so strip the leading slash from path to avoid double slashes.
  const base = import.meta.env.BASE_URL; // e.g. '/Pin-Parvati/'
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${cleanPath}`;
}
