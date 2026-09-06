/**
 * Builds URLs for resources stored in the TD asset libraries.
 *
 * The base URL and library folder are read from the corresponding Vite
 * environment variables. The returned `getUrl` function combines them with a
 * resource path.
 *
 * @param library The library containing the resource.
 * @returns The configured base URL and a function for building resource URLs.
 * @throws If the library is invalid or the base URL or library folder is not configured.
 */
export function useTDBaseUrl(
  library: 'assets' | 'classic' | 'images' | 'sprites' | 'resources',
) {
  const baseUrl: string | undefined = import.meta.env.VITE__TD_BASE_URL;
  let folder: string | undefined = '';

  switch (library) {
    case 'assets':
      folder = import.meta.env.VITE__TD_ASSETS;
      break;
    case 'images':
      folder = import.meta.env.VITE__TD_IMAGES;
      break;
    case 'sprites':
      folder = import.meta.env.VITE__TD_SPRITES;
      break;
    case 'resources':
      folder = import.meta.env.VITE__TD_RESOURCES;
      break;
    case 'classic':
      folder = import.meta.env.VITE__TD_CLASSIC;
      break;
    default:
      throw new Error('Invalid library');
  }

  if (!baseUrl || !folder) {
    throw new Error('Base URL or folder is not defined');
  }

  return {
    baseUrl,
    getUrl: (path: string) => [baseUrl, folder, path].join('/'),
  };
}
