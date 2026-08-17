const STORAGE_KEY = 'siteStyles';

export async function getSiteStyles() {
  const result = await chrome.storage.local.get(STORAGE_KEY);

  return result[STORAGE_KEY] || [];
}

export async function saveSiteStyles(styles) {
  await chrome.storage.local.set({
    [STORAGE_KEY]: styles,
  });
}