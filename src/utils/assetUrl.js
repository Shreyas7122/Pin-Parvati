export function assetUrl(path) {
  if (!path) return '';

  // If already a full URL or data/blob URI, return as-is
  if (
    path.startsWith('data:') ||
    path.startsWith('blob:') ||
    path.startsWith('http://') ||
    path.startsWith('https://')
  ) {
    return path;
  }

  const base = import.meta.env.BASE_URL || '/';

  // If path already starts with the base path, do not prepend again
  if (path.startsWith(base)) {
    return path;
  }

  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${cleanPath}`;
}

