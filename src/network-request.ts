export interface IconEntry {
  key: string;
  path: string;
}
export async function fetchIcons(url: string, errorEl: HTMLElement) {
  const path =
    'https://raw.githubusercontent.com/deniszholob/icons-factorio/refs/heads/main/factorio-icons';
  return fetch(url)
    .then((res: Response): Promise<Record<string, string>> => res.json())
    .then((manifest) =>
      Object.entries(manifest).map(
        ([key, iconPath]): IconEntry => ({
          key,
          path: getBasePath(path) + iconPath,
        }),
      ),
    )
    .catch((err) => {
      errorEl.innerHTML = `<p class='text-red-500'>Failed to load icons from ${url}.</p>`;
      console.error('Failed to load manifest.json', err);
    });
}

function getBasePath(url: string): string {
  const segments = url.split('/');
  segments.pop(); // remove the last segment
  return segments.join('/') + '/';
}
