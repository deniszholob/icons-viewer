import { renderManifest } from './render';

const QUERY_PARAMS_KEY = 'url';

function main() {
  // console.log('main');
  document.addEventListener('DOMContentLoaded', async () => {
    await setUpPage(getQueryParams());
  });
}

async function setUpPage(url?: string) {
  console.log('setUpPage');
  const manifest = document.getElementById('manifest-url');
  if (!manifest) throw new Error('search element is undefined');
  if (!(manifest instanceof HTMLInputElement)) {
    throw new Error('toggle is not a checkbox');
  }
  if (url) manifest.value = url;
  syncUrlParam(manifest.value);

  const search = document.getElementById('search');
  if (!search) throw new Error('search element is undefined');
  if (!(search instanceof HTMLInputElement)) {
    throw new Error('toggle is not a checkbox');
  }
  const groupToggle = document.getElementById('group-toggle');
  if (!groupToggle) throw new Error('toggle element is undefined');
  if (!(groupToggle instanceof HTMLInputElement)) {
    throw new Error('toggle is not a checkbox');
  }
  const groupToggleOff = document.getElementById('group-toggle-all');
  if (!groupToggleOff) throw new Error('off element is undefined');
  const groupToggleOn = document.getElementById('group-toggle-grouped');
  if (!groupToggleOn) throw new Error('on element is undefined');
  const elCount = document.getElementById('total-count');
  if (!elCount) throw new Error('search element is undefined');
  const elContainer = document.getElementById('icon-container');
  if (!elContainer) throw new Error('container element is undefined');

  const elToc = document.getElementById('toc');
  if (!elToc) throw new Error('toc element is undefined');

  const elScrollTop = document.getElementById('scroll-to-top');
  if (!elScrollTop) throw new Error('scroll-top element is undefined');
  elScrollTop.addEventListener('click', () => {
    elContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  const elFileLinks = document.getElementById('file-links');
  if (!elFileLinks) throw new Error('file-links element is undefined');

  groupToggle.addEventListener('change', async () => {
    await updateToggleStyles(groupToggle, groupToggleOn, groupToggleOff);

    await renderManifest(
      elContainer,
      elToc,
      elCount,
      manifest.value,
      search.value,
      groupToggle.checked,
    );
  });

  search.addEventListener('input', async () => {
    // debounce(() => {
    await renderManifest(
      elContainer,
      elToc,
      elCount,
      manifest.value,
      search.value,
      groupToggle.checked,
    );
    // });
  });

  manifest.addEventListener('change', async () => {
    syncUrlParam(manifest.value);

    // debounce(() => {
    await renderManifest(
      elContainer,
      elToc,
      elCount,
      manifest.value,
      search.value,
      groupToggle.checked,
    );
    // });

    updateFileLinks(elFileLinks, manifest.value);
  });

  // Initialize on page load
  await updateToggleStyles(groupToggle, groupToggleOn, groupToggleOff);
  await renderManifest(
    elContainer,
    elToc,
    elCount,
    manifest.value,
    search.value,
    groupToggle.checked,
  );

  updateFileLinks(elFileLinks, manifest.value);
}

function updateFileLinks(elFileLinks: HTMLElement, manifestUrl: string): void {
  elFileLinks.innerHTML = '';

  const manifestBase = manifestUrl.split('/').slice(0, -1).join('/');
  const manifestName = manifestUrl.split('/').pop();
  if (!manifestName) return;
  const enumName = `${manifestBase.split('/').pop()}.enum.ts`;
  const enumUrl = `${manifestBase}/${enumName}`;

  const elManifestLink = document.createElement('a');
  elManifestLink.href = manifestUrl;
  elManifestLink.textContent = manifestName;
  elManifestLink.target = '_blank';
  elManifestLink.rel = 'noopener noreferrer';
  elManifestLink.className =
    'text-orange-400 hover:text-orange-600 hover:underline';
  elFileLinks.append(elManifestLink);

  const elEnumLink = document.createElement('a');
  elEnumLink.href = enumUrl;
  elEnumLink.textContent = enumName;
  elEnumLink.target = '_blank';
  elEnumLink.rel = 'noopener noreferrer';
  elEnumLink.className =
    'text-orange-400 hover:text-orange-600 hover:underline';
  elFileLinks.append(elEnumLink);
}

function updateToggleStyles(
  toggleEl: HTMLInputElement,
  onEl: HTMLElement,
  offEl: HTMLElement,
): void {
  if (toggleEl.checked) {
    onEl.classList.add('bg-orange-500');
    offEl.classList.remove('bg-orange-600');
  } else {
    onEl.classList.remove('bg-orange-500');
    offEl.classList.add('bg-orange-600');
  }
}

// ?url=http://localhost:4201/assets/configs/factory-game/manifest.json
function getQueryParams(): string | undefined {
  const queryParams = new URLSearchParams(window.location.search);
  return queryParams.get(QUERY_PARAMS_KEY) ?? undefined;
}

function syncUrlParam(value: string | undefined): void {
  const currentParams = new URLSearchParams(window.location.search);

  if (value && value.trim().length > 0) {
    currentParams.set(QUERY_PARAMS_KEY, value.trim());
  } else {
    currentParams.delete(QUERY_PARAMS_KEY);
  }

  const newRelativePathQuery =
    window.location.pathname +
    (currentParams.toString() ? '?' + currentParams.toString() : '');
  window.history.replaceState(null, '', newRelativePathQuery);
}

main();
