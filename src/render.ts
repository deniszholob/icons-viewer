import { fetchIcons, type IconEntry } from './network-request';
import { getGroupFromKey, getTitleFromKey } from './utils';

let fetchedUrl = '';
let icons: IconEntry[] = [];

export async function renderManifest(
  elContainer: HTMLElement,
  elToc: HTMLElement,
  elCount: HTMLElement,
  url: string,
  filter: string,
  grouped: boolean,
) {
  console.log('renderManifest', url, filter);
  if (url !== fetchedUrl) {
    icons = (await fetchIcons(url, elContainer)) ?? [];
    fetchedUrl = url;
  }

  renderIcons(elContainer, elToc, elCount, icons, filter, grouped);
}

function renderIcons(
  elContainer: HTMLElement,
  elToc: HTMLElement,
  elCount: HTMLElement,
  icons: IconEntry[],
  filter: string,
  grouped: boolean,
): void {
  console.log('renderIcons', icons, filter);

  // Reset
  elContainer.innerHTML = ``;
  elToc.innerHTML = '';

  // Filter Icons
  const filteredIcons = icons.filter((icon) =>
    icon.key.toLowerCase().includes(filter.toLowerCase()),
  );

  // Group Icons
  const groupedIcons = new Map<string, IconEntry[]>();
  for (const icon of filteredIcons) {
    const group = grouped ? getGroupFromKey(icon.key) : 'All';
    if (!groupedIcons.has(group)) groupedIcons.set(group, []);
    groupedIcons.get(group)!.push(icon);
  }

  // Update total count
  elCount.textContent = `${filteredIcons.length} / ${icons.length}`;

  // Sort grouped icons
  const sortedGroupedIcons = [...groupedIcons.entries()].sort();

  // Render
  const containerFrag = document.createDocumentFragment();
  const fragToc = document.createDocumentFragment();

  // For each group
  sortedGroupedIcons.forEach(([group, icons]) => {
    // Add TOC item
    fragToc.appendChild(createTocItem(group, icons.length));

    // Add section
    // const fragSection = createSection(group, group);

    const sectionId = getSectionIdFromGroup(group);
    const elSection = document.createElement('section');
    elSection.id = sectionId;

    const elDetails = document.createElement('details');
    elDetails.open = true;
    elDetails.className = 'bg-gray-800 rounded overflow-hidden';

    const elSummary = document.createElement('summary');
    elSummary.textContent = `${group} (${icons.length})`;
    elSummary.className =
      'cursor-pointer text-lg font-semibold text-white p-4 bg-gray-700';
    elDetails.appendChild(elSummary);

    const elGrid = document.createElement('div');
    elGrid.className =
      'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 mt-4';

    const fragGrid = document.createDocumentFragment();

    // Add icons to section
    icons.forEach((icon) => fragGrid.appendChild(createIcon(icon)));

    elGrid.appendChild(fragGrid);
    elDetails.appendChild(elGrid);
    elSection.appendChild(elDetails);
    containerFrag.appendChild(elSection);
  });

  elToc.appendChild(fragToc);
  elContainer.appendChild(containerFrag);

  //   const fragment = createSection('icons', 'Icons');
  //   filteredIcons.forEach((icon) => fragment.appendChild(createIcon(icon)));
  //   elContainer.appendChild(fragment);

  // .map((icon) => createIcon(icon))
  // .forEach((icon) => containerEl.appendChild(icon));
}

function getSectionIdFromGroup(group: string): string {
  return `section-${group.replace(/\s+/g, '-')}`;
}

function createTocItem(group: string, count: number): HTMLElement {
  //   const li = document.createElement('li');
  //   const a = document.createElement('a');
  //   a.href = `#section-${group.replace(/\s+/g, "-")}`;
  //   a.textContent = `${group} (${count})`;
  //   li.appendChild(a);
  //   return li;

  const sectionId = getSectionIdFromGroup(group);
  const elTocA = document.createElement('a');
  elTocA.href = `#${sectionId}`;
  elTocA.textContent = `${group} (${count})`;
  elTocA.className = 'block hover:underline';
  elTocA.addEventListener('click', (e) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    const details = section?.querySelector('details');
    if (details && !details.open) {
      details.open = true;
    }
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  return elTocA;
}

// function createSection(sectionId: string, group: string): DocumentFragment {
//   const section = document.createElement('section');
//   section.id = sectionId;

//   const details = document.createElement('details');
//   details.open = true;
//   details.className = 'bg-gray-800 rounded p-4';

//   const summary = document.createElement('summary');
//   summary.textContent = `${group} (${icons.length})`;
//   summary.className = 'cursor-pointer text-lg font-semibold text-white';
//   details.appendChild(summary);

//   const grid = document.createElement('div');
//   grid.className =
//     'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 mt-4';

//   const gridFrag = document.createDocumentFragment();
//   return gridFrag;
// }

function createIcon({ key, path }: IconEntry): HTMLElement {
  //   return `<icon key="${key}" src="${path}" class="icon"></icon>`;

  const title = getTitleFromKey(key);
  const groupName = getGroupFromKey(key);

  const wrapper = document.createElement('div');
  wrapper.className = 'flex flex-col items-center text-center text-sm';

  const link = document.createElement('a');
  link.href = path;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';

  const img = document.createElement('img');
  img.src = path;
  img.alt = key;
  img.title = path;
  img.className =
    'w-16 h-16 object-contain bg-gray-700 p-1 rounded shadow-lg hover:bg-gray-600';
  link.appendChild(img);

  const caption = document.createElement('div');
  caption.className = 'mt-2';
  caption.innerHTML = `<div class="font-medium">${title}</div><div class="text-xs text-gray-400">${groupName}</div>`;

  wrapper.appendChild(link);
  wrapper.appendChild(caption);
  return wrapper;
}
