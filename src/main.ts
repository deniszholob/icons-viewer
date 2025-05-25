import { renderManifest } from './render';

function main() {
  console.log('main');
  document.addEventListener('DOMContentLoaded', async () => {
    await setUpPage();
  });
}

async function setUpPage() {
  console.log('setUpPage');
  const manifest = document.getElementById('manifest-url');
  if (!manifest) throw new Error('search element is undefined');
  if (!(manifest instanceof HTMLInputElement)) {
    throw new Error('toggle is not a checkbox');
  }
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
}

function updateToggleStyles(
  toggleEl: HTMLInputElement,
  onEl: HTMLElement,
  offEl: HTMLElement,
): void {
  if (toggleEl.checked) {
    onEl.classList.add('bg-orange-600');
    offEl.classList.remove('bg-orange-800');
  } else {
    onEl.classList.remove('bg-orange-600');
    offEl.classList.add('bg-orange-800');
  }
}

main();
